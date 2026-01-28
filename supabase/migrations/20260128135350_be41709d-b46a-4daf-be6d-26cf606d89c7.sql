-- =============================================
-- FACTORY PRO DATABASE SCHEMA
-- Hệ thống giám sát thiết bị nhà máy
-- =============================================

-- 1. ENUM TYPES
CREATE TYPE public.app_role AS ENUM ('admin', 'technician', 'operator', 'viewer');
CREATE TYPE public.equipment_status AS ENUM ('hoat_dong', 'bao_tri', 'hong', 'cho_kiem_tra');
CREATE TYPE public.incident_severity AS ENUM ('thap', 'trung_binh', 'cao', 'khan_cap');
CREATE TYPE public.incident_status AS ENUM ('moi', 'dang_xu_ly', 'da_khac_phuc', 'dong');
CREATE TYPE public.maintenance_priority AS ENUM ('thap', 'trung_binh', 'cao', 'khan_cap');
CREATE TYPE public.maintenance_status AS ENUM ('cho_thuc_hien', 'dang_thuc_hien', 'hoan_thanh', 'huy');

-- 2. PROFILES TABLE (user additional info)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  ho_va_ten TEXT NOT NULL,
  so_dien_thoai TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. USER ROLES TABLE (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'viewer',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- 4. PRODUCTION LINES (Dây chuyền sản xuất)
CREATE TABLE public.production_lines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ma TEXT NOT NULL UNIQUE,
  ten TEXT NOT NULL,
  mo_ta TEXT,
  trang_thai BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. AREAS (Khu vực)
CREATE TABLE public.areas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ma TEXT NOT NULL UNIQUE,
  ten TEXT NOT NULL,
  mo_ta TEXT,
  production_line_id UUID REFERENCES public.production_lines(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. EQUIPMENT TYPES (Loại thiết bị)
CREATE TABLE public.equipment_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ma TEXT NOT NULL UNIQUE,
  ten TEXT NOT NULL,
  mo_ta TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. EQUIPMENT (Thiết bị)
CREATE TABLE public.equipment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ma TEXT NOT NULL UNIQUE,
  ten TEXT NOT NULL,
  mo_ta TEXT,
  equipment_type_id UUID REFERENCES public.equipment_types(id) ON DELETE SET NULL,
  production_line_id UUID REFERENCES public.production_lines(id) ON DELETE SET NULL,
  area_id UUID REFERENCES public.areas(id) ON DELETE SET NULL,
  trang_thai equipment_status NOT NULL DEFAULT 'hoat_dong',
  ngay_lap_dat DATE,
  hinh_anh TEXT,
  thong_so JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. INCIDENTS (Sự cố)
CREATE TABLE public.incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ma TEXT NOT NULL UNIQUE,
  ten TEXT NOT NULL,
  mo_ta TEXT,
  equipment_id UUID REFERENCES public.equipment(id) ON DELETE SET NULL,
  muc_do incident_severity NOT NULL DEFAULT 'trung_binh',
  trang_thai incident_status NOT NULL DEFAULT 'moi',
  nguoi_bao_cao UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  nguoi_xu_ly UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  phat_hien TEXT,
  nguyen_nhan TEXT,
  giai_phap TEXT,
  ngay_phat_hien TIMESTAMPTZ NOT NULL DEFAULT now(),
  ngay_hoan_thanh TIMESTAMPTZ,
  hinh_anh TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 9. MAINTENANCE (Bảo trì)
CREATE TABLE public.maintenance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ma TEXT NOT NULL UNIQUE,
  ten TEXT NOT NULL,
  mo_ta TEXT,
  equipment_id UUID REFERENCES public.equipment(id) ON DELETE SET NULL,
  loai TEXT NOT NULL DEFAULT 'dinh_ky',
  uu_tien maintenance_priority NOT NULL DEFAULT 'trung_binh',
  trang_thai maintenance_status NOT NULL DEFAULT 'cho_thuc_hien',
  nguoi_thuc_hien UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  cong_viec TEXT,
  ngay_bat_dau DATE,
  ngay_het_han DATE,
  ngay_hoan_thanh TIMESTAMPTZ,
  ghi_chu TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 10. ENABLE RLS ON ALL TABLES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.production_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance ENABLE ROW LEVEL SECURITY;

-- 11. SECURITY DEFINER FUNCTION FOR ROLE CHECK
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- 12. FUNCTION TO CHECK IF USER IS ADMIN
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = 'admin'
  )
$$;

-- 13. RLS POLICIES

-- Profiles: Users can read all, update own
CREATE POLICY "Users can view all profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- User Roles: Only admins can manage, users can view own
CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

CREATE POLICY "Admins can insert roles"
  ON public.user_roles FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update roles"
  ON public.user_roles FOR UPDATE
  TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete roles"
  ON public.user_roles FOR DELETE
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- Production Lines, Areas, Equipment Types: All authenticated can read, admins can manage
CREATE POLICY "Authenticated can view production_lines"
  ON public.production_lines FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage production_lines"
  ON public.production_lines FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Authenticated can view areas"
  ON public.areas FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage areas"
  ON public.areas FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Authenticated can view equipment_types"
  ON public.equipment_types FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage equipment_types"
  ON public.equipment_types FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- Equipment: All authenticated can read, admins/technicians can manage
CREATE POLICY "Authenticated can view equipment"
  ON public.equipment FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage equipment"
  ON public.equipment FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()) OR public.has_role(auth.uid(), 'technician'))
  WITH CHECK (public.is_admin(auth.uid()) OR public.has_role(auth.uid(), 'technician'));

-- Incidents: All can view, technicians/operators can create/update
CREATE POLICY "Authenticated can view incidents"
  ON public.incidents FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Staff can insert incidents"
  ON public.incidents FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Staff can update incidents"
  ON public.incidents FOR UPDATE
  TO authenticated
  USING (
    public.is_admin(auth.uid()) 
    OR public.has_role(auth.uid(), 'technician')
    OR nguoi_bao_cao = auth.uid()
  );

CREATE POLICY "Admins can delete incidents"
  ON public.incidents FOR DELETE
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- Maintenance: Similar to incidents
CREATE POLICY "Authenticated can view maintenance"
  ON public.maintenance FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Staff can insert maintenance"
  ON public.maintenance FOR INSERT
  TO authenticated
  WITH CHECK (
    public.is_admin(auth.uid()) 
    OR public.has_role(auth.uid(), 'technician')
  );

CREATE POLICY "Staff can update maintenance"
  ON public.maintenance FOR UPDATE
  TO authenticated
  USING (
    public.is_admin(auth.uid()) 
    OR public.has_role(auth.uid(), 'technician')
    OR nguoi_thuc_hien = auth.uid()
  );

CREATE POLICY "Admins can delete maintenance"
  ON public.maintenance FOR DELETE
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- 14. UPDATED_AT TRIGGER FUNCTION
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 15. APPLY TRIGGER TO TABLES
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_production_lines_updated_at
  BEFORE UPDATE ON public.production_lines
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_areas_updated_at
  BEFORE UPDATE ON public.areas
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_equipment_types_updated_at
  BEFORE UPDATE ON public.equipment_types
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_equipment_updated_at
  BEFORE UPDATE ON public.equipment
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_incidents_updated_at
  BEFORE UPDATE ON public.incidents
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_maintenance_updated_at
  BEFORE UPDATE ON public.maintenance
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 16. TRIGGER TO AUTO-CREATE PROFILE ON SIGNUP
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, ho_va_ten)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'ho_va_ten', NEW.email));
  
  -- Assign default 'viewer' role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'viewer');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
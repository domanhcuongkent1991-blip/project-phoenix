export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      areas: {
        Row: {
          created_at: string
          id: string
          ma: string
          mo_ta: string | null
          production_line_id: string | null
          ten: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          ma: string
          mo_ta?: string | null
          production_line_id?: string | null
          ten: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          ma?: string
          mo_ta?: string | null
          production_line_id?: string | null
          ten?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "areas_production_line_id_fkey"
            columns: ["production_line_id"]
            isOneToOne: false
            referencedRelation: "production_lines"
            referencedColumns: ["id"]
          },
        ]
      }
      equipment: {
        Row: {
          area_id: string | null
          created_at: string
          equipment_type_id: string | null
          hinh_anh: string | null
          id: string
          ma: string
          mo_ta: string | null
          ngay_lap_dat: string | null
          production_line_id: string | null
          ten: string
          thong_so: Json | null
          trang_thai: Database["public"]["Enums"]["equipment_status"]
          updated_at: string
        }
        Insert: {
          area_id?: string | null
          created_at?: string
          equipment_type_id?: string | null
          hinh_anh?: string | null
          id?: string
          ma: string
          mo_ta?: string | null
          ngay_lap_dat?: string | null
          production_line_id?: string | null
          ten: string
          thong_so?: Json | null
          trang_thai?: Database["public"]["Enums"]["equipment_status"]
          updated_at?: string
        }
        Update: {
          area_id?: string | null
          created_at?: string
          equipment_type_id?: string | null
          hinh_anh?: string | null
          id?: string
          ma?: string
          mo_ta?: string | null
          ngay_lap_dat?: string | null
          production_line_id?: string | null
          ten?: string
          thong_so?: Json | null
          trang_thai?: Database["public"]["Enums"]["equipment_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "equipment_area_id_fkey"
            columns: ["area_id"]
            isOneToOne: false
            referencedRelation: "areas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "equipment_equipment_type_id_fkey"
            columns: ["equipment_type_id"]
            isOneToOne: false
            referencedRelation: "equipment_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "equipment_production_line_id_fkey"
            columns: ["production_line_id"]
            isOneToOne: false
            referencedRelation: "production_lines"
            referencedColumns: ["id"]
          },
        ]
      }
      equipment_types: {
        Row: {
          created_at: string
          id: string
          ma: string
          mo_ta: string | null
          ten: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          ma: string
          mo_ta?: string | null
          ten: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          ma?: string
          mo_ta?: string | null
          ten?: string
          updated_at?: string
        }
        Relationships: []
      }
      incidents: {
        Row: {
          created_at: string
          equipment_id: string | null
          giai_phap: string | null
          hinh_anh: string[] | null
          id: string
          ma: string
          mo_ta: string | null
          muc_do: Database["public"]["Enums"]["incident_severity"]
          ngay_hoan_thanh: string | null
          ngay_phat_hien: string
          nguoi_bao_cao: string | null
          nguoi_xu_ly: string | null
          nguyen_nhan: string | null
          phat_hien: string | null
          ten: string
          trang_thai: Database["public"]["Enums"]["incident_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          equipment_id?: string | null
          giai_phap?: string | null
          hinh_anh?: string[] | null
          id?: string
          ma: string
          mo_ta?: string | null
          muc_do?: Database["public"]["Enums"]["incident_severity"]
          ngay_hoan_thanh?: string | null
          ngay_phat_hien?: string
          nguoi_bao_cao?: string | null
          nguoi_xu_ly?: string | null
          nguyen_nhan?: string | null
          phat_hien?: string | null
          ten: string
          trang_thai?: Database["public"]["Enums"]["incident_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          equipment_id?: string | null
          giai_phap?: string | null
          hinh_anh?: string[] | null
          id?: string
          ma?: string
          mo_ta?: string | null
          muc_do?: Database["public"]["Enums"]["incident_severity"]
          ngay_hoan_thanh?: string | null
          ngay_phat_hien?: string
          nguoi_bao_cao?: string | null
          nguoi_xu_ly?: string | null
          nguyen_nhan?: string | null
          phat_hien?: string | null
          ten?: string
          trang_thai?: Database["public"]["Enums"]["incident_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "incidents_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipment"
            referencedColumns: ["id"]
          },
        ]
      }
      maintenance: {
        Row: {
          cong_viec: string | null
          created_at: string
          equipment_id: string | null
          ghi_chu: string | null
          id: string
          loai: string
          ma: string
          mo_ta: string | null
          ngay_bat_dau: string | null
          ngay_het_han: string | null
          ngay_hoan_thanh: string | null
          nguoi_thuc_hien: string | null
          ten: string
          trang_thai: Database["public"]["Enums"]["maintenance_status"]
          updated_at: string
          uu_tien: Database["public"]["Enums"]["maintenance_priority"]
        }
        Insert: {
          cong_viec?: string | null
          created_at?: string
          equipment_id?: string | null
          ghi_chu?: string | null
          id?: string
          loai?: string
          ma: string
          mo_ta?: string | null
          ngay_bat_dau?: string | null
          ngay_het_han?: string | null
          ngay_hoan_thanh?: string | null
          nguoi_thuc_hien?: string | null
          ten: string
          trang_thai?: Database["public"]["Enums"]["maintenance_status"]
          updated_at?: string
          uu_tien?: Database["public"]["Enums"]["maintenance_priority"]
        }
        Update: {
          cong_viec?: string | null
          created_at?: string
          equipment_id?: string | null
          ghi_chu?: string | null
          id?: string
          loai?: string
          ma?: string
          mo_ta?: string | null
          ngay_bat_dau?: string | null
          ngay_het_han?: string | null
          ngay_hoan_thanh?: string | null
          nguoi_thuc_hien?: string | null
          ten?: string
          trang_thai?: Database["public"]["Enums"]["maintenance_status"]
          updated_at?: string
          uu_tien?: Database["public"]["Enums"]["maintenance_priority"]
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipment"
            referencedColumns: ["id"]
          },
        ]
      }
      production_lines: {
        Row: {
          created_at: string
          id: string
          ma: string
          mo_ta: string | null
          ten: string
          trang_thai: boolean
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          ma: string
          mo_ta?: string | null
          ten: string
          trang_thai?: boolean
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          ma?: string
          mo_ta?: string | null
          ten?: string
          trang_thai?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          ho_va_ten: string
          id: string
          so_dien_thoai: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          ho_va_ten: string
          id?: string
          so_dien_thoai?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          ho_va_ten?: string
          id?: string
          so_dien_thoai?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "technician" | "operator" | "viewer"
      equipment_status: "hoat_dong" | "bao_tri" | "hong" | "cho_kiem_tra"
      incident_severity: "thap" | "trung_binh" | "cao" | "khan_cap"
      incident_status: "moi" | "dang_xu_ly" | "da_khac_phuc" | "dong"
      maintenance_priority: "thap" | "trung_binh" | "cao" | "khan_cap"
      maintenance_status:
        | "cho_thuc_hien"
        | "dang_thuc_hien"
        | "hoan_thanh"
        | "huy"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "technician", "operator", "viewer"],
      equipment_status: ["hoat_dong", "bao_tri", "hong", "cho_kiem_tra"],
      incident_severity: ["thap", "trung_binh", "cao", "khan_cap"],
      incident_status: ["moi", "dang_xu_ly", "da_khac_phuc", "dong"],
      maintenance_priority: ["thap", "trung_binh", "cao", "khan_cap"],
      maintenance_status: [
        "cho_thuc_hien",
        "dang_thuc_hien",
        "hoan_thanh",
        "huy",
      ],
    },
  },
} as const

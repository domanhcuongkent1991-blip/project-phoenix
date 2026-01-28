import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const statusBadgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-secondary text-secondary-foreground",
        success: "bg-success text-success-foreground",
        warning: "bg-warning text-warning-foreground",
        error: "bg-destructive text-destructive-foreground",
        info: "bg-info text-info-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof statusBadgeVariants> {}

function StatusBadge({ className, variant, ...props }: StatusBadgeProps) {
  return (
    <span className={cn(statusBadgeVariants({ variant }), className)} {...props} />
  );
}

// Mapping trạng thái thiết bị
export const equipmentStatusMap: Record<string, { label: string; variant: StatusBadgeProps["variant"] }> = {
  hoat_dong: { label: "Hoạt động", variant: "success" },
  bao_tri: { label: "Bảo trì", variant: "warning" },
  hong: { label: "Hỏng", variant: "error" },
  cho_kiem_tra: { label: "Chờ kiểm tra", variant: "info" },
};

// Mapping mức độ sự cố
export const incidentSeverityMap: Record<string, { label: string; variant: StatusBadgeProps["variant"] }> = {
  thap: { label: "Thấp", variant: "default" },
  trung_binh: { label: "Trung bình", variant: "warning" },
  cao: { label: "Cao", variant: "error" },
  khan_cap: { label: "Khẩn cấp", variant: "error" },
};

// Mapping trạng thái sự cố
export const incidentStatusMap: Record<string, { label: string; variant: StatusBadgeProps["variant"] }> = {
  moi: { label: "Mới", variant: "info" },
  dang_xu_ly: { label: "Đang xử lý", variant: "warning" },
  da_khac_phuc: { label: "Đã khắc phục", variant: "success" },
  dong: { label: "Đóng", variant: "default" },
};

// Mapping trạng thái bảo trì
export const maintenanceStatusMap: Record<string, { label: string; variant: StatusBadgeProps["variant"] }> = {
  cho_thuc_hien: { label: "Chờ thực hiện", variant: "info" },
  dang_thuc_hien: { label: "Đang thực hiện", variant: "warning" },
  hoan_thanh: { label: "Hoàn thành", variant: "success" },
  huy: { label: "Hủy", variant: "default" },
};

export { StatusBadge, statusBadgeVariants };

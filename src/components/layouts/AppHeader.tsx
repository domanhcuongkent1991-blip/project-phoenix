import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useLocation } from "react-router-dom";

// Mapping route sang tên hiển thị
const routeNames: Record<string, string> = {
  dashboard: "Dashboard",
  "thiet-bi": "Thiết bị",
  "su-co": "Sự cố",
  "bao-tri": "Bảo trì",
  "quan-ly": "Quản lý dữ liệu",
  "day-chuyen": "Dây chuyền",
  "khu-vuc": "Khu vực",
  "loai-thiet-bi": "Loại thiết bị",
  "quan-tri": "Quản trị",
  "nguoi-dung": "Người dùng",
};

export function AppHeader() {
  const location = useLocation();
  const pathSegments = location.pathname.split("/").filter(Boolean);

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b bg-background px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      
      <Breadcrumb>
        <BreadcrumbList>
          {pathSegments.map((segment, index) => {
            const isLast = index === pathSegments.length - 1;
            const path = "/" + pathSegments.slice(0, index + 1).join("/");
            const name = routeNames[segment] || segment;

            return (
              <BreadcrumbItem key={path}>
                {!isLast ? (
                  <>
                    <BreadcrumbLink href={path}>{name}</BreadcrumbLink>
                    <BreadcrumbSeparator />
                  </>
                ) : (
                  <BreadcrumbPage>{name}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  );
}

import { 
  LayoutDashboard, 
  Settings, 
  AlertTriangle, 
  Wrench, 
  Users, 
  Database,
  Factory,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Menu items chính
const mainMenuItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Thiết bị", url: "/thiet-bi", icon: Settings },
  { title: "Sự cố", url: "/su-co", icon: AlertTriangle },
  { title: "Bảo trì", url: "/bao-tri", icon: Wrench },
];

// Menu quản lý dữ liệu (Admin only)
const dataMenuItems = [
  { title: "Dây chuyền", url: "/quan-ly/day-chuyen" },
  { title: "Khu vực", url: "/quan-ly/khu-vuc" },
  { title: "Loại thiết bị", url: "/quan-ly/loai-thiet-bi" },
];

// Menu quản trị
const adminMenuItems = [
  { title: "Người dùng", url: "/quan-tri/nguoi-dung", icon: Users },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const { profile, isAdmin, signOut } = useAuth();

  const isActive = (path: string) => location.pathname === path;
  const isDataMenuActive = dataMenuItems.some((item) => isActive(item.url));

  return (
    <Sidebar collapsible="icon">
      {/* Header với logo */}
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sidebar-primary">
            <Factory className="h-6 w-6 text-sidebar-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-sidebar-foreground">Factory Pro</span>
              <span className="text-xs text-sidebar-muted">Giám sát nhà máy</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Menu chính */}
        <SidebarGroup>
          <SidebarGroupLabel>Menu chính</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <NavLink to={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Menu quản lý dữ liệu - Collapsible */}
        {isAdmin && (
          <Collapsible defaultOpen={isDataMenuActive} className="group/collapsible">
            <SidebarGroup>
              <CollapsibleTrigger asChild>
                <SidebarGroupLabel className="cursor-pointer hover:bg-sidebar-accent rounded-md px-2 py-1.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4" />
                    {!collapsed && <span>Quản lý dữ liệu</span>}
                  </div>
                  {!collapsed && (
                    <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                  )}
                </SidebarGroupLabel>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {dataMenuItems.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild isActive={isActive(item.url)}>
                          <NavLink to={item.url} className="pl-6">
                            <span>{item.title}</span>
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        )}

        {/* Menu quản trị */}
        {isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel>Quản trị</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminMenuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive(item.url)}>
                      <NavLink to={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      {/* Footer với user info */}
      <SidebarFooter className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={profile?.avatar_url || undefined} />
            <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground">
              {profile?.ho_va_ten?.charAt(0)?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex flex-1 flex-col overflow-hidden">
              <span className="truncate text-sm font-medium text-sidebar-foreground">
                {profile?.ho_va_ten || "Người dùng"}
              </span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={signOut}
            className="h-8 w-8 text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-accent"
            title="Đăng xuất"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

import { useEffect, useState } from "react";
import { 
  Settings, 
  AlertTriangle, 
  Wrench, 
  CheckCircle2,
  Clock,
  TrendingUp,
} from "lucide-react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge, equipmentStatusMap, incidentStatusMap } from "@/components/ui/status-badge";
import { supabase } from "@/integrations/supabase/client";

interface DashboardStats {
  totalEquipment: number;
  activeEquipment: number;
  pendingIncidents: number;
  pendingMaintenance: number;
}

interface RecentIncident {
  id: string;
  ma: string;
  ten: string;
  trang_thai: string;
  muc_do: string;
  created_at: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalEquipment: 0,
    activeEquipment: 0,
    pendingIncidents: 0,
    pendingMaintenance: 0,
  });
  const [recentIncidents, setRecentIncidents] = useState<RecentIncident[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Lấy số liệu thiết bị
        const { count: totalEquipment } = await supabase
          .from("equipment")
          .select("*", { count: "exact", head: true });

        const { count: activeEquipment } = await supabase
          .from("equipment")
          .select("*", { count: "exact", head: true })
          .eq("trang_thai", "hoat_dong");

        // Lấy số sự cố đang xử lý
        const { count: pendingIncidents } = await supabase
          .from("incidents")
          .select("*", { count: "exact", head: true })
          .in("trang_thai", ["moi", "dang_xu_ly"]);

        // Lấy số bảo trì chờ thực hiện
        const { count: pendingMaintenance } = await supabase
          .from("maintenance")
          .select("*", { count: "exact", head: true })
          .in("trang_thai", ["cho_thuc_hien", "dang_thuc_hien"]);

        // Lấy sự cố gần đây
        const { data: incidents } = await supabase
          .from("incidents")
          .select("id, ma, ten, trang_thai, muc_do, created_at")
          .order("created_at", { ascending: false })
          .limit(5);

        setStats({
          totalEquipment: totalEquipment || 0,
          activeEquipment: activeEquipment || 0,
          pendingIncidents: pendingIncidents || 0,
          pendingMaintenance: pendingMaintenance || 0,
        });

        setRecentIncidents(incidents as RecentIncident[] || []);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statsCards = [
    {
      title: "Tổng thiết bị",
      value: stats.totalEquipment,
      icon: Settings,
      description: `${stats.activeEquipment} đang hoạt động`,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Thiết bị hoạt động",
      value: stats.activeEquipment,
      icon: CheckCircle2,
      description: `${Math.round((stats.activeEquipment / (stats.totalEquipment || 1)) * 100)}% tổng số`,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      title: "Sự cố chờ xử lý",
      value: stats.pendingIncidents,
      icon: AlertTriangle,
      description: "Cần xử lý ngay",
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
    {
      title: "Bảo trì chờ thực hiện",
      value: stats.pendingMaintenance,
      icon: Wrench,
      description: "Đã lên lịch",
      color: "text-info",
      bgColor: "bg-info/10",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Tổng quan hệ thống giám sát thiết bị nhà máy
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statsCards.map((card) => (
            <Card key={card.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </CardTitle>
                <div className={`rounded-lg p-2 ${card.bgColor}`}>
                  <card.icon className={`h-4 w-4 ${card.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{card.value}</div>
                <p className="text-xs text-muted-foreground">{card.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Incidents */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-warning" />
                Sự cố gần đây
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Clock className="h-8 w-8 animate-pulse text-muted-foreground" />
                </div>
              ) : recentIncidents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <CheckCircle2 className="h-12 w-12 text-success" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    Không có sự cố nào
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentIncidents.map((incident) => (
                    <div
                      key={incident.id}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{incident.ten}</p>
                        <p className="text-xs text-muted-foreground">
                          {incident.ma}
                        </p>
                      </div>
                      <StatusBadge
                        variant={incidentStatusMap[incident.trang_thai]?.variant}
                      >
                        {incidentStatusMap[incident.trang_thai]?.label || incident.trang_thai}
                      </StatusBadge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats Chart Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Thống kê nhanh
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="mb-4 grid grid-cols-2 gap-4 w-full">
                  <div className="rounded-lg bg-success/10 p-4">
                    <p className="text-2xl font-bold text-success">
                      {Math.round((stats.activeEquipment / (stats.totalEquipment || 1)) * 100)}%
                    </p>
                    <p className="text-xs text-muted-foreground">Thiết bị hoạt động</p>
                  </div>
                  <div className="rounded-lg bg-warning/10 p-4">
                    <p className="text-2xl font-bold text-warning">
                      {stats.pendingIncidents}
                    </p>
                    <p className="text-xs text-muted-foreground">Sự cố cần xử lý</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Biểu đồ chi tiết sẽ được thêm sau
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

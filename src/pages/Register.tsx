import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Factory, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { registerSchema, type RegisterInput } from "@/lib/validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true);
    const { error } = await signUp(data.email, data.password, data.hoVaTen);
    setIsLoading(false);

    if (error) {
      toast({
        variant: "destructive",
        title: "Đăng ký thất bại",
        description: error.message || "Không thể tạo tài khoản",
      });
      return;
    }

    toast({
      title: "Đăng ký thành công",
      description: "Tài khoản của bạn đã được tạo!",
    });
    navigate("/dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-primary">
            <Factory className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-2xl">Đăng ký tài khoản</CardTitle>
            <CardDescription>
              Tạo tài khoản để truy cập hệ thống
            </CardDescription>
          </div>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="hoVaTen">Họ và tên</Label>
              <Input
                id="hoVaTen"
                type="text"
                placeholder="Nguyễn Văn A"
                {...register("hoVaTen")}
              />
              {errors.hoVaTen && (
                <p className="text-sm text-destructive">{errors.hoVaTen.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Đăng ký
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Đã có tài khoản?{" "}
              <Link to="/dang-nhap" className="text-primary hover:underline">
                Đăng nhập
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

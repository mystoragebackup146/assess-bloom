import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Login • TalentPulse";
    if (user) navigate("/dashboard", { replace: true });
  }, [user, navigate]);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const firstName = String(fd.get("firstName") || "").trim();
    const lastName = String(fd.get("lastName") || "").trim();
    const email = String(fd.get("email") || "").trim();
    const role = String(fd.get("role") || "user").trim() as "admin" | "user";
    if (!firstName || !email) return;
    login({ firstName, lastName, email, role });
    navigate("/dashboard");
  }

  return (
    <main className="min-h-screen grid place-items-center bg-background">
      <Card className="w-full max-w-md shadow-sm">
        <CardHeader>
          <CardTitle>Welcome to TalentPulse</CardTitle>
          <CardDescription>Sign in as Admin or User (local only)</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label>First name *</Label>
                <Input name="firstName" required />
              </div>
              <div>
                <Label>Last name</Label>
                <Input name="lastName" />
              </div>
            </div>
            <div>
              <Label>Email *</Label>
              <Input type="email" name="email" required />
            </div>
            <div>
              <Label>Login as</Label>
              <select name="role" className="w-full h-10 rounded-md border bg-background px-3 text-sm">
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>
            <Button type="submit" className="w-full">Continue</Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}

import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/contexts/AuthContext";

export function Navbar({ search, onSearch }: { search: string; onSearch: (v: string) => void }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="w-full border-b bg-background">
      <div className="container flex items-center justify-between gap-3 py-3">
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={() => navigate("/dashboard")} className="font-semibold text-base">
            TalentPulse
          </Button>
        </div>
        <div className="flex-1 max-w-xl">
          <Input
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search by name, email, keywords..."
            aria-label="Search employees"
          />
        </div>
        <div className="flex items-center gap-2">
          {user && (
            <span className="text-sm text-muted-foreground hidden sm:inline">Hi {user.firstName}</span>
          )}
          <ThemeToggle />
          {user && (
            <Button variant="outline" onClick={logout}>
              Logout
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

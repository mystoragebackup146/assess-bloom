import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useEmployees } from "@/contexts/EmployeesContext";

export default function EmployeeDetails() {
  const { id } = useParams<{ id: string }>();
  const { getById } = useEmployees();
  const emp = id ? getById(id) : undefined;
  const navigate = useNavigate();

  useEffect(() => {
    document.title = emp ? `${emp.name} • TalentPulse` : "Employee • TalentPulse";
  }, [emp]);

  if (!emp) {
    return (
      <main className="container py-10">
        <p className="text-muted-foreground">Employee not found.</p>
        <Button className="mt-4" onClick={() => navigate(-1)}>Go back</Button>
      </main>
    );
  }

  return (
    <main className="container py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">{emp.name}</h1>
          <p className="text-sm text-muted-foreground">{emp.role} • {emp.email}</p>
        </div>
        <Button variant="outline" onClick={() => navigate("/dashboard")}>Back to Dashboard</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Highlights</CardTitle>
          <CardDescription>Tags and submission status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Badge variant={emp.assessment_submitted ? "default" : "secondary"}>
              {emp.assessment_submitted ? "Submitted" : "Not Submitted"}
            </Badge>
            {(emp.tags || []).map((t) => <Badge key={t} variant="outline">{t}</Badge>)}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Assessment Answers</CardTitle>
          <CardDescription>All 20 responses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {Array.from({ length: 20 }, (_, i) => {
              const key = `q${i + 1}` as const;
              return (
                <div key={key}>
                  <div className="text-sm font-medium">Q{i + 1}</div>
                  <div className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {emp.answers?.[key] || "—"}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

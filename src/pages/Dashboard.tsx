import { useEffect, useMemo, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { AddEditEmployeeDialog } from "@/components/employee/AddEditEmployeeDialog";
import { EmployeeTable } from "@/components/employee/EmployeeTable";
import { Filters, FiltersBar, SortBy } from "@/components/employee/FiltersBar";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/useDebounce";
import { useEmployees, Employee } from "@/contexts/EmployeesContext";
import { useAuth } from "@/contexts/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const { employees, addEmployee, updateEmployee, deleteEmployee } = useEmployees();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  const [filters, setFilters] = useState<Filters>({ submitted: "All", role: "All", interest: "All", goals: "All", culture: "All", attitude: "All" });
  const [sort, setSort] = useState<SortBy>("name_asc");

  useEffect(() => {
    document.title = "Dashboard • TalentPulse";
  }, []);

  const filtered = useMemo(() => {
    let data = [...employees];

    // Search
    const q = debouncedSearch.trim().toLowerCase();
    if (q) {
      data = data.filter((e) =>
        e.name.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q) ||
        Object.values(e.answers || {}).some((a) => a?.toLowerCase().includes(q)) ||
        e.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Filters
    if (filters.submitted && filters.submitted !== "All") {
      const flag = filters.submitted === "Submitted";
      data = data.filter((e) => e.assessment_submitted === flag);
    }
    if (filters.role && filters.role !== "All") data = data.filter((e) => e.role === filters.role);
    if (filters.interest && filters.interest !== "All") data = data.filter((e) => e.interest_area === filters.interest);
    if (filters.goals && filters.goals !== "All") data = data.filter((e) => e.long_term_goals === filters.goals);
    if (filters.culture && filters.culture !== "All") data = data.filter((e) => e.work_culture === filters.culture);
    if (filters.attitude && filters.attitude !== "All") data = data.filter((e) => e.learning_attitude === filters.attitude);

    // Sort
    data.sort((a, b) => {
      switch (sort) {
        case "name_asc":
          return a.name.localeCompare(b.name);
        case "name_desc":
          return b.name.localeCompare(a.name);
        case "date_new":
          return (new Date(b.submission_date || 0).getTime()) - (new Date(a.submission_date || 0).getTime());
        case "date_old":
          return (new Date(a.submission_date || 0).getTime()) - (new Date(b.submission_date || 0).getTime());
        case "learning_high":
          return (b.learning_score || 0) - (a.learning_score || 0);
        case "learning_low":
          return (a.learning_score || 0) - (b.learning_score || 0);
        default:
          return 0;
      }
    });

    return data;
  }, [employees, debouncedSearch, filters, sort]);

  function resetFilters() {
    setFilters({ submitted: "All", role: "All", interest: "All", goals: "All", culture: "All", attitude: "All" });
    setSort("name_asc");
  }

  function onSaveNew(e: Omit<Employee, "id" | "tags" | "learning_score">) {
    addEmployee(e);
  }

  function exportCSV() {
    const rows = [
      ["Name","Email","Role","Submitted","Submission Date","Tags"],
      ...filtered.map((e) => [e.name, e.email, e.role, e.assessment_submitted ? "Yes" : "No", e.submission_date || "", (e.tags||[]).join(";")])
    ];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'employees.csv'; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar search={search} onSearch={setSearch} />

      <main className="container py-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold">Employee Dashboard</h1>
            <p className="text-sm text-muted-foreground">Manage assessments, filter, sort and export. {user?.role === 'admin' ? "(Admin)" : "(Viewer)"}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={exportCSV}>Export CSV</Button>
            {user?.role === 'admin' && (
              <AddEditEmployeeDialog onSave={onSaveNew} />
            )}
          </div>
        </div>

        <FiltersBar filters={filters} setFilters={setFilters} sort={sort} setSort={setSort} reset={resetFilters} />

        <EmployeeTable
          data={filtered}
          onEdit={(emp) => {
            // Quick inline edit: open dialog prefilled
            const container = document.createElement('div');
            document.body.appendChild(container);
            // For simplicity here, suggest editing from details page or future enhancement
            window.location.href = `/employee/${emp.id}`;
          }}
          onDelete={(id) => deleteEmployee(id)}
        />
      </main>
    </div>
  );
}

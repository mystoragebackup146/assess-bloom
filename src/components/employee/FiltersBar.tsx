import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type Filters = {
  submitted?: "Submitted" | "Not Submitted" | "All";
  role?: string | "All";
  interest?: string | "All";
  goals?: string | "All";
  culture?: string | "All";
  attitude?: string | "All";
};

export type SortBy = "name_asc" | "name_desc" | "date_new" | "date_old" | "learning_high" | "learning_low";

const roles = ["Software Engineer", "Backend Developer", "Frontend Developer", "Product Manager", "HR Manager"];
const interests = ["AI Enthusiast", "HR-Tech Passionate", "Exploring / Curious"];
const goals = ["Career-focused", "Entrepreneurial", "Technically inclined", "Unclear / Exploring"];
const cultures = ["Prefers healthy culture", "Salary-driven"];
const attitudes = ["Active Learner", "Passive"];

export function FiltersBar({ filters, setFilters, sort, setSort, reset }: {
  filters: Filters;
  setFilters: (f: Filters) => void;
  sort: SortBy;
  setSort: (s: SortBy) => void;
  reset: () => void;
}) {
  const selectCls = "min-w-[180px]";

  const options = useMemo(() => ({ roles, interests, goals, cultures, attitudes }), []);

  return (
    <div className="w-full border-b bg-background">
      <div className="container py-3 flex flex-wrap gap-3 items-center">
        <Select value={filters.submitted ?? "All"} onValueChange={(v) => setFilters({ ...filters, submitted: v as any })}>
          <SelectTrigger className={selectCls} aria-label="Filter by submission">
            <SelectValue placeholder="Submission" />
          </SelectTrigger>
          <SelectContent>
            {(["All", "Submitted", "Not Submitted"] as const).map((v) => (
              <SelectItem key={v} value={v}>{v}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.role ?? "All"} onValueChange={(v) => setFilters({ ...filters, role: v })}>
          <SelectTrigger className={selectCls} aria-label="Filter by role">
            <SelectValue placeholder="Role / Designation" />
          </SelectTrigger>
          <SelectContent>
            {(["All", ...options.roles]).map((v) => (
              <SelectItem key={v} value={v}>{v}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.interest ?? "All"} onValueChange={(v) => setFilters({ ...filters, interest: v })}>
          <SelectTrigger className={selectCls} aria-label="Filter by interest">
            <SelectValue placeholder="Interest Area" />
          </SelectTrigger>
          <SelectContent>
            {(["All", ...options.interests]).map((v) => (
              <SelectItem key={v} value={v}>{v}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.goals ?? "All"} onValueChange={(v) => setFilters({ ...filters, goals: v })}>
          <SelectTrigger className={selectCls} aria-label="Filter by goals">
            <SelectValue placeholder="Long-term goals" />
          </SelectTrigger>
          <SelectContent>
            {(["All", ...options.goals]).map((v) => (
              <SelectItem key={v} value={v}>{v}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.culture ?? "All"} onValueChange={(v) => setFilters({ ...filters, culture: v })}>
          <SelectTrigger className={selectCls} aria-label="Filter by culture">
            <SelectValue placeholder="Work culture" />
          </SelectTrigger>
          <SelectContent>
            {(["All", ...options.cultures]).map((v) => (
              <SelectItem key={v} value={v}>{v}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.attitude ?? "All"} onValueChange={(v) => setFilters({ ...filters, attitude: v })}>
          <SelectTrigger className={selectCls} aria-label="Filter by learning attitude">
            <SelectValue placeholder="Learning attitude" />
          </SelectTrigger>
          <SelectContent>
            {(["All", ...options.attitudes]).map((v) => (
              <SelectItem key={v} value={v}>{v}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="ml-auto flex items-center gap-2">
          <Select value={sort} onValueChange={(v) => setSort(v as any)}>
            <SelectTrigger className={selectCls} aria-label="Sort by">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name_asc">Name A–Z</SelectItem>
              <SelectItem value="name_desc">Name Z–A</SelectItem>
              <SelectItem value="date_new">Submission Newest</SelectItem>
              <SelectItem value="date_old">Submission Oldest</SelectItem>
              <SelectItem value="learning_high">Learning Score High</SelectItem>
              <SelectItem value="learning_low">Learning Score Low</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={reset}>Reset</Button>
        </div>
      </div>
    </div>
  );
}

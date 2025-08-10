import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Employee } from "@/contexts/EmployeesContext";

const interests = ["AI Enthusiast", "HR-Tech Passionate", "Exploring / Curious"];
const goals = ["Career-focused", "Entrepreneurial", "Technically inclined", "Unclear / Exploring"];
const cultures = ["Prefers healthy culture", "Salary-driven"];
const attitudes = ["Active Learner", "Passive"];

export function AddEditEmployeeDialog({ triggerLabel = "Add Employee", onSave, defaultValue, open: controlledOpen, onOpenChange }: {
  triggerLabel?: string;
  onSave: (e: Omit<Employee, "id" | "tags" | "learning_score">) => void;
  defaultValue?: Partial<Employee>;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
const [internalOpen, setInternalOpen] = useState(false);
const isControlled = controlledOpen !== undefined;
const actualOpen = isControlled ? !!controlledOpen : internalOpen;
const setActualOpen = (v: boolean) => {
  if (isControlled) onOpenChange?.(v);
  else setInternalOpen(v);
};
const [showAnswers, setShowAnswers] = useState(false);

  const [form, setForm] = useState<Partial<Employee>>({
    name: defaultValue?.name ?? "",
    email: defaultValue?.email ?? "",
    role: defaultValue?.role ?? "",
    assessment_submitted: defaultValue?.assessment_submitted ?? false,
    submission_date: defaultValue?.submission_date ?? new Date().toISOString().slice(0, 10),
    interest_area: defaultValue?.interest_area ?? undefined,
    long_term_goals: defaultValue?.long_term_goals ?? undefined,
    work_culture: defaultValue?.work_culture ?? undefined,
    learning_attitude: defaultValue?.learning_attitude ?? undefined,
    answers: defaultValue?.answers ?? Object.fromEntries(Array.from({ length: 20 }, (_, i) => ["q" + (i + 1), ""]))
  });

  function handleSave() {
    if (!form.name || !form.email || !form.role) return;
    onSave({
      name: form.name!,
      email: form.email!,
      role: form.role!,
      assessment_submitted: !!form.assessment_submitted,
      submission_date: form.submission_date,
      interest_area: form.interest_area,
      long_term_goals: form.long_term_goals,
      work_culture: form.work_culture,
      learning_attitude: form.learning_attitude,
      answers: form.answers ?? {},
      tags: [], // ignored in context
    } as any);
    setActualOpen(false);
  }

return (
    <Dialog open={actualOpen} onOpenChange={setActualOpen}>
      {!isControlled && (
        <DialogTrigger asChild>
          <Button>{triggerLabel}</Button>
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{defaultValue ? "Edit Employee" : "Add New Employee"}</DialogTitle>
          <DialogDescription>Fill in the employee details. All fields with * are required.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Name *</Label>
              <Input value={form.name as string} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <Label>Email *</Label>
              <Input type="email" value={form.email as string} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <Label>Role / Designation *</Label>
              <Input value={form.role as string} onChange={(e) => setForm({ ...form, role: e.target.value })} />
            </div>
            <div className="flex items-center gap-3 mt-6">
              <Switch checked={!!form.assessment_submitted} onCheckedChange={(v) => setForm({ ...form, assessment_submitted: v })} />
              <Label>Assessment Submitted</Label>
            </div>
            <div>
              <Label>Submission Date</Label>
              <Input type="date" value={form.submission_date as string} onChange={(e) => setForm({ ...form, submission_date: e.target.value })} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Interest Area</Label>
              <Select value={form.interest_area} onValueChange={(v) => setForm({ ...form, interest_area: v })}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  {interests.map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Long-term Goals</Label>
              <Select value={form.long_term_goals} onValueChange={(v) => setForm({ ...form, long_term_goals: v })}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  {goals.map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Work Culture Preference</Label>
              <Select value={form.work_culture} onValueChange={(v) => setForm({ ...form, work_culture: v })}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  {cultures.map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Learning Attitude</Label>
              <Select value={form.learning_attitude} onValueChange={(v) => setForm({ ...form, learning_attitude: v })}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  {attitudes.map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Label>Assessment Answers (20)</Label>
            <Button variant="outline" onClick={() => setShowAnswers((s) => !s)}>
              {showAnswers ? "Hide" : "Show"}
            </Button>
          </div>

          {showAnswers && (
            <div className="grid gap-3 max-h-[40vh] overflow-auto pr-2">
              {Array.from({ length: 20 }, (_, idx) => {
                const key = `q${idx + 1}`;
                return (
                  <div key={key}>
                    <Label>Q{idx + 1}</Label>
                    <Textarea
                      value={(form.answers as any)?.[key] ?? ""}
                      onChange={(e) => setForm({ ...form, answers: { ...(form.answers || {}), [key]: e.target.value } })}
                      placeholder={`Enter answer for question ${idx + 1}`}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setActualOpen(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

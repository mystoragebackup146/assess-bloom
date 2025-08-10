import React, { createContext, useContext, useMemo, useCallback } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export type Employee = {
  id: string;
  name: string;
  email: string;
  role: string;
  assessment_submitted: boolean;
  submission_date?: string; // ISO string
  answers: Record<string, string>;
  interest_area?: string;
  long_term_goals?: string;
  work_culture?: string;
  learning_attitude?: string;
  learning_score?: number;
  tags: string[];
};

type EmployeesContextType = {
  employees: Employee[];
  addEmployee: (e: Omit<Employee, "id" | "tags" | "learning_score">) => void;
  updateEmployee: (id: string, updates: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;
  getById: (id: string) => Employee | undefined;
};

const EmployeesContext = createContext<EmployeesContextType | undefined>(undefined);

function deriveTags(e: Omit<Employee, "id" | "tags" | "learning_score">) {
  const tags = new Set<string>();
  if (e.interest_area) tags.add(e.interest_area);
  if (e.long_term_goals) tags.add(e.long_term_goals);
  if (e.work_culture) tags.add(e.work_culture);
  if (e.learning_attitude) tags.add(e.learning_attitude);
  if (e.assessment_submitted) tags.add("Submitted");
  return Array.from(tags);
}

function deriveLearningScore(attitude?: string) {
  if (!attitude) return 0;
  return attitude === "Active Learner" ? 100 : 40;
}

export function EmployeesProvider({ children }: { children: React.ReactNode }) {
  const [employees, setEmployees] = useLocalStorage<Employee[]>("employees", []);

  const addEmployee = useCallback((e: Omit<Employee, "id" | "tags" | "learning_score">) => {
    const id = crypto.randomUUID();
    const newEmp: Employee = {
      ...e,
      id,
      tags: deriveTags(e),
      learning_score: deriveLearningScore(e.learning_attitude),
    };
    setEmployees((prev) => [newEmp, ...prev]);
  }, [setEmployees]);

  const updateEmployee = useCallback((id: string, updates: Partial<Employee>) => {
    setEmployees((prev) => prev.map((emp) => {
      if (emp.id !== id) return emp;
      const next = { ...emp, ...updates } as Employee;
      next.tags = deriveTags(next);
      next.learning_score = deriveLearningScore(next.learning_attitude);
      return next;
    }));
  }, [setEmployees]);

  const deleteEmployee = useCallback((id: string) => {
    setEmployees((prev) => prev.filter((e) => e.id !== id));
  }, [setEmployees]);

  const getById = useCallback((id: string) => employees.find((e) => e.id === id), [employees]);

  const value = useMemo(() => ({ employees, addEmployee, updateEmployee, deleteEmployee, getById }), [employees, addEmployee, updateEmployee, deleteEmployee, getById]);

  return <EmployeesContext.Provider value={value}>{children}</EmployeesContext.Provider>;
}

export function useEmployees() {
  const ctx = useContext(EmployeesContext);
  if (!ctx) throw new Error("useEmployees must be used within EmployeesProvider");
  return ctx;
}

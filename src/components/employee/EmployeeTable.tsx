import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Employee } from "@/contexts/EmployeesContext";

export function EmployeeTable({ data, onEdit, onDelete }: {
  data: Employee[];
  onEdit: (e: Employee) => void;
  onDelete: (id: string) => void;
}) {
  const navigate = useNavigate();

  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Highlights</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((e) => (
            <TableRow key={e.id} className="cursor-pointer" onClick={() => navigate(`/employee/${e.id}`)}>
              <TableCell>{e.name}</TableCell>
              <TableCell>{e.role}</TableCell>
              <TableCell>{e.email}</TableCell>
              <TableCell>
                <Badge variant={e.assessment_submitted ? "default" : "secondary"}>
                  {e.assessment_submitted ? "Submitted" : "Not Submitted"}
                </Badge>
              </TableCell>
              <TableCell className="max-w-[360px]">
                <div className="flex flex-wrap gap-1">
                  {e.tags?.slice(0, 6).map((t) => (
                    <Badge key={t} variant="outline">{t}</Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell className="text-right" onClick={(ev) => ev.stopPropagation()}>
                <div className="flex justify-end gap-2">
                  <Button size="sm" variant="outline" onClick={() => onEdit(e)}>Edit</Button>
                  <Button size="sm" variant="destructive" onClick={() => onDelete(e.id)}>Delete</Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {data.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground">
                No employees found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

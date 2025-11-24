import { Users } from "lucide-react"
import { EmptyState } from "@/components/ui/empty-state"

interface NoEmployeesProps {
  onAddEmployee: () => void
}

export function NoEmployees({ onAddEmployee }: NoEmployeesProps) {
  return (
    <EmptyState
      icon={Users}
      title="No employees found"
      description="Get started by adding your first employee to the roster. You can add them individually or use bulk upload to import multiple employees at once."
      action={{
        label: "Add Employee",
        onClick: onAddEmployee,
      }}
    />
  )
}

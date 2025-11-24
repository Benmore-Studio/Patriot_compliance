import { FileSearch } from "lucide-react"
import { EmptyState } from "@/components/ui/empty-state"

export function NoAuditLogs() {
  return (
    <EmptyState
      icon={FileSearch}
      title="No audit logs found"
      description="Audit logs will appear here as users perform actions in the system. All activities are automatically tracked for compliance and security purposes."
    />
  )
}

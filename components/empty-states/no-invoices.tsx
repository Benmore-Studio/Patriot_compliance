import { FileText } from "lucide-react"
import { EmptyState } from "@/components/ui/empty-state"

interface NoInvoicesProps {
  onCreateInvoice: () => void
}

export function NoInvoices({ onCreateInvoice }: NoInvoicesProps) {
  return (
    <EmptyState
      icon={FileText}
      title="No invoices generated"
      description="Generate your first invoice to begin tracking billing and payments for compliance services provided to your clients."
      action={{
        label: "Create Invoice",
        onClick: onCreateInvoice,
      }}
    />
  )
}

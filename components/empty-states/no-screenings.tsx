import { Shield } from "lucide-react"
import { EmptyState } from "@/components/ui/empty-state"

interface NoScreeningsProps {
  onOrderScreening: () => void
}

export function NoScreenings({ onOrderScreening }: NoScreeningsProps) {
  return (
    <EmptyState
      icon={Shield}
      title="No background screenings found"
      description="Order your first background screening to verify employee credentials and maintain compliance with hiring regulations."
      action={{
        label: "Order Screening",
        onClick: onOrderScreening,
      }}
    />
  )
}

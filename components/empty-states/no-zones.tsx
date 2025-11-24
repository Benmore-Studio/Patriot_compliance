import { MapPin } from "lucide-react"
import { EmptyState } from "@/components/ui/empty-state"

interface NoZonesProps {
  onCreateZone: () => void
}

export function NoZones({ onCreateZone }: NoZonesProps) {
  return (
    <EmptyState
      icon={MapPin}
      title="No geo-fence zones configured"
      description="Create your first geo-fence zone to track employee locations and automate compliance requirements based on geographic boundaries."
      action={{
        label: "Create Zone",
        onClick: onCreateZone,
      }}
    />
  )
}

import { TestTube } from "lucide-react"
import { EmptyState } from "@/components/ui/empty-state"

interface NoTestsProps {
  onScheduleTest: () => void
}

export function NoTests({ onScheduleTest }: NoTestsProps) {
  return (
    <EmptyState
      icon={TestTube}
      title="No drug tests scheduled"
      description="Schedule your first drug test to begin compliance tracking. You can schedule individual tests or generate random selections for DOT compliance."
      action={{
        label: "Schedule Test",
        onClick: onScheduleTest,
      }}
    />
  )
}

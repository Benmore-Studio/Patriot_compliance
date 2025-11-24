import { GraduationCap } from "lucide-react"
import { EmptyState } from "@/components/ui/empty-state"

interface NoCertificatesProps {
  onAddCertificate: () => void
}

export function NoCertificates({ onAddCertificate }: NoCertificatesProps) {
  return (
    <EmptyState
      icon={GraduationCap}
      title="No training certificates found"
      description="Add training certificates to track employee qualifications and ensure compliance with certification requirements."
      action={{
        label: "Add Certificate",
        onClick: onAddCertificate,
      }}
    />
  )
}

import { ComplianceMeter } from "@/components/compliance-meter"
import { PolicyProgressTiles } from "@/components/policy-progress-tiles"
import { AlertsCenter } from "@/components/alerts-center"
import { AuditQueue } from "@/components/audit-queue"
import { KeyStatistics } from "@/components/key-statistics"
import { LocationReadiness } from "@/components/location-readiness"
import { RosterExceptions } from "@/components/roster-exceptions"
import { UrgentNotifications } from "@/components/urgent-notifications"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Service Company Dashboard</h1>
          <p className="mt-2 text-muted-foreground">
            Real-time operational compliance hub driven by Employee Roster data
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <ComplianceMeter />
        <div className="lg:col-span-2">
          <PolicyProgressTiles />
        </div>
      </div>

      <AlertsCenter />

      <div className="grid gap-6 lg:grid-cols-2">
        <AuditQueue />
        <KeyStatistics />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <LocationReadiness />
        <RosterExceptions />
      </div>

      <UrgentNotifications />
    </div>
  )
}

import { BillingOverview } from "@/components/billing-overview"
import { InvoiceGenerator } from "@/components/invoice-generator"
import { BillingRecords } from "@/components/billing-records"
import { PaymentTracking } from "@/components/payment-tracking"

export default function BillingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Billing System</h1>
        <p className="mt-2 text-muted-foreground">
          Automated invoicing, payment tracking, and billing records management
        </p>
      </div>

      <BillingOverview />

      <div className="grid gap-8 lg:grid-cols-2">
        <InvoiceGenerator />
        <PaymentTracking />
      </div>

      <BillingRecords />
    </div>
  )
}

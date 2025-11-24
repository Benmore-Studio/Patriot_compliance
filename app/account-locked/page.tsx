import { Lock, Mail, Phone, CreditCard, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AccountLockedPage() {
  // Mock data - in real app, this would come from auth context or API
  const lockoutInfo = {
    invoiceNumber: "INV-2024-0338",
    amountDue: "$19,230.00",
    daysOverdue: 45,
    companyName: "Express Delivery Inc.",
    billingEmail: "billing@patriotcs.com",
    billingPhone: "(555) 123-4567",
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-2xl w-full space-y-8 text-center">
        {/* Lock Icon */}
        <div className="flex justify-center">
          <div className="rounded-full bg-destructive/10 p-6">
            <Lock className="h-16 w-16 text-destructive" />
          </div>
        </div>

        {/* Headline */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">Account Temporarily Suspended</h1>
          <p className="text-xl text-muted-foreground">Outstanding Invoice Payment Required</p>
        </div>

        {/* Details Card */}
        <div className="rounded-lg border border-border bg-card p-8 text-left space-y-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
            <div className="flex-1 space-y-4">
              <p className="text-sm text-muted-foreground">
                Your account has been temporarily suspended due to an outstanding invoice payment. To restore access,
                please submit payment using one of the methods below.
              </p>

              <div className="grid gap-3 text-sm">
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Company:</span>
                  <span className="font-medium text-foreground">{lockoutInfo.companyName}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Invoice Number:</span>
                  <span className="font-medium text-foreground">{lockoutInfo.invoiceNumber}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Amount Due:</span>
                  <span className="font-bold text-destructive text-lg">{lockoutInfo.amountDue}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Days Overdue:</span>
                  <span className="font-medium text-destructive">{lockoutInfo.daysOverdue} days</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Options */}
        <div className="rounded-lg border border-border bg-card p-6 text-left space-y-4">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Options
          </h2>

          <div className="space-y-4">
            {/* Online Payment */}
            <div className="space-y-2">
              <h3 className="font-medium text-foreground">Pay Online (Fastest)</h3>
              <p className="text-sm text-muted-foreground">
                Process your payment securely online. Account will be restored within 2 hours.
              </p>
              <Button className="w-full" size="lg">
                <CreditCard className="mr-2 h-4 w-4" />
                Pay Online Now
              </Button>
            </div>

            {/* Wire Transfer */}
            <div className="space-y-2 pt-4 border-t border-border">
              <h3 className="font-medium text-foreground">Wire Transfer</h3>
              <div className="text-sm space-y-1 text-muted-foreground">
                <p>Bank: First National Bank</p>
                <p>Account: 1234567890</p>
                <p>Routing: 987654321</p>
                <p>Reference: {lockoutInfo.invoiceNumber}</p>
              </div>
            </div>

            {/* Check */}
            <div className="space-y-2 pt-4 border-t border-border">
              <h3 className="font-medium text-foreground">Mail Check</h3>
              <div className="text-sm space-y-1 text-muted-foreground">
                <p>Patriot Compliance Services</p>
                <p>Attn: Billing Department</p>
                <p>123 Main Street, Suite 100</p>
                <p>City, State 12345</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="rounded-lg border border-border bg-card p-6 space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Need Assistance?</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <a
              href={`mailto:${lockoutInfo.billingEmail}`}
              className="flex items-center gap-3 p-4 rounded-lg border border-border hover:bg-accent transition-colors"
            >
              <Mail className="h-5 w-5 text-primary" />
              <div className="text-left">
                <p className="text-sm font-medium text-foreground">Email Support</p>
                <p className="text-xs text-muted-foreground">{lockoutInfo.billingEmail}</p>
              </div>
            </a>
            <a
              href={`tel:${lockoutInfo.billingPhone}`}
              className="flex items-center gap-3 p-4 rounded-lg border border-border hover:bg-accent transition-colors"
            >
              <Phone className="h-5 w-5 text-primary" />
              <div className="text-left">
                <p className="text-sm font-medium text-foreground">Phone Support</p>
                <p className="text-xs text-muted-foreground">{lockoutInfo.billingPhone}</p>
              </div>
            </a>
          </div>
          <p className="text-sm text-muted-foreground">
            <strong>Estimated Reactivation:</strong> Within 2 hours of payment confirmation
          </p>
        </div>

        {/* Footer */}
        <p className="text-xs text-muted-foreground">
          If you believe this is an error, please contact our billing department immediately.
        </p>
      </div>
    </div>
  )
}

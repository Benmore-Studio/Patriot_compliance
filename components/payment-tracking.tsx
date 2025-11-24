import { TrendingUp, Calendar } from "lucide-react"

const recentPayments = [
  { company: "Acme Transportation", amount: "$12,450", date: "2024-03-20", status: "completed" },
  { company: "Global Logistics", amount: "$8,920", date: "2024-03-18", status: "completed" },
  { company: "SafeWay Services", amount: "$15,680", date: "2024-03-15", status: "completed" },
  { company: "Metro Transit Co.", amount: "$6,340", date: "2024-03-12", status: "pending" },
]

export function PaymentTracking() {
  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="border-b border-border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-card-foreground">Payment Tracking</h2>
            <p className="mt-1 text-sm text-muted-foreground">Recent payment activity and status</p>
          </div>
          <TrendingUp className="h-6 w-6 text-muted-foreground" />
        </div>
      </div>
      <div className="divide-y divide-border">
        {recentPayments.map((payment, index) => (
          <div key={index} className="flex items-center justify-between p-4 hover:bg-accent/50 transition-colors">
            <div className="flex-1">
              <p className="text-sm font-medium text-card-foreground">{payment.company}</p>
              <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {payment.date}
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-card-foreground">{payment.amount}</p>
              <span
                className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                  payment.status === "completed" ? "bg-chart-2/10 text-chart-2" : "bg-chart-5/10 text-chart-5"
                }`}
              >
                {payment.status}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4">
        <button className="w-full rounded-lg border border-border bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80">
          View All Payments
        </button>
      </div>
    </div>
  )
}

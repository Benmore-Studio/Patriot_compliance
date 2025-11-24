"use client"

import Link from "next/link"
import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react"

const policies = [
  {
    id: 1,
    name: "DOT Random Testing",
    type: "DOT",
    ytdProgress: 48,
    ytdTarget: 50,
    tested: 96,
    eligible: 200,
    status: "warning",
    exceptions: ["2 Refusals", "1 Shy Bladder"],
    daysRemaining: 7,
    moduleLink: "/compliance/drug-testing",
  },
  {
    id: 2,
    name: "DOT Alcohol Testing",
    type: "DOT",
    ytdProgress: 12,
    ytdTarget: 10,
    tested: 24,
    eligible: 200,
    status: "success",
    exceptions: [],
    daysRemaining: 7,
    moduleLink: "/compliance/drug-testing",
  },
  {
    id: 3,
    name: "Non-DOT Random Testing",
    type: "Non-DOT",
    ytdProgress: 28,
    ytdTarget: 30,
    tested: 168,
    eligible: 600,
    status: "warning",
    exceptions: ["1 Missed Window"],
    daysRemaining: 14,
    moduleLink: "/compliance/drug-testing",
  },
]

export function PolicyProgressTiles() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-card-foreground">Policy Progress</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          YTD random/alcohol testing vs policy targets - Click to drill down
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {policies.map((policy) => {
          const progressPercentage = (policy.ytdProgress / policy.ytdTarget) * 100
          const Icon =
            policy.status === "success" ? CheckCircle2 : policy.status === "warning" ? AlertTriangle : XCircle

          return (
            <Link
              key={policy.id}
              href={policy.moduleLink}
              className="rounded-lg border border-border bg-card p-4 transition-all hover:border-primary hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                      {policy.type}
                    </span>
                    <Icon
                      className={`h-4 w-4 ${
                        policy.status === "success"
                          ? "text-chart-2"
                          : policy.status === "warning"
                            ? "text-chart-5"
                            : "text-destructive"
                      }`}
                    />
                  </div>
                  <h3 className="mt-2 font-medium text-card-foreground">{policy.name}</h3>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-bold text-card-foreground">{policy.ytdProgress}%</span>
                    <span className="text-sm text-muted-foreground">Target: {policy.ytdTarget}%</span>
                  </div>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                      className={`h-full ${
                        policy.status === "success"
                          ? "bg-chart-2"
                          : policy.status === "warning"
                            ? "bg-chart-5"
                            : "bg-destructive"
                      }`}
                      style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {policy.tested} / {policy.eligible} tested
                  </span>
                  <span className="text-muted-foreground">{policy.daysRemaining}d left</span>
                </div>

                {policy.exceptions.length > 0 && (
                  <div className="rounded bg-destructive/10 p-2">
                    <p className="text-xs font-medium text-destructive">Exceptions:</p>
                    <ul className="mt-1 space-y-0.5">
                      {policy.exceptions.map((exception, idx) => (
                        <li key={idx} className="text-xs text-destructive">
                          • {exception}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <div className="mt-3 text-right">
                <span className="text-xs font-medium text-primary">View Details →</span>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

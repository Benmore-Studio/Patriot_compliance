import { Clock, User } from "lucide-react"

const queueItems = [
  {
    id: 1,
    type: "Drug Test",
    employee: "Robert Chen",
    department: "Transportation",
    priority: "high",
    dueDate: "2024-03-25",
  },
  {
    id: 2,
    type: "Background Check",
    employee: "Emily Rodriguez",
    department: "Operations",
    priority: "medium",
    dueDate: "2024-03-28",
  },
  {
    id: 3,
    type: "Training Certification",
    employee: "David Kim",
    department: "Safety",
    priority: "low",
    dueDate: "2024-04-02",
  },
  {
    id: 4,
    type: "Medical Exam",
    employee: "Lisa Anderson",
    department: "Transportation",
    priority: "high",
    dueDate: "2024-03-26",
  },
]

export function QueueManagement() {
  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="border-b border-border p-6">
        <h2 className="text-xl font-semibold text-card-foreground">Compliance Queue</h2>
        <p className="mt-1 text-sm text-muted-foreground">Pending compliance tasks and reviews</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-border bg-muted/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Employee
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Department
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Priority
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Due Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {queueItems.map((item) => (
              <tr key={item.id} className="hover:bg-accent/50 transition-colors">
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-card-foreground">{item.type}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {item.employee}
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground">{item.department}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                      item.priority === "high"
                        ? "bg-destructive/10 text-destructive"
                        : item.priority === "medium"
                          ? "bg-chart-5/10 text-chart-5"
                          : "bg-chart-1/10 text-chart-1"
                    }`}
                  >
                    {item.priority}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {item.dueDate}
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  <button className="font-medium text-primary hover:underline">Process</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

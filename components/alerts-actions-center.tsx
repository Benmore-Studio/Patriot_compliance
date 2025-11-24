"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Clock, User, Download } from "lucide-react"

const mockAlertsData = [
  {
    id: "1",
    severity: "CRITICAL",
    module: "Billing",
    company: "FastHaul Transport",
    alert: "Account locked - 60+ days past due",
    owner: null,
    slaTimer: "Overdue",
    status: "open",
  },
  {
    id: "2",
    severity: "CRITICAL",
    module: "Drug & Alcohol",
    company: "XYZ Logistics LLC",
    alert: "Random testing quota shortfall - Q1 2025",
    owner: "J. Smith",
    slaTimer: "2 days",
    status: "assigned",
  },
  {
    id: "3",
    severity: "HIGH",
    module: "Occupational Health",
    company: "Premier Freight Inc.",
    alert: "8 DOT physicals expired, 12 expiring within 30 days",
    owner: "M. Johnson",
    slaTimer: "5 days",
    status: "assigned",
  },
]

export function AlertsActionsCenter() {
  const { toast } = useToast()
  const [alerts, setAlerts] = useState(mockAlertsData)
  const [statusFilter, setStatusFilter] = useState("all")
  const [assignDialogOpen, setAssignDialogOpen] = useState(false)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [selectedAlert, setSelectedAlert] = useState<any>(null)
  const [assignee, setAssignee] = useState("")
  const [notes, setNotes] = useState("")

  const filteredAlerts = alerts.filter((alert) => {
    if (statusFilter === "all") return true
    return alert.status === statusFilter
  })

  const handleAssign = () => {
    if (!assignee.trim()) {
      toast({
        title: "Error",
        description: "Please enter an assignee name",
        variant: "destructive",
      })
      return
    }

    setAlerts(
      alerts.map((alert) =>
        alert.id === selectedAlert.id ? { ...alert, owner: assignee, status: "assigned" } : alert,
      ),
    )

    toast({
      title: "Alert Assigned",
      description: `Alert assigned to ${assignee}`,
    })

    setAssignDialogOpen(false)
    setAssignee("")
  }

  const handleResolve = (alertId: string) => {
    setAlerts(alerts.map((alert) => (alert.id === alertId ? { ...alert, status: "resolved" } : alert)))

    toast({
      title: "Alert Resolved",
      description: "Alert has been marked as resolved",
    })
  }

  const handleExport = () => {
    toast({
      title: "Exporting Queue",
      description: "Generating CSV export of current alert queue...",
    })

    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: "Alert queue exported successfully",
      })
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Alerts & Actions Center</CardTitle>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="assigned">Assigned</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export Queue
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Severity</TableHead>
                <TableHead>Module</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Alert</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>SLA Timer</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAlerts.map((alert) => (
                <TableRow key={alert.id}>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        alert.severity === "CRITICAL"
                          ? "bg-red-500/20 text-red-400 border-red-500/30"
                          : "bg-orange-500/20 text-orange-400 border-orange-500/30"
                      }
                    >
                      {alert.severity}
                    </Badge>
                  </TableCell>
                  <TableCell>{alert.module}</TableCell>
                  <TableCell>{alert.company}</TableCell>
                  <TableCell>{alert.alert}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{alert.owner || "Unassigned"}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className={`flex items-center gap-1 ${alert.slaTimer === "Overdue" ? "text-red-400" : ""}`}>
                      <Clock className="h-4 w-4" />
                      <span className="text-sm font-medium">{alert.slaTimer}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {!alert.owner && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedAlert(alert)
                            setAssignDialogOpen(true)
                          }}
                        >
                          Assign
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedAlert(alert)
                          setViewDialogOpen(true)
                        }}
                      >
                        View
                      </Button>
                      {alert.status !== "resolved" && (
                        <Button size="sm" variant="outline" onClick={() => handleResolve(alert.id)}>
                          Resolve
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Alert</DialogTitle>
            <DialogDescription>Assign this alert to a team member for resolution</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Alert Details</Label>
              <p className="text-sm text-muted-foreground">{selectedAlert?.alert}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="assignee">Assign To</Label>
              <Select value={assignee} onValueChange={setAssignee}>
                <SelectTrigger>
                  <SelectValue placeholder="Select team member" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="J. Smith">J. Smith</SelectItem>
                  <SelectItem value="M. Johnson">M. Johnson</SelectItem>
                  <SelectItem value="K. Williams">K. Williams</SelectItem>
                  <SelectItem value="R. Davis">R. Davis</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Add any relevant notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAssign}>Assign Alert</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Alert Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">Severity</Label>
                <p className="font-medium">{selectedAlert?.severity}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Module</Label>
                <p className="font-medium">{selectedAlert?.module}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Company</Label>
                <p className="font-medium">{selectedAlert?.company}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Owner</Label>
                <p className="font-medium">{selectedAlert?.owner || "Unassigned"}</p>
              </div>
            </div>
            <div>
              <Label className="text-muted-foreground">Alert Description</Label>
              <p className="mt-1">{selectedAlert?.alert}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">SLA Timer</Label>
              <p className="mt-1">{selectedAlert?.slaTimer}</p>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

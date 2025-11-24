"use client"

import { useState } from "react"
import { Download, Eye, MoreVertical, Lock, Unlock, Mail, Phone, Calendar, FileText, AlertTriangle } from "lucide-react"
import { mockInvoices, type Invoice } from "@/lib/data/mock-invoices"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

export function BillingRecords() {
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices)
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [showLockDialog, setShowLockDialog] = useState(false)
  const [showUnlockDialog, setShowUnlockDialog] = useState(false)
  const [showHistoryDialog, setShowHistoryDialog] = useState(false)
  const [lockConfirmation, setLockConfirmation] = useState("")
  const [unlockNotes, setUnlockNotes] = useState("")
  const { toast } = useToast()

  const handleLockAccount = () => {
    if (lockConfirmation !== "LOCK") {
      toast({
        title: "Invalid confirmation",
        description: "Please type 'LOCK' to confirm",
        variant: "destructive",
      })
      return
    }

    if (!selectedInvoice) return

    const updatedInvoices = invoices.map((inv) =>
      inv.id === selectedInvoice.id
        ? {
            ...inv,
            status: "locked" as const,
            lockoutHistory: [
              ...(inv.lockoutHistory || []),
              {
                id: `lock-${Date.now()}`,
                timestamp: new Date().toISOString(),
                action: "locked" as const,
                adminId: "admin-current",
                adminName: "Current Admin",
                reason: `Manual lock - ${inv.daysOverdue} days overdue`,
                notes: `Invoice ${inv.id} locked due to non-payment`,
              },
            ],
          }
        : inv,
    )

    setInvoices(updatedInvoices)
    setShowLockDialog(false)
    setLockConfirmation("")
    setSelectedInvoice(null)

    toast({
      title: "Account Locked",
      description: `${selectedInvoice.client} has been locked. Notifications sent.`,
    })
  }

  const handleUnlockAccount = () => {
    if (!selectedInvoice) return

    const updatedInvoices = invoices.map((inv) =>
      inv.id === selectedInvoice.id
        ? {
            ...inv,
            status: "paid" as const,
            lockoutHistory: [
              ...(inv.lockoutHistory || []),
              {
                id: `unlock-${Date.now()}`,
                timestamp: new Date().toISOString(),
                action: "unlocked" as const,
                adminId: "admin-current",
                adminName: "Current Admin",
                reason: "Payment confirmed",
                notes: unlockNotes || "Account unlocked after payment verification",
              },
            ],
          }
        : inv,
    )

    setInvoices(updatedInvoices)
    setShowUnlockDialog(false)
    setUnlockNotes("")
    setSelectedInvoice(null)

    toast({
      title: "Account Unlocked",
      description: `${selectedInvoice.client} has been restored. Notifications sent.`,
    })
  }

  const getStatusBadge = (invoice: Invoice) => {
    const statusConfig = {
      active: {
        bg: "bg-chart-2/10",
        text: "text-chart-2",
        label: "Active",
        detail: invoice.daysUntilDue ? `Due in ${invoice.daysUntilDue} days` : "",
      },
      warning: {
        bg: "bg-chart-5/10",
        text: "text-chart-5",
        label: "Warning",
        detail: invoice.daysUntilDue ? `Due in ${invoice.daysUntilDue} days` : "",
      },
      overdue: {
        bg: "bg-chart-3/10",
        text: "text-chart-3",
        label: "Overdue",
        detail: invoice.daysOverdue ? `${invoice.daysOverdue} days overdue` : "",
      },
      locked: {
        bg: "bg-destructive/10",
        text: "text-destructive",
        label: "Locked",
        detail: invoice.daysOverdue ? `${invoice.daysOverdue} days overdue` : "",
      },
      paid: {
        bg: "bg-chart-2/10",
        text: "text-chart-2",
        label: "Paid",
        detail: "",
      },
    }

    const config = statusConfig[invoice.status]

    return (
      <div className="flex flex-col gap-1">
        <span className={`rounded-full px-2 py-1 text-xs font-medium ${config.bg} ${config.text} w-fit`}>
          {config.label}
        </span>
        {config.detail && <span className="text-xs text-muted-foreground">{config.detail}</span>}
      </div>
    )
  }

  const getActionMenuItems = (invoice: Invoice) => {
    const commonItems = (
      <>
        <DropdownMenuItem onClick={() => toast({ title: "View Invoice", description: `Opening ${invoice.id}` })}>
          <Eye className="mr-2 h-4 w-4" />
          View
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => toast({ title: "Generate PDF", description: `Generating PDF for ${invoice.id}` })}
        >
          <FileText className="mr-2 h-4 w-4" />
          Generate PDF
        </DropdownMenuItem>
      </>
    )

    switch (invoice.status) {
      case "active":
        return (
          <>
            {commonItems}
            <DropdownMenuItem
              onClick={() => toast({ title: "Reminder Sent", description: `Reminder sent to ${invoice.client}` })}
            >
              <Mail className="mr-2 h-4 w-4" />
              Send Reminder
            </DropdownMenuItem>
          </>
        )
      case "warning":
        return (
          <>
            {commonItems}
            <DropdownMenuItem
              onClick={() => toast({ title: "Payment Reminder", description: `Reminder sent to ${invoice.client}` })}
            >
              <Mail className="mr-2 h-4 w-4" />
              Send Payment Reminder
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => toast({ title: "Call Client", description: `Calling ${invoice.client}` })}>
              <Phone className="mr-2 h-4 w-4" />
              Call Client
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => toast({ title: "Extend Due Date", description: `Extended due date for ${invoice.id}` })}
            >
              <Calendar className="mr-2 h-4 w-4" />
              Extend Due Date
            </DropdownMenuItem>
          </>
        )
      case "overdue":
        return (
          <>
            {commonItems}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                setSelectedInvoice(invoice)
                setShowLockDialog(true)
              }}
              className="text-destructive focus:text-destructive"
            >
              <Lock className="mr-2 h-4 w-4" />
              Lock Account
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => toast({ title: "Final Notice", description: `Final notice sent to ${invoice.client}` })}
            >
              <AlertTriangle className="mr-2 h-4 w-4" />
              Send Final Notice
            </DropdownMenuItem>
          </>
        )
      case "locked":
        return (
          <>
            {commonItems}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                setSelectedInvoice(invoice)
                setShowUnlockDialog(true)
              }}
              className="text-chart-2 focus:text-chart-2"
            >
              <Unlock className="mr-2 h-4 w-4" />
              Unlock Account
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setSelectedInvoice(invoice)
                setShowHistoryDialog(true)
              }}
            >
              <FileText className="mr-2 h-4 w-4" />
              View Lock Details
            </DropdownMenuItem>
          </>
        )
      case "paid":
        return commonItems
      default:
        return commonItems
    }
  }

  return (
    <>
      <div className="rounded-lg border border-border bg-card">
        <div className="border-b border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-card-foreground">Billing Records</h2>
              <p className="mt-1 text-sm text-muted-foreground">Complete invoice history and payment records</p>
            </div>
            <button className="flex items-center gap-2 rounded-lg border border-border bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80">
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border bg-muted/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Invoice ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Account Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-accent/50 transition-colors">
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-card-foreground">{invoice.id}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground">{invoice.client}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground">{invoice.type}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-card-foreground">
                    {invoice.amountFormatted}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground">{invoice.dueDate}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">{getStatusBadge(invoice)}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">{getActionMenuItems(invoice)}</DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={showLockDialog} onOpenChange={setShowLockDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Lock Account - Confirmation Required
            </DialogTitle>
            <DialogDescription>
              You are about to lock the account for <strong>{selectedInvoice?.client}</strong>. This will:
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
              <li>Block all user logins for this company</li>
              <li>Set dashboard to read-only mode</li>
              <li>Send notification emails to company admins</li>
              <li>Mark company as locked in compliance portal</li>
              <li>Prevent new report generation</li>
            </ul>
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <p className="text-sm font-medium">Invoice Details:</p>
              <p className="text-sm text-muted-foreground">Amount Due: {selectedInvoice?.amountFormatted}</p>
              <p className="text-sm text-muted-foreground">Days Overdue: {selectedInvoice?.daysOverdue}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Type 'LOCK' to confirm:</label>
              <Input
                value={lockConfirmation}
                onChange={(e) => setLockConfirmation(e.target.value)}
                placeholder="LOCK"
                className="font-mono"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowLockDialog(false)
                setLockConfirmation("")
              }}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleLockAccount} disabled={lockConfirmation !== "LOCK"}>
              <Lock className="mr-2 h-4 w-4" />
              Lock Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showUnlockDialog} onOpenChange={setShowUnlockDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-chart-2">
              <Unlock className="h-5 w-5" />
              Unlock Account
            </DialogTitle>
            <DialogDescription>
              Verify payment has been received for <strong>{selectedInvoice?.client}</strong>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <p className="text-sm font-medium">Invoice Details:</p>
              <p className="text-sm text-muted-foreground">Amount: {selectedInvoice?.amountFormatted}</p>
              <p className="text-sm text-muted-foreground">Invoice: {selectedInvoice?.id}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Add notes (optional):</label>
              <Textarea
                value={unlockNotes}
                onChange={(e) => setUnlockNotes(e.target.value)}
                placeholder="e.g., Payment confirmed via wire transfer"
                rows={3}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Account will be immediately restored and notifications will be sent to the company.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowUnlockDialog(false)
                setUnlockNotes("")
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleUnlockAccount} className="bg-chart-2 hover:bg-chart-2/90">
              <Unlock className="mr-2 h-4 w-4" />
              Unlock Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showHistoryDialog} onOpenChange={setShowHistoryDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Lockout History - {selectedInvoice?.client}</DialogTitle>
            <DialogDescription>Complete lock/unlock event history for this account</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {selectedInvoice?.lockoutHistory?.map((event) => (
              <div key={event.id} className="border border-border rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-sm font-medium ${event.action === "locked" ? "text-destructive" : "text-chart-2"}`}
                  >
                    {event.action === "locked" ? "Account Locked" : "Account Unlocked"}
                  </span>
                  <span className="text-xs text-muted-foreground">{new Date(event.timestamp).toLocaleString()}</span>
                </div>
                <p className="text-sm text-muted-foreground">By: {event.adminName}</p>
                <p className="text-sm">Reason: {event.reason}</p>
                {event.notes && <p className="text-sm text-muted-foreground italic">Notes: {event.notes}</p>}
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button onClick={() => setShowHistoryDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

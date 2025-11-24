"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
import { DollarSign, Lock, CheckCircle2, AlertCircle, Mail, Phone } from "lucide-react"

const mockBillingData = [
  {
    id: "1",
    company: "ABC Trucking Co.",
    tier: "Enterprise",
    amount: 2500,
    status: "current",
    lastPayment: "Jan 1, 2025",
  },
  {
    id: "2",
    company: "XYZ Logistics LLC",
    tier: "Professional",
    amount: 1800,
    status: "current",
    lastPayment: "Jan 1, 2025",
  },
  {
    id: "3",
    company: "FastHaul Transport",
    tier: "Professional",
    amount: 1750,
    status: "locked",
    lastPayment: "Oct 15, 2024",
  },
  {
    id: "4",
    company: "SafeRoad Services",
    tier: "Standard",
    amount: 1200,
    status: "current",
    lastPayment: "Jan 1, 2025",
  },
  {
    id: "5",
    company: "Premier Freight Inc.",
    tier: "Professional",
    amount: 1650,
    status: "past_due",
    lastPayment: "Dec 1, 2024",
  },
]

export function BillingPayments() {
  const { toast } = useToast()
  const [billingData, setBillingData] = useState(mockBillingData)
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false)
  const [contactDialogOpen, setContactDialogOpen] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState<any>(null)
  const [message, setMessage] = useState("")

  const totalMRR = billingData.reduce((sum, item) => sum + item.amount, 0)
  const currentAccounts = billingData.filter((item) => item.status === "current").length
  const pastDueAccounts = billingData.filter((item) => item.status === "past_due")
  const lockedAccounts = billingData.filter((item) => item.status === "locked")

  const handleProcessPayments = () => {
    toast({
      title: "Processing Payments",
      description: "Initiating automated payment processing for all current accounts...",
    })

    setTimeout(() => {
      toast({
        title: "Payments Processed",
        description: `Successfully processed ${currentAccounts} automated payments`,
      })
    }, 2000)
  }

  const handleSendReminder = (company: any) => {
    toast({
      title: "Reminder Sent",
      description: `Payment reminder sent to ${company.company}`,
    })
  }

  const handleContact = () => {
    if (!message.trim()) {
      toast({
        title: "Error",
        description: "Please enter a message",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Message Sent",
      description: `Message sent to ${selectedCompany?.company}`,
    })

    setContactDialogOpen(false)
    setMessage("")
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total MRR</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalMRR.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Accounts Current</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">{currentAccounts}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((currentAccounts / billingData.length) * 100)}% of portfolio
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Past Due</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-400">{pastDueAccounts.length}</div>
            <p className="text-xs text-muted-foreground">
              ${pastDueAccounts.reduce((sum, item) => sum + item.amount, 0).toLocaleString()} outstanding
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Locked Accounts</CardTitle>
            <Lock className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-400">{lockedAccounts.length}</div>
            <p className="text-xs text-muted-foreground">
              ${lockedAccounts.reduce((sum, item) => sum + item.amount, 0).toLocaleString()} outstanding
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Billing Status by Company</CardTitle>
            <Button onClick={handleProcessPayments}>Process Automated Payments</Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Subscription Tier</TableHead>
                <TableHead>Monthly Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Payment</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {billingData.map((company) => (
                <TableRow key={company.id}>
                  <TableCell className="font-medium">{company.company}</TableCell>
                  <TableCell>{company.tier}</TableCell>
                  <TableCell>${company.amount.toLocaleString()}/mo</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        company.status === "current"
                          ? "bg-green-500/20 text-green-400 border-green-500/30"
                          : company.status === "past_due"
                            ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                            : "bg-red-500/20 text-red-400 border-red-500/30"
                      }
                    >
                      {company.status === "current"
                        ? "Current"
                        : company.status === "past_due"
                          ? "Past Due (15 days)"
                          : "Locked (60+ days)"}
                    </Badge>
                  </TableCell>
                  <TableCell>{company.lastPayment}</TableCell>
                  <TableCell>
                    {company.status === "current" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedCompany(company)
                          setHistoryDialogOpen(true)
                        }}
                      >
                        View History
                      </Button>
                    )}
                    {company.status === "locked" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedCompany(company)
                          setContactDialogOpen(true)
                        }}
                      >
                        Contact
                      </Button>
                    )}
                    {company.status === "past_due" && (
                      <Button size="sm" variant="outline" onClick={() => handleSendReminder(company)}>
                        Send Reminder
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={historyDialogOpen} onOpenChange={setHistoryDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Payment History - {selectedCompany?.company}</DialogTitle>
            <DialogDescription>View all payment transactions for this account</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Jan 1, 2025</TableCell>
                  <TableCell>${selectedCompany?.amount}</TableCell>
                  <TableCell>Auto-Pay (ACH)</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30">
                      Paid
                    </Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Dec 1, 2024</TableCell>
                  <TableCell>${selectedCompany?.amount}</TableCell>
                  <TableCell>Auto-Pay (ACH)</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30">
                      Paid
                    </Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Nov 1, 2024</TableCell>
                  <TableCell>${selectedCompany?.amount}</TableCell>
                  <TableCell>Auto-Pay (ACH)</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30">
                      Paid
                    </Badge>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          <DialogFooter>
            <Button onClick={() => setHistoryDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={contactDialogOpen} onOpenChange={setContactDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contact {selectedCompany?.company}</DialogTitle>
            <DialogDescription>Send a message regarding their account status</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 bg-transparent">
                <Mail className="h-4 w-4 mr-2" />
                Email
              </Button>
              <Button variant="outline" className="flex-1 bg-transparent">
                <Phone className="h-4 w-4 mr-2" />
                Call
              </Button>
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Enter your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setContactDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleContact}>Send Message</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

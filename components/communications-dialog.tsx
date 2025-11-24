"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { Mail, MessageSquare, Bell } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface CommunicationsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  companyName?: string
}

export function CommunicationsDialog({ open, onOpenChange, companyName }: CommunicationsDialogProps) {
  const [channel, setChannel] = useState<"email" | "sms" | "portal">("email")
  const [priority, setPriority] = useState<"low" | "normal" | "high">("normal")
  const [template, setTemplate] = useState("")
  const [message, setMessage] = useState("")
  const { toast } = useToast()

  const templates = [
    { value: "missing-docs", label: "Missing Documents Request" },
    { value: "expiring-cert", label: "Expiring Certification Alert" },
    { value: "compliance-issue", label: "Compliance Issue Notification" },
    { value: "custom", label: "Custom Message" },
  ]

  const handleSend = () => {
    toast({
      title: "Message Sent",
      description: `${channel.toUpperCase()} notification sent to ${companyName || "service company"}`,
    })
    onOpenChange(false)
    setMessage("")
    setTemplate("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Request Changes</DialogTitle>
          <DialogDescription>
            Send a request to {companyName || "the service company"} via multiple channels
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Communication Channel</Label>
            <RadioGroup
              value={channel}
              onValueChange={(value) => setChannel(value as typeof channel)}
              className="flex gap-4 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="email" id="email" />
                <Label htmlFor="email" className="flex items-center gap-2 cursor-pointer">
                  <Mail className="h-4 w-4" />
                  Email
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sms" id="sms" />
                <Label htmlFor="sms" className="flex items-center gap-2 cursor-pointer">
                  <MessageSquare className="h-4 w-4" />
                  SMS
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="portal" id="portal" />
                <Label htmlFor="portal" className="flex items-center gap-2 cursor-pointer">
                  <Bell className="h-4 w-4" />
                  Portal Notification
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label htmlFor="priority">Priority Level</Label>
            <Select value={priority} onValueChange={(value) => setPriority(value as typeof priority)}>
              <SelectTrigger id="priority">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Low</Badge>
                    <span className="text-sm text-muted-foreground">Response within 7 days</span>
                  </div>
                </SelectItem>
                <SelectItem value="normal">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      Normal
                    </Badge>
                    <span className="text-sm text-muted-foreground">Response within 3 days</span>
                  </div>
                </SelectItem>
                <SelectItem value="high">
                  <div className="flex items-center gap-2">
                    <Badge variant="destructive">High</Badge>
                    <span className="text-sm text-muted-foreground">Response within 24 hours</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="template">Message Template</Label>
            <Select value={template} onValueChange={setTemplate}>
              <SelectTrigger id="template">
                <SelectValue placeholder="Select a template or write custom message" />
              </SelectTrigger>
              <SelectContent>
                {templates.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="Enter your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {channel === "sms"
                ? "SMS messages are limited to 160 characters"
                : "No character limit for email and portal notifications"}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSend} disabled={!message.trim()}>
            Send {channel.toUpperCase()} Message
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

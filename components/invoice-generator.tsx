"use client"

import { useState } from "react"
import { FileText, Plus } from "lucide-react"

const billingModels = [
  { id: "per-test", name: "Per-Test Billing", description: "Charge per individual test or service" },
  { id: "per-service", name: "Per-Service Billing", description: "Charge per service category" },
  { id: "subscription", name: "Subscription Model", description: "Monthly or annual subscription" },
]

export function InvoiceGenerator() {
  const [selectedModel, setSelectedModel] = useState("per-test")

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="border-b border-border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-card-foreground">Invoice Generator</h2>
            <p className="mt-1 text-sm text-muted-foreground">Create invoices using employee roster data</p>
          </div>
          <FileText className="h-6 w-6 text-muted-foreground" />
        </div>
      </div>
      <div className="p-6 space-y-6">
        <div className="space-y-3">
          <label className="text-sm font-medium text-card-foreground">Billing Model</label>
          <div className="space-y-2">
            {billingModels.map((model) => (
              <label
                key={model.id}
                className={`flex items-start gap-3 rounded-lg border p-4 cursor-pointer transition-colors ${
                  selectedModel === model.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                }`}
              >
                <input
                  type="radio"
                  name="billing-model"
                  value={model.id}
                  checked={selectedModel === model.id}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-card-foreground">{model.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{model.description}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-card-foreground">Client / Service Company</label>
          <select className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground">
            <option>Acme Transportation Inc.</option>
            <option>Global Logistics Corp.</option>
            <option>SafeWay Services LLC</option>
          </select>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-card-foreground">Billing Period</label>
            <input
              type="date"
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-card-foreground">Due Date</label>
            <input
              type="date"
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground"
            />
          </div>
        </div>

        <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          <Plus className="h-4 w-4" />
          Generate Invoice
        </button>
      </div>
    </div>
  )
}

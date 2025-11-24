"use client"

import { useState } from "react"
import { Download, FileSpreadsheet, FileText, Printer, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

interface ExportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description?: string
  recordCount?: number
}

export function ExportDialog({
  open,
  onOpenChange,
  title = "Export Data",
  description = "Choose your preferred export format",
  recordCount = 0,
}: ExportDialogProps) {
  const [selectedFormat, setSelectedFormat] = useState<"csv" | "excel" | "pdf" | "print">("excel")
  const [isExporting, setIsExporting] = useState(false)
  const { toast } = useToast()

  const formats = [
    {
      value: "excel",
      label: "Excel Spreadsheet",
      description: "Best for data analysis and manipulation",
      icon: FileSpreadsheet,
      extension: ".xlsx",
    },
    {
      value: "csv",
      label: "CSV File",
      description: "Universal format compatible with all systems",
      icon: FileText,
      extension: ".csv",
    },
    {
      value: "pdf",
      label: "PDF Document",
      description: "Professional format for sharing and printing",
      icon: FileText,
      extension: ".pdf",
    },
    {
      value: "print",
      label: "Print Preview",
      description: "Open print dialog for immediate printing",
      icon: Printer,
      extension: "",
    },
  ]

  const handleExport = () => {
    setIsExporting(true)

    // Simulate export process
    setTimeout(() => {
      setIsExporting(false)
      onOpenChange(false)

      const formatLabel = formats.find((f) => f.value === selectedFormat)?.label
      toast({
        title: "Export Successful",
        description: `${recordCount} records exported as ${formatLabel}`,
      })
    }, 1500)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description}
            {recordCount > 0 && ` • ${recordCount} records will be exported`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <RadioGroup value={selectedFormat} onValueChange={(value: any) => setSelectedFormat(value)}>
            <div className="space-y-3">
              {formats.map((format) => {
                const Icon = format.icon
                return (
                  <div
                    key={format.value}
                    className={`relative flex items-start space-x-3 rounded-lg border-2 p-4 cursor-pointer transition-all ${
                      selectedFormat === format.value
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50 hover:bg-accent/50"
                    }`}
                    onClick={() => setSelectedFormat(format.value as any)}
                  >
                    <RadioGroupItem value={format.value} id={format.value} className="mt-1" />
                    <div className="flex-1">
                      <Label htmlFor={format.value} className="flex items-center gap-2 cursor-pointer">
                        <Icon className="h-5 w-5 text-primary" />
                        <span className="font-semibold">{format.label}</span>
                        {format.extension && (
                          <span className="text-xs text-muted-foreground">({format.extension})</span>
                        )}
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">{format.description}</p>
                    </div>
                    {selectedFormat === format.value && (
                      <Check className="h-5 w-5 text-primary absolute top-4 right-4" />
                    )}
                  </div>
                )
              })}
            </div>
          </RadioGroup>

          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <p className="text-sm font-medium">Export includes:</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• All visible columns and data</li>
              <li>• Current filters and sorting applied</li>
              <li>• Formatted dates and values</li>
              <li>• Compliance status indicators</li>
            </ul>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isExporting}>
              Cancel
            </Button>
            <Button onClick={handleExport} disabled={isExporting}>
              <Download className="mr-2 h-4 w-4" />
              {isExporting ? "Exporting..." : `Export as ${formats.find((f) => f.value === selectedFormat)?.label}`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

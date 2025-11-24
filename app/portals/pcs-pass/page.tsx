"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, Clock, Upload, MapPin, Camera, QrCode, FileText, AlertCircle, Download } from "lucide-react"
import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { generatePCSPassPDF, type PCSPassData } from "@/lib/pdf-generator"
import { toast } from "sonner"

export default function FieldWorkerPortalPage() {
  const [showDocuments, setShowDocuments] = useState(false)
  const [showTimesheets, setShowTimesheets] = useState(false)
  const [showReportIssue, setShowReportIssue] = useState(false)
  const [showQRCode, setShowQRCode] = useState(false)
  const [showCheckIn, setShowCheckIn] = useState(false)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

  const handleGeneratePDF = async () => {
    setIsGeneratingPDF(true)
    try {
      const pcsPassData: PCSPassData = {
        employeeName: "John Smith",
        employeeId: "EMP-12345",
        overallStatus: "Compliant - All requirements up to date",
        drugTesting: {
          lastTest: "Passed",
          testDate: "Dec 15, 2024",
          status: "Active in Random Pool",
        },
        backgroundCheck: {
          status: "Clear",
          completed: "Nov 20, 2024",
          nextReview: "Nov 20, 2025",
        },
        training: [
          { name: "DOT Training", status: "Current" },
          { name: "Safety Training", status: "Current" },
          { name: "HAZMAT Certification", status: "Expires Soon", expiryDate: "30 days" },
        ],
        medical: {
          dotPhysical: "Current",
          expires: "Aug 15, 2025",
        },
        recentUploads: [
          { name: "HAZMAT Certificate", date: "2 days ago", status: "Approved" },
          { name: "DOT Physical Card", date: "1 week ago", status: "Pending" },
        ],
        checkIns: [
          { location: "Site A - Building 3", date: "Yesterday, 8:00 AM - 5:00 PM" },
          { location: "Site B - Warehouse", date: "Dec 28, 7:30 AM - 4:30 PM" },
        ],
      }

      await generatePCSPassPDF(pcsPassData)
      toast.success("PDF generated successfully!")
    } catch (error) {
      console.error("[v0] PDF generation error:", error)
      toast.error("Failed to generate PDF. Please try again.")
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Compliance Status</h1>
          <p className="text-muted-foreground mt-1">View your personal compliance records and upload documents</p>
        </div>
        <Button onClick={handleGeneratePDF} disabled={isGeneratingPDF} className="gap-2">
          <Download className="h-4 w-4" />
          {isGeneratingPDF ? "Generating..." : "Download PDF"}
        </Button>
      </div>

      {/* Compliance Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Status</CardTitle>
          <CardDescription>Your current compliance standing</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-4xl font-bold text-green-600">Compliant</div>
              <p className="text-sm text-muted-foreground mt-1">All requirements up to date</p>
            </div>
            <CheckCircle className="h-16 w-16 text-green-600" />
          </div>
        </CardContent>
      </Card>

      {/* Notifications Section */}
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Important updates and reminders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
              <Clock className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">HAZMAT Certification Expiring Soon</p>
                <p className="text-xs text-muted-foreground">Expires in 30 days - Schedule renewal</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">Random Drug Test Scheduled</p>
                <p className="text-xs text-muted-foreground">Tomorrow at 9:00 AM - Site Office</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Compliance Items */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Drug Testing</CardTitle>
            <CardDescription>Your drug testing status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Last Test</span>
              <Badge variant="default" className="bg-green-600">
                <CheckCircle className="mr-1 h-3 w-3" />
                Passed
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Test Date</span>
              <span className="text-sm font-medium text-foreground">Dec 15, 2024</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Random Pool</span>
              <Badge variant="secondary">Active</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Background Check</CardTitle>
            <CardDescription>Your background screening status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Status</span>
              <Badge variant="default" className="bg-green-600">
                <CheckCircle className="mr-1 h-3 w-3" />
                Clear
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Completed</span>
              <span className="text-sm font-medium text-foreground">Nov 20, 2024</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Next Review</span>
              <span className="text-sm font-medium text-foreground">Nov 20, 2025</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Training & Certifications</CardTitle>
            <CardDescription>Your training completion status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">DOT Training</span>
              <Badge variant="default" className="bg-green-600">
                <CheckCircle className="mr-1 h-3 w-3" />
                Current
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Safety Training</span>
              <Badge variant="default" className="bg-green-600">
                <CheckCircle className="mr-1 h-3 w-3" />
                Current
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">HAZMAT Cert</span>
              <Badge
                variant="secondary"
                className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
              >
                <Clock className="mr-1 h-3 w-3" />
                Expires in 30 days
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Medical/Physical</CardTitle>
            <CardDescription>Your health screening status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">DOT Physical</span>
              <Badge variant="default" className="bg-green-600">
                <CheckCircle className="mr-1 h-3 w-3" />
                Current
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Expires</span>
              <span className="text-sm font-medium text-foreground">Aug 15, 2025</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Medical Card</span>
              <Button variant="link" size="sm" className="h-auto p-0">
                View Card
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload Documents</CardTitle>
          <CardDescription>Submit required documents for review</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="rounded-lg border-2 border-dashed border-border p-8 text-center hover:border-primary/50 transition-colors">
              <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-2 text-sm font-medium text-foreground">Upload a document</p>
              <p className="text-xs text-muted-foreground">PDF, JPG, PNG up to 10MB</p>
              <div className="flex gap-3 justify-center mt-4 flex-wrap">
                <Button>
                  <FileText className="mr-2 h-4 w-4" />
                  Choose File
                </Button>
                <Button variant="outline">
                  <Camera className="mr-2 h-4 w-4" />
                  Take Photo
                </Button>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <h4 className="text-sm font-medium text-foreground mb-3">Recent Uploads</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-foreground">HAZMAT Certificate</p>
                      <p className="text-xs text-muted-foreground">Uploaded 2 days ago</p>
                    </div>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                  >
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Approved
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-foreground">DOT Physical Card</p>
                      <p className="text-xs text-muted-foreground">Uploaded 1 week ago</p>
                    </div>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                  >
                    <Clock className="mr-1 h-3 w-3" />
                    Pending
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Site Check-In</CardTitle>
          <CardDescription>Log your current work location</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">Current Location</p>
                  <p className="text-xs text-muted-foreground">Not checked in</p>
                </div>
              </div>
              <Button size="lg" className="bg-primary" onClick={() => setShowCheckIn(true)}>
                <MapPin className="mr-2 h-4 w-4" />
                Check In
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button variant="outline" className="w-full bg-transparent" onClick={() => setShowQRCode(true)}>
                <QrCode className="mr-2 h-4 w-4" />
                Scan QR Code
              </Button>
              <Button variant="outline" className="w-full bg-transparent" onClick={() => setShowCheckIn(true)}>
                <MapPin className="mr-2 h-4 w-4" />
                Use GPS
              </Button>
            </div>

            <div className="pt-4 border-t border-border">
              <h4 className="text-sm font-medium text-foreground mb-3">Recent Check-Ins</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Site A - Building 3</p>
                      <p className="text-xs text-muted-foreground">Yesterday, 8:00 AM - 5:00 PM</p>
                    </div>
                  </div>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Site B - Warehouse</p>
                      <p className="text-xs text-muted-foreground">Dec 28, 7:30 AM - 4:30 PM</p>
                    </div>
                  </div>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and resources</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Button
              variant="outline"
              className="h-auto flex-col gap-2 py-4 bg-transparent"
              onClick={() => setShowDocuments(true)}
            >
              <FileText className="h-5 w-5" />
              <span className="text-xs">View Documents</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto flex-col gap-2 py-4 bg-transparent"
              onClick={() => setShowTimesheets(true)}
            >
              <Clock className="h-5 w-5" />
              <span className="text-xs">Time Sheets</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto flex-col gap-2 py-4 bg-transparent"
              onClick={() => setShowReportIssue(true)}
            >
              <AlertCircle className="h-5 w-5" />
              <span className="text-xs">Report Issue</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto flex-col gap-2 py-4 bg-transparent"
              onClick={() => setShowQRCode(true)}
            >
              <QrCode className="h-5 w-5" />
              <span className="text-xs">My QR Code</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {showDocuments && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowDocuments(false)}
        >
          <Card className="w-full max-w-2xl m-4" onClick={(e) => e.stopPropagation()}>
            <CardHeader>
              <CardTitle>My Documents</CardTitle>
              <CardDescription>View and download your compliance documents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {["DOT Physical Card", "HAZMAT Certificate", "Safety Training Certificate", "Drug Test Results"].map(
                  (doc) => (
                    <div key={doc} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-3">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{doc}</span>
                      </div>
                      <Button variant="outline" size="sm">
                        Download
                      </Button>
                    </div>
                  ),
                )}
              </div>
              <div className="mt-4 flex justify-end">
                <Button onClick={() => setShowDocuments(false)}>Close</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {showTimesheets && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowTimesheets(false)}
        >
          <Card className="w-full max-w-2xl m-4" onClick={(e) => e.stopPropagation()}>
            <CardHeader>
              <CardTitle>Time Sheets</CardTitle>
              <CardDescription>View and submit your work hours</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center py-8 text-muted-foreground">Timesheet feature coming soon</div>
              </div>
              <div className="mt-4 flex justify-end">
                <Button onClick={() => setShowTimesheets(false)}>Close</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {showReportIssue && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowReportIssue(false)}
        >
          <Card className="w-full max-w-2xl m-4" onClick={(e) => e.stopPropagation()}>
            <CardHeader>
              <CardTitle>Report an Issue</CardTitle>
              <CardDescription>Submit a safety concern or compliance issue</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Issue Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select issue type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="safety">Safety Concern</SelectItem>
                      <SelectItem value="equipment">Equipment Issue</SelectItem>
                      <SelectItem value="compliance">Compliance Issue</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea placeholder="Describe the issue..." className="min-h-[100px]" />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setShowReportIssue(false)}>
                    Cancel
                  </Button>
                  <Button>Submit Report</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {showQRCode && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowQRCode(false)}
        >
          <Card className="w-full max-w-md m-4" onClick={(e) => e.stopPropagation()}>
            <CardHeader>
              <CardTitle>My QR Code</CardTitle>
              <CardDescription>Scan this code for quick check-in</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center space-y-4">
                <div className="w-64 h-64 bg-muted rounded-lg flex items-center justify-center">
                  <QrCode className="h-48 w-48 text-muted-foreground" />
                </div>
                <div className="text-center">
                  <p className="font-medium">Employee ID: EMP-12345</p>
                  <p className="text-sm text-muted-foreground">John Smith</p>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Button onClick={() => setShowQRCode(false)}>Close</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {showCheckIn && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowCheckIn(false)}
        >
          <Card className="w-full max-w-md m-4" onClick={(e) => e.stopPropagation()}>
            <CardHeader>
              <CardTitle>Check In to Site</CardTitle>
              <CardDescription>Confirm your location</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Select Site</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a site" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="site-a">Site A - Building 3</SelectItem>
                      <SelectItem value="site-b">Site B - Warehouse</SelectItem>
                      <SelectItem value="site-c">Site C - Office</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setShowCheckIn(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setShowCheckIn(false)}>Confirm Check-In</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

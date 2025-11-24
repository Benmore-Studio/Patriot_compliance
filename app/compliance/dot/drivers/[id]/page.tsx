"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Upload, Camera, Download, CheckCircle2, AlertCircle, Clock, Eye, Trash2, Scan } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const dqFileDocuments = [
  {
    id: 1,
    name: "Application for Employment",
    required: true,
    status: "complete",
    uploadDate: "2024-01-15",
    expirationDate: null,
    ocrData: { applicantName: "John Smith", applicationDate: "2024-01-15" },
  },
  {
    id: 2,
    name: "Motor Vehicle Record (MVR)",
    required: true,
    status: "complete",
    uploadDate: "2024-12-01",
    expirationDate: "2025-12-01",
    ocrData: { licenseNumber: "CDL-123456", violations: 0, licenseStatus: "Valid" },
  },
  {
    id: 3,
    name: "Road Test Certificate",
    required: true,
    status: "complete",
    uploadDate: "2024-01-20",
    expirationDate: null,
    ocrData: { testDate: "2024-01-20", examiner: "Mike Johnson", result: "Pass" },
  },
  {
    id: 4,
    name: "Medical Examiner's Certificate",
    required: true,
    status: "expiring",
    uploadDate: "2024-06-15",
    expirationDate: "2025-06-15",
    ocrData: {
      expirationDate: "2025-06-15",
      workAccommodations: "None",
      examiner: "Dr. Sarah Williams",
      registryNumber: "12345",
    },
  },
  {
    id: 5,
    name: "Clearinghouse Query (Pre-Employment)",
    required: true,
    status: "complete",
    uploadDate: "2024-01-10",
    expirationDate: null,
    ocrData: { queryDate: "2024-01-10", result: "No violations found" },
  },
  {
    id: 6,
    name: "Previous Employer Drug & Alcohol Records",
    required: true,
    status: "complete",
    uploadDate: "2024-01-12",
    expirationDate: null,
    ocrData: { employers: 2, violations: 0 },
  },
  {
    id: 7,
    name: "Annual Inquiry and Certification of Violations",
    required: true,
    status: "missing",
    uploadDate: null,
    expirationDate: null,
    ocrData: null,
  },
  {
    id: 8,
    name: "Annual Motor Vehicle Record Review",
    required: true,
    status: "complete",
    uploadDate: "2025-01-05",
    expirationDate: "2026-01-05",
    ocrData: { reviewDate: "2025-01-05", reviewer: "Safety Manager", violations: 0 },
  },
]

export default function DriverDQFilePage() {
  const params = useParams()
  const router = useRouter()
  const [uploadingDoc, setUploadingDoc] = useState<number | null>(null)
  const [ocrProcessing, setOcrProcessing] = useState(false)

  const driverId = params.id as string
  const driverName = "John Smith" // Mock data
  const completionPercentage = Math.round(
    (dqFileDocuments.filter((doc) => doc.status === "complete" || doc.status === "expiring").length /
      dqFileDocuments.length) *
      100,
  )

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "complete":
        return <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
      case "expiring":
        return <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
      case "missing":
        return <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
      default:
        return <AlertCircle className="h-5 w-5 text-muted-foreground" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "complete":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-100">
            Complete
          </Badge>
        )
      case "expiring":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-100">
            Expiring Soon
          </Badge>
        )
      case "missing":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900 dark:text-red-100">Missing</Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const handleFileUpload = async (docId: number, file: File) => {
    setUploadingDoc(docId)
    setOcrProcessing(true)

    // Simulate OCR processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setOcrProcessing(false)
    setUploadingDoc(null)

    // In production, this would call the API to upload and process with Tesseract
    console.log("[v0] Uploaded file for document", docId, file.name)
  }

  const handleDownloadDQFile = () => {
    // In production, this would generate a PDF of all documents
    console.log("[v0] Downloading complete DQ file for driver", driverId)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Driver Qualification File</h1>
            <p className="text-muted-foreground">
              {driverName} - Driver ID: {driverId}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleDownloadDQFile}>
            <Download className="mr-2 h-4 w-4" />
            Download Complete DQ File (PDF)
          </Button>
        </div>
      </div>

      {/* Completion Status */}
      <Card>
        <CardHeader>
          <CardTitle>DQ File Completion Status</CardTitle>
          <CardDescription>Federal Motor Carrier Safety Regulations §391.51</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{completionPercentage}% Complete</p>
                <p className="text-sm text-muted-foreground">
                  {dqFileDocuments.filter((doc) => doc.status === "complete" || doc.status === "expiring").length} of{" "}
                  {dqFileDocuments.length} documents
                </p>
              </div>
              {completionPercentage === 100 ? (
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                  <CheckCircle2 className="mr-1 h-4 w-4" />
                  Audit Ready
                </Badge>
              ) : (
                <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
                  <AlertCircle className="mr-1 h-4 w-4" />
                  Incomplete
                </Badge>
              )}
            </div>
            <Progress value={completionPercentage} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Documents List */}
      <Card>
        <CardHeader>
          <CardTitle>Required Documents (8 Total)</CardTitle>
          <CardDescription>Upload and manage all required DOT driver qualification documents</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {dqFileDocuments.map((doc) => (
              <div key={doc.id} className="rounded-lg border p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3 flex-1">
                    {getStatusIcon(doc.status)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{doc.name}</h4>
                        {getStatusBadge(doc.status)}
                      </div>
                      {doc.uploadDate && <p className="text-sm text-muted-foreground">Uploaded: {doc.uploadDate}</p>}
                      {doc.expirationDate && (
                        <p className="text-sm text-muted-foreground">Expires: {doc.expirationDate}</p>
                      )}
                      {doc.status === "expiring" && (
                        <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">
                          ⚠️ Expires in 45 days - Upload new document
                        </p>
                      )}
                      {doc.status === "missing" && (
                        <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                          ❌ Required document missing - Upload immediately
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* OCR Extracted Data */}
                {doc.ocrData && (
                  <div className="mb-3 p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Scan className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">OCR Extracted Data</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {Object.entries(doc.ocrData).map(([key, value]) => (
                        <div key={key}>
                          <span className="text-muted-foreground capitalize">{key.replace(/([A-Z])/g, " $1")}: </span>
                          <span className="font-medium">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  {doc.status !== "missing" && (
                    <>
                      <Button variant="outline" size="sm">
                        <Eye className="mr-2 h-4 w-4" />
                        View Document
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 bg-transparent">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    </>
                  )}
                  <label htmlFor={`file-upload-${doc.id}`}>
                    <Button
                      variant={doc.status === "missing" ? "default" : "outline"}
                      size="sm"
                      className={doc.status === "missing" ? "bg-primary hover:bg-primary/90" : ""}
                      asChild
                    >
                      <span>
                        <Upload className="mr-2 h-4 w-4" />
                        {doc.status === "missing" ? "Upload Document" : "Replace Document"}
                      </span>
                    </Button>
                  </label>
                  <input
                    id={`file-upload-${doc.id}`}
                    type="file"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleFileUpload(doc.id, file)
                    }}
                  />
                  <Button variant="outline" size="sm">
                    <Camera className="mr-2 h-4 w-4" />
                    Capture
                  </Button>
                </div>

                {uploadingDoc === doc.id && (
                  <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Scan className="h-4 w-4 text-blue-600 dark:text-blue-400 animate-pulse" />
                      <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                        {ocrProcessing ? "Processing with OCR..." : "Uploading..."}
                      </span>
                    </div>
                    <Progress value={ocrProcessing ? 60 : 30} className="h-2" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Expiration Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Expiration Alerts</CardTitle>
          <CardDescription>Automated alerts for expiring documents</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="30" className="space-y-4">
            <TabsList>
              <TabsTrigger value="30">30 Days</TabsTrigger>
              <TabsTrigger value="60">60 Days</TabsTrigger>
              <TabsTrigger value="90">90 Days</TabsTrigger>
            </TabsList>
            <TabsContent value="30">
              <div className="space-y-2">
                {dqFileDocuments
                  .filter((doc) => doc.status === "expiring")
                  .map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                        <div>
                          <p className="font-medium">{doc.name}</p>
                          <p className="text-sm text-muted-foreground">Expires: {doc.expirationDate}</p>
                        </div>
                      </div>
                      <Button size="sm" className="bg-primary hover:bg-primary/90">
                        Upload New
                      </Button>
                    </div>
                  ))}
                {dqFileDocuments.filter((doc) => doc.status === "expiring").length === 0 && (
                  <p className="text-center text-muted-foreground py-4">No documents expiring in 30 days</p>
                )}
              </div>
            </TabsContent>
            <TabsContent value="60">
              <p className="text-center text-muted-foreground py-4">No documents expiring in 60 days</p>
            </TabsContent>
            <TabsContent value="90">
              <p className="text-center text-muted-foreground py-4">No documents expiring in 90 days</p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

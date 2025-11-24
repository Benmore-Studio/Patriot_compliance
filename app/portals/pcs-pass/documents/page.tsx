"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Upload, FileText, Download, Eye, Trash2, Camera, Search } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function DocumentsPage() {
  const { toast } = useToast()
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const documents = [
    {
      id: "doc-1",
      name: "DOT Physical Card",
      type: "Medical",
      uploadDate: "2024-08-15",
      expiryDate: "2025-08-15",
      status: "current",
      size: "245 KB",
    },
    {
      id: "doc-2",
      name: "HAZMAT Certification",
      type: "Training",
      uploadDate: "2024-02-15",
      expiryDate: "2025-02-15",
      status: "expiring",
      size: "189 KB",
    },
    {
      id: "doc-3",
      name: "Background Check Report",
      type: "Background",
      uploadDate: "2024-11-20",
      expiryDate: "2025-11-20",
      status: "current",
      size: "512 KB",
    },
    {
      id: "doc-4",
      name: "Drug Test Result - Dec 2024",
      type: "Drug Testing",
      uploadDate: "2024-12-15",
      expiryDate: null,
      status: "current",
      size: "98 KB",
    },
  ]

  const handleFileUpload = () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Document uploaded",
      description: "Your document has been submitted for review",
    })
    setUploadDialogOpen(false)
    setSelectedFile(null)
  }

  const filteredDocuments = documents.filter((doc) => doc.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Documents</h1>
          <p className="text-muted-foreground">Manage your compliance documents</p>
        </div>
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Upload className="mr-2 h-4 w-4" />
              Upload Document
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Document</DialogTitle>
              <DialogDescription>Submit a new document for review</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="rounded-lg border-2 border-dashed border-border p-8 text-center">
                <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-2 text-sm font-medium">Upload a document</p>
                <p className="text-xs text-muted-foreground">PDF, JPG, PNG up to 10MB</p>
                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-center">
                  <Input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    className="hidden"
                    id="file-upload"
                  />
                  <Label htmlFor="file-upload" className="cursor-pointer">
                    <Button type="button" onClick={() => document.getElementById("file-upload")?.click()}>
                      Choose File
                    </Button>
                  </Label>
                  <Button variant="outline">
                    <Camera className="mr-2 h-4 w-4" />
                    Take Photo
                  </Button>
                </div>
                {selectedFile && <p className="mt-2 text-sm">Selected: {selectedFile.name}</p>}
              </div>
              <div className="space-y-2">
                <Label>Document Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="medical">Medical Certificate</SelectItem>
                    <SelectItem value="training">Training Certificate</SelectItem>
                    <SelectItem value="license">License/Permit</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleFileUpload} className="w-full">
                Submit Document
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Upload Date</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocuments.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{doc.name}</span>
                  </TableCell>
                  <TableCell>{doc.type}</TableCell>
                  <TableCell>{doc.uploadDate}</TableCell>
                  <TableCell>{doc.expiryDate || "N/A"}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        doc.status === "current" ? "default" : doc.status === "expiring" ? "secondary" : "destructive"
                      }
                      className={
                        doc.status === "current" ? "bg-green-600" : doc.status === "expiring" ? "bg-yellow-500" : ""
                      }
                    >
                      {doc.status === "current" ? "Current" : doc.status === "expiring" ? "Expiring Soon" : "Expired"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import {
  ArrowLeft,
  Download,
  Edit,
  FileText,
  TestTube,
  Shield,
  GraduationCap,
  Heart,
  AlertTriangle,
  MapPin,
  User,
  Mail,
  Phone,
  CheckCircle2,
  Clock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"

export default async function Employee360Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  // Mock employee data - in production this would come from an API
  const employee = {
    id: id,
    name:
      id === "EMP-001"
        ? "John Smith"
        : id === "EMP-002"
          ? "Sarah Johnson"
          : id === "EMP-003"
            ? "Mike Davis"
            : "Emily Brown",
    role: "CDL Driver",
    department: "Transportation",
    location: "Houston, TX",
    hireDate: "2020-03-15",
    dob: "1985-06-20",
    email: "john.smith@company.com",
    phone: "(555) 123-4567",
    status: "active",
    photo: null,
    address: "123 Main St, Houston, TX 77001",
    emergencyContact: "Jane Smith - (555) 987-6543",
  }

  // Mock compliance data
  const drugTests = [
    { id: "DT-2024-156", type: "Random", date: "12/15/2024", result: "Negative", panel: "DOT 5-Panel" },
    { id: "DT-2024-089", type: "Random", date: "06/10/2024", result: "Negative", panel: "DOT 5-Panel" },
    { id: "DT-2024-012", type: "Pre-Employment", date: "03/15/2020", result: "Negative", panel: "DOT 10-Panel" },
  ]

  const backgroundCheck = {
    status: "Clear",
    date: "03/10/2020",
    provider: "Tazworks",
    lookback: "7 years",
    components: ["Criminal", "MVR", "Employment Verification", "Education Verification"],
  }

  const training = [
    {
      course: "DOT Hours of Service",
      completed: "03/15/2024",
      expires: "03/15/2025",
      status: "expiring",
      certificate: "CERT-2024-001",
    },
    {
      course: "Hazmat Handling",
      completed: "01/10/2024",
      expires: "01/10/2027",
      status: "valid",
      certificate: "CERT-2024-002",
    },
    {
      course: "Defensive Driving",
      completed: "05/20/2024",
      expires: "05/20/2026",
      status: "valid",
      certificate: "CERT-2024-003",
    },
  ]

  const medicalRecords = [
    { type: "DOT Physical", date: "08/20/2024", expires: "08/20/2026", provider: "Dr. Smith", status: "valid" },
    {
      type: "Medical Certificate",
      date: "08/20/2024",
      expires: "08/20/2026",
      certNumber: "MC-2024-001",
      status: "valid",
    },
  ]

  const geoFenceHistory = [
    {
      site: "Houston Distribution Center",
      checkIn: "01/15/2025 08:00 AM",
      checkOut: "01/15/2025 05:00 PM",
      hours: "9h",
    },
    { site: "Dallas Warehouse", checkIn: "01/14/2025 07:30 AM", checkOut: "01/14/2025 04:30 PM", hours: "9h" },
    {
      site: "Houston Distribution Center",
      checkIn: "01/13/2025 08:15 AM",
      checkOut: "01/13/2025 05:15 PM",
      hours: "9h",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/employees">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Roster
            </Button>
          </Link>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Profile
          </Button>
          <Button>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </div>
      </div>

      {/* Employee Header Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={employee.photo || undefined} />
              <AvatarFallback className="text-2xl">
                {employee.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">{employee.name}</h1>
                  <p className="text-lg text-muted-foreground">
                    {employee.role} • {employee.department}
                  </p>
                </div>
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                >
                  <CheckCircle2 className="mr-1 h-3 w-3" />
                  Active
                </Badge>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground">Employee ID</p>
                    <p className="font-medium">{employee.id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground">Email</p>
                    <p className="font-medium">{employee.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground">Phone</p>
                    <p className="font-medium">{employee.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground">Location</p>
                    <p className="font-medium">{employee.location}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Compliance Status Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <TestTube className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-sm font-medium">Drug Testing</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
              <CheckCircle2 className="mr-1 h-3 w-3" />
              Compliant
            </Badge>
            <p className="text-xs text-muted-foreground mt-2">Last test: 12/15/2024</p>
            <p className="text-xs text-muted-foreground">Result: Negative</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-sm font-medium">Background Check</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
              <CheckCircle2 className="mr-1 h-3 w-3" />
              Clear
            </Badge>
            <p className="text-xs text-muted-foreground mt-2">Completed: 03/10/2020</p>
            <p className="text-xs text-muted-foreground">Provider: Tazworks</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-sm font-medium">Training</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Badge
              variant="secondary"
              className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
            >
              <AlertTriangle className="mr-1 h-3 w-3" />
              At Risk
            </Badge>
            <p className="text-xs text-muted-foreground mt-2">1 course expiring soon</p>
            <p className="text-xs text-muted-foreground">3 active certifications</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-sm font-medium">Medical Status</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
              <CheckCircle2 className="mr-1 h-3 w-3" />
              Current
            </Badge>
            <p className="text-xs text-muted-foreground mt-2">DOT Physical: 08/20/2024</p>
            <p className="text-xs text-muted-foreground">Expires: 08/20/2026</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="drug-testing">Drug Testing</TabsTrigger>
          <TabsTrigger value="background">Background</TabsTrigger>
          <TabsTrigger value="training">Training & Certs</TabsTrigger>
          <TabsTrigger value="medical">Medical Records</TabsTrigger>
          <TabsTrigger value="geo-fence">Geo-Fence Check-Ins</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Full Name</p>
                    <p className="font-medium">{employee.name}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Date of Birth</p>
                    <p className="font-medium">{employee.dob}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Hire Date</p>
                    <p className="font-medium">{employee.hireDate}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Department</p>
                    <p className="font-medium">{employee.department}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-muted-foreground">Address</p>
                    <p className="font-medium">{employee.address}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-muted-foreground">Emergency Contact</p>
                    <p className="font-medium">{employee.emergencyContact}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Compliance Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Overall Compliance</span>
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                  >
                    92%
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Active Alerts</span>
                  <Badge
                    variant="secondary"
                    className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                  >
                    1
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Documents on File</span>
                  <span className="text-sm font-medium">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Last Updated</span>
                  <span className="text-sm font-medium">01/15/2025</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3 pb-3 border-b">
                  <TestTube className="h-5 w-5 text-green-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Drug Test Completed</p>
                    <p className="text-xs text-muted-foreground">Random test - Result: Negative</p>
                    <p className="text-xs text-muted-foreground">12/15/2024</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 pb-3 border-b">
                  <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Site Check-In</p>
                    <p className="text-xs text-muted-foreground">Houston Distribution Center</p>
                    <p className="text-xs text-muted-foreground">01/15/2025 08:00 AM</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Training Expiring Soon</p>
                    <p className="text-xs text-muted-foreground">DOT Hours of Service - Expires 03/15/2025</p>
                    <p className="text-xs text-muted-foreground">01/10/2025</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="drug-testing">
          <Card>
            <CardHeader>
              <CardTitle>Drug Testing History</CardTitle>
              <CardDescription>Complete record of all drug and alcohol tests</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Test ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Panel</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Result</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {drugTests.map((test) => (
                    <TableRow key={test.id}>
                      <TableCell className="font-medium">{test.id}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{test.type}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{test.panel}</TableCell>
                      <TableCell>{test.date}</TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                        >
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                          {test.result}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="background">
          <Card>
            <CardHeader>
              <CardTitle>Background Check Information</CardTitle>
              <CardDescription>Criminal history, MVR, and employment verification</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge
                    variant="secondary"
                    className="mt-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                  >
                    {backgroundCheck.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Completion Date</p>
                  <p className="font-medium mt-1">{backgroundCheck.date}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Provider</p>
                  <p className="font-medium mt-1">{backgroundCheck.provider}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Lookback Period</p>
                  <p className="font-medium mt-1">{backgroundCheck.lookback}</p>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Components Checked</h4>
                <div className="grid grid-cols-2 gap-2">
                  {backgroundCheck.components.map((component) => (
                    <div key={component} className="flex items-center gap-2 p-2 border rounded-lg">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span className="text-sm">{component}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-lg bg-green-50 dark:bg-green-950 p-4">
                <p className="text-sm text-green-900 dark:text-green-100">
                  <strong>Result:</strong> No disqualifying records found. Employee cleared for employment.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="training">
          <Card>
            <CardHeader>
              <CardTitle>Training & Certifications</CardTitle>
              <CardDescription>Completed courses and upcoming requirements</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Course Name</TableHead>
                    <TableHead>Certificate #</TableHead>
                    <TableHead>Completion Date</TableHead>
                    <TableHead>Expiration</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {training.map((course) => (
                    <TableRow key={course.certificate}>
                      <TableCell className="font-medium">{course.course}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{course.certificate}</TableCell>
                      <TableCell>{course.completed}</TableCell>
                      <TableCell>{course.expires}</TableCell>
                      <TableCell>
                        {course.status === "valid" ? (
                          <Badge
                            variant="secondary"
                            className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                          >
                            <CheckCircle2 className="mr-1 h-3 w-3" />
                            Valid
                          </Badge>
                        ) : (
                          <Badge
                            variant="secondary"
                            className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                          >
                            <Clock className="mr-1 h-3 w-3" />
                            Expiring Soon
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          {course.status === "valid" ? "View Certificate" : "Renew"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="medical">
          <Card>
            <CardHeader>
              <CardTitle>Medical Records</CardTitle>
              <CardDescription>DOT physicals, medical certifications, and health screenings</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Record Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Provider/Cert #</TableHead>
                    <TableHead>Expiration</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {medicalRecords.map((record, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{record.type}</TableCell>
                      <TableCell>{record.date}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {"provider" in record ? record.provider : record.certNumber}
                      </TableCell>
                      <TableCell>{record.expires}</TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                        >
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                          Valid
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          View Record
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="geo-fence">
          <Card>
            <CardHeader>
              <CardTitle>Geo-Fence Check-In History</CardTitle>
              <CardDescription>Site access and time tracking</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Site</TableHead>
                    <TableHead>Check-In</TableHead>
                    <TableHead>Check-Out</TableHead>
                    <TableHead>Hours</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {geoFenceHistory.map((entry, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{entry.site}</TableCell>
                      <TableCell>{entry.checkIn}</TableCell>
                      <TableCell>{entry.checkOut}</TableCell>
                      <TableCell>{entry.hours}</TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                        >
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                          Verified
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Document Library</CardTitle>
              <CardDescription>All employee documents and certificates</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document Type</TableHead>
                    <TableHead>File Name</TableHead>
                    <TableHead>Upload Date</TableHead>
                    <TableHead>Expiration</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>CDL License</TableCell>
                    <TableCell>cdl-john-smith.pdf</TableCell>
                    <TableCell>01/15/2024</TableCell>
                    <TableCell>01/15/2028</TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                      >
                        Valid
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <FileText className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Medical Certificate</TableCell>
                    <TableCell>medical-cert-2024.pdf</TableCell>
                    <TableCell>08/20/2024</TableCell>
                    <TableCell>08/20/2026</TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                      >
                        Valid
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <FileText className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>I-9 Form</TableCell>
                    <TableCell>i9-john-smith.pdf</TableCell>
                    <TableCell>03/15/2020</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                      >
                        On File
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <FileText className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

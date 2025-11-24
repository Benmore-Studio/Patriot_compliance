"use client"

import { useState } from "react"
import { Search, Download, Mail, FileText, Printer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"

export default function OnboardingRequirementsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [moduleFilter, setModuleFilter] = useState("all")
  const [regulationFilter, setRegulationFilter] = useState("all")
  const [selectedState, setSelectedState] = useState("federal")
  const { toast } = useToast()

  const handlePrint = () => {
    window.print()
    toast({
      title: "Printing",
      description: "Compliance manual is being prepared for printing",
    })
  }

  const handleExport = () => {
    toast({
      title: "Exporting",
      description: "Compliance requirements are being exported to PDF",
    })
  }

  const handleEmail = () => {
    toast({
      title: "Email Sent",
      description: "Requirements have been sent to stakeholders",
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Compliance Requirements & Onboarding</h1>
          <p className="text-muted-foreground">Complete reference for all compliance modules and setup</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print Manual
          </Button>
          <Button variant="outline" onClick={handleEmail}>
            <Mail className="mr-2 h-4 w-4" />
            Email
          </Button>
          <Button onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search requirements..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={moduleFilter} onValueChange={setModuleFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by module" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Modules</SelectItem>
                <SelectItem value="drug-testing">Drug Testing</SelectItem>
                <SelectItem value="background">Background Checks</SelectItem>
                <SelectItem value="dot">DOT Compliance</SelectItem>
                <SelectItem value="health">Occupational Health</SelectItem>
                <SelectItem value="training">Training & Certs</SelectItem>
                <SelectItem value="hos">Hours of Service</SelectItem>
                <SelectItem value="hipaa">HIPAA Privacy</SelectItem>
              </SelectContent>
            </Select>
            <Select value={regulationFilter} onValueChange={setRegulationFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by regulation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regulations</SelectItem>
                <SelectItem value="dot">DOT/FMCSA</SelectItem>
                <SelectItem value="osha">OSHA</SelectItem>
                <SelectItem value="fcra">FCRA</SelectItem>
                <SelectItem value="hipaa">HIPAA</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for Each Module */}
      <Tabs defaultValue="drug-testing" className="space-y-4">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="drug-testing">Drug Testing</TabsTrigger>
          <TabsTrigger value="background">Background</TabsTrigger>
          <TabsTrigger value="dot">DOT</TabsTrigger>
          <TabsTrigger value="health">Health</TabsTrigger>
          <TabsTrigger value="training">Training</TabsTrigger>
          <TabsTrigger value="hos">HOS</TabsTrigger>
          <TabsTrigger value="hipaa">HIPAA</TabsTrigger>
        </TabsList>

        {/* Drug & Alcohol Testing Tab */}
        <TabsContent value="drug-testing" className="space-y-6">
          {/* Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
              <CardDescription>Drug & Alcohol Testing Program Requirements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">What This Module Covers</h4>
                <p className="text-sm text-muted-foreground">
                  DOT and non-DOT drug and alcohol testing programs, including pre-employment, random, post-accident,
                  reasonable suspicion, return-to-duty, and follow-up testing. Includes MRO review, SAP referrals, and
                  FMCSA Clearinghouse reporting.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Who Needs It</h4>
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm font-bold text-foreground">CDL Drivers</span>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-sm font-bold text-foreground">Safety-Sensitive Employees</span>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-sm font-bold text-foreground">DOT-Regulated Positions</span>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Compliance Frequency</h4>
                <p className="text-sm text-muted-foreground">
                  Random testing: 50% annually (drug), 10% annually (alcohol). Pre-employment: Before hire.
                  Post-accident: Immediately. Return-to-duty: Before return. Follow-up: Minimum 6 tests in 12 months.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Penalties for Non-Compliance</h4>
                <p className="text-sm text-red-600 dark:text-red-400">
                  FMCSA fines up to $10,000 per violation. Driver disqualification. Out-of-service orders. Increased
                  audit scrutiny.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Federal Requirements */}
          <Card>
            <CardHeader>
              <CardTitle>Federal Requirements</CardTitle>
              <CardDescription>49 CFR Part 382 - Controlled Substances and Alcohol Use and Testing</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Requirement</TableHead>
                    <TableHead>Regulation</TableHead>
                    <TableHead>Mandatory</TableHead>
                    <TableHead>Frequency</TableHead>
                    <TableHead>Documentation</TableHead>
                    <TableHead>Lookback</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Pre-Employment Testing</TableCell>
                    <TableCell>49 CFR §382.301</TableCell>
                    <TableCell>
                      <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">Yes</Badge>
                    </TableCell>
                    <TableCell>Before hire</TableCell>
                    <TableCell>Test result, consent form</TableCell>
                    <TableCell>N/A</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Random Testing (Drug)</TableCell>
                    <TableCell>49 CFR §382.305</TableCell>
                    <TableCell>
                      <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">Yes</Badge>
                    </TableCell>
                    <TableCell>50% annually</TableCell>
                    <TableCell>Selection records, test results</TableCell>
                    <TableCell>N/A</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Random Testing (Alcohol)</TableCell>
                    <TableCell>49 CFR §382.305</TableCell>
                    <TableCell>
                      <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">Yes</Badge>
                    </TableCell>
                    <TableCell>10% annually</TableCell>
                    <TableCell>Selection records, test results</TableCell>
                    <TableCell>N/A</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Post-Accident</TableCell>
                    <TableCell>49 CFR §382.303</TableCell>
                    <TableCell>
                      <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">Yes</Badge>
                    </TableCell>
                    <TableCell>Immediately</TableCell>
                    <TableCell>Accident report, test results</TableCell>
                    <TableCell>N/A</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Reasonable Suspicion</TableCell>
                    <TableCell>49 CFR §382.307</TableCell>
                    <TableCell>
                      <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">Yes</Badge>
                    </TableCell>
                    <TableCell>As needed</TableCell>
                    <TableCell>Observation report, test results</TableCell>
                    <TableCell>N/A</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Return-to-Duty</TableCell>
                    <TableCell>49 CFR §382.309</TableCell>
                    <TableCell>
                      <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">Yes</Badge>
                    </TableCell>
                    <TableCell>Before return</TableCell>
                    <TableCell>SAP report, test results</TableCell>
                    <TableCell>N/A</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Follow-Up</TableCell>
                    <TableCell>49 CFR §382.311</TableCell>
                    <TableCell>
                      <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">Yes</Badge>
                    </TableCell>
                    <TableCell>6 tests/12mo minimum</TableCell>
                    <TableCell>SAP plan, test results</TableCell>
                    <TableCell>N/A</TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              <div className="mt-6 space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Test Panel Requirements</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>DOT 5-Panel: Marijuana, Cocaine, Opiates, Amphetamines, PCP</li>
                    <li>Cut-off levels specified in 49 CFR Part 40</li>
                    <li>MRO review required for all positive results</li>
                    <li>SAP referral required for violations</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Chain of Custody</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>Federal custody form (CCF) required</li>
                    <li>Specimen integrity procedures must be followed</li>
                    <li>Split specimen retention required</li>
                    <li>Documentation retention: 5 years</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* State-Specific Requirements */}
          <Card>
            <CardHeader>
              <CardTitle>State-Specific Requirements</CardTitle>
              <CardDescription>Additional state regulations beyond federal requirements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Select value={selectedState} onValueChange={setSelectedState}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="federal">Federal Only</SelectItem>
                    <SelectItem value="california">California</SelectItem>
                    <SelectItem value="new-york">New York</SelectItem>
                    <SelectItem value="texas">Texas</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {selectedState === "california" && (
                <div className="space-y-2">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">California Additions</h4>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                      <li>Marijuana testing restrictions for non-safety-sensitive positions</li>
                      <li>Additional privacy protections for test results</li>
                      <li>Specific notification requirements</li>
                    </ul>
                  </div>
                </div>
              )}

              {selectedState === "new-york" && (
                <div className="space-y-2">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">New York Additions</h4>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                      <li>Marijuana not disqualifying for most positions</li>
                      <li>Additional employee rights protections</li>
                      <li>Specific consent form requirements</li>
                    </ul>
                  </div>
                </div>
              )}

              {selectedState === "texas" && (
                <div className="space-y-2">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Texas Additions</h4>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                      <li>Additional alcohol testing for certain roles</li>
                      <li>Specific documentation requirements</li>
                      <li>Enhanced random testing rates for some industries</li>
                    </ul>
                  </div>
                </div>
              )}

              {selectedState === "federal" && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Select a state to view state-specific requirements</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Setup Checklist */}
          <Card>
            <CardHeader>
              <CardTitle>Setup Checklist</CardTitle>
              <CardDescription>Steps to configure drug testing module</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  "Configure drug testing policy",
                  "Add testing vendors (CRL, Quest, etc.)",
                  "Set up random pool roster",
                  "Define notification rules",
                  "Configure roles and permissions",
                  "Upload existing test records",
                  "Test vendor webhook integration",
                  "Train supervisors on reasonable suspicion",
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                    <Checkbox id={`drug-${index}`} />
                    <label htmlFor={`drug-${index}`} className="text-sm cursor-pointer flex-1">
                      {item}
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Document Templates */}
          <Card>
            <CardHeader>
              <CardTitle>Document Templates</CardTitle>
              <CardDescription>Download required forms and templates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  "Drug Testing Policy Template",
                  "Employee Consent Form",
                  "Reasonable Suspicion Observation Form",
                  "Supervisor Training Materials",
                  "Random Selection Audit Log",
                  "Record-Keeping Checklist",
                ].map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm">{doc}</span>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Common Scenarios */}
          <Card>
            <CardHeader>
              <CardTitle>Common Scenarios</CardTitle>
              <CardDescription>Frequently asked questions and step-by-step guidance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">What happens if an employee fails a drug test?</h4>
                  <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1">
                    <li>MRO reviews the positive result and contacts employee</li>
                    <li>If confirmed positive, employee is immediately removed from safety-sensitive duties</li>
                    <li>Employee must be referred to a Substance Abuse Professional (SAP)</li>
                    <li>Violation must be reported to FMCSA Clearinghouse within 2 business days</li>
                    <li>Employee completes SAP evaluation and treatment plan</li>
                    <li>Return-to-duty test must be negative before returning to work</li>
                    <li>Follow-up testing required (minimum 6 tests in 12 months)</li>
                  </ol>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">How often must random testing be done?</h4>
                  <p className="text-sm text-muted-foreground">
                    DOT requires random drug testing at a rate of 50% of the average number of driver positions
                    annually, and random alcohol testing at 10% annually. Tests must be spread throughout the year and
                    conducted using a scientifically valid random selection process.
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">When is post-accident testing required?</h4>
                  <p className="text-sm text-muted-foreground">
                    Post-accident testing is required when: (1) there is a fatality, (2) the driver receives a citation
                    for a moving violation and there is bodily injury requiring immediate medical treatment away from
                    the scene, or (3) the driver receives a citation and a vehicle is towed from the scene. Testing must
                    be conducted as soon as possible, within 8 hours for alcohol and 32 hours for drugs.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Background Checks Tab */}
        <TabsContent value="background" className="space-y-6">
          {/* Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
              <CardDescription>Background Screening & FCRA Compliance Requirements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">What This Module Covers</h4>
                <p className="text-sm text-muted-foreground">
                  Pre-employment and ongoing background checks including criminal records, motor vehicle records,
                  employment verification, education verification, and continuous monitoring. Includes FCRA-compliant
                  adverse action workflows and adjudication rules.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Who Needs It</h4>
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm font-bold text-foreground">All New Hires</span>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-sm font-bold text-foreground">CDL Drivers</span>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-sm font-bold text-foreground">Safety-Sensitive Positions</span>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-sm font-bold text-foreground">Existing Employees (7-year updates)</span>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Compliance Frequency</h4>
                <p className="text-sm text-muted-foreground">
                  Pre-employment: Before hire. 7-year updates: Every 7 years. Annual reviews: Annually for CDL drivers.
                  Continuous monitoring: Real-time for criminal records.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Penalties for Non-Compliance</h4>
                <p className="text-sm text-red-600 dark:text-red-400">
                  FCRA violations: Up to $1,000 per violation. Class action lawsuits. Punitive damages. State-specific
                  penalties for ban-the-box violations.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Federal Requirements (FCRA) */}
          <Card>
            <CardHeader>
              <CardTitle>Federal Requirements (FCRA)</CardTitle>
              <CardDescription>Fair Credit Reporting Act - 15 U.S.C. § 1681</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Requirement</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Mandatory</TableHead>
                    <TableHead>Documentation</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Written Consent</TableCell>
                    <TableCell>Employee must consent before check</TableCell>
                    <TableCell>
                      <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">Yes</Badge>
                    </TableCell>
                    <TableCell>Signed consent form</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Pre-Adverse Action</TableCell>
                    <TableCell>Notice before taking action</TableCell>
                    <TableCell>
                      <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">Yes</Badge>
                    </TableCell>
                    <TableCell>Letter + report copy</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Adverse Action</TableCell>
                    <TableCell>Final notice if not hired/terminated</TableCell>
                    <TableCell>
                      <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">Yes</Badge>
                    </TableCell>
                    <TableCell>Letter + dispute rights</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Record Retention</TableCell>
                    <TableCell>Keep all records</TableCell>
                    <TableCell>
                      <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">Yes</Badge>
                    </TableCell>
                    <TableCell>7 years</TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              <div className="mt-6 space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Disqualifying Offenses</h4>
                  <p className="text-sm text-muted-foreground mb-2">Configurable by role:</p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>Felonies within 7 years (federal standard)</li>
                    <li>Violent crimes (permanent disqualification)</li>
                    <li>Drug-related offenses (case-by-case review)</li>
                    <li>Financial crimes for financial roles</li>
                    <li>State-specific lookback periods apply</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* State-Specific Requirements */}
          <Card>
            <CardHeader>
              <CardTitle>Ban-the-Box Laws by State</CardTitle>
              <CardDescription>State-specific lookback period limits</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>State</TableHead>
                    <TableHead>Lookback Period</TableHead>
                    <TableHead>Restrictions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">California</TableCell>
                    <TableCell>7 years</TableCell>
                    <TableCell>Cannot consider convictions older than 7 years</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Colorado</TableCell>
                    <TableCell>5 years</TableCell>
                    <TableCell>5 years for certain offenses</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Massachusetts</TableCell>
                    <TableCell>3 years</TableCell>
                    <TableCell>3 years for certain offenses</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">New York</TableCell>
                    <TableCell>Varies</TableCell>
                    <TableCell>Cannot ask about criminal history on initial application</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Setup Checklist */}
          <Card>
            <CardHeader>
              <CardTitle>Setup Checklist</CardTitle>
              <CardDescription>Steps to configure background checks module</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  "Configure background check policy",
                  "Add screening vendor (TazWorks)",
                  "Define screening packages by role",
                  "Set up adjudication matrix",
                  "Configure adverse action workflow",
                  "Define roles and permissions",
                  "Upload existing screening records",
                  "Test vendor API integration",
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                    <Checkbox id={`bg-${index}`} />
                    <label htmlFor={`bg-${index}`} className="text-sm cursor-pointer flex-1">
                      {item}
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Document Templates */}
          <Card>
            <CardHeader>
              <CardTitle>Document Templates</CardTitle>
              <CardDescription>Download FCRA-compliant forms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  "Disclosure and Authorization Form",
                  "Pre-Adverse Action Notice Template",
                  "Final Adverse Action Notice Template",
                  "Summary of FCRA Rights",
                  "Adjudication Matrix Template",
                  "Record-Keeping Log",
                ].map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm">{doc}</span>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Common Scenarios */}
          <Card>
            <CardHeader>
              <CardTitle>Common Scenarios</CardTitle>
              <CardDescription>Frequently asked questions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">What's the lookback period for felonies?</h4>
                  <p className="text-sm text-muted-foreground">
                    Federal standard is 7 years, but state laws vary. California limits lookback to 7 years for most
                    convictions. Some states like Massachusetts have 3-year limits for certain offenses. Always check
                    state-specific requirements.
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">How long is the adverse action waiting period?</h4>
                  <p className="text-sm text-muted-foreground">
                    FCRA requires a "reasonable" waiting period between pre-adverse and final adverse action notices.
                    Industry standard is 5 business days to allow the candidate to dispute findings.
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">What if a candidate disputes the background check?</h4>
                  <p className="text-sm text-muted-foreground">
                    The candidate must contact the screening company (not the employer) to dispute. The screening
                    company has 30 days to investigate. Employers should delay final adverse action until the dispute is
                    resolved.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* DOT Compliance Tab */}
        <TabsContent value="dot" className="space-y-6">
          {/* Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
              <CardDescription>DOT Driver Qualification & FMCSA Compliance Requirements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">What This Module Covers</h4>
                <p className="text-sm text-muted-foreground">
                  Driver Qualification (DQ) files, medical certificates, clearinghouse queries, hours of service
                  compliance, accident reporting, and DOT audit readiness. Ensures compliance with FMCSA regulations for
                  commercial motor vehicle operations.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Who Needs It</h4>
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm font-bold text-foreground">CDL-A Drivers</span>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-sm font-bold text-foreground">CDL-B Drivers</span>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-sm font-bold text-foreground">Interstate Commerce Drivers</span>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Compliance Frequency</h4>
                <p className="text-sm text-muted-foreground">
                  Medical certificates: Every 2 years. Annual MVR review: Annually. Clearinghouse queries:
                  Pre-employment and annually. DQ file review: Annually.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Penalties for Non-Compliance</h4>
                <p className="text-sm text-red-600 dark:text-red-400">
                  FMCSA fines up to $16,000 per violation. Out-of-service orders. Driver disqualification. Increased CSA
                  scores. Potential loss of operating authority.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Driver Qualification File Requirements */}
          <Card>
            <CardHeader>
              <CardTitle>Driver Qualification File (DQ File) Requirements</CardTitle>
              <CardDescription>49 CFR §391.51 - Required documents</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document</TableHead>
                    <TableHead>Regulation</TableHead>
                    <TableHead>Frequency</TableHead>
                    <TableHead>Retention</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Application for Employment</TableCell>
                    <TableCell>§391.21</TableCell>
                    <TableCell>At hire</TableCell>
                    <TableCell>3 years after termination</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Inquiry to Previous Employers (3 years)</TableCell>
                    <TableCell>§391.23</TableCell>
                    <TableCell>At hire</TableCell>
                    <TableCell>3 years after termination</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Motor Vehicle Record (MVR)</TableCell>
                    <TableCell>§391.25</TableCell>
                    <TableCell>Annual</TableCell>
                    <TableCell>3 years after termination</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Road Test Certificate or CDL</TableCell>
                    <TableCell>§391.31</TableCell>
                    <TableCell>At hire</TableCell>
                    <TableCell>3 years after termination</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Medical Examiner's Certificate</TableCell>
                    <TableCell>§391.43</TableCell>
                    <TableCell>Every 2 years</TableCell>
                    <TableCell>3 years after termination</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Annual Review of Driving Record</TableCell>
                    <TableCell>§391.25</TableCell>
                    <TableCell>Annual</TableCell>
                    <TableCell>3 years after termination</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Violation Certifications</TableCell>
                    <TableCell>§391.27</TableCell>
                    <TableCell>Annual</TableCell>
                    <TableCell>3 years after termination</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Clearinghouse Queries</TableCell>
                    <TableCell>§382.701</TableCell>
                    <TableCell>Pre-employment, Annual</TableCell>
                    <TableCell>3 years after termination</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Medical Certificate Requirements */}
          <Card>
            <CardHeader>
              <CardTitle>Medical Certificate Requirements</CardTitle>
              <CardDescription>49 CFR §391.41 - Physical qualifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Physical Requirements</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>Vision: 20/40 or better in each eye (with or without correction)</li>
                    <li>Hearing: 5-foot whisper test or audiometric test</li>
                    <li>Blood pressure: {"<"}140/90 (no stage 3 hypertension)</li>
                    <li>Diabetes: Controlled, insulin use requires exemption</li>
                    <li>Seizure disorders: Disqualifying unless seizure-free 8+ years</li>
                    <li>Cardiac: No current unstable conditions</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Certificate Validity</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>Valid for 2 years (or less if medical conditions require monitoring)</li>
                    <li>Examiner must be on FMCSA National Registry</li>
                    <li>Copy must be in DQ file</li>
                    <li>Driver must carry card while operating CMV</li>
                    <li>Self-certification required with state DMV</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Setup Checklist */}
          <Card>
            <CardHeader>
              <CardTitle>Setup Checklist</CardTitle>
              <CardDescription>Steps to configure DOT compliance module</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  "Add all CDL drivers to roster",
                  "Create DQ files for each driver",
                  "Upload medical certificates",
                  "Configure clearinghouse access",
                  "Set up annual MVR review process",
                  "Define accident reporting workflow",
                  "Configure HOS monitoring",
                  "Train staff on DOT requirements",
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                    <Checkbox id={`dot-${index}`} />
                    <label htmlFor={`dot-${index}`} className="text-sm cursor-pointer flex-1">
                      {item}
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Document Templates */}
          <Card>
            <CardHeader>
              <CardTitle>Document Templates</CardTitle>
              <CardDescription>Download DOT-required forms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  "Driver Application Form",
                  "Previous Employer Inquiry Form",
                  "Annual Review Checklist",
                  "Violation Certification Form",
                  "Accident Report Form",
                  "DQ File Audit Checklist",
                ].map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm">{doc}</span>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Common Scenarios */}
          <Card>
            <CardHeader>
              <CardTitle>Common Scenarios</CardTitle>
              <CardDescription>Frequently asked questions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">What happens if a driver's medical certificate expires?</h4>
                  <p className="text-sm text-muted-foreground">
                    The driver is immediately disqualified from operating a CMV. They must obtain a new medical
                    certificate before returning to duty. Employers face penalties for allowing drivers to operate with
                    expired certificates.
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">How often must clearinghouse queries be run?</h4>
                  <p className="text-sm text-muted-foreground">
                    Pre-employment full query required before hiring any CDL driver. Annual limited query required for
                    all current CDL drivers. Queries must be documented and retained in the DQ file.
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">What makes an accident DOT-reportable?</h4>
                  <p className="text-sm text-muted-foreground">
                    An accident is DOT-reportable if it involves a CMV and results in: (1) a fatality, (2) bodily injury
                    requiring immediate medical treatment away from the scene, or (3) disabling damage requiring the
                    vehicle to be towed. Must be reported within 30 days.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Occupational Health Tab */}
        <TabsContent value="health" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
              <CardDescription>Occupational Health & OSHA Compliance Requirements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">What This Module Covers</h4>
                <p className="text-sm text-muted-foreground">
                  Work-related injury and illness tracking, OSHA recordkeeping (Forms 300, 300A, 301), medical
                  surveillance programs, work accommodations, and OSHA incident reporting. Ensures workplace safety and
                  regulatory compliance.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Who Needs It</h4>
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm font-bold text-foreground">All Employers</span>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-sm font-bold text-foreground">Safety-Sensitive Positions</span>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-sm font-bold text-foreground">Hazardous Material Handlers</span>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Compliance Frequency</h4>
                <p className="text-sm text-muted-foreground">
                  OSHA 300 Log: Ongoing. Form 300A posting: February 1 - April 30 annually. Incident reporting: Within 8
                  hours (fatality) or 24 hours (hospitalization).
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Penalties for Non-Compliance</h4>
                <p className="text-sm text-red-600 dark:text-red-400">
                  OSHA fines up to $15,625 per violation. Willful violations: Up to $156,259. Failure to post Form 300A:
                  $15,625 per day. Criminal penalties for willful violations causing death.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* OSHA Recordkeeping Requirements */}
          <Card>
            <CardHeader>
              <CardTitle>OSHA Recordkeeping Requirements</CardTitle>
              <CardDescription>
                29 CFR 1904 - Recording and Reporting Occupational Injuries and Illnesses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Form</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Frequency</TableHead>
                    <TableHead>Retention</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Form 300</TableCell>
                    <TableCell>Log of Work-Related Injuries and Illnesses</TableCell>
                    <TableCell>Ongoing</TableCell>
                    <TableCell>5 years</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Form 300A</TableCell>
                    <TableCell>Summary (must be posted Feb 1 - Apr 30)</TableCell>
                    <TableCell>Annual</TableCell>
                    <TableCell>5 years</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Form 301</TableCell>
                    <TableCell>Injury/Illness Incident Report</TableCell>
                    <TableCell>Per incident</TableCell>
                    <TableCell>5 years</TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              <div className="mt-6 space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Electronic Submission Requirements</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>Establishments with 250+ employees: Submit Forms 300, 300A, and 301 annually</li>
                    <li>Establishments with 20-249 employees in high-hazard industries: Submit Form 300A annually</li>
                    <li>Submission deadline: March 2 each year</li>
                    <li>Submit via OSHA's Injury Tracking Application (ITA)</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Setup Checklist */}
          <Card>
            <CardHeader>
              <CardTitle>Setup Checklist</CardTitle>
              <CardDescription>Steps to configure occupational health module</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  "Set up OSHA 300 Log",
                  "Configure incident reporting workflow",
                  "Define work accommodation process",
                  "Set up medical surveillance programs",
                  "Configure notification rules",
                  "Train staff on OSHA recordkeeping",
                  "Upload existing injury/illness records",
                  "Test incident reporting system",
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                    <Checkbox id={`health-${index}`} />
                    <label htmlFor={`health-${index}`} className="text-sm cursor-pointer flex-1">
                      {item}
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Document Templates */}
          <Card>
            <CardHeader>
              <CardTitle>Document Templates</CardTitle>
              <CardDescription>Download OSHA-required forms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  "OSHA Form 300 (Log)",
                  "OSHA Form 300A (Summary)",
                  "OSHA Form 301 (Incident Report)",
                  "Work Accommodation Request Form",
                  "Medical Surveillance Tracking Log",
                  "Incident Investigation Template",
                ].map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm">{doc}</span>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Common Scenarios */}
          <Card>
            <CardHeader>
              <CardTitle>Common Scenarios</CardTitle>
              <CardDescription>Frequently asked questions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">What injuries must be recorded on the OSHA 300 Log?</h4>
                  <p className="text-sm text-muted-foreground">
                    Record work-related injuries and illnesses that result in: death, days away from work, restricted
                    work or job transfer, medical treatment beyond first aid, loss of consciousness, or significant
                    injury diagnosed by a healthcare professional.
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">When must Form 300A be posted?</h4>
                  <p className="text-sm text-muted-foreground">
                    Form 300A (Summary) must be posted in a common area from February 1 through April 30 each year. It
                    must be certified by a company executive and be accessible to all employees.
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">What is the difference between first aid and medical treatment?</h4>
                  <p className="text-sm text-muted-foreground">
                    First aid includes: bandages, cleaning wounds, hot/cold therapy, non-prescription medications, etc.
                    Medical treatment includes: stitches, prescription medications, physical therapy, diagnostic
                    procedures, etc. Only medical treatment must be recorded on the OSHA 300 Log.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Training & Certifications Tab */}
        <TabsContent value="training" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
              <CardDescription>Training & Certification Requirements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">What This Module Covers</h4>
                <p className="text-sm text-muted-foreground">
                  Employee training programs, certification tracking, expiration monitoring, compliance training (OSHA,
                  DOT, HIPAA), and continuing education requirements. Ensures employees maintain required certifications
                  and training.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Who Needs It</h4>
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm font-bold text-foreground">All Employees</span>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-sm font-bold text-foreground">CDL Drivers</span>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-sm font-bold text-foreground">Safety-Sensitive Positions</span>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-sm font-bold text-foreground">Supervisors</span>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Compliance Frequency</h4>
                <p className="text-sm text-muted-foreground">
                  Varies by certification type. OSHA training: Annual. DOT training: Every 2 years. First Aid/CPR: Every
                  2 years. Hazmat: Every 3 years.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Penalties for Non-Compliance</h4>
                <p className="text-sm text-red-600 dark:text-red-400">
                  OSHA fines for inadequate training. DOT fines for expired certifications. Liability exposure for
                  untrained employees. Increased insurance premiums.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Required Training Programs */}
          <Card>
            <CardHeader>
              <CardTitle>Required Training Programs</CardTitle>
              <CardDescription>Industry-specific training requirements</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Training Type</TableHead>
                    <TableHead>Who Needs It</TableHead>
                    <TableHead>Frequency</TableHead>
                    <TableHead>Regulation</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">OSHA Safety Training</TableCell>
                    <TableCell>All employees</TableCell>
                    <TableCell>Annual</TableCell>
                    <TableCell>29 CFR 1910</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">DOT Hours of Service</TableCell>
                    <TableCell>CDL drivers</TableCell>
                    <TableCell>Every 2 years</TableCell>
                    <TableCell>49 CFR 395</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Hazmat Training</TableCell>
                    <TableCell>Hazmat handlers</TableCell>
                    <TableCell>Every 3 years</TableCell>
                    <TableCell>49 CFR 172</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">First Aid/CPR</TableCell>
                    <TableCell>Designated responders</TableCell>
                    <TableCell>Every 2 years</TableCell>
                    <TableCell>OSHA 1910.151</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Reasonable Suspicion</TableCell>
                    <TableCell>Supervisors</TableCell>
                    <TableCell>Every 2 years</TableCell>
                    <TableCell>49 CFR 382.603</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Setup Checklist */}
          <Card>
            <CardHeader>
              <CardTitle>Setup Checklist</CardTitle>
              <CardDescription>Steps to configure training module</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  "Define required training programs",
                  "Set up certification tracking",
                  "Configure expiration alerts",
                  "Upload existing training records",
                  "Define training providers",
                  "Set up automatic reminders",
                  "Configure reporting dashboards",
                  "Train staff on system usage",
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                    <Checkbox id={`training-${index}`} />
                    <label htmlFor={`training-${index}`} className="text-sm cursor-pointer flex-1">
                      {item}
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Document Templates */}
          <Card>
            <CardHeader>
              <CardTitle>Document Templates</CardTitle>
              <CardDescription>Download training-related forms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  "Training Attendance Sheet",
                  "Certification Tracking Log",
                  "Training Completion Certificate",
                  "Training Needs Assessment",
                  "Annual Training Plan Template",
                  "Training Evaluation Form",
                ].map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm">{doc}</span>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Common Scenarios */}
          <Card>
            <CardHeader>
              <CardTitle>Common Scenarios</CardTitle>
              <CardDescription>Frequently asked questions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">What happens if a certification expires?</h4>
                  <p className="text-sm text-muted-foreground">
                    Employees cannot perform duties requiring that certification until it's renewed. Employers face
                    penalties for allowing employees to work with expired certifications. Set up automatic alerts 30-60
                    days before expiration.
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">How long must training records be retained?</h4>
                  <p className="text-sm text-muted-foreground">
                    OSHA requires training records to be retained for the duration of employment plus 3 years. DOT
                    requires training records to be retained for 3 years after termination. Some certifications require
                    longer retention periods.
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Can online training satisfy DOT requirements?</h4>
                  <p className="text-sm text-muted-foreground">
                    Yes, but it must meet specific criteria: interactive, allow for questions, include a knowledge
                    assessment, and be documented. Some training (like reasonable suspicion) requires in-person
                    components.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Hours of Service Tab */}
        <TabsContent value="hos" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
              <CardDescription>Hours of Service Compliance Requirements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">What This Module Covers</h4>
                <p className="text-sm text-muted-foreground">
                  Driver hours of service tracking, ELD compliance, duty status monitoring, violation detection, and HOS
                  exception management. Ensures drivers comply with federal hours of service regulations.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Who Needs It</h4>
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm font-bold text-foreground">CDL Drivers</span>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-sm font-bold text-foreground">Interstate Commerce Drivers</span>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-sm font-bold text-foreground">Property-Carrying Vehicles</span>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Compliance Frequency</h4>
                <p className="text-sm text-muted-foreground">
                  Real-time monitoring. Daily log reviews. Weekly compliance checks. Monthly violation reports.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Penalties for Non-Compliance</h4>
                <p className="text-sm text-red-600 dark:text-red-400">
                  FMCSA fines up to $16,000 per violation. Driver out-of-service orders. Increased CSA scores. ELD
                  mandate violations: Up to $11,000 per day.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* HOS Rules */}
          <Card>
            <CardHeader>
              <CardTitle>Hours of Service Rules</CardTitle>
              <CardDescription>49 CFR Part 395 - Property-Carrying Vehicles</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rule</TableHead>
                    <TableHead>Limit</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">11-Hour Driving Limit</TableCell>
                    <TableCell>11 hours</TableCell>
                    <TableCell>Maximum driving time after 10 consecutive hours off duty</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">14-Hour Limit</TableCell>
                    <TableCell>14 hours</TableCell>
                    <TableCell>Maximum on-duty time after 10 consecutive hours off duty</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">30-Minute Break</TableCell>
                    <TableCell>30 minutes</TableCell>
                    <TableCell>Required after 8 cumulative hours of driving</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">60/70-Hour Limit</TableCell>
                    <TableCell>60/70 hours</TableCell>
                    <TableCell>Maximum on-duty time in 7/8 consecutive days</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">34-Hour Restart</TableCell>
                    <TableCell>34 hours</TableCell>
                    <TableCell>Consecutive off-duty time to reset 60/70-hour clock</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Setup Checklist */}
          <Card>
            <CardHeader>
              <CardTitle>Setup Checklist</CardTitle>
              <CardDescription>Steps to configure HOS module</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  "Configure ELD integration",
                  "Set up driver roster",
                  "Define HOS rules and exceptions",
                  "Configure violation alerts",
                  "Set up reporting dashboards",
                  "Train drivers on ELD usage",
                  "Test ELD data transfer",
                  "Configure backup procedures",
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                    <Checkbox id={`hos-${index}`} />
                    <label htmlFor={`hos-${index}`} className="text-sm cursor-pointer flex-1">
                      {item}
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Document Templates */}
          <Card>
            <CardHeader>
              <CardTitle>Document Templates</CardTitle>
              <CardDescription>Download HOS-related forms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  "Driver's Daily Log (Paper Backup)",
                  "HOS Violation Report Template",
                  "ELD Malfunction Procedures",
                  "Driver Training Checklist",
                  "HOS Exception Documentation",
                  "Monthly Compliance Report",
                ].map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm">{doc}</span>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Common Scenarios */}
          <Card>
            <CardHeader>
              <CardTitle>Common Scenarios</CardTitle>
              <CardDescription>Frequently asked questions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">What happens if a driver exceeds the 11-hour driving limit?</h4>
                  <p className="text-sm text-muted-foreground">
                    The driver must immediately cease driving and take a 10-hour break before driving again. This is a
                    serious violation that can result in fines, out-of-service orders, and increased CSA scores.
                    Document the violation and implement corrective actions.
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Can drivers use the 16-hour exception?</h4>
                  <p className="text-sm text-muted-foreground">
                    Yes, but only once per 34-hour restart. The 16-hour exception extends the 14-hour window to 16 hours
                    for drivers who return to their normal work reporting location and are released from duty within 16
                    hours.
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">What if the ELD malfunctions?</h4>
                  <p className="text-sm text-muted-foreground">
                    Drivers must note the malfunction and continue to manually record their hours on paper logs. The
                    carrier has 8 days to repair or replace the ELD. Drivers must carry paper logs as backup during this
                    period.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* HIPAA Privacy Tab */}
        <TabsContent value="hipaa" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
              <CardDescription>HIPAA Privacy & Data Security Requirements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">What This Module Covers</h4>
                <p className="text-sm text-muted-foreground">
                  Protected Health Information (PHI) access controls, data encryption, audit logging, breach
                  notification, staff training, and HIPAA compliance monitoring. Ensures proper handling of sensitive
                  health information.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Who Needs It</h4>
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm font-bold text-foreground">Healthcare Providers</span>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-sm font-bold text-foreground">Occupational Health Staff</span>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-sm font-bold text-foreground">HR Personnel</span>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-sm font-bold text-foreground">System Administrators</span>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Compliance Frequency</h4>
                <p className="text-sm text-muted-foreground">
                  Staff training: Annual. Security assessments: Annual. Audit log reviews: Quarterly. Access control
                  reviews: Quarterly.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Penalties for Non-Compliance</h4>
                <p className="text-sm text-red-600 dark:text-red-400">
                  HIPAA fines: $100 to $50,000 per violation. Maximum annual penalty: $1.5 million. Criminal penalties:
                  Up to $250,000 and 10 years imprisonment for willful violations.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* HIPAA Requirements */}
          <Card>
            <CardHeader>
              <CardTitle>HIPAA Privacy Rule Requirements</CardTitle>
              <CardDescription>45 CFR Part 160 and Part 164</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Requirement</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Mandatory</TableHead>
                    <TableHead>Documentation</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Privacy Notice</TableCell>
                    <TableCell>Provide notice of privacy practices</TableCell>
                    <TableCell>
                      <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">Yes</Badge>
                    </TableCell>
                    <TableCell>Signed acknowledgment</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Access Controls</TableCell>
                    <TableCell>Limit PHI access to authorized users</TableCell>
                    <TableCell>
                      <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">Yes</Badge>
                    </TableCell>
                    <TableCell>Access logs, permissions</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Encryption</TableCell>
                    <TableCell>Encrypt PHI at rest and in transit</TableCell>
                    <TableCell>
                      <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
                        Addressable
                      </Badge>
                    </TableCell>
                    <TableCell>Encryption certificates</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Audit Logs</TableCell>
                    <TableCell>Track all PHI access and modifications</TableCell>
                    <TableCell>
                      <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">Yes</Badge>
                    </TableCell>
                    <TableCell>Audit trail reports</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Breach Notification</TableCell>
                    <TableCell>Notify affected individuals within 60 days</TableCell>
                    <TableCell>
                      <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">Yes</Badge>
                    </TableCell>
                    <TableCell>Breach notification letters</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Staff Training</TableCell>
                    <TableCell>Annual HIPAA training for all staff</TableCell>
                    <TableCell>
                      <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">Yes</Badge>
                    </TableCell>
                    <TableCell>Training completion records</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Setup Checklist */}
          <Card>
            <CardHeader>
              <CardTitle>Setup Checklist</CardTitle>
              <CardDescription>Steps to configure HIPAA compliance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  "Conduct HIPAA risk assessment",
                  "Configure PHI access controls",
                  "Enable data encryption",
                  "Set up audit logging",
                  "Define breach notification procedures",
                  "Implement staff training program",
                  "Create privacy policies",
                  "Test security controls",
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                    <Checkbox id={`hipaa-${index}`} />
                    <label htmlFor={`hipaa-${index}`} className="text-sm cursor-pointer flex-1">
                      {item}
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Document Templates */}
          <Card>
            <CardHeader>
              <CardTitle>Document Templates</CardTitle>
              <CardDescription>Download HIPAA-required forms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  "Notice of Privacy Practices",
                  "HIPAA Authorization Form",
                  "Breach Notification Template",
                  "Risk Assessment Checklist",
                  "Business Associate Agreement",
                  "Staff Training Materials",
                ].map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm">{doc}</span>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Common Scenarios */}
          <Card>
            <CardHeader>
              <CardTitle>Common Scenarios</CardTitle>
              <CardDescription>Frequently asked questions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">What constitutes a HIPAA breach?</h4>
                  <p className="text-sm text-muted-foreground">
                    A breach is an unauthorized acquisition, access, use, or disclosure of PHI that compromises the
                    security or privacy of the information. Examples include: lost/stolen devices, unauthorized access,
                    misdirected emails, or improper disposal of records.
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">How long must HIPAA records be retained?</h4>
                  <p className="text-sm text-muted-foreground">
                    HIPAA requires covered entities to retain documentation for 6 years from the date of creation or
                    last effective date, whichever is later. This includes policies, procedures, training records, and
                    audit logs.
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">What is the minimum necessary standard?</h4>
                  <p className="text-sm text-muted-foreground">
                    The minimum necessary standard requires covered entities to make reasonable efforts to limit PHI
                    access, use, and disclosure to the minimum necessary to accomplish the intended purpose. Implement
                    role-based access controls to enforce this standard.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

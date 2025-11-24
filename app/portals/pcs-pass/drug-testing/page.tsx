"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, CheckCircle, Download, TestTube } from "lucide-react"
import { mockWorkerData } from "@/lib/data/mock-worker-data"
import Link from "next/link"

export default function DrugTestingHistoryPage() {
  const { drugTesting } = mockWorkerData

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/portals/pcs-pass">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Drug Testing History</h1>
          <p className="text-muted-foreground">View your complete drug testing records</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 p-3 dark:bg-blue-900">
                <TestTube className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <CardTitle>Current Status</CardTitle>
                <CardDescription>Last updated: {drugTesting.lastTest}</CardDescription>
              </div>
            </div>
            <Badge variant="default" className="bg-green-600">
              <CheckCircle className="mr-1 h-4 w-4" />
              Passed
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm text-muted-foreground">Last Test Date</p>
              <p className="text-lg font-semibold">{drugTesting.lastTest}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Random Pool Status</p>
              <Badge variant={drugTesting.randomPool ? "default" : "secondary"}>
                {drugTesting.randomPool ? "Active" : "Inactive"}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Tests</p>
              <p className="text-lg font-semibold">{drugTesting.history.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Test History</CardTitle>
          <CardDescription>Complete record of all drug tests</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Result</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {drugTesting.history.map((test, index) => (
                <TableRow key={index}>
                  <TableCell>{test.date}</TableCell>
                  <TableCell>{test.type}</TableCell>
                  <TableCell>{test.location}</TableCell>
                  <TableCell>
                    <Badge variant={test.result === "Negative" ? "default" : "destructive"} className="bg-green-600">
                      {test.result}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
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

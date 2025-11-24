"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Activity, AlertTriangle, CheckCircle2, Clock } from "lucide-react"

export function OccupationalHealthOversight() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">Across all companies</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Physicals</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">1,089</div>
            <p className="text-xs text-muted-foreground">87% compliant</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
            <Clock className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-400">94</div>
            <p className="text-xs text-muted-foreground">Within 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expired</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-400">64</div>
            <p className="text-xs text-muted-foreground">Immediate action needed</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Occupational Health Status by Company</CardTitle>
            <Button>Export OH Report</Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Total Employees</TableHead>
                <TableHead>DOT Physicals</TableHead>
                <TableHead>Respirator Fit Tests</TableHead>
                <TableHead>Expiring (30 days)</TableHead>
                <TableHead>Expired</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">ABC Trucking Co.</TableCell>
                <TableCell>285</TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30">
                    278 Current
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30">
                    280 Current
                  </Badge>
                </TableCell>
                <TableCell>12</TableCell>
                <TableCell>7</TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                    At Risk
                  </Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">XYZ Logistics LLC</TableCell>
                <TableCell>412</TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-red-500/20 text-red-400 border-red-500/30">
                    385 Current
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                    398 Current
                  </Badge>
                </TableCell>
                <TableCell>28</TableCell>
                <TableCell>27</TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-red-500/20 text-red-400 border-red-500/30">
                    Non-Compliant
                  </Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">FastHaul Transport</TableCell>
                <TableCell>156</TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-red-500/20 text-red-400 border-red-500/30">
                    138 Current
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-red-500/20 text-red-400 border-red-500/30">
                    142 Current
                  </Badge>
                </TableCell>
                <TableCell>15</TableCell>
                <TableCell>18</TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-red-500/20 text-red-400 border-red-500/30">
                    Non-Compliant
                  </Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">SafeRoad Services</TableCell>
                <TableCell>198</TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30">
                    195 Current
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30">
                    196 Current
                  </Badge>
                </TableCell>
                <TableCell>8</TableCell>
                <TableCell>3</TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30">
                    Compliant
                  </Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Premier Freight Inc.</TableCell>
                <TableCell>196</TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                    183 Current
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                    188 Current
                  </Badge>
                </TableCell>
                <TableCell>31</TableCell>
                <TableCell>9</TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                    At Risk
                  </Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Users } from "lucide-react"

export function RosterEmployee360() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Employee Roster & 360° View
            </CardTitle>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search employees..." className="pl-9 w-[300px]" />
              </div>
              <Button>Export Roster</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Drug & Alcohol</TableHead>
                <TableHead>Background</TableHead>
                <TableHead>OH Status</TableHead>
                <TableHead>Training</TableHead>
                <TableHead>Certifications</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">John Smith</TableCell>
                <TableCell>ABC Trucking Co.</TableCell>
                <TableCell>CDL Driver</TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30">
                    Compliant
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30">
                    Clear
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30">
                    Current
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30">
                    Complete
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                    1 Expiring
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button size="sm" variant="outline">
                    View 360°
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Sarah Johnson</TableCell>
                <TableCell>XYZ Logistics LLC</TableCell>
                <TableCell>Warehouse Manager</TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30">
                    Compliant
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30">
                    Clear
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-red-500/20 text-red-400 border-red-500/30">
                    Expired
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                    2 Pending
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30">
                    Current
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button size="sm" variant="outline">
                    View 360°
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Michael Davis</TableCell>
                <TableCell>FastHaul Transport</TableCell>
                <TableCell>CDL Driver</TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-red-500/20 text-red-400 border-red-500/30">
                    Positive Test
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                    Pending
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-red-500/20 text-red-400 border-red-500/30">
                    Expired
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-red-500/20 text-red-400 border-red-500/30">
                    Incomplete
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-red-500/20 text-red-400 border-red-500/30">
                    2 Expired
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button size="sm" variant="outline">
                    View 360°
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

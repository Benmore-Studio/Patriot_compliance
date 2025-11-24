"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MapPin, QrCode, Clock, CheckCircle } from "lucide-react"
import { mockWorkerData } from "@/lib/data/mock-worker-data"
import { useToast } from "@/hooks/use-toast"

export default function CheckInPage() {
  const { toast } = useToast()
  const [isCheckedIn, setIsCheckedIn] = useState(false)
  const [currentLocation, setCurrentLocation] = useState<string | null>(null)

  const handleCheckIn = () => {
    setIsCheckedIn(true)
    setCurrentLocation("Construction Site A")
    toast({
      title: "Checked in successfully",
      description: "Your location has been logged",
    })
  }

  const handleCheckOut = () => {
    setIsCheckedIn(false)
    setCurrentLocation(null)
    toast({
      title: "Checked out successfully",
      description: "Your session has been ended",
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Site Check-In</h1>
        <p className="text-muted-foreground">Log your work location and track your time</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Current Status</CardTitle>
          <CardDescription>Your current check-in status</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div className="flex items-center gap-3">
              <MapPin className={`h-6 w-6 ${isCheckedIn ? "text-green-600" : "text-muted-foreground"}`} />
              <div>
                <p className="font-medium">{isCheckedIn ? "Checked In" : "Not Checked In"}</p>
                {isCheckedIn && currentLocation && <p className="text-sm text-muted-foreground">{currentLocation}</p>}
              </div>
            </div>
            {isCheckedIn && (
              <Badge variant="default" className="bg-green-600">
                <CheckCircle className="mr-1 h-3 w-3" />
                Active
              </Badge>
            )}
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {!isCheckedIn ? (
              <>
                <Button onClick={handleCheckIn} size="lg" className="w-full">
                  <MapPin className="mr-2 h-4 w-4" />
                  Check In Now
                </Button>
                <Button variant="outline" size="lg" className="w-full bg-transparent">
                  <QrCode className="mr-2 h-4 w-4" />
                  Scan QR Code
                </Button>
              </>
            ) : (
              <Button onClick={handleCheckOut} variant="destructive" size="lg" className="w-full md:col-span-2">
                <Clock className="mr-2 h-4 w-4" />
                Check Out
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Check-In History</CardTitle>
          <CardDescription>Your recent work locations</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Location</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Duration</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockWorkerData.checkIns.map((checkIn, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{checkIn.location}</TableCell>
                  <TableCell>{new Date(checkIn.timestamp).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(checkIn.timestamp).toLocaleTimeString()}</TableCell>
                  <TableCell>8h 30m</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

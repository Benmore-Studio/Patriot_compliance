"use client"

import type React from "react"

import { use, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, Lock, Eye, Download, AlertCircle } from "lucide-react"

export default function ShareViewPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params)
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [data, setData] = useState<any>(null)
  const [authenticated, setAuthenticated] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch(`/api/share/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error || "Failed to access shared data")
        return
      }

      setData(result.data)
      setAuthenticated(true)
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <CardTitle>Secure Shared Data</CardTitle>
            <CardDescription>
              This link is password protected. Enter the password to view the shared data.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Verifying..." : "Access Data"}
              </Button>
            </form>

            <div className="mt-6 space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Shield className="w-3 h-3" />
                <span>HIPAA/PII compliant secure sharing</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-3 h-3" />
                <span>All access is logged and audited</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Shared Data</CardTitle>
                <CardDescription>{data.metadata?.title || "Compliance data shared securely"}</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {data.watermark && (
              <Alert className="mb-4">
                <AlertDescription>
                  This document is watermarked and all access is logged for audit purposes.
                </AlertDescription>
              </Alert>
            )}

            {/* Render data based on type */}
            {data.type === "employees" && (
              <div className="space-y-4">
                <h3 className="font-semibold">Employee Compliance Status</h3>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="text-left p-3 text-sm font-medium">Name</th>
                        <th className="text-left p-3 text-sm font-medium">Department</th>
                        <th className="text-left p-3 text-sm font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.employees?.map((emp: any) => (
                        <tr key={emp.id} className="border-t">
                          <td className="p-3">{emp.name}</td>
                          <td className="p-3">{emp.department}</td>
                          <td className="p-3">
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                emp.status === "Compliant"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                  : "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
                              }`}
                            >
                              {emp.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

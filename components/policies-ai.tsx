"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Upload, Brain, CheckCircle2 } from "lucide-react"

export function PoliciesAI() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Policies</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">Across all companies</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Normalized</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">100% processed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">DOT Policies</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground">75% of portfolio</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Non-DOT Policies</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6</div>
            <p className="text-xs text-muted-foreground">25% of portfolio</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Policy Management & AI Interpreter</CardTitle>
            <Button>
              <Upload className="mr-2 h-4 w-4" />
              Upload New Policy
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                company: "ABC Trucking Co.",
                type: "DOT",
                randomRate: "50%",
                testingPool: "CDL Drivers",
                normalized: true,
              },
              {
                company: "XYZ Logistics LLC",
                type: "DOT",
                randomRate: "50%",
                testingPool: "Safety-Sensitive",
                normalized: true,
              },
              {
                company: "FastHaul Transport",
                type: "DOT",
                randomRate: "50%",
                testingPool: "All Drivers",
                normalized: true,
              },
              {
                company: "SafeRoad Services",
                type: "Non-DOT",
                randomRate: "25%",
                testingPool: "All Employees",
                normalized: true,
              },
              {
                company: "Premier Freight Inc.",
                type: "DOT",
                randomRate: "50%",
                testingPool: "CDL Drivers",
                normalized: true,
              },
            ].map((item) => (
              <div key={item.company} className="rounded-lg border border-border p-4">
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium text-foreground">{item.company}</span>
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={
                          item.type === "DOT"
                            ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                            : "bg-purple-500/20 text-purple-400 border-purple-500/30"
                        }
                      >
                        {item.type}
                      </Badge>
                      {item.normalized && (
                        <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30">
                          <Brain className="mr-1 h-3 w-3" />
                          AI Normalized
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    View Policy
                  </Button>
                </div>
                <div className="grid gap-2 text-sm md:grid-cols-2">
                  <div>
                    <span className="text-muted-foreground">Random Testing Rate:</span>
                    <span className="ml-2 font-medium text-foreground">{item.randomRate}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Testing Pool:</span>
                    <span className="ml-2 font-medium text-foreground">{item.testingPool}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Policy Interpreter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border bg-muted/20 p-4">
            <p className="mb-4 text-sm text-muted-foreground">
              The AI Policy Interpreter automatically analyzes uploaded policies and extracts key compliance
              requirements:
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-green-400" />
                <span className="text-foreground">Random testing rates and quotas</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-green-400" />
                <span className="text-foreground">Testing pool definitions and eligibility criteria</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-green-400" />
                <span className="text-foreground">Occupational health requirements (physicals, fit tests)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-green-400" />
                <span className="text-foreground">Training and certification mandates</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-green-400" />
                <span className="text-foreground">Compliance thresholds and alert triggers</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

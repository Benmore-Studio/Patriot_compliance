"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, Search, FileText, Building2, Bot, Send } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

const mockPolicies = [
  {
    id: "POL-001",
    name: "Drug & Alcohol Testing Policy",
    category: "Safety",
    lastUpdated: "2025-01-10",
    companiesApplied: 8,
    version: "3.2",
  },
  {
    id: "POL-002",
    name: "DOT Compliance Manual",
    category: "DOT",
    lastUpdated: "2024-12-15",
    companiesApplied: 5,
    version: "2.1",
  },
  {
    id: "POL-003",
    name: "Background Check Procedures",
    category: "HR",
    lastUpdated: "2025-01-05",
    companiesApplied: 10,
    version: "1.8",
  },
  {
    id: "POL-004",
    name: "Safety Training Requirements",
    category: "Training",
    lastUpdated: "2024-11-20",
    companiesApplied: 9,
    version: "4.0",
  },
]

const mockChatHistory = [
  {
    role: "assistant",
    message: "Hello! I'm DER-IQ, your compliance assistant. How can I help you today?",
  },
]

export default function PoliciesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [chatMessages, setChatMessages] = useState(mockChatHistory)
  const [chatInput, setChatInput] = useState("")

  const filteredPolicies = mockPolicies.filter((policy) => {
    const matchesSearch = policy.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === "all" || policy.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const stats = {
    totalPolicies: mockPolicies.length,
    recentlyUpdated: mockPolicies.filter((p) => new Date(p.lastUpdated) > new Date("2025-01-01")).length,
    companiesCovered: 10,
    aiQueries: 47,
  }

  const handleSendMessage = () => {
    if (!chatInput.trim()) return
    setChatMessages([
      ...chatMessages,
      { role: "user", message: chatInput },
      {
        role: "assistant",
        message: "I'm processing your question about compliance policies. This is a demo response.",
      },
    ])
    setChatInput("")
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Policy & AI Tools</h1>
          <p className="text-muted-foreground">Policy management and insights</p>
        </div>
        <Button variant="outline" className="gap-2 bg-transparent">
          <Download className="h-4 w-4" />
          Export Policy Bundle
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Policies</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPolicies}</div>
            <p className="text-xs text-muted-foreground">Active documents</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recently Updated</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.recentlyUpdated}</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Companies Covered</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.companiesCovered}</div>
            <p className="text-xs text-muted-foreground">Service companies</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Queries This Month</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.aiQueries}</div>
            <p className="text-xs text-muted-foreground">DER-IQ assistant</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Policy Library */}
        <div className="lg:col-span-2 space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search policies..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Safety">Safety</SelectItem>
                    <SelectItem value="DOT">DOT</SelectItem>
                    <SelectItem value="HR">HR</SelectItem>
                    <SelectItem value="Training">Training</SelectItem>
                    <SelectItem value="Compliance">Compliance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Policy Table */}
          <Card>
            <CardHeader>
              <CardTitle>Policy Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Policy Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Companies</TableHead>
                    <TableHead>Version</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPolicies.map((policy) => (
                    <TableRow key={policy.id}>
                      <TableCell className="font-medium">{policy.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{policy.category}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{policy.lastUpdated}</TableCell>
                      <TableCell>{policy.companiesApplied}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">v{policy.version}</Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" className="gap-2">
                          <Download className="h-3 w-3" />
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

        {/* AI Chat Panel */}
        <div className="lg:col-span-1">
          <Card className="h-[600px] flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                DER-IQ Assistant
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-4">
              <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-muted/30 rounded-lg">
                {chatMessages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-background border"
                      }`}
                    >
                      <p className="text-sm">{msg.message}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Textarea
                  placeholder="Ask about compliance policies..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                  className="min-h-[60px]"
                />
                <Button onClick={handleSendMessage} size="icon" className="shrink-0">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

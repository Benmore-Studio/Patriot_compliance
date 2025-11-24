"use client"

import { useState, useRef, useEffect } from "react"
import { X, Send, Copy, ThumbsUp, ThumbsDown, Trash2, Sparkles, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

const quickActions = [
  "What is DOT random testing frequency?",
  "How do I upload employees?",
  "Explain adverse action process",
  "What are FMCSA requirements?",
]

export function DerIqChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }, [messages, isTyping])

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Keyboard shortcut (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setIsOpen((prev) => !prev)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: getAIResponse(content),
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiResponse])
      setIsTyping(false)
    }, 1500)
  }

  const getAIResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase()

    if (lowerQuestion.includes("random testing") || lowerQuestion.includes("dot random")) {
      return `**DOT Random Testing Requirements:**

The FMCSA requires employers to conduct random drug and alcohol testing at the following minimum annual rates:

- **Drug Testing:** 50% of the average number of driver positions
- **Alcohol Testing:** 10% of the average number of driver positions

**Key Points:**
- Selections must be truly random and unpredictable
- Tests must be spread reasonably throughout the year
- Drivers can be selected more than once per year
- Testing must be unannounced

You can manage your random pool in the **Drug Testing > Random Pool** section.`
    }

    if (lowerQuestion.includes("upload") || lowerQuestion.includes("add employee")) {
      return `**Uploading Employees:**

You have two options to add employees to the system:

**1. Bulk Upload (Recommended for multiple employees):**
- Go to **Employees > Bulk Upload**
- Download the CSV template
- Fill in employee information
- Upload the completed file

**2. Manual Entry:**
- Go to **Employees > Add Employee**
- Fill in the employee form
- Click "Create Employee"

**Required Fields:**
- Employee ID, Name, Role, Department, Location, Date of Birth, Hire Date

Need help with the CSV format? I can show you an example!`
    }

    if (lowerQuestion.includes("adverse action")) {
      return `**FCRA Adverse Action Process:**

When a background check reveals disqualifying information, you must follow this process:

**Step 1: Pre-Adverse Action Notice**
- Send within 24 hours of decision
- Include copy of background report
- Include FCRA Summary of Rights
- System sends automatically

**Step 2: Waiting Period (5 Business Days)**
- Candidate can dispute findings
- System tracks countdown timer
- Reminders sent automatically

**Step 3: Final Adverse Action Notice**
- Send after waiting period expires
- Include final decision and contact info
- System generates compliant notice

You can manage adverse actions in **Background Checks > Adverse Actions** tab.`
    }

    if (lowerQuestion.includes("fmcsa") || lowerQuestion.includes("requirements")) {
      return `**Key FMCSA Requirements:**

**Drug & Alcohol Testing:**
- Pre-employment testing required
- Random testing: 50% drug / 10% alcohol annually
- Post-accident testing within 8 hours
- Reasonable suspicion testing when warranted

**Driver Qualification Files:**
- Application for employment
- Motor vehicle record (MVR)
- Road test certificate or equivalent
- Medical examiner's certificate
- Annual review of driving record

**Hours of Service:**
- 11-hour driving limit
- 14-hour on-duty limit
- 30-minute break required
- 60/70-hour weekly limits

Need specific guidance on any of these? Just ask!`
    }

    return `I understand you're asking about "${question}". 

I'm DER IQ, your compliance assistant. I can help you with:

- DOT regulations and requirements
- Drug testing procedures
- Background check processes
- Employee management
- FMCSA compliance
- Hours of Service rules

Could you provide more details about what you'd like to know?`
  }

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  const handleClearChat = () => {
    setMessages([])
  }

  const handleQuickAction = (action: string) => {
    handleSendMessage(action)
  }

  return (
    <>
      {/* Floating Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg transition-all duration-300 z-50",
          "bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800",
          "animate-pulse hover:animate-none",
          isOpen && "scale-0",
        )}
        size="icon"
      >
        <Sparkles className="h-6 w-6 text-white" />
      </Button>

      {/* Chat Drawer */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[400px] h-[600px] bg-background border border-border rounded-lg shadow-2xl flex flex-col z-50 animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-to-r from-blue-600 to-blue-700">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">DER IQ</h3>
                <p className="text-xs text-white/80">Your Compliance Assistant</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {messages.length > 0 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-white hover:bg-white/20"
                  onClick={handleClearChat}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-white/20"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
            {messages.length === 0 ? (
              <div className="space-y-4">
                <div className="text-center py-8">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="font-semibold text-lg mb-2">Hi! I'm DER IQ</h4>
                  <p className="text-sm text-muted-foreground mb-4">How can I help you today?</p>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase">Quick Actions</p>
                  {quickActions.map((action, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full justify-start text-left h-auto py-3 px-4 bg-transparent"
                      onClick={() => handleQuickAction(action)}
                    >
                      <span className="text-sm">{action}</span>
                    </Button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn("flex gap-3", message.role === "user" ? "justify-end" : "justify-start")}
                  >
                    {message.role === "assistant" && (
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center flex-shrink-0">
                        <Sparkles className="h-4 w-4 text-white" />
                      </div>
                    )}
                    <div
                      className={cn(
                        "rounded-lg px-4 py-3 max-w-[80%]",
                        message.role === "user" ? "bg-blue-600 text-white" : "bg-muted text-foreground",
                      )}
                    >
                      <div className="text-sm whitespace-pre-wrap leading-relaxed">
                        {message.content.split("\n").map((line, i) => {
                          if (line.startsWith("**") && line.endsWith("**")) {
                            return (
                              <p key={i} className="font-semibold mb-2">
                                {line.replace(/\*\*/g, "")}
                              </p>
                            )
                          }
                          if (line.startsWith("- ")) {
                            return (
                              <li key={i} className="ml-4 mb-1">
                                {line.substring(2)}
                              </li>
                            )
                          }
                          return line ? (
                            <p key={i} className="mb-2">
                              {line}
                            </p>
                          ) : (
                            <br key={i} />
                          )
                        })}
                      </div>
                      {message.role === "assistant" && (
                        <div className="flex items-center gap-2 mt-3 pt-2 border-t border-border/50">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-xs"
                            onClick={() => handleCopyMessage(message.content)}
                          >
                            <Copy className="h-3 w-3 mr-1" />
                            Copy
                          </Button>
                          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                            <ThumbsUp className="h-3 w-3 mr-1" />
                            Helpful
                          </Button>
                          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                            <ThumbsDown className="h-3 w-3 mr-1" />
                            Not Helpful
                          </Button>
                        </div>
                      )}
                    </div>
                    {message.role === "user" && (
                      <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-medium text-primary-foreground">You</span>
                      </div>
                    )}
                  </div>
                ))}

                {isTyping && (
                  <div className="flex gap-3">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="h-4 w-4 text-white" />
                    </div>
                    <div className="rounded-lg px-4 py-3 bg-muted">
                      <div className="flex gap-1">
                        <div
                          className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        />
                        <div
                          className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        />
                        <div
                          className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t border-border">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSendMessage(input)
              }}
              className="flex gap-2"
            >
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1"
                disabled={isTyping}
              />
              <Button type="submit" size="icon" disabled={!input.trim() || isTyping}>
                {isTyping ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </form>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Press{" "}
              <Badge variant="secondary" className="text-xs px-1">
                Cmd+K
              </Badge>{" "}
              to toggle chat
            </p>
          </div>
        </div>
      )}
    </>
  )
}

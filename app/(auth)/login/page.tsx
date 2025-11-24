"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth/auth-context"
import Image from "next/image"
import {
  Shield,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Building2,
  Users,
  Briefcase,
  FileCheck,
  TrendingUp,
  CheckCircle2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

const portalOptions = [
  {
    value: "service-company",
    label: "Service Company",
    icon: Building2,
    description: "Manage your workforce compliance",
    route: "/dashboard",
  },
  {
    value: "compliance-company",
    label: "Compliance Company",
    icon: FileCheck,
    description: "Oversee multiple service companies",
    route: "/compliance",
  },
  {
    value: "field-worker",
    label: "PCS Pass", // Renamed from "Field Worker" to "PCS Pass"
    icon: Users,
    description: "View your compliance status",
    route: "/portals/pcs-pass", // Updated route
  },
  {
    value: "auditor",
    label: "Auditor",
    icon: Briefcase,
    description: "Audit compliance records",
    route: "/portals/auditor",
  },
  {
    value: "executive",
    label: "Executive",
    icon: TrendingUp,
    description: "Executive command center",
    route: "/portals/executive",
  },
]

export default function LoginPage() {
  const { login } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [showForgotPasswordDialog, setShowForgotPasswordDialog] = useState(false)
  const [chevronTheme, setChevronTheme] = useState(false)

  useEffect(() => {
    const isChevron = localStorage.getItem("chevronTheme") === "true"
    setChevronTheme(isChevron)
    if (isChevron) {
      document.documentElement.classList.add("chevron-theme")
    }
  }, [])

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {}

    if (!email) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!password) {
      newErrors.password = "Password is required"
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    try {
      await login(email, password, "service-company", rememberMe)
      router.push("/dashboard")
    } catch (error) {
      setErrors({ email: "Invalid credentials. Please try again." })
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Brand */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 p-12 flex-col justify-between text-white">
        <div>
          {chevronTheme ? (
            <div className="mb-8">
              <Image
                src="/images/chevron-logo.png"
                alt="Chevron"
                width={240}
                height={100}
                priority
                className="object-contain"
              />
              <p className="text-sm text-blue-100 mt-2">Compliance Provider</p>
            </div>
          ) : (
            <div className="flex items-center gap-3 mb-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm">
                <Shield className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Patriot CS</h1>
                <p className="text-sm text-blue-100">Compliance Systems</p>
              </div>
            </div>
          )}

          <div className="space-y-6 mt-16">
            <h2 className="text-4xl font-bold leading-tight">
              Enterprise Compliance
              <br />
              Management Platform
            </h2>
            <p className="text-lg text-blue-100 max-w-md">
              Streamline workforce compliance across drug testing, background checks, DOT regulations, and occupational
              health.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-blue-100 uppercase tracking-wide mb-3">Security & Compliance</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-blue-200 shrink-0" />
              <span className="text-sm text-blue-100">SOC 2 Type II</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-blue-200 shrink-0" />
              <span className="text-sm text-blue-100">HIPAA Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-blue-200 shrink-0" />
              <span className="text-sm text-blue-100">GDPR Ready</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-blue-200 shrink-0" />
              <span className="text-sm text-blue-100">CCPA Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-blue-200 shrink-0" />
              <span className="text-sm text-blue-100">PCI DSS Level 1</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-blue-200 shrink-0" />
              <span className="text-sm text-blue-100">TLS 1.3 Transit</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-blue-200 shrink-0" />
              <span className="text-sm text-blue-100">AES-256 at Rest</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-blue-200 shrink-0" />
              <span className="text-sm text-blue-100">AWS Secure Storage</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-blue-200 shrink-0" />
              <span className="text-sm text-blue-100">NIST 800-53</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-blue-200 shrink-0" />
              <span className="text-sm text-blue-100">NIST 800-171</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-300 shrink-0" />
              <span className="text-sm text-blue-100 font-semibold">MFA Available</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-300 shrink-0" />
              <span className="text-sm text-blue-100 font-semibold">ID.me Ready</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8">
          {chevronTheme ? (
            <div className="flex flex-col items-center justify-center mb-8 space-y-4">
              <Image
                src="/images/chevron-logo.png"
                alt="Chevron"
                width={200}
                height={80}
                priority
                className="object-contain"
              />
              <div className="h-px w-full bg-border" />
            </div>
          ) : (
            <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Patriot CS</h1>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Welcome back</h2>
            <p className="text-muted-foreground">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="john.doe@company.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (errors.email) setErrors({ ...errors, email: undefined })
                  }}
                  className={`pl-9 ${errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                />
              </div>
              {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (errors.password) setErrors({ ...errors, password: undefined })
                  }}
                  className={`pl-9 pr-9 ${errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">
                  Remember me
                </Label>
              </div>
              <button
                type="button"
                onClick={() => setShowForgotPasswordDialog(true)}
                className="text-sm text-primary hover:underline"
              >
                Forgot password?
              </button>
            </div>

            {/* Sign In Button */}
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" size="lg" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          {/* Footer */}
          <div className="space-y-4 pt-4">
            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link href="#" className="text-primary hover:underline font-medium">
                Contact your administrator
              </Link>
            </p>

            <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
              <Link href="#" className="hover:text-foreground">
                Privacy Policy
              </Link>
              <span>•</span>
              <Link href="#" className="hover:text-foreground">
                Terms of Service
              </Link>
              <span>•</span>
              <span>v1.0.0</span>
            </div>

            <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground border rounded-lg p-3 bg-muted/30">
              <Shield className="h-4 w-4 text-green-600" />
              <span className="font-medium">Secure connection</span>
              <span>•</span>
              <span className="font-semibold text-green-600">MFA Available</span>
              <span>•</span>
              <span className="font-semibold text-blue-600">ID.me Ready</span>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={showForgotPasswordDialog} onOpenChange={setShowForgotPasswordDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-blue-600" />
              Password Reset Request - Demo
            </DialogTitle>
            <DialogDescription>
              For demonstration purposes, this shows what a password reset email would look like.
            </DialogDescription>
          </DialogHeader>

          <div className="border rounded-lg p-6 bg-muted/30 space-y-4">
            {/* Email Header */}
            <div className="border-b pb-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold">From:</span>
                <span className="text-muted-foreground">noreply@patriotcs.com</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold">To:</span>
                <span className="text-muted-foreground">{email || "user@company.com"}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold">Subject:</span>
                <span className="text-muted-foreground">Password Reset Request</span>
              </div>
            </div>

            {/* Email Body */}
            <div className="space-y-4 text-sm">
              <p className="font-semibold">Hello,</p>

              <p>
                We received a request to reset your password for your Patriot CS account. Click the button below to
                create a new password:
              </p>

              <div className="flex justify-center py-4">
                <Button className="bg-blue-600 hover:bg-blue-700">Reset Password</Button>
              </div>

              <p className="text-muted-foreground text-xs">
                This link will expire in 24 hours. If you didn't request a password reset, please ignore this email or
                contact support if you have concerns.
              </p>

              <div className="border-t pt-4 text-xs text-muted-foreground space-y-1">
                <p className="font-semibold">Security Notice:</p>
                <p>• This email was sent from a secure, monitored system</p>
                <p>• Never share your password with anyone</p>
                <p>• Patriot CS will never ask for your password via email</p>
              </div>

              <div className="text-xs text-muted-foreground pt-2">
                <p>Best regards,</p>
                <p className="font-semibold">Patriot CS Security Team</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowForgotPasswordDialog(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

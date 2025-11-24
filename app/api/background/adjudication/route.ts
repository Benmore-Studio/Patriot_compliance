import { type NextRequest, NextResponse } from "next/server"

// Mock adjudication rules
const rules = [
  {
    id: "RULE-001",
    category: "Criminal Records",
    severity: "High",
    condition: "Felony within 7 years",
    action: "Auto-Reject",
    lookbackYears: 7,
    scoreImpact: 100,
    active: true,
  },
  {
    id: "RULE-002",
    category: "Criminal Records",
    severity: "Medium",
    condition: "Misdemeanor within 5 years",
    action: "Manual Review",
    lookbackYears: 5,
    scoreImpact: 50,
    active: true,
  },
]

export async function GET() {
  return NextResponse.json({ rules })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { category, severity, condition, action, lookbackYears, scoreImpact } = body

  const newRule = {
    id: `RULE-${String(rules.length + 1).padStart(3, "0")}`,
    category,
    severity,
    condition,
    action,
    lookbackYears,
    scoreImpact,
    active: true,
  }

  rules.push(newRule)

  return NextResponse.json({ rule: newRule }, { status: 201 })
}

// Adjudication engine
export async function adjudicateScreening(screeningId: string, findings: any[]) {
  let totalScore = 0
  const triggeredRules = []

  for (const finding of findings) {
    for (const rule of rules) {
      if (!rule.active) continue

      // Check if finding matches rule conditions
      // This is simplified - production would have complex matching logic
      if (finding.category === rule.category) {
        totalScore += rule.scoreImpact
        triggeredRules.push(rule)
      }
    }
  }

  return {
    screeningId,
    adjudicationScore: totalScore,
    decision: totalScore >= 100 ? "reject" : totalScore >= 50 ? "review" : "clear",
    triggeredRules,
  }
}

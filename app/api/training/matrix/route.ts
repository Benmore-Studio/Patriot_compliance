import { NextResponse } from "next/server"

export async function GET() {
  // Mock training matrix data
  const trainingMatrix = [
    {
      id: "1",
      trainingName: "OSHA 10-Hour Construction",
      requiredFor: "All PCS Pass users", // Renamed from "All field workers" to "All PCS Pass users"
      frequency: "Initial + Refresher every 3 years",
      totalRequired: 150,
      completed: 142,
      completionRate: 95,
    },
    {
      id: "2",
      trainingName: "Hazard Communication (HazCom)",
      requiredFor: "All employees",
      frequency: "Annual",
      totalRequired: 156,
      completed: 156,
      completionRate: 100,
    },
    {
      id: "3",
      trainingName: "Forklift Operator Certification",
      requiredFor: "Warehouse staff",
      frequency: "Initial + Evaluation every 3 years",
      totalRequired: 35,
      completed: 28,
      completionRate: 80,
    },
  ]

  return NextResponse.json(trainingMatrix)
}

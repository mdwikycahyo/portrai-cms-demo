export type SimulationStatus = "Draft" | "Published" | "In Progress" | "Archived"

export interface Simulation {
  id: string
  name: string
  status: SimulationStatus
}

export const mockSimulations: Simulation[] = [
  {
    id: "1",
    name: "Customer Service Scenario",
    status: "Draft",
  },
  {
    id: "2",
    name: "Leadership Challenge",
    status: "Published",
  },
  {
    id: "3",
    name: "Sales Negotiation",
    status: "In Progress",
  },
  {
    id: "4",
    name: "Team Conflict Resolution",
    status: "Draft",
  },
  {
    id: "5",
    name: "Performance Review",
    status: "Published",
  },
  {
    id: "6",
    name: "Onboarding Flow",
    status: "Archived",
  },
  {
    id: "7",
    name: "Interview Simulation V1",
    status: "Draft",
  },
  {
    id: "8",
    name: "Conflict Resolution Training",
    status: "In Progress",
  },
  {
    id: "9",
    name: "Product Knowledge Test",
    status: "Published",
  },
  {
    id: "10",
    name: "Crisis Management Drill",
    status: "Archived",
  },
]

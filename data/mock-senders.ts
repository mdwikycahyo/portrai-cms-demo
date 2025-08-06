export interface Sender {
  id: string
  name: string
  email: string
  roleName: string
}

export const mockSenders: Sender[] = [
  {
    id: "sender-1",
    name: "Sarah Johnson",
    email: "sarah.johnson@company.com",
    roleName: "VP of Solutions"
  },
  {
    id: "sender-2", 
    name: "Michael Chen",
    email: "michael.chen@company.com",
    roleName: "Director of Operations"
  },
  {
    id: "sender-3",
    name: "Emily Rodriguez",
    email: "emily.rodriguez@company.com",
    roleName: "Senior HR Manager"
  },
  {
    id: "sender-4",
    name: "David Thompson",
    email: "david.thompson@company.com",
    roleName: "VP of Human Resources"
  },
  {
    id: "sender-5",
    name: "Lisa Wang",
    email: "lisa.wang@company.com",
    roleName: "Director of Talent Acquisition"
  },
  {
    id: "sender-6",
    name: "Robert Martinez",
    email: "robert.martinez@company.com",
    roleName: "Chief People Officer"
  },
  {
    id: "sender-7",
    name: "Jennifer Kim",
    email: "jennifer.kim@company.com",
    roleName: "Senior Operations Manager"
  },
  {
    id: "sender-8",
    name: "Thomas Anderson",
    email: "thomas.anderson@company.com",
    roleName: "VP of Business Development"
  }
]

export const getSenderById = (id: string): Sender | undefined => {
  return mockSenders.find(sender => sender.id === id)
}

export const getSenderByEmail = (email: string): Sender | undefined => {
  return mockSenders.find(sender => sender.email === email)
}

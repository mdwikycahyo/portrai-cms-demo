export interface Rule {
  id: string
  conditionType: "textLength" | "keywordMatch" | "timeTaken"
  operator: "equals" | "greaterThan" | "lessThan" | "contains" | "notContains"
  value: string | number | string[]
  targetNodeId: string
  logic?: "AND" | "OR"
}

export interface EmailPromptNodeData {
  label: string
  senderId: string
  subject: string
  body: string
}

export interface ResponseNodeData {
  label: string
  timeLimit: number
  responseType: "text" | "keywords" | "multipleChoice"
  // Text Length constraints
  minLength?: number
  maxLength?: number
  // Keyword Match
  keywords?: string[]
  // Multiple Choice
  options?: { id: string; text: string; nextNodeId?: string }[]
  // Fallback Settings
  hasFallback: boolean
  fallbackNodeId?: string
  // Branching Rules
  rules: Rule[]
}

export interface VoicePromptNodeData {
  label: string
  script: string
  voiceProfile: string
  callDuration?: number
  callSentiment?: string
}

export interface ChatNodeData {
  label: string
  personaId?: string
}

export type NodeData = EmailPromptNodeData | ResponseNodeData | VoicePromptNodeData | ChatNodeData

"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { EmailPromptNodeData } from "@/types/canvas"

interface EmailPropertiesProps {
  data: EmailPromptNodeData
  nodeId: string
  nodeType: string
  onUpdateNodeData: (nodeId: string, newData: any) => void
  validateField: (field: string, value: any, nodeType: string) => void
  getFieldError: (field: string) => string | undefined
}

export function EmailProperties({ 
  data, 
  nodeId, 
  nodeType, 
  onUpdateNodeData, 
  validateField, 
  getFieldError 
}: EmailPropertiesProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="email-sender" className="text-xs font-medium text-gray-700">
          Sender
        </Label>
        <Input
          id="email-sender"
          value={data.sender || ""}
          onChange={(e) => onUpdateNodeData(nodeId, { sender: e.target.value })}
          onBlur={(e) => validateField("sender", e.target.value, nodeType)}
          className={`mt-1 ${getFieldError("sender") ? "border-red-500" : ""}`}
          placeholder="sender@company.com"
          aria-invalid={!!getFieldError("sender")}
          aria-describedby={getFieldError("sender") ? "sender-error" : undefined}
        />
        {getFieldError("sender") && (
          <div id="sender-error" className="text-xs text-red-600 mt-1" role="alert">
            {getFieldError("sender")}
          </div>
        )}
      </div>
      <div>
        <Label htmlFor="email-subject" className="text-xs font-medium text-gray-700">
          Subject
        </Label>
        <Input
          id="email-subject"
          value={data.subject || ""}
          onChange={(e) => onUpdateNodeData(nodeId, { subject: e.target.value })}
          onBlur={(e) => validateField("subject", e.target.value, nodeType)}
          className={`mt-1 ${getFieldError("subject") ? "border-red-500" : ""}`}
          placeholder="Email subject"
          aria-invalid={!!getFieldError("subject")}
          aria-describedby={getFieldError("subject") ? "subject-error" : undefined}
        />
        {getFieldError("subject") && (
          <div id="subject-error" className="text-xs text-red-600 mt-1" role="alert">
            {getFieldError("subject")}
          </div>
        )}
      </div>
      <div>
        <Label htmlFor="email-body" className="text-xs font-medium text-gray-700">
          Body
        </Label>
        <Textarea
          id="email-body"
          value={data.body || ""}
          onChange={(e) => onUpdateNodeData(nodeId, { body: e.target.value })}
          onBlur={(e) => validateField("body", e.target.value, nodeType)}
          className={`mt-1 ${getFieldError("body") ? "border-red-500" : ""}`}
          placeholder="Email content..."
          rows={4}
          aria-invalid={!!getFieldError("body")}
          aria-describedby={getFieldError("body") ? "body-error" : undefined}
        />
        {getFieldError("body") && (
          <div id="body-error" className="text-xs text-red-600 mt-1" role="alert">
            {getFieldError("body")}
          </div>
        )}
      </div>
    </div>
  )
}

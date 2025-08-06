"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { VoicePromptNodeData } from "@/types/canvas"

interface VoicePropertiesProps {
  data: VoicePromptNodeData
  nodeId: string
  nodeType: string
  onUpdateNodeData: (nodeId: string, newData: any) => void
  validateField: (field: string, value: any, nodeType: string) => void
  getFieldError: (field: string) => string | undefined
}

export function VoiceProperties({ 
  data, 
  nodeId, 
  nodeType, 
  onUpdateNodeData, 
  validateField, 
  getFieldError 
}: VoicePropertiesProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="voice-script" className="text-xs font-medium text-gray-700">
          Script
        </Label>
        <Textarea
          id="voice-script"
          value={data.script || ""}
          onChange={(e) => onUpdateNodeData(nodeId, { script: e.target.value })}
          onBlur={(e) => validateField("script", e.target.value, nodeType)}
          className={`mt-1 ${getFieldError("script") ? "border-red-500" : ""}`}
          placeholder="Voice script content..."
          rows={4}
          aria-invalid={!!getFieldError("script")}
          aria-describedby={getFieldError("script") ? "script-error" : undefined}
        />
        {getFieldError("script") && (
          <div id="script-error" className="text-xs text-red-600 mt-1" role="alert">
            {getFieldError("script")}
          </div>
        )}
      </div>
      <div>
        <Label htmlFor="voice-profile" className="text-xs font-medium text-gray-700">
          Voice Profile
        </Label>
        <Select
          value={data.voiceProfile || ""}
          onValueChange={(value) => onUpdateNodeData(nodeId, { voiceProfile: value })}
        >
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select voice profile" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default</SelectItem>
            <SelectItem value="professional">Professional</SelectItem>
            <SelectItem value="friendly">Friendly</SelectItem>
            <SelectItem value="authoritative">Authoritative</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="call-duration" className="text-xs font-medium text-gray-700">
          Call Duration (seconds)
        </Label>
        <Input
          id="call-duration"
          type="number"
          value={data.callDuration || ""}
          onChange={(e) =>
            onUpdateNodeData(nodeId, {
              callDuration: e.target.value ? Number.parseInt(e.target.value) : undefined,
            })
          }
          className="mt-1"
          placeholder="30"
          min="1"
        />
      </div>
      <div>
        <Label htmlFor="call-sentiment" className="text-xs font-medium text-gray-700">
          Call Sentiment
        </Label>
        <Select
          value={data.callSentiment || ""}
          onValueChange={(value) => onUpdateNodeData(nodeId, { callSentiment: value })}
        >
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select sentiment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="neutral">Neutral</SelectItem>
            <SelectItem value="positive">Positive</SelectItem>
            <SelectItem value="negative">Negative</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

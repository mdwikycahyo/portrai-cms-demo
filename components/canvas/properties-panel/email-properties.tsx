"use client"

import * as React from "react"
import { useEffect, useState, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TiptapEditor } from "@/components/ui/tiptap-editor"
import { mockSenders, getSenderById } from "@/data/mock-senders"
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
  // The selectedSender is still useful for displaying details within the SelectItem,
  // but SelectValue will now handle its own display based on the 'value' prop.
  const selectedSender = getSenderById(data.senderId || "")
  
  // Local state for inputs to prevent glitching
  const [subjectValue, setSubjectValue] = useState(data.subject || "")
  const [bodyValue, setBodyValue] = useState(data.body || "")
  const subjectDebounceTimerRef = useRef<NodeJS.Timeout | null>(null)
  const bodyDebounceTimerRef = useRef<NodeJS.Timeout | null>(null)
  
  // Update local states when data changes from external sources
  useEffect(() => {
    setSubjectValue(data.subject || "")
    setBodyValue(data.body || "")
  }, [data.subject, data.body])
  
  const handleSenderChange = (senderId: string) => {
    onUpdateNodeData(nodeId, { senderId })
    // Re-validate the senderId field after change
    validateField("senderId", senderId, nodeType)
  }
  
  // Optimized subject change handler with controlled input
  const handleSubjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    
    // Always update local state immediately for responsive UI
    setSubjectValue(newValue)
    
    // Clear any existing timer
    if (subjectDebounceTimerRef.current) {
      clearTimeout(subjectDebounceTimerRef.current)
    }
    
    // Set a new timer to update the node data after a longer delay
    // This prevents re-renders during typing
    subjectDebounceTimerRef.current = setTimeout(() => {
      // Only update node data if the value is different from current data
      // This prevents unnecessary re-renders
      if (data.subject !== newValue) {
        onUpdateNodeData(nodeId, { subject: newValue })
      }
    }, 1500) // Increased to 1500ms to reduce interference with typing
  }
  
  // Optimized body change handler with controlled input for rich text editor
  const handleBodyChange = (newValue: string) => {
    // Always update local state immediately for responsive UI
    setBodyValue(newValue)
    
    // Clear any existing timer
    if (bodyDebounceTimerRef.current) {
      clearTimeout(bodyDebounceTimerRef.current)
    }
    
    // Set a new timer to update the node data after a longer delay
    bodyDebounceTimerRef.current = setTimeout(() => {
      // Only update node data if the value is different from current data
      if (data.body !== newValue) {
        onUpdateNodeData(nodeId, { body: newValue })
      }
    }, 1500) // Increased to 1500ms to reduce interference with typing
  }
  
  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (subjectDebounceTimerRef.current) {
        clearTimeout(subjectDebounceTimerRef.current)
      }
      if (bodyDebounceTimerRef.current) {
        clearTimeout(bodyDebounceTimerRef.current)
      }
    }
  }, [])

  // Create a custom SelectValue component to display sender information nicely
  const CustomSelectValue = React.forwardRef<
    HTMLSpanElement,
    React.ComponentPropsWithoutRef<typeof SelectValue>
  >(({ className, ...props }, ref) => {
    // Only render custom content if we have a selected sender
    if (selectedSender) {
      return (
        <SelectValue 
          ref={ref} 
          {...props} 
          className={className}
        >
          <div className="flex flex-col py-2 text-left">
            <span className="font-medium">{selectedSender.name}</span>
            <span className="text-xs text-gray-500">{selectedSender.roleName}</span>
            <span className="text-xs text-gray-400">{selectedSender.email}</span>
          </div>
        </SelectValue>
      )
    }
    
    // Default placeholder when no sender is selected
    return (
      <SelectValue 
        ref={ref} 
        placeholder="Select a sender" 
        {...props} 
        className={className} 
      />
    )
  })
  CustomSelectValue.displayName = "CustomSelectValue"

  return (
    <div className="flex flex-col h-full">
      <div className="space-y-4 p-2 flex-none">
      <div>
        <Label htmlFor="email-sender" className="text-xs font-medium text-gray-700">
          Sender
        </Label>
        <Select
          value={data.senderId || ""}
          onValueChange={handleSenderChange}
        >
          <SelectTrigger 
            id="email-sender"
            className={`mt-1 w-full ${data.senderId && "h-auto min-h-[70px]"} ${getFieldError("senderId") ? "border-red-500" : ""}`}
            aria-invalid={!!getFieldError("senderId")}
            aria-describedby={getFieldError("senderId") ? "sender-error" : undefined}
          >
            <CustomSelectValue />
          </SelectTrigger>
          <SelectContent>
            {mockSenders.map((sender) => (
              <SelectItem key={sender.id} value={sender.id}>
                <div className="flex flex-col">
                  <span className="font-medium">{String(sender.name)}</span>
                  <span className="text-xs text-gray-500">{String(sender.roleName)}</span>
                  <span className="text-xs text-gray-400">{String(sender.email)}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {getFieldError("senderId") && (
          <div id="sender-error" className="text-xs text-red-600 mt-1" role="alert">
            {getFieldError("senderId")}
          </div>
        )}
      </div>
      <div>
        <Label htmlFor="email-subject" className="text-xs font-medium text-gray-700">
          Subject
        </Label>
        <Input
          id="email-subject"
          value={subjectValue} // Use local state for immediate feedback
          onChange={handleSubjectChange} // Use debounced handler
          onBlur={(e) => {
            // On blur, clear any pending debounce timer
            if (subjectDebounceTimerRef.current) {
              clearTimeout(subjectDebounceTimerRef.current)
              subjectDebounceTimerRef.current = null
            }
            
            // Only update if the value has changed from the current data
            if (data.subject !== e.target.value) {
              onUpdateNodeData(nodeId, { subject: e.target.value })
            }
            
            // Always validate on blur
            validateField("subject", e.target.value, nodeType)
          }}
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
      </div>
      <div className="flex-1 flex flex-col p-2 min-h-0">
        <Label htmlFor="email-body" className="text-xs font-medium text-gray-700 mb-1">
          Body
        </Label>
        <div className="flex-1 flex flex-col min-h-0">
          <TiptapEditor
            value={bodyValue} // Use local state for immediate feedback
            onChange={handleBodyChange} // Use debounced handler
            onBlur={() => {
              // On blur, clear any pending debounce timer
              if (bodyDebounceTimerRef.current) {
                clearTimeout(bodyDebounceTimerRef.current)
                bodyDebounceTimerRef.current = null
              }
              
              // Only update if the value has changed from the current data
              if (data.body !== bodyValue) {
                onUpdateNodeData(nodeId, { body: bodyValue })
              }
              
              // Always validate on blur
              validateField("body", bodyValue, nodeType)
            }}
            className={`${getFieldError("body") ? "border-red-500" : ""}`}
            placeholder="Email content..."
            minHeight="100%"
            resizable={true}
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
    </div>
  )
}

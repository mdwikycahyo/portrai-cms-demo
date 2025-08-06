import { useCallback, useState } from "react"
import type { NodeData } from "@/types/canvas"

interface ValidationErrors {
  [field: string]: string | undefined
}

export function useValidation() {
  const [errors, setErrors] = useState<ValidationErrors>({})

  const validateField = useCallback((field: string, value: any, nodeType: string) => {
    let error: string | undefined

    switch (nodeType) {
      case "emailPrompt":
        if (field === "senderId") {
          if (!value || value.trim() === "") {
            error = "Please select a sender"
          }
        } else if (field === "subject") {
          if (!value || value.trim() === "") {
            error = "Subject is required"
          } else if (value.length > 200) {
            error = "Subject must be 200 characters or less"
          }
        } else if (field === "body") {
          if (!value || value.trim() === "") {
            error = "Email body is required"
          } else if (value.length > 5000) {
            error = "Email body must be 5000 characters or less"
          }
        }
        break

      case "voicePrompt":
        if (field === "script") {
          if (!value || value.trim() === "") {
            error = "Script is required"
          } else if (value.length > 2000) {
            error = "Script must be 2000 characters or less"
          }
        } else if (field === "voiceProfile") {
          if (!value || value.trim() === "") {
            error = "Voice profile is required"
          }
        }
        break

      case "response":
        if (field === "timeLimit") {
          const numValue = Number(value)
          if (isNaN(numValue) || numValue <= 0) {
            error = "Time limit must be a positive number"
          } else if (numValue > 3600) {
            error = "Time limit cannot exceed 3600 seconds"
          }
        } else if (field === "minLength") {
          const numValue = Number(value)
          if (value !== "" && (isNaN(numValue) || numValue < 0)) {
            error = "Minimum length must be a non-negative number"
          }
        } else if (field === "maxLength") {
          const numValue = Number(value)
          if (value !== "" && (isNaN(numValue) || numValue < 0)) {
            error = "Maximum length must be a non-negative number"
          }
        }
        break

      case "chat":
        // Chat nodes currently don't have required validation
        break

      default:
        break
    }

    setErrors(prev => ({
      ...prev,
      [field]: error
    }))

    return !error
  }, [])

  const getFieldError = useCallback((field: string) => {
    return errors[field]
  }, [errors])

  const clearErrors = useCallback(() => {
    setErrors({})
  }, [])

  const hasErrors = useCallback(() => {
    return Object.values(errors).some(error => error !== undefined)
  }, [errors])

  return {
    validateField,
    getFieldError,
    clearErrors,
    hasErrors,
    errors
  }
}

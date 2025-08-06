import { useState, useCallback } from "react"

export const useValidation = () => {
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  const validateField = useCallback((field: string, value: any, nodeType: string) => {
    setValidationErrors(errors => {
      const newErrors = { ...errors }

      switch (nodeType) {
        case "emailPromptNode":
          if (field === "sender" && (!value || !value.includes("@"))) {
            newErrors[field] = "Valid email address required"
          } else if (field === "subject" && (!value || value.trim() === "")) {
            newErrors[field] = "Subject is required"
          } else if (field === "body" && (!value || value.trim() === "")) {
            newErrors[field] = "Email body is required"
          } else {
            delete newErrors[field]
          }
          break
        case "voicePromptNode":
          if (field === "script" && (!value || value.trim() === "")) {
            newErrors[field] = "Script is required"
          } else {
            delete newErrors[field]
          }
          break
        case "responseNode":
          if (field === "timeLimit" && (!value || value <= 0)) {
            newErrors[field] = "Time limit must be greater than 0"
          } else {
            delete newErrors[field]
          }
          break
        case "chatNode":
          if (field === "personaId" && !value) {
            newErrors[field] = "Persona selection is required"
          } else {
            delete newErrors[field]
          }
          break
      }

      return newErrors
    })
  }, [])

  const getFieldError = useCallback((field: string) => validationErrors[field], [validationErrors])

  return { validationErrors, validateField, getFieldError }
}

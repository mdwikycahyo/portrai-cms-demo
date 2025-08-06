import type { Rule } from "@/types/canvas"

export const getOperatorOptions = (conditionType: Rule["conditionType"]) => {
  switch (conditionType) {
    case "textLength":
    case "timeTaken":
      return [
        { value: "greaterThan", label: "Greater than" },
        { value: "lessThan", label: "Less than" },
        { value: "equals", label: "Equals" },
      ]
    case "keywordMatch":
      return [
        { value: "contains", label: "Contains" },
        { value: "notContains", label: "Does not contain" },
      ]
    default:
      return []
  }
}

export const getConditionSummary = (rule: Rule) => {
  const conditionLabels = {
    textLength: "Text Length",
    keywordMatch: "Keywords",
    timeTaken: "Time Taken",
  }

  const operatorLabels = {
    greaterThan: ">",
    lessThan: "<",
    equals: "=",
    contains: "contains",
    notContains: "!contains",
  }

  return `${conditionLabels[rule.conditionType]} ${operatorLabels[rule.operator]} ${rule.value}`
}

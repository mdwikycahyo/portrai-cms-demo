# Design Challenge: HR Simulation Builder Interface

## Context
Design a visual workflow builder for HR professionals to create branching assessment simulations. Think **n8n-style flowchart interface** but specialized for HR scenario building.

## User Profile
- **Who:** HR/L&D professionals 
- **Tech Skills:** Microsoft Office level (low-medium technical ability)
- **Current Pain:** Using scattered tools (Canva + Google Docs) to build simulations
- **Goal:** Create complex branching scenarios in one unified tool

## Core Requirements

### 1. Visual Flow Creation
Users need to build branching storylines like this:
```
Email Trigger → Participant Response → Branch A/B/C → More Interactions
```

### 2. Interaction Types Per Node
Each flowchart node must support:
- **Chat interactions** (AI persona, tone, expected responses)
- **Voice calls** (same as chat but voice-based)  
- **Email interactions** (sender profile, content, response classification)

### 3. Response Classification System
For each interaction, admin defines:
- **Classification rules** (keywords, intent, tone detection)
- **Branching logic** ("if response shows 'problem-solving' → go to Branch A")
- **Fallback paths** (what happens when responses don't match criteria)

## Design Questions to Solve

### Primary Challenge:
**How should the node creation and editing interface work?**
- How does admin add new interaction nodes?
- How does admin configure each interaction type within a node?
- How does admin set up branching rules and classification parameters?

### Secondary Challenges:
- **Content management:** Where/how do admins write and store interaction content?
- **Flow visualization:** How to keep complex branching scenarios readable?
- **Testing workflow:** How can admins preview and test their simulation flows?

## Expected Output Format

Provide **3 different design approaches** with:

1. **Approach Name & Core Concept**
2. **Visual Description** (describe the interface layout and key elements)
3. **User Workflow Steps** (step-by-step how admin would use it)
4. **Pros/Cons** (usability trade-offs)
5. **Implementation Notes** (technical considerations for frontend development)

## Design Constraints
- Must be **intuitive for non-technical users**
- Should **reduce tool fragmentation** (replace Canva + Google Docs workflow)
- **Visual flowchart paradigm** is preferred
- Focus on **practical implementation** for frontend development

## Success Criteria
The design should enable an HR professional to create a complete branching simulation scenario in **one unified interface** without needing external tools for content creation or flow mapping.
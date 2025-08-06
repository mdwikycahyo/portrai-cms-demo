# Refactoring Plan for the Canvas Builder

## Analysis

The codebase is generally well-structured, but some components have grown quite large and could benefit from being broken down into smaller, more focused components. This will improve maintainability, readability, and reusability.

Here are the key areas for improvement:

1.  **`CanvasWorkflow` (`components/canvas/canvas-workflow.tsx`):** This is the largest and most complex component. It manages the entire canvas state, including nodes, edges, history, user interactions (drag and drop, copy/paste), and local storage synchronization. Its responsibilities are too broad for a single component.

2.  **`PropertiesPanel` (`components/canvas/properties-panel.tsx`):** This component is responsible for rendering the properties of all the different node types. As new node types are added, this component will continue to grow, making it difficult to manage. The rendering logic for each node type is also tightly coupled within this single component.

3.  **`PersonaManagerTab` (`components/canvas/persona-manager-tab.tsx`):** This component handles both the creation/editing of personas and the listing of existing personas. These are two distinct responsibilities that can be separated.

## Improvement Plan

I will refactor the codebase to address the issues identified above. Here's the plan:

### 1. Refactor `CanvasWorkflow`

I will break down `CanvasWorkflow` into smaller, more manageable hooks and components:

*   **`useCanvasState.ts`:** A custom hook to manage the state of the canvas, including nodes, edges, and the history stack. This will encapsulate the `useNodesState`, `useEdgesState`, and `useCanvasHistory` logic.
*   **`useCanvasInteractions.ts`:** A custom hook to handle user interactions like copy, paste, undo, and redo.
*   **`useCanvasSync.ts`:** A custom hook to manage the synchronization of the canvas state with local storage.
*   **`Canvas.tsx`:** The main component that will use the new hooks and render the `ReactFlow` component and its children.

### 2. Refactor `PropertiesPanel`

I will refactor the `PropertiesPanel` to use a more modular and extensible approach:

*   **`PropertiesPanel.tsx`:** This will be the main component that dynamically renders the appropriate properties form based on the selected node's type.
*   **`EmailProperties.tsx`, `VoiceProperties.tsx`, `ChatProperties.tsx`, `ResponseProperties.tsx`:** These will be new components, each responsible for rendering the properties of a specific node type. This makes it easy to add new node types in the future without modifying the main `PropertiesPanel` component.
*   **`useNodeUpdater.ts`:** A custom hook to provide a simple and consistent way to update node data from the properties forms.
*   **`useValidation.ts`:** A custom hook for handling form validation within the properties panels.

### 3. Refactor `PersonaManagerTab`

I will split the `PersonaManagerTab` into two separate components:

*   **`PersonaForm.tsx`:** A component for creating and editing personas.
*   **`PersonaList.tsx`:** A component for displaying the list of existing personas.
*   **`PersonaManager.tsx`:** The main component that will manage the state of the personas and render the `PersonaForm` and `PersonaList` components.

This refactoring will result in a more organized, maintainable, and scalable codebase. It will also make it easier to add new features and functionality in the future.

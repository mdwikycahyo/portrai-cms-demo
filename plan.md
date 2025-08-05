The document you provided, "Enhanced Frontend Prototype Specification: HR Simulation Builder," outlines a detailed plan for building a visual workflow builder for HR professionals. The core of the application is a React Flow canvas where users can design branching assessment simulations.

Here's a breakdown of what I understand from the document:

- **Purpose**: To create a frontend-only prototype for HR simulation building, focusing on visual workflow design.
- **Key Features**:

- **Simulation Canvas**: A central React Flow canvas where users drag and drop nodes to build simulation flows.
- **Node Types**: Primarily "Behavior Prompts" (system-initiated interactions like email, chat, voice call) and "Participant Response" points.
- **Branching Logic**: Users can define rules to determine the next step based on participant responses, including fallback paths.
- **Persona Management**: Ability to create and assign communication personas for chat interactions.



- **Data Storage**: All simulation data will be stored and managed entirely within the browser's `localStorage`, with no backend integration.
- **UI/UX**: The document specifies detailed layouts and visual treatments for the Dashboard (listing simulations), the Canvas Workspace (with a node palette, properties panel, and top bar controls), and various node states (default, selected, hover, invalid, active).
- **Configuration**: Extensive details are provided for configuring response constraints (text length, keywords, multiple choice), fallback paths, voice call prompts (script editor, voice profiles, call controls), and complex branching rules.
- **Core Functionality**: Includes specifications for saving/loading simulations (with auto-save), a robust error handling system (validation, visual feedback), accessibility features (keyboard navigation, screen reader support), and canvas enhancements (undo/redo, copy/paste, mini-map, smart layout).
- **Data Models**: TypeScript interfaces are provided for the core data structures like `Simulation`, `Node` types, `Edge`, `Rule`, and `Persona`.
- **Constraints**: The prototype is strictly frontend-only, uses `localStorage`, has performance considerations (max 500 nodes), and targets Chromium-based browsers and Firefox (no mobile support).


You're right about the context window limitation, and this is a comprehensive project. To address this, I propose breaking down the implementation into several manageable phases. This allows us to build the application incrementally, ensuring each part is functional before moving to the next.

Here's a proposed phased implementation plan:

### Phase 1: Project Setup & Dashboard

- Set up the Next.js project with necessary dependencies (React Flow, shadcn/ui).
- Implement the basic Dashboard UI: Header, "Simulation Builder" title, "Create New" button, and a placeholder for the simulation list.
- Implement basic `localStorage` functionality to save and load just the names of simulations, allowing users to create and see their saved simulations.


### Phase 2: Core Canvas Workspace & Basic Node Interaction

- Integrate React Flow into the Canvas Workspace.
- Implement the main Canvas Workspace layout: Node Palette (empty for now), Canvas Area, Properties Panel (empty for now), and the Top Bar (Simulation Name, Save/Load placeholders, Undo/Redo placeholders).
- Enable basic node creation from the palette (e.g., a generic "Node" type) and allow dragging/dropping on the canvas.
- Implement basic node states: Default, Selected, and Hover visual treatments.
- Implement basic saving and loading of the React Flow state (nodes and edges) to `localStorage`.


### Phase 3: Implementing Core Node Types & Basic Properties

- Define and implement the `EmailPromptNode` and `ResponseNode` types within React Flow.
- Develop the Properties Panel to allow configuration of basic data for `EmailPromptNode` (sender, subject, body).
- Develop the Properties Panel to allow configuration of basic data for `ResponseNode` (timeLimit).
- Implement connection handles on nodes and provide visual feedback for valid/invalid connections.


### Phase 4: Advanced Response Node Configuration & Fallback Paths

- Implement the UI and logic for `ResponseNode` constraints: Text Length (min/max inputs), Keyword Match (tag-based input), and Multiple Choice (dynamic option builder).
- Implement the UI and logic for Fallback Settings: Toggle switch, target node selection (dropdown/create new), and visual feedback on the canvas (dashed connector line).


### Phase 5: Voice Call Prompt Configuration & Persona Management

- Implement the UI for Voice Call Prompt Configuration: Script editor, voice profile dropdown, simulated call controls (play/pause, speed), and call metadata inputs.
- Implement the Persona Management UI: Persona creation form (avatar upload, name, type, response style, tone slider, sample responses).
- Implement the workflow for assigning personas to chat nodes (drag-and-drop or selection).


### Phase 6: Branching Rule Logic & Canvas Enhancements

- Implement the Rule Builder UI for branching logic: Condition type, parameters, operator, value input, target node, and the "Add Condition" button with AND/OR toggle.
- Integrate the rule logic with edges to control branching.
- Implement core canvas enhancements: Undo/Redo functionality (using Zustand), and Copy/Paste for node groups.
- Integrate the React Flow MiniMap component.


### Phase 7: Error Handling & Accessibility

- Implement the Error Handling System: On-blur validation for missing fields (red outline, tooltip), rejected snap for invalid connections (toast), and visual warnings for orphaned nodes.
- Implement Accessibility Features: Keyboard navigation for nodes and panels, and ARIA labels for interactive elements.


This phased approach will allow us to tackle the project systematically. I will start by generating the code for **Phase 1** in my next response.
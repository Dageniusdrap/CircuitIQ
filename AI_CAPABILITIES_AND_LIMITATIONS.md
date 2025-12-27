# CircuitIQ AI Capabilities & Limitations

This document provides a technical breakdown of the AI capabilities currently implemented in CircuitIQ, addressing the ability to interpret diagrams, trace problems, and simulate repairs.

## 1. Diagram Interpretation (IMPLEMENTED)
**Can it interpret wiring diagrams?** **YES.**
- **Technology:** Uses GPT-4 Vision.
- **How it works:** When you upload a PDF or Image, the system:
  1.  Scans the visual diagram.
  2.  Extracts specific components (relays, fuses, pins).
  3.  Identifies connections between them.
  4.  Classifies the vehicle type and system (e.g., "Boeing 737 Landing Gear").
  5.  Saves this structured data to the database, making it searchable and "understood" by the AI teammate.

## 2. Live Troubleshooting & Tracing (IMPLEMENTED)
**Trace where the problem is? Give procedures?** **YES.**
- **Technology:** The `EngineerTeammate` AI agent (GPT-4 Turbo).
- **How it works:**
  - It maintains a **Diagnostic State** (what we know, what we've tested).
  - It "thinks" through the problem like a human engineer (generating hypotheses, confidence scores).
  - It suggests the **Next Logical Step** based on your inputs.
  - It can generate specific **Test Procedures** (e.g., "Check voltage at Pin 30").
  - If you say "I measured 0V at the fuse," it updates its internal state to rule out certain causes and guide you to the next component in the circuit.

## 3. Simulation & Training (PARTIALLY IMPLEMENTED)
**Does it allow simulated testing or training?**
- **Simulation:** **Text-Based Only.**
  - There is **NO** physics-based "flight simulator" or interactive circuit board where you click wires to see sparks.
  - However, you can use the AI for **Roleplay Training**. You can tell the AI "Simulate a broken fuel pump scenario" and it will walk you through the troubleshooting process as if it were real, evaluating your answers.
- **Verification:** The AI asks you to verify repairs ("Did the voltage return to 28V?"), but it relies on **your input**. It cannot physically sense if the "virtual" plane is fixed unless you confirm the readings.

## 4. Operational Questions (IMPLEMENTED)
**Does it answer procedural questions?** **YES.**
- The AI is context-aware. If you are looking at a "Boeing 737" diagram, it knows specific systems.
- You can ask "How do I start the APU?" or "What is the normal hydraulic pressure?" and it will answer based on its general engineering knowledge + the specific diagram context.

## 5. Areas for Improvement (Current Limitations)
1.  **Memory Persistence:** Currently, if you refresh the page or step away too long, the AI might "forget" the specific steps you just took in that session (unless we move session storage to the database).
2.  **Visual Highlighting:** While the AI creates a list of components, the "interactive highlighting" on the PDF itself is currently basic. It can tell you *where* to look ("Top left, usually"), but it might not draw a glowing line on the specific wire in the PDF viewer yet.

## Summary
| Feature | Status | Details |
| :--- | :--- | :--- |
| **Parsing Diagrams** | ✅ Working | Extracts components, wires, and metadata. |
| **Logic Tracing** | ✅ Working | Suggests next steps based on electrical logic. |
| **Procedural QA** | ✅ Working | Answers "How to..." questions correctly. |
| **Physics Sim** | ❌ Not Built | No interactive 3D/2D physics simulation. |
| **Training Mode** | ⚠️ Text Only | Can roleplay scenarios, but not a gamified simulator. |

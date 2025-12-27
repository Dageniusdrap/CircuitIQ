# CircuitIQ Implementation & Data Flow Guide

This document explains how the different parts of CircuitIQ work together, where data is stored, and how it flows through the application.

## 1. System Overview

CircuitIQ is a Next.js application that integrates several key services:
- **Frontend:** Next.js (React) App Router (`src/app`)
- **Database:** Neon (PostgreSQL) - Stores user data, diagram metadata, and chat history.
- **File Storage:** UploadThing - Stores the actual PDF/Image files.
- **AI/LLM:** OpenAI - Analyzes the diagrams.
- **Authentication:** NextAuth.js (v5) - Manages user sessions.

## 2. The Data Flow: Uploading a Diagram

When you upload a file on the `/upload` page, the following chain of events occurs:

1.  **Frontend Selection:**
    *   You drop a file into the `UploadZone` component.
    *   The component sends the file directly to **UploadThing's** servers.

2.  **Server-Side Processing (The "Handshake"):**
    *   Once UploadThing receives the file, it notifies your application via a webhook callback defined in `src/app/api/uploadthing/core.ts`.
    *   **CRITICAL STEP:** This callback creates a new record in your **Neon Database** in the `Diagram` table.
    *   It saves the `fileUrl` (the public link to the file) and `fileKey`.
    *   It sets the status to `PENDING` or `PROCESSING`.

3.  **Feedback Loop:**
    *   The frontend receives a "Client Upload Complete" event.
    *   The UI updates to show the file as "Uploaded".
    *   Because the record now exists in the database, it immediately becomes visible on other pages.

## 3. Where Data Lives

| Data Type | Storage Location | Database Model | Access Method |
| :--- | :--- | :--- | :--- |
| **User Accounts** | Neon DB | `User` | Prisma Client (`prisma.user...`) |
| **PDF/Image Files** | UploadThing | N/A (Stored remotely) | `fileUrl` string in DB |
| **Diagram Metadata** | Neon DB | `Diagram` | `prisma.diagram...` |
| **Chat/Diagnostics** | Neon DB | `Analysis` & `ActivityLog` | `prisma.analysis...` |

## 4. Operational Integration (How Pages Work Together)

### **A. Upload Page (`/upload`)**
*   **Purpose:** Entry point for new data.
*   **Action:** Uploads file -> Creates DB Record.
*   **Visuals:** Shows the upload dropzone AND (now) a list of the 5 most recent uploads fetched from the `Diagram` table.

### **B. Diagrams Library (`/diagrams`)**
*   **Purpose:** The central repository.
*   **Action:** Fetches **ALL** records from the `Diagram` table.
*   **Feature:** Allows filtering by vehicle type (Plane/Car/Marine) which is just a generic filter on the database query.

### **C. Diagnostics Page (`/diagnostics`)**
*   **Purpose:** The interactive AI workspace.
*   **Logic:**
    *   **With ID (`/diagnostics?diagramId=123`):** It fetches that specific diagram's data and context to prime the AI.
    *   **Without ID:** It now renders the `DiagramSelector` component, which fetches the list of diagrams so you can choose where to start.

### **D. Search (`/search`)**
*   **Purpose:** Quick navigation.
*   **Action:** Performs a text search query against the `Diagram` table (title, model, system) and returns matching records.

## 5. Summary of Recent Fixes

We have "closed the loop" to ensure these systems talk to each other:
1.  **Authentication:** Fixed the login issue by correcting schema models (`PasswordResetToken`).
2.  **Upload Visibility:** Added a "Recent Uploads" list to the `/upload` page so you can verify uploads immediately.
3.  **Diagnostics Flow:** Added a "Diagram Selector" so you aren't stuck on a blank screen if you visit diagnostics directly.

Everything is connected via the **Neon Database**. As long as the `Diagram` record is created (which happens automatically on upload), the content becomes available everywhere.

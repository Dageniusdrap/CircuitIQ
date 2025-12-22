# CircuitIQ Platform

AI-Powered Wiring Diagnostic Platform for aircraft, automotive, and marine systems.

## Features

- **Upload Diagrams**: Bulk upload PDFs, images, or CAD files.
- **AI Analysis**: Automatically extracts components and connections.
- **Diagnostic Assistant**: Chat with an AI engineer teammate to troubleshoot issues.
- **System Analysis**: Visualize system interactions and failure impacts.

## Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Environment Variables**:
   Copy `.env.local` example and fill in your API keys (OpenAI, UploadThing, Database).

3. **Database**:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Run Development Server**:
   ```bash
   npm run dev
   ```

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: PostgreSQL + Prisma
- **Auth**: NextAuth.js v5
- **UI**: Tailwind CSS + shadcn/ui
- **AI**: OpenAI GPT-4 Vision & Turbo
- **Storage**: UploadThing

## Renaming Note

This project was originally based on "WireDiag" but has been renamed to **CircuitIQ**.

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'ENGINEER', 'TECHNICIAN', 'VIEWER');

-- CreateEnum
CREATE TYPE "VehicleType" AS ENUM ('AIRCRAFT', 'AUTOMOTIVE', 'MARINE', 'OTHER');

-- CreateEnum
CREATE TYPE "ProcessingStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'TECHNICIAN',
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
    "twoFactorSecret" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Diagram" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "vehicleType" "VehicleType" NOT NULL,
    "manufacturer" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "year" INTEGER,
    "system" TEXT NOT NULL,
    "systemCode" TEXT,
    "fileUrl" TEXT NOT NULL,
    "fileKey" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "thumbnailUrl" TEXT,
    "status" "ProcessingStatus" NOT NULL DEFAULT 'PENDING',
    "processingStartedAt" TIMESTAMP(3),
    "processingCompletedAt" TIMESTAMP(3),
    "processingError" TEXT,
    "aiExtractedData" JSONB,
    "confidence" DOUBLE PRECISION,
    "uploadedById" TEXT NOT NULL,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "downloadCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Diagram_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Component" (
    "id" TEXT NOT NULL,
    "diagramId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "partNumber" TEXT,
    "alternatePartNumbers" TEXT,
    "type" TEXT NOT NULL,
    "manufacturer" TEXT,
    "location" TEXT,
    "locationCode" TEXT,
    "function" TEXT NOT NULL,
    "specifications" JSONB,
    "operatingParams" JSONB,
    "xPosition" DOUBLE PRECISION,
    "yPosition" DOUBLE PRECISION,
    "boundingBox" JSONB,
    "extractedByAI" BOOLEAN NOT NULL DEFAULT false,
    "verifiedByUser" BOOLEAN NOT NULL DEFAULT false,
    "confidence" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Component_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ComponentConnection" (
    "id" TEXT NOT NULL,
    "fromId" TEXT NOT NULL,
    "toId" TEXT NOT NULL,
    "wireColor" TEXT,
    "wireGauge" TEXT,
    "wireLength" DOUBLE PRECISION,
    "wireRoute" TEXT,
    "connectorType" TEXT,
    "connectorPart" TEXT,
    "pinNumber" TEXT,
    "pinFunction" TEXT,
    "signalType" TEXT,
    "voltage" TEXT,
    "current" TEXT,
    "expectedResistance" DOUBLE PRECISION,
    "expectedVoltage" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ComponentConnection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FailureMode" (
    "id" TEXT NOT NULL,
    "componentId" TEXT NOT NULL,
    "mode" TEXT NOT NULL,
    "symptoms" TEXT NOT NULL,
    "visualIndicators" TEXT,
    "directImpacts" JSONB NOT NULL,
    "cascadingEffects" JSONB NOT NULL,
    "safetyImplications" TEXT,
    "bypassPossible" BOOLEAN NOT NULL DEFAULT false,
    "bypassProcedure" TEXT,
    "bypassLimitations" TEXT,
    "isolationPossible" BOOLEAN NOT NULL DEFAULT false,
    "isolationProcedure" TEXT,
    "isolationEffects" TEXT,
    "probability" DOUBLE PRECISION,
    "severity" TEXT,
    "priority" TEXT,
    "repairProcedure" TEXT,
    "estimatedRepairTime" INTEGER,
    "requiredTools" JSONB,
    "requiredParts" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FailureMode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestProcedure" (
    "id" TEXT NOT NULL,
    "componentId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "steps" JSONB NOT NULL,
    "requiredTools" JSONB NOT NULL,
    "safetyPrecautions" JSONB NOT NULL,
    "prerequisites" TEXT,
    "expectedValues" JSONB NOT NULL,
    "passCriteria" TEXT NOT NULL,
    "failCriteria" TEXT NOT NULL,
    "testType" TEXT NOT NULL,
    "estimatedTime" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TestProcedure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Analysis" (
    "id" TEXT NOT NULL,
    "diagramId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "symptom" TEXT NOT NULL,
    "additionalContext" TEXT,
    "aiResponse" JSONB NOT NULL,
    "suggestedTests" JSONB NOT NULL,
    "probableCauses" JSONB NOT NULL,
    "affectedSystems" JSONB,
    "completedAt" TIMESTAMP(3),
    "successful" BOOLEAN,
    "resolution" TEXT,
    "rootCause" TEXT,
    "helpful" BOOLEAN,
    "accuracy" INTEGER,
    "feedback" TEXT,
    "chatHistory" JSONB NOT NULL,
    "processingTime" INTEGER,
    "tokensUsed" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Analysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SystemIntegration" (
    "id" TEXT NOT NULL,
    "systemName" TEXT NOT NULL,
    "systemCode" TEXT,
    "vehicleType" "VehicleType" NOT NULL,
    "connectedSystems" JSONB NOT NULL,
    "powerSources" JSONB NOT NULL,
    "groundPoints" JSONB NOT NULL,
    "dataInterfaces" JSONB,
    "dependencies" JSONB NOT NULL,
    "dependents" JSONB NOT NULL,
    "emergencyBypass" TEXT,
    "redundancyInfo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SystemIntegration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivityLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "details" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActivityLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConfirmedFix" (
    "id" TEXT NOT NULL,
    "symptom" TEXT NOT NULL,
    "vehicleMake" TEXT NOT NULL,
    "vehicleModel" TEXT NOT NULL,
    "vehicleYear" INTEGER,
    "componentName" TEXT NOT NULL,
    "fixDescription" TEXT NOT NULL,
    "steps" JSONB,
    "timesSolved" INTEGER NOT NULL DEFAULT 1,
    "votes" INTEGER NOT NULL DEFAULT 0,
    "difficulty" TEXT,
    "averageCost" DOUBLE PRECISION,
    "averageTime" INTEGER,
    "verifiedBy" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConfirmedFix_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TSB" (
    "id" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "manufacturer" TEXT NOT NULL,
    "models" JSONB NOT NULL,
    "years" JSONB,
    "issue" TEXT NOT NULL,
    "resolution" TEXT NOT NULL,
    "pdfUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TSB_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Measurement" (
    "id" TEXT NOT NULL,
    "analysisId" TEXT,
    "componentId" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL,
    "location" TEXT,
    "isAbnormal" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,

    CONSTRAINT "Measurement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PartSource" (
    "id" TEXT NOT NULL,
    "partNumber" TEXT NOT NULL,
    "vendor" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "inStock" BOOLEAN NOT NULL DEFAULT true,
    "leadTime" TEXT,
    "buyLink" TEXT,
    "lastChecked" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PartSource_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "Account"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE INDEX "Diagram_vehicleType_manufacturer_model_idx" ON "Diagram"("vehicleType", "manufacturer", "model");

-- CreateIndex
CREATE INDEX "Diagram_system_idx" ON "Diagram"("system");

-- CreateIndex
CREATE INDEX "Diagram_uploadedById_idx" ON "Diagram"("uploadedById");

-- CreateIndex
CREATE INDEX "Diagram_status_idx" ON "Diagram"("status");

-- CreateIndex
CREATE INDEX "Diagram_createdAt_idx" ON "Diagram"("createdAt");

-- CreateIndex
CREATE INDEX "Component_diagramId_idx" ON "Component"("diagramId");

-- CreateIndex
CREATE INDEX "Component_type_idx" ON "Component"("type");

-- CreateIndex
CREATE INDEX "Component_partNumber_idx" ON "Component"("partNumber");

-- CreateIndex
CREATE INDEX "ComponentConnection_fromId_idx" ON "ComponentConnection"("fromId");

-- CreateIndex
CREATE INDEX "ComponentConnection_toId_idx" ON "ComponentConnection"("toId");

-- CreateIndex
CREATE UNIQUE INDEX "ComponentConnection_fromId_toId_key" ON "ComponentConnection"("fromId", "toId");

-- CreateIndex
CREATE INDEX "FailureMode_componentId_idx" ON "FailureMode"("componentId");

-- CreateIndex
CREATE INDEX "FailureMode_mode_idx" ON "FailureMode"("mode");

-- CreateIndex
CREATE INDEX "FailureMode_severity_idx" ON "FailureMode"("severity");

-- CreateIndex
CREATE INDEX "TestProcedure_componentId_idx" ON "TestProcedure"("componentId");

-- CreateIndex
CREATE INDEX "TestProcedure_testType_idx" ON "TestProcedure"("testType");

-- CreateIndex
CREATE INDEX "Analysis_diagramId_idx" ON "Analysis"("diagramId");

-- CreateIndex
CREATE INDEX "Analysis_userId_idx" ON "Analysis"("userId");

-- CreateIndex
CREATE INDEX "Analysis_createdAt_idx" ON "Analysis"("createdAt");

-- CreateIndex
CREATE INDEX "Analysis_successful_idx" ON "Analysis"("successful");

-- CreateIndex
CREATE INDEX "SystemIntegration_vehicleType_idx" ON "SystemIntegration"("vehicleType");

-- CreateIndex
CREATE UNIQUE INDEX "SystemIntegration_systemName_vehicleType_key" ON "SystemIntegration"("systemName", "vehicleType");

-- CreateIndex
CREATE INDEX "ActivityLog_userId_idx" ON "ActivityLog"("userId");

-- CreateIndex
CREATE INDEX "ActivityLog_action_idx" ON "ActivityLog"("action");

-- CreateIndex
CREATE INDEX "ActivityLog_createdAt_idx" ON "ActivityLog"("createdAt");

-- CreateIndex
CREATE INDEX "ConfirmedFix_symptom_idx" ON "ConfirmedFix"("symptom");

-- CreateIndex
CREATE INDEX "ConfirmedFix_vehicleMake_vehicleModel_idx" ON "ConfirmedFix"("vehicleMake", "vehicleModel");

-- CreateIndex
CREATE INDEX "TSB_manufacturer_idx" ON "TSB"("manufacturer");

-- CreateIndex
CREATE UNIQUE INDEX "TSB_number_key" ON "TSB"("number");

-- CreateIndex
CREATE INDEX "Measurement_analysisId_idx" ON "Measurement"("analysisId");

-- CreateIndex
CREATE INDEX "Measurement_componentId_idx" ON "Measurement"("componentId");

-- CreateIndex
CREATE INDEX "PartSource_partNumber_idx" ON "PartSource"("partNumber");

-- CreateIndex
CREATE INDEX "PartSource_vendor_idx" ON "PartSource"("vendor");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Diagram" ADD CONSTRAINT "Diagram_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Component" ADD CONSTRAINT "Component_diagramId_fkey" FOREIGN KEY ("diagramId") REFERENCES "Diagram"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComponentConnection" ADD CONSTRAINT "ComponentConnection_fromId_fkey" FOREIGN KEY ("fromId") REFERENCES "Component"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComponentConnection" ADD CONSTRAINT "ComponentConnection_toId_fkey" FOREIGN KEY ("toId") REFERENCES "Component"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FailureMode" ADD CONSTRAINT "FailureMode_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "Component"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestProcedure" ADD CONSTRAINT "TestProcedure_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "Component"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Analysis" ADD CONSTRAINT "Analysis_diagramId_fkey" FOREIGN KEY ("diagramId") REFERENCES "Diagram"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Analysis" ADD CONSTRAINT "Analysis_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Measurement" ADD CONSTRAINT "Measurement_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "Analysis"("id") ON DELETE SET NULL ON UPDATE CASCADE;

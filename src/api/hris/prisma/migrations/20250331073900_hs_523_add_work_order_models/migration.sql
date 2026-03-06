-- CreateEnum
CREATE TYPE "WorkOrderStatus" AS ENUM ('COMPLETED', 'IN_PROGRESS', 'ON_HOLD', 'CANCELLED', 'CREATED');

-- CreateEnum
CREATE TYPE "WorkOrderChangeType" AS ENUM ('CREATED', 'UPDATED', 'STATUS_CHANGED', 'COMMENT_ADDED', 'ATTACHMENT_ADDED');

-- CreateTable
CREATE TABLE "WorkOrder" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "status" "WorkOrderStatus" NOT NULL DEFAULT 'CREATED',
    "costEstimate" TEXT NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "locationId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "assigneeIds" TEXT[],
    "creatorId" TEXT NOT NULL,

    CONSTRAINT "WorkOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkOrderChangelog" (
    "id" TEXT NOT NULL,
    "type" "WorkOrderChangeType" NOT NULL,
    "description" TEXT,
    "attachment" TEXT,
    "creatorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorkOrderChangelog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EquipmentChangelog" (
    "id" TEXT NOT NULL,
    "previousState" JSONB NOT NULL,
    "currentState" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actorId" TEXT NOT NULL,

    CONSTRAINT "EquipmentChangelog_pkey" PRIMARY KEY ("id")
);

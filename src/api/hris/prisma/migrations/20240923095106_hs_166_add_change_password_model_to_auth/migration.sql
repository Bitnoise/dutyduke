-- CreateTable
CREATE TABLE "ChangePasswordRequest" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailHash" TEXT,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChangePasswordRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ChangePasswordRequest_email_key" ON "ChangePasswordRequest"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ChangePasswordRequest_emailHash_key" ON "ChangePasswordRequest"("emailHash");

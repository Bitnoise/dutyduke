-- CreateEnum
CREATE TYPE "FeedbackType" AS ENUM ('buddy', 'terminal', 'other', 'external');

-- CreateEnum
CREATE TYPE "FeedbackScoreType" AS ENUM ('neutral', 'positive', 'negative');

-- CreateTable
CREATE TABLE "Feedback" (
    "id" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "hostId" TEXT NOT NULL,
    "plannedDay" TIMESTAMP(3) NOT NULL,
    "type" "FeedbackType" NOT NULL,
    "noteBefore" TEXT,
    "noteForPerson" TEXT,
    "notes" TEXT,
    "feedbackScore" "FeedbackScoreType",
    "clientFeedback" TEXT,
    "internalFeedback" TEXT,
    "isDone" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeedbackParticipant" (
    "id" TEXT NOT NULL,
    "feedbackId" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,

    CONSTRAINT "FeedbackParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeedbackDocument" (
    "id" TEXT NOT NULL,
    "feedbackId" TEXT NOT NULL,
    "uri" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FeedbackDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExternalSurvey" (
    "id" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "hostId" TEXT NOT NULL,
    "plannedDay" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expirationDate" TIMESTAMP(3) NOT NULL,
    "url" TEXT NOT NULL,
    "type" "FeedbackType" NOT NULL DEFAULT 'external',
    "externalHostFirstName" TEXT NOT NULL,
    "externalHostLastName" TEXT NOT NULL,
    "externalHostPosition" TEXT NOT NULL,
    "externalCompanyName" TEXT NOT NULL,
    "isDone" BOOLEAN NOT NULL DEFAULT false,
    "isExpired" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExternalSurvey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExternalFeedback" (
    "id" TEXT NOT NULL,
    "externalSurveyId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExternalFeedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExternalFeedbackQuestion" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "order" SERIAL NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExternalFeedbackQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExternalFeedbackQuestionRelation" (
    "id" TEXT NOT NULL,
    "externalFeedbackId" TEXT NOT NULL,
    "externalFeedbackQuestionId" TEXT NOT NULL,

    CONSTRAINT "ExternalFeedbackQuestionRelation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExternalFeedbackAnswer" (
    "id" TEXT NOT NULL,
    "externalFeedbackQuestionId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "externalFeedbackId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExternalFeedbackAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FeedbackParticipant_feedbackId_employeeId_key" ON "FeedbackParticipant"("feedbackId", "employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "ExternalFeedback_externalSurveyId_key" ON "ExternalFeedback"("externalSurveyId");

-- CreateIndex
CREATE UNIQUE INDEX "ExternalFeedbackQuestionRelation_externalFeedbackId_externa_key" ON "ExternalFeedbackQuestionRelation"("externalFeedbackId", "externalFeedbackQuestionId");

-- CreateIndex
CREATE INDEX "ExternalFeedbackAnswer_externalFeedbackId_idx" ON "ExternalFeedbackAnswer"("externalFeedbackId");

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeedbackParticipant" ADD CONSTRAINT "FeedbackParticipant_feedbackId_fkey" FOREIGN KEY ("feedbackId") REFERENCES "Feedback"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeedbackParticipant" ADD CONSTRAINT "FeedbackParticipant_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeedbackDocument" ADD CONSTRAINT "FeedbackDocument_feedbackId_fkey" FOREIGN KEY ("feedbackId") REFERENCES "Feedback"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExternalSurvey" ADD CONSTRAINT "ExternalSurvey_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExternalSurvey" ADD CONSTRAINT "ExternalSurvey_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExternalFeedback" ADD CONSTRAINT "ExternalFeedback_externalSurveyId_fkey" FOREIGN KEY ("externalSurveyId") REFERENCES "ExternalSurvey"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExternalFeedbackQuestionRelation" ADD CONSTRAINT "ExternalFeedbackQuestionRelation_externalFeedbackId_fkey" FOREIGN KEY ("externalFeedbackId") REFERENCES "ExternalFeedback"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExternalFeedbackQuestionRelation" ADD CONSTRAINT "ExternalFeedbackQuestionRelation_externalFeedbackQuestionI_fkey" FOREIGN KEY ("externalFeedbackQuestionId") REFERENCES "ExternalFeedbackQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExternalFeedbackAnswer" ADD CONSTRAINT "ExternalFeedbackAnswer_externalFeedbackQuestionId_fkey" FOREIGN KEY ("externalFeedbackQuestionId") REFERENCES "ExternalFeedbackQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExternalFeedbackAnswer" ADD CONSTRAINT "ExternalFeedbackAnswer_externalFeedbackId_fkey" FOREIGN KEY ("externalFeedbackId") REFERENCES "ExternalFeedback"("id") ON DELETE CASCADE ON UPDATE CASCADE;

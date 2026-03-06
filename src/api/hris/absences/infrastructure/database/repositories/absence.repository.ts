import { AbsenceStatus, type OrganizationPrismaClient } from '@/api/hris/prisma/client';
import { type CUID } from '@/api/hris/types';
import { type AbsenceRepository } from '../../../model/repositories/absence.repository';
import { type AbsenceDTO, type RequestAbsenceDTO } from '../../../model/dtos/absence.dto';

export function absenceRepository(db: OrganizationPrismaClient): AbsenceRepository {
  const requestAbsence = async (absence: RequestAbsenceDTO, days: number, recipientIds: CUID[]) => {
    const created = await db.absence.create({
      data: { ...absence, recipientIds, days },
    });
    return created.id;
  };

  const approveAbsence = async (absenceId: CUID, reviewerId: CUID) => {
    await db.absence.updateMany({
      where: { id: absenceId },
      data: { status: AbsenceStatus.APPROVED, reviewerId, approvedAt: new Date(), rejectedAt: null },
    });
  };
  const rejectAbsence = async (absenceId: CUID, reviewerId: CUID) => {
    await db.absence.updateMany({
      where: { id: absenceId },
      data: { status: AbsenceStatus.REJECTED, reviewerId, rejectedAt: new Date(), approvedAt: null },
    });
  };

  const deleteAbsence = async (absenceIds?: CUID[]) => {
    const whereInput = absenceIds ? { id: { in: absenceIds } } : undefined;

    await db.absence.deleteMany({ where: whereInput });
  };

  const getAbsenceById = async (id: CUID): Promise<AbsenceDTO | null> => {
    const absence = await db.absence.findUnique({ where: { id } });
    return absence ?? null;
  };

  return {
    getAbsenceById,
    requestAbsence,
    approveAbsence,
    rejectAbsence,
    deleteAbsence,
  };
}

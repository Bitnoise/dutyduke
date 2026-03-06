import { type CUID } from '@/shared';
import { type AbsenceDTO, type RequestAbsenceDTO } from '../dtos/absence.dto';

export type AbsenceRepository = {
  getAbsenceById(id: CUID): Promise<AbsenceDTO | null>;
  requestAbsence(absence: RequestAbsenceDTO, days: number, recipientIds: CUID[]): Promise<CUID>;
  approveAbsence(absenceId: CUID, reviewerId: CUID): Promise<void>;
  rejectAbsence(absenceId: CUID, reviewerId: CUID): Promise<void>;
  deleteAbsence(absenceIds?: CUID[]): Promise<void>;
};

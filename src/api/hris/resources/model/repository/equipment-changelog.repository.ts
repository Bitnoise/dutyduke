import { type CUID } from '@/shared';

export type EquipmentChangelogRepository = {
  createLog(actorId: CUID, previousState: string, currentState: string): Promise<void>;
};

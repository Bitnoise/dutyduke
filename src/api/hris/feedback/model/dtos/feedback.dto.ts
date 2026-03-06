import { type FeedbackType, type FeedbackScoreType } from '@/api/hris/prisma/client';
import { type WithId, type WithoutId, type CUID, type Nullable } from '@/shared';

export type FeedbackDto = WithId<{
  personId: CUID;
  hostId: CUID;
  plannedDay: Date;
  type: FeedbackType;
  noteBefore: Nullable<string>;
  noteForPerson: Nullable<string>;
  notes: Nullable<string>;
  feedbackScore: Nullable<FeedbackScoreType>;
  clientFeedback: Nullable<string>;
  internalFeedback: Nullable<string>;
  isDone: Nullable<boolean>;
  participantIds: CUID[];
  createdAt: Date;
  updatedAt: Date;
}>;

export type BaseFeedbackDto = Pick<
  FeedbackDto,
  'id' | 'personId' | 'hostId' | 'plannedDay' | 'type' | 'isDone' | 'createdAt' | 'updatedAt'
>;

export type CreateFeedbackDto = Pick<FeedbackDto, 'personId' | 'hostId' | 'plannedDay' | 'type'> &
  Partial<
    Pick<
      FeedbackDto,
      | 'noteBefore'
      | 'noteForPerson'
      | 'notes'
      | 'feedbackScore'
      | 'clientFeedback'
      | 'internalFeedback'
      | 'isDone'
    >
  > & {
    participantIds?: CUID[];
  };

export type UpdateFeedbackDto = Partial<
  Omit<WithoutId<FeedbackDto>, 'personId' | 'createdAt' | 'updatedAt'>
> & {
  participantIds?: CUID[];
};

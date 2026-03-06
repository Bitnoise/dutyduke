'use client';

import { useTranslations } from '@/shared/service/locale/use-translations';
import { Modal, ModalHeader, Button, Icon } from '@/lib/ui';
import { parseDate } from '@/shared';

type FeedbackStatus = 'scheduled' | 'approaching' | 'overdue' | 'neutral' | null;
type FeedbackType = 'buddy' | 'terminal' | 'other' | 'external';

export type FeedbackDetails = {
  id: string;
  date: Date;
  status: FeedbackStatus;
  type: FeedbackType;
  facilitators: string[];
  participants?: string[];
  isDone?: boolean;
  internalFeedback?: string;
  clientFeedback?: string;
  notes?: string;
  noteBefore?: string;
  noteForPerson?: string;
  attachments?: Array<{ id: string; uri: string; name: string }>;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  feedback: FeedbackDetails;
  dateFormat: string;
  onEdit?: () => void;
};

export function FeedbackDetailsModal({ isOpen, onClose, feedback, dateFormat, onEdit }: Props) {
  const t = useTranslations();

  const {
    date,
    type,
    facilitators,
    participants = [],
    isDone = false,
    internalFeedback,
    clientFeedback,
    notes,
    noteBefore,
    noteForPerson,
    attachments = [],
  } = feedback;

  const facilitatorText = facilitators.join(', ');
  const participantsText = participants.length > 0 ? participants.join(', ') : facilitators.join(', ');

  return (
    <Modal className="md:max-w-[50rem]" isOpen={isOpen}>
      <ModalHeader title={t('employees.feedback.details.title')} onClose={onClose} />

      <div className="mt-4 space-y-6">
        {/* Key Information Section */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <span className="text-sm text-dark-grey">{t('employees.feedback.details.feedbackType')}: </span>
            <span className="text-sm font-semibold">{t(`employees.feedback.type.${type}`)}</span>
          </div>
          <div>
            <span className="text-sm text-dark-grey">
              {t('employees.feedback.details.feedbackConducted')}:{' '}
            </span>
            <span className="text-sm font-semibold">{isDone ? t('ctaLabels.yes') : t('ctaLabels.no')}</span>
          </div>
          <div>
            <span className="text-sm text-dark-grey">{t('employees.feedback.details.date')}: </span>
            <span className="text-sm font-semibold">{parseDate(date, dateFormat)}</span>
          </div>
          <div>
            <span className="text-sm text-dark-grey">{t('employees.feedback.details.participants')}: </span>
            <span className="text-sm font-semibold">{participantsText}</span>
          </div>
          <div>
            <span className="text-sm text-dark-grey">{t('employees.feedback.facilitator')}: </span>
            <span className="text-sm font-semibold">{facilitatorText}</span>
          </div>
        </div>

        {/* Textual Feedback Sections */}
        {internalFeedback && (
          <div>
            <h3 className="mb-2 text-sm font-semibold">{t('employees.feedback.details.internalFeedback')}</h3>
            <p className="whitespace-pre-wrap text-sm text-dark-grey">{internalFeedback}</p>
          </div>
        )}

        {clientFeedback && (
          <div>
            <h3 className="mb-2 text-sm font-semibold">{t('employees.feedback.details.clientFeedback')}</h3>
            <p className="whitespace-pre-wrap text-sm text-dark-grey">{clientFeedback}</p>
          </div>
        )}

        {notes && (
          <div>
            <h3 className="mb-2 text-sm font-semibold">{t('employees.feedback.details.postMeetingNote')}</h3>
            <p className="whitespace-pre-wrap text-sm text-dark-grey">{notes}</p>
          </div>
        )}

        {noteBefore && (
          <div>
            <h3 className="mb-2 text-sm font-semibold">{t('employees.feedback.details.note')}</h3>
            <p className="whitespace-pre-wrap text-sm text-dark-grey">{noteBefore}</p>
          </div>
        )}

        {noteForPerson && (
          <div>
            <h3 className="mb-2 text-sm font-semibold">{t('employees.feedback.details.notesForEmployee')}</h3>
            <p className="mb-2 text-sm font-bold text-red-600">
              {t('employees.feedback.details.attentionWarning')}
            </p>
            <p className="whitespace-pre-wrap text-sm text-dark-grey">{noteForPerson}</p>
          </div>
        )}

        {/* Attachments Section */}
        {attachments.length > 0 && (
          <div>
            <h3 className="mb-2 text-sm font-semibold">{t('employees.feedback.details.attachments')}:</h3>
            <ul className="space-y-2">
              {attachments.map((attachment) => (
                <li key={attachment.id} className="flex items-center gap-2">
                  <Icon className="text-dark-grey" name="document-text" size="sm" />
                  <span className="text-sm text-dark-grey">{attachment.name}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Footer Action Buttons */}
      <div className="mt-6 flex justify-end gap-4">
        {onEdit && (
          <Button icon="edit-2" intent="secondary" onClick={onEdit}>
            {t('ctaLabels.edit')}
          </Button>
        )}
        <Button icon="close" intent="secondary" onClick={onClose}>
          {t('ctaLabels.close')}
        </Button>
      </div>
    </Modal>
  );
}

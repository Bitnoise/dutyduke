'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useTranslations } from '@/shared/service/locale/use-translations';
import { cn, parseDate, type CUID } from '@/shared';
import { Button } from '@/lib/ui/components/button';
import { Chip } from '@/lib/ui/components/chip';
import { DeleteModal } from '@/lib/ui/components/modal';
import { useModal } from '@/lib/ui/hooks/useModal';
import { getFeedbackDetailsAction } from '../_actions/get-feedback-details.action';
import { deleteFeedbackAction } from '../_actions/delete-feedback.action';
import { FeedbackDetailsModal, type FeedbackDetails } from './feedback-details-modal';
import { type MockedFeedback } from './feedback-timeline';

type FeedbackStatus = 'scheduled' | 'approaching' | 'overdue' | 'neutral' | null;

type Props = {
  data: MockedFeedback;
  employeeId: CUID;
  index: number;
  first: boolean;
  last: boolean;
  isEditable: boolean;
  dateFormat: string;
};

function getStatusChipIntent(status: FeedbackStatus): 'ok' | 'warning' | 'critical' | 'info' | null {
  switch (status) {
    case 'scheduled':
      return null; // Custom styled badge
    case 'approaching':
      return 'warning';
    case 'overdue':
      return 'critical';
    case 'neutral':
      return 'info';
    default:
      return null;
  }
}

function getDotColor(status: FeedbackStatus, first: boolean): string {
  if (first) return 'bg-accent';

  switch (status) {
    case 'scheduled':
      return 'bg-gray-300';
    case 'approaching':
      return 'bg-[var(--color-orange-800)]';
    case 'overdue':
      return 'bg-[var(--color-red-900)]';
    case 'neutral':
      return 'bg-[var(--color-blue-800)]';
    default:
      return 'bg-[var(--color-blue-800)]';
  }
}

function getDotBorder(status: FeedbackStatus): string {
  if (status === 'scheduled') {
    return 'border-dashed border-2 border-gray-400';
  }
  return 'border border-gray-300';
}

function StatusBadge({ status }: { status: FeedbackStatus }) {
  const t = useTranslations();

  if (!status) return null;

  if (status === 'scheduled') {
    return (
      <span className="rounded-[1.1875rem] border border-dashed border-gray-400 bg-gray-100 px-1 py-px text-xs text-gray-600">
        {t(`employees.feedback.status.${status}`)}
      </span>
    );
  }

  const intent = getStatusChipIntent(status);
  if (!intent) return null;

  return <Chip intent={intent}>{t(`employees.feedback.status.${status}`)}</Chip>;
}

export function FeedbackTimelineItem({
  data,
  employeeId,
  index: _index,
  first,
  last,
  isEditable,
  dateFormat,
}: Props) {
  const t = useTranslations();
  const router = useRouter();
  const { isOpen, openModal, closeModal, payload } = useModal<FeedbackDetails>();
  const { isOpen: isDeleteModalOpen, openModal: openDeleteModal, closeModal: closeDeleteModal } = useModal();

  const { date, status, type, facilitators, id } = data;

  const dotClassNames = cn(
    'absolute left-1/2 top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full',
    getDotColor(status, first),
  );

  const borderClassNames = cn('relative mt-1 size-5 rounded-full', getDotBorder(status));

  const facilitatorsText = facilitators.join(' | ');
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleViewFeedback = async () => {
    setIsLoadingDetails(true);
    try {
      // Fetch full feedback details including participants and documents
      const feedbackDetails = await getFeedbackDetailsAction(data.id);

      if (feedbackDetails) {
        openModal(feedbackDetails);
      } else {
        // Fallback to using data from props if fetch fails
        const fallbackDetails: FeedbackDetails = {
          id: data.id,
          date: data.date,
          status: data.status,
          type: data.type,
          facilitators: data.facilitators,
          participants: data.participants || [],
          isDone: data.isDone ?? false,
          internalFeedback: data.internalFeedback || undefined,
          clientFeedback: data.clientFeedback || undefined,
          notes: data.notes || undefined,
          noteBefore: data.noteBefore || undefined,
          noteForPerson: data.noteForPerson || undefined,
          attachments: data.attachments || [],
        };
        openModal(fallbackDetails);
      }
    } catch (_error) {
      // Fallback to using data from props on error
      const fallbackDetails: FeedbackDetails = {
        id: data.id,
        date: data.date,
        status: data.status,
        type: data.type,
        facilitators: data.facilitators,
        participants: data.participants || [],
        isDone: data.isDone ?? false,
        internalFeedback: data.internalFeedback || undefined,
        clientFeedback: data.clientFeedback || undefined,
        notes: data.notes || undefined,
        noteBefore: data.noteBefore || undefined,
        noteForPerson: data.noteForPerson || undefined,
        attachments: data.attachments || [],
      };
      openModal(fallbackDetails);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const handleDeleteFeedback = async () => {
    setIsDeleting(true);
    try {
      await deleteFeedbackAction(id, employeeId);
      closeDeleteModal();
      // The page will be revalidated by the server action, so we can just close the modal
    } catch (_error) {
      // Error is already logged in the action
      // If deletion fails, the feedback will still be visible in the list
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="group mb-2 flex flex-row group-hover:opacity-100">
        <div className="mr-3 mt-2 text-grey">
          <div className={borderClassNames}>
            <span className={dotClassNames} />
          </div>
          {!last && <div className="m-auto min-h-full w-px bg-grey" />}
        </div>
        <div className="group flex w-full items-center justify-between gap-4 rounded-md p-2 hover:bg-light-ice-blue">
          <div className="flex-1">
            <div className="flex flex-row flex-wrap items-baseline gap-2 text-xs tracking-wider">
              <div className="font-semibold">{parseDate(date, dateFormat)}</div>
              <StatusBadge status={status} />
            </div>
            <div className="mt-2 text-xs font-normal text-dark-grey">
              <div className="text-base font-semibold text-black">{t(`employees.feedback.type.${type}`)}</div>
              {t('employees.feedback.facilitator')}: {facilitatorsText}
            </div>
          </div>
          {isEditable && (
            <div className="flex shrink-0 gap-2 opacity-0 transition-opacity group-hover:opacity-100">
              <Button
                icon="eye"
                intent="tertiary"
                isDisabled={isLoadingDetails}
                size="sm"
                onClick={handleViewFeedback}
              />
              <Button
                icon="edit-2"
                intent="tertiary"
                size="sm"
                onClick={() => {
                  router.push(`/employees/${employeeId}/feedback/${id}/edit`);
                }}
              />
              <Button
                icon="trash"
                intent="tertiary"
                isDisabled={isDeleting}
                size="sm"
                onClick={openDeleteModal}
              />
            </div>
          )}
        </div>
      </div>
      {isOpen && payload && (
        <FeedbackDetailsModal
          dateFormat={dateFormat}
          feedback={payload}
          isOpen={isOpen}
          onClose={closeModal}
          onEdit={() => {
            closeModal();
            router.push(`/employees/${employeeId}/feedback/${id}/edit`);
          }}
        />
      )}
      <DeleteModal isOpen={isDeleteModalOpen} onClose={closeDeleteModal} onOk={handleDeleteFeedback} />
    </>
  );
}

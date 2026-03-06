import { ApiError, type CUID } from '@/shared';
import { privateRoute, requirePermission, type PermissionChecker } from '@/api/hris/authorization';
import { ResourceType, PermissionAction, PermissionScope } from '@/api/hris/authorization/permissions';
import {
  type CreateFeedbackDto,
  type FeedbackDto,
  type UpdateFeedbackDto,
} from '@/api/hris/feedback/model/dtos';
import { feedbackRepository } from '@/api/hris/feedback/infrastructure/database/repositories';
import { feedbackQueries } from '@/api/hris/feedback/infrastructure/database/queries';
import {
  createFeedbackUseCase,
  deleteFeedbackUseCase,
  updateFeedbackUseCase,
} from '@/api/hris/feedback/model/use-cases';
import { type OrganizationContext } from '@/api/hris';
import { FEEDBACK_ERROR_MESSAGES } from '@/api/hris/feedback/errors';
import { employeeQueries } from '@/api/hris/employees/infrastructure/database/queries';

export type FeedbackController = {
  createFeedback: (feedback: CreateFeedbackDto) => Promise<CUID>;
  getFeedbackById: (feedbackId: CUID) => Promise<FeedbackDto>;
  getFeedbacksByPersonId: (personId: CUID) => Promise<FeedbackDto[]>;
  getFeedbacksByHostId: (hostId: CUID) => Promise<FeedbackDto[]>;
  updateFeedback: (feedbackId: CUID, feedback: UpdateFeedbackDto) => Promise<void>;
  deleteFeedback: (feedbackId: CUID) => Promise<void>;
};

export function feedbackController(organizationContext: OrganizationContext): FeedbackController {
  const feedbackRepositoryInstance = feedbackRepository(organizationContext.db);
  const feedbackQueriesInstance = feedbackQueries(organizationContext.db);
  const employeeQueriesImpl = employeeQueries(organizationContext);

  const createFeedback = async (checker: PermissionChecker, feedback: CreateFeedbackDto): Promise<CUID> => {
    // Check if user can create feedback
    const canCreate = checker.can(ResourceType.EMPLOYEE_FEEDBACK, PermissionAction.CREATE);
    const scope = checker.getScope(ResourceType.EMPLOYEE_FEEDBACK);

    if (!canCreate) {
      throw new ApiError(403, 'Forbidden: No permission to create feedback');
    }

    // If scope is SELF, verify this is for the current user's employee record
    if (scope === PermissionScope.SELF) {
      const currentEmployee = await employeeQueriesImpl.getEmployeeByIdentityId(checker.getIdentityId());
      if (!currentEmployee || currentEmployee.id !== feedback.personId) {
        throw new ApiError(403, 'Forbidden: Can only create feedback for own employee record');
      }
    }

    return createFeedbackUseCase(feedbackRepositoryInstance)(feedback);
  };

  const getFeedbackById = async (checker: PermissionChecker, feedbackId: CUID): Promise<FeedbackDto> => {
    // Check if user can view feedback
    const canView = checker.can(ResourceType.EMPLOYEE_FEEDBACK, PermissionAction.VIEW);
    const scope = checker.getScope(ResourceType.EMPLOYEE_FEEDBACK);

    if (!canView) {
      throw new ApiError(403, 'Forbidden: No permission to view feedback');
    }

    const feedback = await feedbackQueriesInstance.getFeedbackById(feedbackId);

    if (!feedback) {
      throw new ApiError(404, FEEDBACK_ERROR_MESSAGES.NOT_FOUND(feedbackId));
    }

    // If scope is SELF, verify this feedback belongs to the current user's employee record
    if (scope === PermissionScope.SELF) {
      const currentEmployee = await employeeQueriesImpl.getEmployeeByIdentityId(checker.getIdentityId());
      if (!currentEmployee || currentEmployee.id !== feedback.personId) {
        throw new ApiError(403, 'Forbidden: Can only view own feedback');
      }
    }

    return feedback;
  };

  const getFeedbacksByPersonId = async (
    checker: PermissionChecker,
    personId: CUID,
  ): Promise<FeedbackDto[]> => {
    // Check if user can view feedback
    const canView = checker.can(ResourceType.EMPLOYEE_FEEDBACK, PermissionAction.VIEW);
    const scope = checker.getScope(ResourceType.EMPLOYEE_FEEDBACK);

    if (!canView) {
      throw new ApiError(403, 'Forbidden: No permission to view feedback');
    }

    // If scope is SELF, verify this is the current user's employee record
    if (scope === PermissionScope.SELF) {
      const currentEmployee = await employeeQueriesImpl.getEmployeeByIdentityId(checker.getIdentityId());
      if (!currentEmployee || currentEmployee.id !== personId) {
        throw new ApiError(403, 'Forbidden: Can only view own feedback');
      }
    }

    return feedbackQueriesInstance.getFeedbacksByPersonId(personId);
  };

  const getFeedbacksByHostId = async (checker: PermissionChecker, hostId: CUID): Promise<FeedbackDto[]> => {
    // Check if user can view feedback
    const canView = checker.can(ResourceType.EMPLOYEE_FEEDBACK, PermissionAction.VIEW);
    const scope = checker.getScope(ResourceType.EMPLOYEE_FEEDBACK);

    if (!canView) {
      throw new ApiError(403, 'Forbidden: No permission to view feedback');
    }

    // If scope is SELF, verify this is the current user's employee record
    if (scope === PermissionScope.SELF) {
      const currentEmployee = await employeeQueriesImpl.getEmployeeByIdentityId(checker.getIdentityId());
      if (!currentEmployee || currentEmployee.id !== hostId) {
        throw new ApiError(403, 'Forbidden: Can only view feedbacks hosted by own employee record');
      }
    }

    return feedbackQueriesInstance.getFeedbacksByHostId(hostId);
  };

  const updateFeedback = async (
    checker: PermissionChecker,
    feedbackId: CUID,
    feedback: UpdateFeedbackDto,
  ): Promise<void> => {
    // Check if user can edit feedback
    const canEdit = checker.can(ResourceType.EMPLOYEE_FEEDBACK, PermissionAction.EDIT);
    const scope = checker.getScope(ResourceType.EMPLOYEE_FEEDBACK);

    if (!canEdit) {
      throw new ApiError(403, 'Forbidden: No permission to edit feedback');
    }

    // Verify feedback exists before update
    const existingFeedback = await feedbackQueriesInstance.getFeedbackById(feedbackId);
    if (!existingFeedback) {
      throw new ApiError(404, FEEDBACK_ERROR_MESSAGES.NOT_FOUND(feedbackId));
    }

    // If scope is SELF, verify this feedback belongs to the current user's employee record
    if (scope === PermissionScope.SELF) {
      const currentEmployee = await employeeQueriesImpl.getEmployeeByIdentityId(checker.getIdentityId());
      if (!currentEmployee || currentEmployee.id !== existingFeedback.personId) {
        throw new ApiError(403, 'Forbidden: Can only edit feedback for own employee record');
      }
    }

    return updateFeedbackUseCase(feedbackRepositoryInstance)(feedbackId, feedback);
  };

  const deleteFeedback = async (checker: PermissionChecker, feedbackId: CUID): Promise<void> => {
    // Check if user can delete feedback
    const canDelete = checker.can(ResourceType.EMPLOYEE_FEEDBACK, PermissionAction.DELETE);
    const scope = checker.getScope(ResourceType.EMPLOYEE_FEEDBACK);

    if (!canDelete) {
      throw new ApiError(403, 'Forbidden: No permission to delete feedback');
    }

    // Verify feedback exists before deletion
    const feedback = await feedbackQueriesInstance.getFeedbackById(feedbackId);
    if (!feedback) {
      throw new ApiError(404, FEEDBACK_ERROR_MESSAGES.NOT_FOUND(feedbackId));
    }

    // If scope is SELF, verify this feedback belongs to the current user's employee record
    if (scope === PermissionScope.SELF) {
      const currentEmployee = await employeeQueriesImpl.getEmployeeByIdentityId(checker.getIdentityId());
      if (!currentEmployee || currentEmployee.id !== feedback.personId) {
        throw new ApiError(403, 'Forbidden: Can only delete feedback for own employee record');
      }
    }

    return deleteFeedbackUseCase(feedbackRepositoryInstance)(feedbackId);
  };

  return {
    createFeedback: requirePermission(
      ResourceType.EMPLOYEE_FEEDBACK,
      PermissionAction.CREATE,
      createFeedback,
    ),
    getFeedbackById: privateRoute(getFeedbackById),
    getFeedbacksByPersonId: privateRoute(getFeedbacksByPersonId),
    getFeedbacksByHostId: privateRoute(getFeedbacksByHostId),
    updateFeedback: requirePermission(ResourceType.EMPLOYEE_FEEDBACK, PermissionAction.EDIT, updateFeedback),
    deleteFeedback: requirePermission(
      ResourceType.EMPLOYEE_FEEDBACK,
      PermissionAction.DELETE,
      deleteFeedback,
    ),
  };
}

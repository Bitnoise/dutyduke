import { type Toast } from '@/lib/ui/components/toasts/types';

type EmployeeGeneralToastKey =
  | 'BASIC_INFO_UPDATE'
  | 'CONTACT_INFO_UPDATE'
  | 'PARTNERSHIP_INFO_UPDATE'
  | 'OTHER_INFO_UPDATE'
  | 'CREATE'
  | 'USER_LIMIT_EXCEEDED';

export const EMPLOYEE_GENERAL_TOASTS: Record<EmployeeGeneralToastKey, Toast> = {
  CREATE: { label: 'employees.create.success', intent: 'success' },
  USER_LIMIT_EXCEEDED: { label: 'employees.create.userLimitExceeded', intent: 'error' },
  BASIC_INFO_UPDATE: { label: 'employees.general.basicInfo.success', intent: 'success' },
  CONTACT_INFO_UPDATE: { label: 'employees.general.contactInfo.success', intent: 'success' },
  PARTNERSHIP_INFO_UPDATE: { label: 'employees.general.partnershipInfo.success', intent: 'success' },
  OTHER_INFO_UPDATE: { label: 'employees.general.otherInfo.success', intent: 'success' },
};

type CompanyGeneralToastKey = 'BASIC_INFO_UPDATE';

export const COMPANY_GENERAL_TOASTS: Record<CompanyGeneralToastKey, Toast> = {
  BASIC_INFO_UPDATE: { label: 'company.basicInfo.success', intent: 'success' },
};

type EaringsToastKey = 'UPDATE' | 'EDIT' | 'DELETE';

export const EARNINGS_TOASTS: Record<EaringsToastKey, Toast> = {
  UPDATE: { label: 'employees.earnings.update.success', intent: 'success' },
  DELETE: { label: 'employees.earnings.delete.success', intent: 'success' },
  EDIT: { label: 'employees.earnings.edit.success', intent: 'success' },
};

type SkillsKey =
  | 'UPDATE_CAREER_DEVELOPMENT'
  | 'UPDATE_EDUCATION'
  | 'UPDATE_SKILLS'
  | 'UPDATE_BASIC_INFO'
  | 'ADD_PROJECT'
  | 'UPDATE_PROJECT'
  | 'DELETE_PROJECT'
  | 'ADD_EMPLOYMENT_HISTORY'
  | 'UPDATE_EMPLOYMENT_HISTORY'
  | 'DELETE_EMPLOYMENT_HISTORY'
  | 'ADD_EDUCATION'
  | 'UPDATE_EDUCATION'
  | 'DELETE_EDUCATION'
  | 'ADD_COURSE'
  | 'UPDATE_COURSE'
  | 'DELETE_COURSE';

export const SKILLS_TOASTS: Record<SkillsKey, Toast> = {
  UPDATE_BASIC_INFO: {
    intent: 'success',
    label: 'employees.skills.updateBasicInfo.success',
  },
  UPDATE_CAREER_DEVELOPMENT: {
    intent: 'success',
    label: 'employees.skills.updateCareer.success',
  },

  UPDATE_SKILLS: {
    intent: 'success',
    label: 'employees.skills.updateSkills.success',
  },
  ADD_PROJECT: {
    intent: 'success',
    label: 'employees.skills.addProject.success',
  },
  UPDATE_PROJECT: {
    intent: 'success',
    label: 'employees.skills.updateProject.success',
  },
  DELETE_PROJECT: {
    intent: 'success',
    label: 'employees.skills.deleteProject.success',
  },
  ADD_EMPLOYMENT_HISTORY: {
    intent: 'success',
    label: 'employees.skills.addEmploymentHistory.success',
  },
  UPDATE_EMPLOYMENT_HISTORY: {
    intent: 'success',
    label: 'employees.skills.updateEmploymentHistory.success',
  },
  DELETE_EMPLOYMENT_HISTORY: {
    intent: 'success',
    label: 'employees.skills.deleteEmploymentHistory.success',
  },
  ADD_EDUCATION: {
    intent: 'success',
    label: 'employees.skills.addEducation.success',
  },
  UPDATE_EDUCATION: {
    intent: 'success',
    label: 'employees.skills.updateEducation.success',
  },
  DELETE_EDUCATION: {
    intent: 'success',
    label: 'employees.skills.deleteEducation.success',
  },
  ADD_COURSE: {
    intent: 'success',
    label: 'employees.skills.addCourse.success',
  },
  UPDATE_COURSE: {
    intent: 'success',
    label: 'employees.skills.updateCourse.success',
  },
  DELETE_COURSE: {
    intent: 'success',
    label: 'employees.skills.deleteCourse.success',
  },
};

type SettingsToastKey = 'UPDATE' | 'CHANGE_PASSWORD';

export const SETTINGS_TOASTS: Record<SettingsToastKey, Toast> = {
  UPDATE: { intent: 'success', label: 'settings.update.success' },
  CHANGE_PASSWORD: { intent: 'success', label: 'settings.update.changePassword.success' },
};

type EmployeeDocumentsToastKey = 'DELETE' | 'UPLOAD';

export const EMPLOYEE_DOCUMENTS_TOASTS: Record<EmployeeDocumentsToastKey, Toast> = {
  DELETE: { intent: 'success', label: 'employees.documents.delete.success' },
  UPLOAD: { intent: 'success', label: 'employees.documents.upload.success' },
};

type EquipmentToastKey = 'UPDATE' | 'ASSIGN';

export const EQUIPMENT_TOASTS: Record<EquipmentToastKey, Toast> = {
  UPDATE: { intent: 'success', label: 'equipment.update.success' },
  ASSIGN: { intent: 'success', label: 'equipment.assign.success' },
};

type EquipmentDocumentToastKey = 'DELETE' | 'UPLOAD';

export const EQUIPMENT_DOCUMENTS_TOASTS: Record<EquipmentDocumentToastKey, Toast> = {
  DELETE: { intent: 'success', label: 'equipment.documents.delete.success' },
  UPLOAD: { intent: 'success', label: 'equipment.documents.upload.success' },
};

type DictionaryToastKey = 'CREATE' | 'DELETE';

export const DICTIONARY_TOASTS: Record<DictionaryToastKey, Toast> = {
  CREATE: { intent: 'success', label: 'dictionaries.create.success' },
  DELETE: { intent: 'success', label: 'dictionaries.delete.success' },
};

type AbsenceToastKey = 'REQUEST' | 'APPROVE' | 'REJECT' | 'CREATE' | 'ADD' | 'DELETE' | 'COPY_TO_CLIPBOARD';

export const ABSENCE_TOASTS: Record<AbsenceToastKey, Toast> = {
  REQUEST: { intent: 'success', label: 'absence.request.success' },
  APPROVE: { intent: 'success', label: 'absence.approve.success' },
  REJECT: { intent: 'success', label: 'absence.reject.success' },
  CREATE: { intent: 'success', label: 'absence.create.success' },
  ADD: { intent: 'success', label: 'absence.settings.add.success' },
  DELETE: { intent: 'success', label: 'absence.settings.delete.success' },
  COPY_TO_CLIPBOARD: { intent: 'success', label: 'absence.ical.copyToClipboard' },
};

type DocumentCategoriesToastKey = 'CREATE' | 'DELETE';

export const DOCUMENTS_CATEGORY_TOASTS: Record<DocumentCategoriesToastKey, Toast> = {
  CREATE: { intent: 'success', label: 'documents.create.success' },
  DELETE: { intent: 'success', label: 'documents.delete.success' },
};

type FeedbackToastKey = 'UPDATE' | 'CREATE' | 'DELETE';

export const FEEDBACK_TOASTS: Record<FeedbackToastKey, Toast> = {
  UPDATE: { intent: 'success', label: 'employees.feedback.update.success' },
  CREATE: { intent: 'success', label: 'employees.feedback.create.success' },
  DELETE: { intent: 'success', label: 'employees.feedback.delete.success' },
};

type BenefitToastKey = 'DELETE' | 'UPDATE' | 'ASSIGN' | 'UNASSIGN';

export const BENEFIT_TOASTS: Record<BenefitToastKey, Toast> = {
  DELETE: { intent: 'success', label: 'company.benefits.delete.success' },
  UPDATE: { intent: 'success', label: 'company.benefits.update.success' },
  ASSIGN: { intent: 'success', label: 'company.benefits.assign.success' },
  UNASSIGN: { intent: 'success', label: 'employees.benefits.unassign.success' },
};

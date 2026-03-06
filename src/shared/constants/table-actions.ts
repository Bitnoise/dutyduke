import { type IconNames } from '@/lib/ui/icons';
import { type ButtonIntent, type ActionType } from '..';

export type Action = {
  id: ActionType;
  label: string;
  icon: IconNames;
  intent?: ButtonIntent;
};

export type TableAction = Record<ActionType, Action>;

export const ACTIONS: TableAction = {
  duplicate: {
    id: 'duplicate',
    label: 'duplicate',
    icon: 'copy',
  },
  edit: {
    id: 'edit',
    label: 'edit',
    icon: 'edit-2',
  },
  mail: {
    id: 'mail',
    label: 'mail',
    icon: 'mail',
  },
  activate: {
    id: 'activate',
    label: 'activate',
    icon: 'ok',
    intent: 'success',
  },
  delete: {
    id: 'delete',
    label: 'delete',
    icon: 'trash',
  },
  assign: {
    id: 'assign',
    label: 'assign',
    icon: 'link-individual',
  },
  unassign: {
    id: 'unassign',
    label: 'unassign',
    icon: 'unlink',
  },
  open: {
    id: 'open',
    label: 'open',
    icon: 'search-normal',
  },
  offboarding: {
    id: 'offboarding',
    label: 'offboarding',
    icon: 'offboarding',
  },
  'generate-cv': {
    id: 'generate-cv',
    label: 'generateCV',
    icon: 'document-employee',
  },
  create: {
    id: 'create',
    label: 'create',
    icon: 'add',
  },
  onboarding: {
    id: 'onboarding',
    label: 'onboarding',
    icon: 'checklist',
  },
  update: {
    id: 'update',
    label: 'update',
    icon: 'edit-2',
  },
  select: {
    id: 'select',
    label: '',
    icon: 'link',
  },
  filter: {
    id: 'select',
    label: '',
    icon: 'link',
  },
  archive: {
    id: 'archive',
    label: 'archive',
    icon: 'trash',
    intent: 'danger',
  },
  changeStatus: {
    id: 'changeStatus',
    label: 'changeStatus',
    icon: 'refresh',
  },
  changeAssignees: {
    id: 'changeAssignees',
    label: 'changeAssignees',
    icon: 'refresh',
  },
  changeDate: {
    id: 'changeDate',
    label: 'changeDate',
    icon: 'clock',
  },
  addFile: {
    id: 'addFile',
    label: 'addFile',
    icon: 'upload',
  },
  approve: {
    id: 'approve',
    label: 'approve',
    icon: 'ok',
  },
  reject: {
    id: 'reject',
    label: 'reject',
    icon: 'close',
  },
  cancel: {
    id: 'cancel',
    label: 'cancel',
    icon: 'trash',
    intent: 'danger',
  },
  print: {
    id: 'print',
    label: 'print',
    icon: 'link',
  },
  scheduleWork: {
    id: 'scheduleWork',
    label: 'scheduleWork',
    icon: 'calendar',
  },
};

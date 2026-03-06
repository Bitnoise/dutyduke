import { type CUID } from '@/shared';

export type PhotoListItemAction = 'download' | 'delete' | 'set-avatar';
export type Photo = { id: CUID; isAvatar: boolean } & ({ file: File } | { filePath: string });

import { persistentVolumeService } from './persistent-volume.service';

export type FilePersistenceType = 'persistent-volume';

export function filePersistenceFactory(type: FilePersistenceType) {
  switch (type) {
    case 'persistent-volume':
      return persistentVolumeService();
  }
}

'use client';

import { Fragment, useEffect, useRef, useState } from 'react';
import { createId } from '@paralleldrive/cuid2';
import { useParams, useRouter } from 'next/navigation';
import { PhotoUploadButton } from '@/lib/ui/components/photos-list/photo-upload-button';
import { PhotoListItem } from '@/lib/ui/components/photos-list/photo-list-item';
import { type Photo, type PhotoListItemAction } from '@/lib/ui/components/photos-list/types';
import { setEmployeeAvatar } from '@/app/(hris)/employees/[id]/general/_actions';

type Props = {
  items: Photo[];
  isEditable?: boolean;
};

export function PhotosList({ isEditable, items = [] }: Props): JSX.Element {
  const [photos, setPhotos] = useState<Photo[]>(() => items);
  const dataTransfer = useRef<DataTransfer | null>(null);

  useEffect(() => {
    dataTransfer.current = new DataTransfer();
  }, []);

  const params = useParams();
  const router = useRouter();

  const addPhoto = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.currentTarget;
    const filesList = target.files;

    if (!filesList || !dataTransfer.current) return;

    const filesArray = Array.from(filesList);
    const filesToUpload: Photo[] = [];

    for (const file of filesArray) {
      dataTransfer.current.items.add(file);

      filesToUpload.push({
        id: `temp--${createId()}`,
        file,
        isAvatar: false,
      });
    }

    target.files = dataTransfer.current.files;
    setPhotos((prev) => [...prev, ...filesToUpload]);
  };

  const deletePhoto = (photoId: string) => {
    const input = document.getElementById('UploadPhotoButton') as HTMLInputElement;

    if (!input) return;

    const { files } = input;

    if (!files || !dataTransfer.current) return;

    const fileToDelete = photos.find((file) => file.id === photoId);

    if (!fileToDelete) return;

    if ('file' in fileToDelete) {
      const fileToDeleteIndex = Array.from(dataTransfer.current.files).findIndex(
        (file) => file.name === fileToDelete.file.name && file.size === fileToDelete.file.size,
      );

      dataTransfer.current.items.remove(fileToDeleteIndex);

      input.files = dataTransfer.current.files; // Assign the updates list
    }

    setPhotos((prev) => prev.filter((photo) => photo.id !== fileToDelete.id));
  };

  const changeAvatar = async (photoId: string) => {
    await setEmployeeAvatar({
      employeeId: params.id as string,
      photoId,
    });
    router.refresh();
  };

  const photoItemsActions: PhotoListItemAction[] = isEditable ? ['delete'] : ['set-avatar', 'download'];

  return (
    <div className="flex items-center gap-x-5">
      {photos.length > 0 && (
        <>
          <ul className="flex gap-x-2.5">
            {photos.map((photo, index) =>
              'filePath' in photo ? (
                <Fragment key={photo.id}>
                  <input defaultValue={photo.id} name="old-photo" type="hidden" />
                  <PhotoListItem
                    actions={photoItemsActions}
                    alt={`photo ${index + 1}`}
                    id={photo.id}
                    isAvatar={photo.isAvatar}
                    isEditable={isEditable}
                    src={photo.filePath}
                    onAvatarChange={changeAvatar}
                    onDelete={deletePhoto}
                  />
                </Fragment>
              ) : (
                <PhotoListItem
                  key={photo.id}
                  actions={photoItemsActions}
                  alt={`photo ${index + 1}`}
                  id={photo.id}
                  isAvatar={photo.isAvatar}
                  isEditable={isEditable}
                  src={photo.file}
                  onAvatarChange={changeAvatar}
                  onDelete={deletePhoto}
                />
              ),
            )}
          </ul>
        </>
      )}
      {isEditable && <PhotoUploadButton id="UploadPhotoButton" name="photos" onChange={addPhoto} />}
    </div>
  );
}

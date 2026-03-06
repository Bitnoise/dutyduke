'use server';

import { revalidatePath } from 'next/cache';
import { hrisApi } from '@/api/hris';
import {
  type ChildrenError,
  type EditEmployeeOtherInfoState,
} from '@/app/(hris)/employees/[id]/general/_actions/types';
import {
  employeeOtherFormSchema,
  type EmployeeOtherForm,
} from '@/app/(hris)/employees/[id]/general/_schemas';
import { ERROR_MESSAGES, handleActionError, HRIS_ROUTES, MAX_FILE_SIZE } from '@/shared';

const getChildrenSchema = (formData: FormData) => {
  const childrenIds = formData.getAll('child-id') as string[];

  const children: EmployeeOtherForm['children'] = [];
  const errors: ChildrenError = {};

  for (const id of childrenIds) {
    const childName = formData.get(`child-${id}-name`) as string;
    const childBirthDate = formData.get(`child-${id}-birthDate`) as string;

    if (!childName) {
      errors[id] = { ...errors[id], name: [ERROR_MESSAGES.REQUIRED] };
    }

    if (!childBirthDate) {
      errors[id] = { ...errors[id], birthDate: [ERROR_MESSAGES.REQUIRED] };
    }

    children.push({
      id,
      name: childName,
      birthDate: childBirthDate,
    });
  }

  return [children, errors] as const;
};

const getPhotosSchema = (formData: FormData) => {
  const newPhotos = formData.getAll('photos');
  const oldPhotos = formData.getAll('old-photo') as string[];

  let employeePhotoError: string | undefined = '';

  const parsedPhotos = newPhotos
    .filter((photo) => !!(photo as File).size)
    .map((photo) => ({ file: photo as File }));

  parsedPhotos.forEach((photo) => {
    if (photo.file.size > MAX_FILE_SIZE) employeePhotoError = ERROR_MESSAGES.INVALID_PHOTO_SIZE;
  });

  const photos = [
    ...parsedPhotos,
    ...oldPhotos.map((id) => {
      return {
        id,
      };
    }),
  ];

  return [photos, employeePhotoError] as const;
};

export async function updateEmployeeOtherInfo(
  prevState: EditEmployeeOtherInfoState,
  formData: FormData,
): Promise<EditEmployeeOtherInfoState> {
  const [children, childrenErrors] = getChildrenSchema(formData);
  const [photos, photosError] = getPhotosSchema(formData);

  const form: EmployeeOtherForm = {
    hobbies: formData.get('hobbies') as string,
    children,
  };

  const otherInfo = employeeOtherFormSchema.safeParse(form);

  if (!otherInfo.success || photosError) {
    return {
      ...prevState,
      form: {
        ...prevState.form,
        ...form,
      },
      status: 'validation-error',
      errors: {
        ...otherInfo.error?.flatten().fieldErrors,
        employeePhoto: photosError,
        children: childrenErrors,
      },
    };
  }

  try {
    const api = hrisApi;

    await api.employees.updateEmployeeGeneralInfo(prevState.form.employeeId, otherInfo.data);
    await api.employees.updateEmployeePhotos(prevState.form.employeeId, photos);
  } catch (e) {
    return {
      ...prevState,
      form: {
        ...prevState.form,
        ...form,
      },
      ...handleActionError(e),
    };
  }

  revalidatePath(HRIS_ROUTES.employees.general.base(prevState.form.employeeId));

  return {
    ...prevState,
    status: 'success',
    data: undefined,
    form: { ...prevState.form, ...form },
  };
}

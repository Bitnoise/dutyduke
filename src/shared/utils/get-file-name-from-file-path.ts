import { truncate } from '@/shared';

type Options = {
  withExt: boolean;
  maxLength?: number;
};

export function getFileNameFromFilePath(
  filePath: string,
  options: Partial<Options> = {
    withExt: true,
  },
) {
  if (!filePath || !filePath.includes('/')) {
    throw new Error(`Invalid filePath provided: ${filePath}`);
  }

  const fileNameWithExt = filePath.split('/').pop()!;
  const fileNameWithoutExt = fileNameWithExt.split('.')[0]!;

  if (options.maxLength && fileNameWithoutExt.length > options.maxLength)
    return truncate(fileNameWithoutExt, options.maxLength);

  if (options.withExt) return fileNameWithExt;

  return fileNameWithoutExt;
}

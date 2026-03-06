import { type CUID } from '@/shared';

export type ErrorCallback = (err: unknown) => void;

export type FileUpload = {
  /**
   * Creates a place for organization to upload files
   * @param organizationId - which organization space to create
   * @param onError - on error callback
   * @returns boolean based on successful operation
   */
  init: (organizationId: CUID, onError?: ErrorCallback) => Promise<boolean>;

  /**
   * Uploads a file to an organization
   * @param organizationId - which organization to store a file to
   * @param file - file to upload
   * @param dirPath - path to where store the file
   * @param onError - on error callback
   * @returns path to a uploaded file
   */
  uploadFile: (
    organizationId: CUID,
    file: File,
    dirPath?: string,
    onError?: ErrorCallback,
  ) => Promise<string | null>;

  /**
   * Uploads a buffer to an organization
   * @param organizationId - which organization to store a file to
   * @param fileName - how uploaded buffer should be named
   * @param buffer - buffer to upload
   * @param dirPath - path to where store the file
   * @param onError - on error callback
   * @returns path to a uploaded file
   */
  uploadBuffer: (
    organizationId: CUID,
    fileName: string,
    buffer: Buffer,
    dirPath?: string,
    onError?: ErrorCallback,
  ) => Promise<string | null>;

  /**
   * Deletes a file to an organization
   * @param organizationId - which organization to delete a file from
   * @param fileName - fileName to search for
   * @param onError - on error callback
   * @returns boolean based on successful operation
   */
  deleteFile: (organizationId: CUID, fileName: string, onError?: ErrorCallback) => Promise<boolean>;

  /**
   * Deletes a file by given filepath
   * @param filePath - absolute path to a file
   * @param onError - on error callback
   * @returns boolean based on successful operation
   */
  deleteFileByFilePath: (filePath: string, onError?: ErrorCallback) => Promise<boolean>;

  /**
   * Returns found file
   * @param organizationId - which organization to get a file from
   * @param filePath - path to a file
   * @param onError - on error callback
   * @returns file buffer
   */
  getFile: (filePath: string, onError?: ErrorCallback) => Promise<Buffer | null>;

  /**
   * Gets all files uploaded by organization
   * @param organizationId - which organization to get files from
   * @param onError - on error callback
   * @returns array of file names
   */
  getAllFileNames: (organizationId: CUID, onError?: ErrorCallback) => Promise<string[]>;

  /**
   * Deletes a provided directory
   * @param organizationId - which organization to delete directory from
   * @param dirPath - path to directory
   * @param force - delete not empty directory
   * @param onError - error callback
   * @returns boolean based on successful operation
   */
  deleteDirectory: (
    organizationId: CUID,
    dirPath: string,
    force?: boolean,
    onError?: ErrorCallback,
  ) => Promise<boolean>;
};

/**
 * Encodes a filename for use in Content-Disposition HTTP header.
 * Handles non-ASCII characters using RFC 5987 format.
 *
 * @param fileName - The filename to encode
 * @returns The encoded filename string for Content-Disposition header
 *
 * @example
 * encodeFilenameForHeader('test.pdf') // 'filename="test.pdf"'
 * encodeFilenameForHeader('żółć.pdf') // 'filename="zolc.pdf"; filename*=UTF-8\'\'%C5%BC%C3%B3%C5%82%C4%87.pdf'
 */
export function encodeFilenameForHeader(fileName: string | undefined | null): string {
  if (!fileName) {
    return 'filename=""';
  }

  // Check if filename contains non-ASCII characters
  const hasNonAscii = /[^\x00-\x7F]/.test(fileName);

  if (!hasNonAscii) {
    // Simple ASCII filename - use standard format
    return `filename="${fileName}"`;
  }

  // For non-ASCII filenames, use RFC 5987 format
  // First, create an ASCII fallback by replacing non-ASCII characters
  // Extract extension to preserve it
  const lastDotIndex = fileName.lastIndexOf('.');
  const hasExtension = lastDotIndex > 0 && lastDotIndex < fileName.length - 1;
  const extension = hasExtension ? fileName.slice(lastDotIndex) : '';
  const nameWithoutExt = hasExtension ? fileName.slice(0, lastDotIndex) : fileName;

  const asciiName = nameWithoutExt
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^\x00-\x7F]/g, ''); // Remove remaining non-ASCII

  // Preserve extension in fallback, use 'file' if name becomes empty
  const asciiFallback = (asciiName || 'file') + extension;

  // Encode the original filename for UTF-8
  const encoded = encodeURIComponent(fileName);

  // Return both formats: ASCII fallback and UTF-8 encoded
  // Browsers will use the UTF-8 version if supported, fallback otherwise
  return `filename="${asciiFallback}"; filename*=UTF-8''${encoded}`;
}

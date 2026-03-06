import { createHash } from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import * as diacritics from 'normalize-diacritics';

const MAX_SIZE = 32;
export class StringTools {
  static createRandomString(size: number = MAX_SIZE): string {
    if (size > MAX_SIZE) {
      throw new Error('Size exceeded. Max size is 32 digits');
    }

    const hasher = createHash('sha1');
    const uuid = uuidv4();
    const currentDate = new Date();
    hasher.update(`${uuid}-${currentDate.toDateString()}`);
    const uniqueHash = hasher.digest('hex');

    return uniqueHash.replaceAll('-', '').substring(0, size);
  }

  static createUnique(existing: string[], size: number = 32): string {
    if (size > 64) {
      throw new Error('Size exceeded. Max size is 64 digits');
    }

    const hasher = createHash('sha1');
    const valueToHash = existing.map((value) => value.trim()).join('');

    hasher.update(valueToHash);
    const digest = hasher.digest('hex');
    const uniqueHash = digest + digest;

    return uniqueHash.replaceAll('-', '').substring(0, size);
  }

  static removeDiacritics(str: string): string {
    return diacritics.normalizeSync(str);
  }
}

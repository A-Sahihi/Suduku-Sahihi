/**
 * Utility functions for Persian localization, number conversion, and RTL support.
 */

const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
const ARABIC_DIGITS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

/**
 * Converts English or Arabic digits in a string or number to Persian digits.
 */
export function toPersianDigits(input: string | number | null | undefined): string {
  if (input === null || input === undefined) return '';
  return String(input).replace(/[0-9]/g, (char) => PERSIAN_DIGITS[parseInt(char, 10)]);
}

/**
 * Normalizes any digit string (Persian, Arabic, English) into standard English digits (1-9).
 */
export function normalizeToDigit(keyOrChar: string): number | null {
  if (!keyOrChar) return null;
  const char = keyOrChar.trim();

  // Check English digits 1-9
  if (/^[1-9]$/.test(char)) {
    return parseInt(char, 10);
  }

  // Check Persian digits
  const pIndex = PERSIAN_DIGITS.indexOf(char);
  if (pIndex > 0 && pIndex <= 9) {
    return pIndex;
  }

  // Check Arabic digits
  const aIndex = ARABIC_DIGITS.indexOf(char);
  if (aIndex > 0 && aIndex <= 9) {
    return aIndex;
  }

  return null;
}

/**
 * Formats seconds into MM:SS with Persian digits.
 */
export function formatPersianTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const mStr = mins < 10 ? `0${mins}` : `${mins}`;
  const sStr = secs < 10 ? `0${secs}` : `${secs}`;
  return `${toPersianDigits(mStr)}:${toPersianDigits(sStr)}`;
}

/**
 * Formats seconds into MM:SS with standard English digits.
 */
export function formatEnglishTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const mStr = mins < 10 ? `0${mins}` : `${mins}`;
  const sStr = secs < 10 ? `0${secs}` : `${secs}`;
  return `${mStr}:${sStr}`;
}

/**
 * Persian labels for difficulty levels.
 */
export const DIFFICULTY_LABELS_FA = {
  beginner: 'مبتدی',
  intermediate: 'متوسط',
  advanced: 'پیشرفته و حرفه‌ای',
} as const;

/**
 * Persian descriptions for difficulty levels.
 */
export const DIFFICULTY_DESCRIPTIONS_FA = {
  beginner: 'آموزش قوانین پایه، اسکن سطر و ستون، و تکنیک تک‌کاندید عریان',
  intermediate: 'جفت‌های عریان و پنهان، خطوط محدودساز، و بلوک‌های متقاطع',
  advanced: 'استراتژی‌های پیشرفته X-Wing، زنجیره‌های منطقی و تحلیل عمیق کاندیدها',
} as const;

import { NEPALI_DIGITS } from '@zener/nepali-date';
import classNames from 'classnames';

type Icn = (string | { [key: string]: boolean } | undefined)[];

export const cn = (...props: Icn) => {
  return classNames(...props);
};

export const engToNepaliNumber = (number: number | string) => {
  return number
    .toString()
    .split('')
    .map((n) => NEPALI_DIGITS[n as keyof typeof NEPALI_DIGITS])
    .join('');
};

export const engToNepNumberFullDate = (date: string) => {
  return date
    .split('')
    .map((d) => {
      if (d !== '-') {
        return NEPALI_DIGITS[d as keyof typeof NEPALI_DIGITS];
      }
      return '-';
    })
    .join('');
};

export const groupArray = (array: any[], groupSize: number) => {
  const result = [];
  for (let i = 0; i < array.length; i += groupSize) {
    result.push(array.slice(i, i + groupSize));
  }
  return result;
};

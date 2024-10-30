import classNames from 'classnames';
import {
  AD_MONTH,
  AD_MONTH_FULL,
  AD_MONTH_NEPALI,
  ENGLISH_WEEK,
  ENGLISH_WEEK_FULL,
  NEPALI_DIGITS,
  NEPALI_WEEK,
  NEPALI_WEEK_FULL,
} from './data';
import { ILang } from 'src/datepicker';
import { stringDateFormatter } from './calendar';

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

export const groupIntoPages = (
  array: any[],
  elementsPerRow = 3,
  rowsPerPage = 4,
) => {
  const elementsPerPage = elementsPerRow * rowsPerPage; // 12 elements per page
  const pages = [];

  // Loop through the array and slice into pages
  for (let i = 0; i < array.length; i += elementsPerPage) {
    const page = [];
    // For each page, slice into rows
    for (
      let j = i;
      j < i + elementsPerPage && j < array.length;
      j += elementsPerRow
    ) {
      page.push(array.slice(j, j + elementsPerRow));
    }
    pages.push(page);
  }

  return pages;
};

export const padZero = (num: number | string) => `${num}`.padStart(2, '0');

const convertLang = (value: number | string, lang: ILang) =>
  lang === 'en' ? value : engToNepaliNumber(value);

export const formatADDate = (
  date: Date,
  format: string = '',
  lang: ILang = 'en',
) => {
  // English date items
  const enYYYY = date.getFullYear();
  const enYY = String(enYYYY).slice(-2);
  const enM = date.getMonth() + 1;
  const enD = date.getDate();
  const enDD = padZero(enD);
  const enMM = padZero(enM);
  const end = date.getDay();

  const dateObj = {
    year: enYYYY,
    month: enM,
    date: enD,
  };

  const strDateObj = stringDateFormatter(dateObj);

  if (!format) {
    return lang === 'en' ? strDateObj : engToNepNumberFullDate(strDateObj);
  }

  // Date items after applying language
  const DD = convertLang(enDD, lang);
  const D = convertLang(enD, lang);
  const YYYY = convertLang(enYYYY, lang);
  const YY = convertLang(enYY, lang);
  const M = convertLang(enM, lang);
  const MM = convertLang(enMM, lang);
  const MMM =
    lang === 'en'
      ? AD_MONTH[date.getMonth()]
      : AD_MONTH_NEPALI[date.getMonth()];
  const MMMM =
    lang === 'en'
      ? AD_MONTH_FULL[date.getMonth()]
      : AD_MONTH_NEPALI[date.getMonth()];
  const d = convertLang(end, lang);
  const dd = lang === 'en' ? ENGLISH_WEEK[end] : NEPALI_WEEK[end];
  const ddd =
    lang === 'en' ? ENGLISH_WEEK_FULL[end].slice(0, 3) : NEPALI_WEEK[end];
  const dddd = lang === 'en' ? ENGLISH_WEEK_FULL[end] : NEPALI_WEEK_FULL[end];

  const replacements = {
    DD,
    D,
    YYYY,
    YY,
    M,
    MM,
    MMM,
    MMMM,
    d, // Abbreviated day name
    dd, // Abbreviated day name
    ddd, // Abbreviated day name
    dddd, // Full day name
  };

  // Replace format tokens with actual date values
  const tokenReg = /(\[.*?\])|(MMMM|MMM|dddd|ddd|dd|d|DD|D|MM|M|YYYY|YY)/g;
  return format.replace(tokenReg, (match, literal) => {
    if (literal) {
      // If it's a literal (like [d]), strip the brackets and return it as is
      return literal.slice(1, -1);
    }
    // Otherwise, it's a token, so replace it using the replacements object
    // @ts-ignore
    return replacements[match];
  });
};

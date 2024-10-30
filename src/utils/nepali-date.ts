import { ILang } from '../datepicker/nepali-date-picker';
import {
  findADfromBS,
  findBSfromAD,
  getCurrentDate,
  getDateFromNumber,
  manipulateDays,
  manipulateMonths,
  manipulateWeeks,
  manipulateYears,
  stringDateFormatter,
} from './calendar';
import {
  engToNepNumberFullDate,
  engToNepaliNumber,
  formatADDate,
  padZero,
} from './commons';
import {
  ENGLISH_NEPALI_MONTH,
  ENGLISH_WEEK,
  ENGLISH_WEEK_FULL,
  NEPALI_MONTH,
  NEPALI_WEEK,
  NEPALI_WEEK_FULL,
  startDateBS,
} from './data';

type LangReturnType<T extends ILang> = T extends 'en' ? number : string;
type ADReturnType<T extends ILang> = T extends 'en'
  ? {
      year: number;
      month: number;
      date: number;
      toString: () => string;
    }
  : {
      year: string;
      month: string;
      date: string;
      toString: () => string;
    };

interface DateObject {
  year: number;
  month: number;
  date: number;
  day: number;
}

interface NepaliDateObject {
  year: string;
  month: string;
  date: string;
  day: string;
}

type IManipulateDate =
  | 'day'
  | 'week'
  | 'month'
  | 'year'
  | 'd'
  | 'w'
  | 'm'
  | 'y';

const reg = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[012])$/;

class NepaliDate {
  #year: number = 2000;

  #month: number = 0;

  #date: number = 1;

  #adDate: Date = new Date();

  constructor();

  constructor(date: string | Date | NepaliDate);

  constructor(year: number, monthIndex: number, date: number);

  constructor(
    yearOrValue?: number | string | NepaliDate | Date,
    month?: number,
    date?: number,
  ) {
    if (typeof yearOrValue === 'number') {
      this.#year = yearOrValue;
      this.#month = month!;
      this.#date = date!;
      this.#setADDate();
    } else if (
      typeof yearOrValue === 'string' ||
      yearOrValue instanceof NepaliDate ||
      yearOrValue instanceof Date
    ) {
      if (typeof yearOrValue === 'string') {
        const parsed = NepaliDate.parseDate(yearOrValue);
        if (!parsed) {
          throw new Error('Invalid date');
        }

        this.#year = parsed.year;
        this.#month = parsed.month - 1;
        this.#date = parsed.date;
      } else if (yearOrValue instanceof NepaliDate) {
        this.#year = yearOrValue.#year;
        this.#month = yearOrValue.#month;
        this.#date = yearOrValue.#date;
      } else {
        const adDate = yearOrValue;
        const stringDate = stringDateFormatter({
          year: adDate.getFullYear(),
          month: adDate.getMonth() + 1,
          date: adDate.getDate(),
        });
        const d = findBSfromAD(stringDate);
        this.#year = d.year;
        this.#month = d.month;
        this.#date = d.date;
      }
    } else {
      const today = getCurrentDate({ type: 'np' });
      this.#year = today.year;
      this.#month = today.month;
      this.#date = today.date;
    }

    this.#setADDate();
  }

  #setADDate = () => {
    this.#adDate = new Date(
      findADfromBS(
        stringDateFormatter({
          year: this.#year,
          month: this.#month + 1,
          date: this.#date,
        }),
      ).toString(),
    );
  };

  format(format: string = '', lang: ILang = 'en') {
    if (!format) {
      return this.toString(lang);
    }
    const date = padZero(this.getDate('en'));
    const month = padZero(this.#month + 1);

    const replacements = {
      DD: lang === 'en' ? date : engToNepaliNumber(date),
      D: this.getDate(lang),
      YYYY: String(this.getFullYear(lang)),
      YY: String(this.getFullYear(lang)).slice(-2),
      M: lang === 'en' ? this.#month + 1 : engToNepaliNumber(this.#month + 1),
      MM: lang === 'en' ? month : engToNepaliNumber(month),
      MMM:
        lang === 'en'
          ? this.getMonthName(lang).slice(0, 3)
          : this.getMonthName(lang),
      MMMM: this.getMonthName(lang),
      d: this.getDay(lang), // Abbreviated day name
      dd:
        lang === 'en'
          ? this.getDayNameFull(lang).slice(0, 2)
          : this.getDayName(lang), // Abbreviated day name
      ddd:
        lang === 'en'
          ? this.getDayNameFull(lang).slice(0, 3)
          : this.getDayName(lang), // Abbreviated day name
      dddd: this.getDayNameFull(lang), // Full day name
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
  }

  toString(lang: ILang = 'en') {
    const d = stringDateFormatter({
      year: this.#year,
      month: this.#month + 1,
      date: this.#date,
    });
    switch (lang) {
      case 'en':
        return d;
      case 'np':
      default: {
        return engToNepNumberFullDate(d);
      }
    }
  }

  toJson(lang?: 'en'): DateObject;

  toJson(lang?: 'np'): NepaliDateObject;

  toJson(lang: ILang = 'en'): DateObject | NepaliDateObject {
    const d: DateObject = {
      year: this.#year,
      month: this.#month,
      date: this.#date,
      day: this.#adDate.getDay(),
    };

    switch (lang) {
      case 'en':
        return d;
      case 'np':
      default: {
        return {
          year: engToNepaliNumber(this.#year),
          month: engToNepaliNumber(this.#month),
          date: engToNepaliNumber(this.#date),
          day: engToNepaliNumber(this.#adDate.getDay()),
        };
      }
    }
  }

  toAD<T extends ILang = 'en'>(lang: T = 'en' as T): ADReturnType<T> {
    const d = findADfromBS(
      stringDateFormatter({
        year: this.#year,
        month: this.#month + 1,
        date: this.#date,
      }),
    );
    switch (lang) {
      case 'en':
        return d as ADReturnType<T>;
      case 'np':
      default: {
        return {
          year: engToNepaliNumber(d.year),
          month: engToNepaliNumber(d.month),
          date: engToNepaliNumber(d.date),
          toString: () => engToNepNumberFullDate(d.toString()),
        } as ADReturnType<T>;
      }
    }
  }

  toADasDate() {
    return new Date(this.toAD('en').toString());
  }

  getFullYear<T extends ILang = 'en'>(lang: T = 'en' as T): LangReturnType<T> {
    return (
      lang === 'en' ? this.#year : engToNepaliNumber(this.#year)
    ) as LangReturnType<T>;
  }

  getMonth<T extends ILang = 'en'>(lang: T = 'en' as T): LangReturnType<T> {
    return (
      lang === 'en' ? this.#month : engToNepaliNumber(this.#month)
    ) as LangReturnType<T>;
  }

  getMonthName(lang: ILang = 'en') {
    return this.#getMonthByIndex(this.#month, lang);
  }

  #getMonthByIndex(index: number, lang: ILang = 'en') {
    if (index < 0 || index > 11) {
      throw new Error('Invalid month');
    }
    return lang === 'en' ? ENGLISH_NEPALI_MONTH[index] : NEPALI_MONTH[index];
  }

  getDate<T extends ILang = 'en'>(lang: T = 'en' as T): LangReturnType<T> {
    return (
      lang === 'en' ? this.#date : engToNepaliNumber(this.#date)
    ) as LangReturnType<T>;
  }

  getDay<T extends ILang = 'en'>(lang: T = 'en' as T): LangReturnType<T> {
    return (
      lang === 'en'
        ? this.#adDate.getDay()
        : engToNepaliNumber(this.#adDate.getDay())
    ) as LangReturnType<T>;
  }

  getDayName(lang: ILang = 'en') {
    return this.#getDayByIndex(this.#adDate.getDay(), lang, false);
  }

  getDayNameFull(lang: ILang = 'en') {
    return this.#getDayByIndex(this.#adDate.getDay(), lang, true);
  }

  #getDayByIndex(index: number, lang: ILang = 'en', full = false) {
    if (index < 0 || index > 6) {
      throw new Error('Invalid day');
    }
    if (full) {
      return lang === 'en' ? ENGLISH_WEEK_FULL[index] : NEPALI_WEEK_FULL[index];
    }
    return lang === 'en' ? ENGLISH_WEEK[index] : NEPALI_WEEK[index];
  }

  #manipulate(v: number, type: IManipulateDate) {
    const cDate = this.toString();
    switch (type) {
      case 'day':
      case 'd':
        return manipulateDays(cDate, v);
      case 'week':
      case 'w':
        return manipulateWeeks(cDate, v);
      case 'month':
      case 'm':
        return manipulateMonths(cDate, v);
      case 'year':
      case 'y':
        return manipulateYears(cDate, v);
      default:
        throw Error(
          "Invalid type. Type must be one of 'day'|'month'|'year'|'d'|'m'|'y'",
        );
    }
  }

  subtract(value: number, type: IManipulateDate) {
    const v = -Math.abs(value);
    const m = this.#manipulate(v, type);
    return new NepaliDate(m.year, m.month, m.date);
  }

  add(value: number, type: IManipulateDate) {
    const v = Math.abs(value);
    const m = this.#manipulate(v, type);
    return new NepaliDate(m.year, m.month, m.date);
  }

  setDate(date: number) {
    if (date > 0) {
      if (date >= this.#date) {
        const dateToAdd = date - this.#date;
        try {
          const {
            year,
            month,
            date: d,
          } = this.add(dateToAdd, 'd').toJson('en');
          this.#date = d;
          this.#year = year;
          this.#month = month;
          this.#setADDate();
        } catch {
          throw Error(`Date exceeds limit.`);
        }
      } else {
        this.#date = date;
      }
    } else {
      this.#date = 1;
      try {
        const {
          year,
          month,
          date: d,
        } = this.subtract(date - 1, 'd').toJson('en');
        this.#date = d;
        this.#year = year;
        this.#month = month;
        this.#setADDate();
      } catch {
        throw Error(`Date exceeds limit.`);
      }
    }
  }

  setMonth(month: number) {
    if (month >= 0) {
      if (month >= this.#month) {
        const monthToAdd = month - this.#month;
        try {
          const {
            year,
            month: m,
            date,
          } = this.add(monthToAdd, 'm').toJson('en');
          this.#date = date;
          this.#year = year;
          this.#month = m;
          this.#setADDate();
        } catch {
          throw Error(`Date exceeds limit.`);
        }
      } else {
        this.#month = month;
      }
    } else {
      this.#month = 0;
      try {
        const { year, month: m, date } = this.subtract(month, 'm').toJson('en');
        this.#date = date;
        this.#year = year;
        this.#month = m;
        this.#setADDate();
      } catch {
        throw Error(`Date exceeds limit.`);
      }
    }
  }

  setFullYear(year: number) {
    const sDate = getDateFromNumber(startDateBS).year;
    if (year < sDate) {
      throw Error(`Invalid year. Year cannot be less than $${sDate}`);
    } else {
      this.#year = year;
    }
  }

  static now(lang: ILang = 'en') {
    const d = getCurrentDate({ type: 'np' });
    return lang === 'en'
      ? d
      : {
          year: engToNepaliNumber(d.year),
          month: engToNepaliNumber(d.month),
          date: engToNepaliNumber(d.date),
          day: engToNepaliNumber(d.day),
          toString: () => engToNepNumberFullDate(d.toString()),
        };
  }

  static parseDate = (date: string) => {
    if (reg.test(date)) {
      const dd = date.split('-');
      if (dd.length !== 3) {
        return null;
      }

      const y = parseInt(dd[0], 10);
      const m = parseInt(dd[1], 10);
      const d = parseInt(dd[2], 10);

      return { date: d, year: y, month: m };
    }
    return null;
  };
}

export { NepaliDate, findADfromBS as toAD, findBSfromAD as toBS, formatADDate };

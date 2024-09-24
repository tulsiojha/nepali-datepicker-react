import { ILang } from '../datepicker/nepali-date-picker';
import {
  findADfromBS,
  findBSfromAD,
  getCurrentDate,
  stringDateFormatter,
} from './calendar';
import { engToNepNumberFullDate, engToNepaliNumber } from './commons';
import {
  ENGLISH_NEPALI_MONTH,
  ENGLISH_WEEK,
  ENGLISH_WEEK_FULL,
  NEPALI_MONTH,
  NEPALI_WEEK,
  NEPALI_WEEK_FULL,
} from './data';

const reg = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[012])$/;

class NepaliDate {
  #year: number = 2000;

  #month: number = 0;

  #date: number = 1;

  #day: number = 0;

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
    this.#day = this.#adDate.getDay();
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

  toJson(lang: ILang = 'en') {
    const d = {
      year: this.#year,
      month: this.#month,
      date: this.#date,
      day: this.#day,
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
          day: engToNepaliNumber(this.#day),
        };
      }
    }
  }

  toAD(lang: ILang = 'en') {
    const d = findADfromBS(
      stringDateFormatter({
        year: this.#year,
        month: this.#month + 1,
        date: this.#date,
      }),
    );
    switch (lang) {
      case 'en':
        return d;
      case 'np':
      default: {
        return {
          year: engToNepaliNumber(d.year),
          month: engToNepaliNumber(d.month),
          date: engToNepaliNumber(d.date),
          toString: () => engToNepNumberFullDate(d.toString()),
        };
      }
    }
  }

  toADasDate() {
    return new Date(this.toAD('en').toString());
  }

  getFullYear(lang: ILang = 'en') {
    return lang === 'en' ? this.#year : engToNepaliNumber(this.#year);
  }

  getMonth(lang: ILang = 'en') {
    return lang === 'en' ? this.#month : engToNepaliNumber(this.#month);
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

  getDate(lang: ILang = 'en') {
    return lang === 'en' ? this.#date : engToNepaliNumber(this.#date);
  }

  getDay(lang: ILang = 'en') {
    return lang === 'en' ? this.#day : engToNepaliNumber(this.#day);
  }

  getDayName(lang: ILang = 'en') {
    return this.#getDayByIndex(this.#day, lang, false);
  }

  getDayNameFull(lang: ILang = 'en') {
    return this.#getDayByIndex(this.#day, lang, true);
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

export { findADfromBS as toAD, findBSfromAD as toBS, NepaliDate };

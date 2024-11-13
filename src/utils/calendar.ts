import { startDateBS, toAD, yearMonthDays } from '@zener/nepali-date';
import { IDatePickerType } from 'src/datepicker/types';

type IDate = {
  year: number;
  month: number;
  date: number;
};
const toInt = (value: number) => ~~value;

const yearDivider = 10000;
const monthDivider = 100;

export const padTwo = (v: number) => `${v}`.padStart(2, '0');
export const padFour = (v: number) => `${v}`.padStart(4, '0');
export const padFourNumber = (v: number) => `${v}`.padStart(4, '0');

export const stringDateFormatter = ({ year, month, date }: IDate) =>
  `${padFour(year)}-${padTwo(month)}-${padTwo(date)}`;

export const getDateFromNumber = (n: number) => {
  const year = toInt(n / yearDivider);
  const month = toInt((n % yearDivider) / monthDivider);
  const date = n % (yearDivider / monthDivider);

  const dateData = { year, month, date };
  return {
    ...dateData,
    toString: () => stringDateFormatter(dateData),
  };
};

export const getStartYearAD = () =>
  toAD(getDateFromNumber(startDateBS).toString());

export const getEndYearAD = () =>
  toAD(
    stringDateFormatter({
      year: getDateFromNumber(startDateBS).year + yearMonthDays.length - 1,
      month: 12,
      date: yearMonthDays[yearMonthDays.length - 1][11],
    }),
  );

const getBSYearIndexFromBS = (year: number) => {
  const startBSYear = getDateFromNumber(startDateBS).year;
  if (year < startBSYear) {
    throw new Error(`Invalid year, year should be greater than ${startBSYear}`);
  }
  return year - startBSYear;
};

export const getMonthInfo = ({
  type = 'BS',
  year,
  month,
}: {
  type?: IDatePickerType;
  year: number;
  month: number;
}) => {
  if (month > 12 || month < 0) {
    throw new Error('Invalid month');
  }

  const getPrevMonthDays = (yearIndex = 0) => {
    let monthDays = 0;
    try {
      let m = month - 2;
      if (m < 0) {
        m = 11;
        monthDays = yearMonthDays[yearIndex - 1][m];
      } else {
        monthDays = yearMonthDays[yearIndex][m];
      }
    } catch (err) {
      monthDays = 0;
    }
    return monthDays;
  };

  const getNextMonthDays = (yearIndex = 0) => {
    let monthDays = 0;
    try {
      let m = month;
      if (m > 11) {
        m = 0;
        monthDays = yearMonthDays[yearIndex + 1][m];
      } else {
        monthDays = yearMonthDays[yearIndex][m];
      }
    } catch (err) {
      monthDays = 0;
    }
    return monthDays;
  };

  switch (type) {
    case 'AD': {
      const currentDate = new Date(year, month, 0);
      const prevDate = new Date(year, month - 1, 0).getDate();
      const nextDate = new Date(year, month + 1, 0).getDate();
      const firstWeekDay = new Date(
        stringDateFormatter({ year, month, date: 1 }),
      ).getDay();
      return {
        currentMonthDays: currentDate.getDate(),
        firstWeekDay,
        prevMonthDays: prevDate,
        nextMonthDays: nextDate,
      };
    }
    case 'BS':
    default: {
      const yearIndex = getBSYearIndexFromBS(year);
      const engYear = toAD(stringDateFormatter({ year, month, date: 1 }));
      const firstWeekDay = new Date(engYear.toString()).getDay();

      return {
        prevMonthDays: getPrevMonthDays(yearIndex),
        nextMonthDays: getNextMonthDays(yearIndex),
        currentMonthDays: yearMonthDays[yearIndex][month - 1],
        firstWeekDay,
      };
    }
  }
};

export const groupDates = (
  monthInfo: ReturnType<typeof getMonthInfo> & { currentMonth: number },
) => {
  const groups = [];
  let x = 1;
  const items = Array.from({ length: 42 }, (_, i) => {
    let day = i + 1 - monthInfo.firstWeekDay;
    let month = 'current';
    if (day <= 0) {
      day = monthInfo.prevMonthDays + day;
      month = 'prev';
    } else if (day > monthInfo.currentMonthDays) {
      day = x;
      x += 1;
      month = 'next';
    }
    return { day, month, currentMonth: monthInfo.currentMonth };
  }) as {
    day: number;
    month: 'current' | 'prev' | 'next';
    currentMonth: number;
  }[]; // Replace with your actual data

  for (let i = 0; i < items.length; i += 7) {
    groups.push(items.slice(i, i + 7));
  }

  return groups;
};

export const getYearsArray = (startYear: number) => {
  return Array.from({ length: 10 }, (_, i) => {
    return startYear + i;
  });
};

export const getDecadeRange = (year: number) => {
  const start = Math.floor(year / 10) * 10;
  const end = start + 9;
  return { start, end };
};

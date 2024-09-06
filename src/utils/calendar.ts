import { baishakOne, startDateAD, startDateBS, yearMonthDays } from "./data";

type IDate = {
  year: number;
  month: number;
  date: number;
};
const toInt = (value: number) => ~~value;

const yearDivider = 10000;
const monthDivider = 100;

const padTwo = (v: number) => `${v}`.padStart(2, "0");

export const stringDateFormatter = ({ year, month, date }: IDate) =>
  `${year}-${padTwo(month)}-${padTwo(date)}`;

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

const getBSYearIndexFromAd = (year: number) => {
  const startADYear = getDateFromNumber(startDateAD).year;
  if (year < startADYear) {
    throw new Error(`Invalid year, year should be greater than ${startADYear}`);
  }
  return year - startADYear;
};

const getBSYearIndexFromBS = (year: number) => {
  const startBSYear = getDateFromNumber(startDateBS).year;
  if (year < startBSYear) {
    throw new Error(`Invalid year, year should be greater than ${startBSYear}`);
  }
  return year - startBSYear;
};

const getDays = (a: Date, b: Date) =>
  (a.getTime() - b.getTime()) / (1000 * 3600 * 24) + 1;

const nepaliDateExtractor = (datestring: string) => {
  if (!datestring) {
    throw new Error("Invalid Date");
  }

  const datesplit = datestring.split("-");

  if (datesplit.length !== 3) {
    throw new Error("Invalid Date");
  }

  const year = parseInt(datesplit[0]);
  const month = parseInt(datesplit[1]);
  const date = parseInt(datesplit[2]);

  if (year < 1000 || date === 0 || month > 12) {
    throw new Error("Invalid Date");
  }

  return { year, month, date };
};

export const findADfromBS = (date: string) => {
  const d = nepaliDateExtractor(date);

  const year = d.year - getDateFromNumber(startDateBS).year;

  let days = 0;
  for (let x = 0; x < d.month - 1; x++) {
    days += yearMonthDays[year][x];
  }

  days += d.date - 1;

  const adIndexDate = getDateFromNumber(baishakOne[year]);
  const currentDate = new Date(stringDateFormatter({ ...adIndexDate }));
  currentDate.setDate(adIndexDate.date + days);
  const dateData = {
    year: currentDate.getFullYear(),
    month: currentDate.getMonth(),
    date: currentDate.getDate(),
  };

  return {
    ...dateData,
    toString: () =>
      stringDateFormatter({ ...dateData, month: dateData.month + 1 }),
  };
};

export const findBSfromAD = (date: string) => {
  const d = new Date(date);
  const adYear = d.getFullYear();

  // get in which nepali year index we are in although this is not fixed here
  let yearIndex = getBSYearIndexFromAd(adYear);

  let baishakOneInADForGivenYear = getDateFromNumber(baishakOne[yearIndex]);

  let dateForBaishakOneInADForGivenYear = new Date(
    baishakOneInADForGivenYear.toString(),
  );
  let days = getDays(d, dateForBaishakOneInADForGivenYear);

  // for nepali year if days are negative it means we are in different quarter of english year, so we need to go to previous quarter
  if (days < 0) {
    yearIndex = yearIndex - 1;

    baishakOneInADForGivenYear = getDateFromNumber(baishakOne[yearIndex]);

    dateForBaishakOneInADForGivenYear = new Date(
      baishakOneInADForGivenYear.toString(),
    );
    days = getDays(d, dateForBaishakOneInADForGivenYear);
  }

  const currentBSYearMonths = yearMonthDays[yearIndex];

  let totalMonths = 0;
  let totalDays = 0;
  for (let x = 0; x < days; x++) {
    totalDays = totalDays + 1;
    if (totalDays > currentBSYearMonths[totalMonths]) {
      totalMonths = totalMonths + 1;
      totalDays = 1;
      continue;
    }
  }

  const dateData = {
    year: yearIndex + getDateFromNumber(startDateBS).year,
    month: totalMonths,
    date: totalDays,
  };

  return {
    ...dateData,
    toString: () =>
      stringDateFormatter({ ...dateData, month: dateData.month + 1 }),
  };
};

export const getCurrentDate = ({ type = "np" }: { type?: "en" | "np" }) => {
  const date = new Date();
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  switch (type) {
    case "en":
      return {
        year: date.getFullYear(),
        month: date.getMonth(),
        date: date.getDate(),
        day: date.getDay(),
      };
    case "np":
    default:
      return { ...findBSfromAD(formatDate(date)), day: date.getDay() };
  }
};

export const getMonthInfo = ({
  type = "np",
  year,
  month,
}: {
  type?: "en" | "np";
  year: number;
  month: number;
}) => {
  if (month > 12 || month < 0) {
    throw new Error("Invalid month");
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
    case "en":
      const date = new Date(year, month + 1, 0);
      return {
        currentMonthDays: date.getDate(),
        firstWeekDay: new Date(
          stringDateFormatter({ year, month, date: 1 }),
        ).getDay(),
        prevMonthDays: 0,
        nextMonthDays: 0,
      };

    case "np":
    default:
      const yearIndex = getBSYearIndexFromBS(year);
      const engYear = findADfromBS(
        stringDateFormatter({ year, month, date: 1 }),
      );
      const firstWeekDay = new Date(engYear.toString()).getDay();

      return {
        prevMonthDays: getPrevMonthDays(yearIndex),
        nextMonthDays: getNextMonthDays(yearIndex),
        currentMonthDays: yearMonthDays[yearIndex][month - 1],
        firstWeekDay,
      };
  }
};

export const groupDates = (
  monthInfo: ReturnType<typeof getMonthInfo> & { currentMonth: number },
) => {
  const groups = [];
  let x = 1;
  const items = Array.from({ length: 42 }, (_, i) => {
    let day = i + 1 - monthInfo.firstWeekDay;
    let month = "current";
    if (day <= 0) {
      day = monthInfo.prevMonthDays + day;
      month = "prev";
    } else if (day > monthInfo.currentMonthDays) {
      day = x;
      x += 1;
      month = "next";
    }
    return { day, month, currentMonth: monthInfo.currentMonth };
  }) as {
    day: number;
    month: "current" | "prev" | "next";
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
  let start = Math.floor(year / 10) * 10;
  let end = start + 9;
  return { start, end };
};

export const reg = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[012])$/;

export const parseDateFromString = (date: string) => {
  if (reg.test(date)) {
    const dd = date.split("-");
    if (dd.length !== 3) {
      return;
    }

    const y = parseInt(dd[0]);
    const m = parseInt(dd[1]);
    const d = parseInt(dd[2]);

    return { date: d, year: y, month: m };
  } else {
    throw new Error("Invalid date.");
  }
};

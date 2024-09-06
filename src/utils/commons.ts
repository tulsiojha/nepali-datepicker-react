import classNames from "classnames";
import { NEPALI_DIGITS } from "./data";

type Icn = (string | { [key: string]: boolean } | undefined)[];

export const cn = (...props: Icn) => {
  return classNames(...props);
};

export const engToNepaliNumber = (number: number) => {
  return number
    .toString()
    .split("")
    .map((n) => NEPALI_DIGITS[n as keyof typeof NEPALI_DIGITS])
    .join("");
};

export const engToNepNumberFullDate = (date: string) => {
  return date
    .split("")
    .map((d) => {
      if (d !== "-") {
        return NEPALI_DIGITS[d as keyof typeof NEPALI_DIGITS];
      }
      return "-";
    })
    .join("");
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
  let pages = [];

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

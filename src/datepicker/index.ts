import '../css/index.scss';

import NepaliDate, * as nepaliDateConstants from '@zener/nepali-date';

import NepaliDatePicker from './nepali-date-picker';

export type {
  INepaliDatePicker,
  IComponents,
  IDatePickerType,
  ILang,
  ISuffixRender,
} from './types';

export { NepaliDate };

export const {
  AD_MONTH,
  AD_MONTH_FULL,
  AD_MONTH_NEPALI,
  ENGLISH_NEPALI_MONTH,
  ENGLISH_WEEK,
  ENGLISH_WEEK_FULL,
  lowerADDate,
  NEPALI_DIGITS,
  NEPALI_MONTH,
  NEPALI_TODAY,
  NEPALI_WEEK,
  NEPALI_WEEK_FULL,
  startDateBS,
  toAD,
  toBS,
  yearMonthDays,
} = nepaliDateConstants;

export default NepaliDatePicker;

import NepaliDate from '@zener/nepali-date';
import { AnimationProps } from 'framer-motion';
import { ReactNode, RefObject } from 'react';
import { IBounds } from 'src/utils/use-bounds';

export type ISuffixRender = (props: {
  onClear: () => void;
  isOpen: boolean;
  showclear: boolean;
}) => ReactNode;

export type IDatePickerType = 'BS' | 'AD';

export type ILang = 'np' | 'en';

export type DateTypeMap = {
  BS: NepaliDate;
  AD: Date;
};

export type IComponents = {
  footer?: (props: {
    onTodayClick: () => void;
    todayText: string;
  }) => ReactNode;
  header?: (props: {
    prevClick: () => void;
    nextClick: () => void;
    onMonthSelectClicked: () => void;
    onYearSelectClicked: () => void;
    prevDisabled: boolean;
    nextDisabled: boolean;
    selectionMode: 'day' | 'year' | 'month';
    monthText: string;
    monthNumber: number;
    yearNumber: number;
    yearText: string;
    yearRange: { start: number; end: number };
    yearRangeText: string;
  }) => ReactNode;
  date?: (props: {
    onClick: () => void;
    dateMonthType: 'current' | 'prev' | 'next';
    month: number;
    year: number;
    isToday: boolean;
    isSelected: boolean;
    dateText: string | number;
    date: number;
    isDisabled: boolean;
    weekDay: number;
  }) => ReactNode;
  year?: (props: {
    onClick: () => void;
    yearText: string | number;
    yearNumber: number;
    isDisabled: boolean;
  }) => ReactNode;
  month?: (props: {
    onClick: () => void;
    monthText: string | number;
    monthNumber: number;
    year: number;
    isDisabled: boolean;
  }) => ReactNode;
  week?: (props: { weekText: string; weekNumber: number }) => ReactNode;
};

export interface IBaseType<T extends keyof DateTypeMap | undefined = 'BS'> {
  lang?: ILang;
  type?: T;
  onChange?: (date: (T extends 'BS' ? NepaliDate : Date) | null) => void;
  portalClassName?: string;
  menuContainerClassName?: string;
  calendarClassName?: string;
  converterMode?: boolean;
  components?: IComponents;
  animation?: null | AnimationProps;
}

export interface INepaliDatePicker<
  T extends keyof DateTypeMap | undefined = 'BS',
> extends IBaseType<T> {
  open?: boolean;
  disabled?: boolean;
  placeholder?: string;
  prefix?: ReactNode;
  suffix?: ISuffixRender;
  showclear?: boolean;
  value?: NepaliDate | Date | string | null;
  className?:
    | string
    | (() => { focus?: string; disabled?: string; default?: string });
  format?: string;
}

export type ISelectionMode = 'day' | 'month' | 'year';

export interface IMenu<T extends keyof DateTypeMap | undefined = 'BS'>
  extends IBaseType<T> {
  show: boolean;
  bounds: IBounds;
  portalRef: RefObject<HTMLDivElement>;
  today: NepaliDate | Date;
  selectedDate?: NepaliDate | Date | null;
}

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { Portal } from '@radix-ui/react-portal';
import NepaliDate, {
  AD_MONTH,
  AD_MONTH_NEPALI,
  ENGLISH_NEPALI_MONTH,
  ENGLISH_WEEK,
  NEPALI_MONTH,
  NEPALI_TODAY,
  NEPALI_WEEK,
  lowerADDate,
  startDateBS,
  yearMonthDays,
} from '@zener/nepali-date';
import {
  getDateFromNumber,
  getDecadeRange,
  getEndYearAD,
  getMonthInfo,
  getStartYearAD,
  getYearsArray,
  groupDates,
  padFourNumber,
  padTwo,
} from '../utils/calendar';
import {
  cn,
  engToNepNumberFullDate,
  engToNepaliNumber,
  groupArray,
} from '../utils/commons';

import { NextIcon, PreviousIcon } from '../icons';
import { DateTypeMap, IMenu, ISelectionMode } from './types';

const Menu = <T extends keyof DateTypeMap | undefined = 'BS'>({
  type,
  show,
  bounds,
  portalRef,
  today,
  onChange,
  selectedDate,
  lang,
  menuContainerClassName,
  calendarClassName,
  portalClassName,
  components,
  converterMode,
  animation,
  max,
  min,
}: IMenu<T>) => {
  const [selectionMode, setSelectionMode] = useState<ISelectionMode>('day');
  const [currentYearRangeIndex, setCurrentYearRangeIndex] = useState(0);
  const [days, setDays] = useState<
    { day: number; month: 'current' | 'next' | 'prev' }[][]
  >([]);
  const [selectedMonthYear, setSelectedMonthYear] = useState<{
    year: number;
    month: number;
  }>();

  const [adDateRangeForConverter, setAdDateRangeForConverter] = useState({
    start: getStartYearAD(),
    end: getEndYearAD(),
  });

  const todayText = lang === 'en' ? 'Today' : NEPALI_TODAY;

  const changeMonth = ({ m, y }: { m: number; y: number }) => {
    const mI = getMonthInfo({
      year: y,
      // since month index start from 0 but getMonthInfo requires index from 1
      month: m + 1,
      type,
    });

    const gD = groupDates({
      ...mI,
      // since month index start from 0 but groupDates requires index from 1
      currentMonth: m + 1,
    });

    setDays(gD);

    setSelectedMonthYear({
      year: y,
      month: m,
    });
    setCurrentYearRangeIndex(getDecadeRange(y).start);
  };

  useEffect(() => {
    setAdDateRangeForConverter({
      start: getStartYearAD(),
      end: getEndYearAD(),
    });
  }, []);

  useEffect(() => {
    setSelectionMode('day');
  }, [show]);

  useEffect(() => {
    if (today || selectedDate) {
      let y = 0;
      let m = 0;
      if (selectedDate) {
        m = selectedDate.getMonth();
        y = selectedDate.getFullYear();
      } else if (today) {
        m = today.getMonth();
        y = today.getFullYear();
      }
      changeMonth({ m, y });
    }
  }, [today, selectedDate, show]);

  const canGoNextYear = () => {
    if (!selectedMonthYear) {
      return false;
    }
    if (type === 'AD') {
      return true;
    }

    const startBSYear = getDateFromNumber(startDateBS).year;
    const endBSYear = startBSYear + yearMonthDays.length - 1;
    const y = selectedMonthYear.year + 1;

    if (y <= endBSYear) {
      return true;
    }
    return false;
  };

  const nextYear = () => {
    if (!selectedMonthYear) {
      return;
    }

    const y = selectedMonthYear.year + 1;
    const m = selectedMonthYear.month;

    if (canGoNextYear()) {
      changeMonth({
        y,
        m,
      });
    }
  };

  const canGoPrevYear = () => {
    if (!selectedMonthYear) {
      return false;
    }

    const startBSYear = getDateFromNumber(startDateBS).year;
    const y = (selectedMonthYear.year || 1) - 1;

    if (type === 'AD') {
      if (
        new Date(
          `${padFourNumber(y)}-${padTwo(selectedMonthYear.month + 1)}-01`,
        ).getTime() > lowerADDate
      ) {
        return true;
      }
      return false;
    }

    if (y >= startBSYear) {
      return true;
    }
    return false;
  };

  const prevYear = () => {
    const y = (selectedMonthYear?.year || 0) - 1;
    const m = selectedMonthYear?.month || 0;

    if (canGoPrevYear()) {
      changeMonth({
        y,
        m,
      });
    }
  };

  const canGoNextDecade = () => {
    if (type === 'AD') {
      return true;
    }
    const startBSYear = getDateFromNumber(startDateBS).year;
    const endBSYear = startBSYear + yearMonthDays.length - 1;
    if (currentYearRangeIndex < getDecadeRange(endBSYear).start) {
      return true;
    }
    return false;
  };

  const canGoPrevDecade = () => {
    if (!selectedMonthYear) {
      return false;
    }
    if (type === 'AD') {
      if (
        new Date(
          `${padFourNumber(currentYearRangeIndex)}-${padTwo(selectedMonthYear.month + 1)}-01`,
        ).getTime() > lowerADDate
      ) {
        return true;
      }
      return false;
    }
    const startBSYear = getDateFromNumber(startDateBS).year;
    if (currentYearRangeIndex > startBSYear) {
      return true;
    }
    return false;
  };

  const nextDecade = () => {
    if (canGoNextDecade()) {
      setCurrentYearRangeIndex((prev) => prev + 10);
    }
  };

  const prevDecade = () => {
    if (canGoPrevDecade()) {
      setCurrentYearRangeIndex((prev) => prev - 10);
    }
  };

  const canGoPrevMonth = () => {
    if (!selectedMonthYear) {
      return false;
    }
    if (type === 'AD') {
      if (
        new Date(
          `${padFourNumber(selectedMonthYear.year)}-${padTwo(selectedMonthYear.month + 1)}-01`,
        ).getTime() > lowerADDate
      ) {
        return true;
      }
      return false;
    }
    const startBSYear = getDateFromNumber(startDateBS);

    if (selectedMonthYear) {
      if (selectedMonthYear.year > startBSYear.year) {
        return true;
      } else if (selectedMonthYear.year === startBSYear.year) {
        return selectedMonthYear.month > 0;
      }
      return false;
    }

    return false;
  };

  const canGoNextMonth = () => {
    if (type === 'AD') {
      return true;
    }
    const startBSYear = getDateFromNumber(startDateBS);
    const endBSYear = startBSYear.year + yearMonthDays.length - 1;

    if (selectedMonthYear) {
      if (selectedMonthYear.year < endBSYear) {
        return true;
      } else if (selectedMonthYear.year === endBSYear) {
        return selectedMonthYear.month < 11;
      }
    }

    return false;
  };

  const prevMonth = () => {
    if (!selectedMonthYear) {
      return;
    }

    if (!canGoPrevMonth()) {
      return;
    }

    let m = selectedMonthYear.month - 1;
    let y = selectedMonthYear.year;

    // go to previous year and select 12th month if month is negative
    if (m < 0) {
      y -= 1;
      m = 11;
    }

    // if year is negative let's make ie 0
    if (y < 0) {
      y = 0;
    }
    changeMonth({ m, y });
  };

  const nextMonth = () => {
    if (!selectedMonthYear) {
      return;
    }

    let m = selectedMonthYear.month + 1;
    let y = selectedMonthYear.year;

    // go to next year and select 1st month if m is greater than 11
    if (m > 11) {
      y += 1;
      m = 0;
    }

    // if year is negative let's make ie 0
    if (y < 0) {
      y = 0;
    }

    changeMonth({ m, y });
  };

  const isSelectedDate = (date: number, month: string) => {
    if (!selectedDate || !selectedMonthYear) {
      return false;
    }
    return (
      selectedDate.getFullYear() === selectedMonthYear.year &&
      selectedDate.getMonth() === selectedMonthYear.month &&
      selectedDate.getDate() === date &&
      month === 'current'
    );
  };

  const isTodayDate = (date: number) => {
    if (!today || !selectedMonthYear) {
      return false;
    }
    return (
      today.getFullYear() === selectedMonthYear.year &&
      today.getMonth() === selectedMonthYear.month &&
      date === today.getDate()
    );
  };

  const checkDayDisabledInBs = (month: string) => {
    if (!selectedMonthYear) {
      return true;
    }

    const startBSYear = getDateFromNumber(startDateBS);
    const endBSYear = startBSYear.year + yearMonthDays.length - 1;

    let m = selectedMonthYear.month;
    let y = selectedMonthYear.year;

    if (type === 'BS') {
      switch (month) {
        case 'next': {
          if (m > 10) {
            y += 1;
            if (y > endBSYear) {
              return true;
            }
          }
          return false;
        }
        case 'prev': {
          m -= 1;
          if (m < 0) {
            y -= 1;
            if (y < startBSYear.year) {
              return true;
            }
          }
          return false;
        }
        default:
          return false;
      }
    }
    return false;
  };

  const checkDayDisabledInAD = (month: string) => {
    if (!selectedMonthYear) {
      return true;
    }

    let m = selectedMonthYear.month;
    let y = selectedMonthYear.year;
    switch (month) {
      case 'prev': {
        m -= 1;
        if (m < 0) {
          y -= 1;
          if (y < 1) {
            return true;
          }
          return false;
        }
        return false;
      }
      case 'next':
      default:
        return false;
    }
  };

  const handleOnChange = (month: string, date: number) => {
    if (!selectedMonthYear) {
      return;
    }

    let m = selectedMonthYear.month;
    let y = selectedMonthYear.year;

    if (checkDayDisabledInBs(month)) {
      return;
    }

    if (month === 'next') {
      if (m > 10) {
        y += 1;
        m = 0;
      } else {
        m += 1;
      }
    } else if (month === 'prev') {
      m -= 1;
      if (m < 0) {
        m = 11;
        y -= 1;
      }
    }

    const x = `${padFourNumber(y)}-${padTwo(m + 1)}-${padTwo(date)}`;

    onChange?.(
      // @ts-ignore
      type === 'BS' ? new NepaliDate(y, m, date) : new Date(x),
    );
  };

  const getSelectionContent = useMemo(() => {
    const num_columns = 3;
    switch (selectionMode) {
      case 'month': {
        const getMonths = () => {
          if (type === 'BS') {
            return lang === 'en' ? ENGLISH_NEPALI_MONTH : NEPALI_MONTH;
          } else {
            return lang === 'en' ? AD_MONTH : AD_MONTH_NEPALI;
          }
        };
        const monthArray = groupArray(getMonths(), num_columns);
        const getMonthIndex = (index: number, mIndex: number) =>
          index * num_columns + mIndex;

        const onMonthClicked = (index: number, mIndex: number) => {
          changeMonth({
            m: getMonthIndex(index, mIndex),
            y: selectedMonthYear?.year || 0,
          });
          setSelectionMode('day');
        };

        const isMonthDisabled = (month: number) => {
          if (!selectedMonthYear) {
            return true;
          }

          if (min) {
            if (
              (selectedMonthYear?.year === min.getFullYear() &&
                month < min.getMonth()) ||
              selectedMonthYear?.year < min.getFullYear()
            ) {
              return true;
            }
          }

          if (max) {
            if (
              (selectedMonthYear?.year === max.getFullYear() &&
                month > max.getMonth()) ||
              selectedMonthYear?.year > max.getFullYear()
            ) {
              return true;
            }
          }

          if (!converterMode) {
            return false;
          }

          if (type === 'BS') {
            return false;
          }

          if (!selectedMonthYear) {
            return true;
          }

          if (
            selectedMonthYear.year < adDateRangeForConverter.start.year ||
            selectedMonthYear.year > adDateRangeForConverter.end.year
          ) {
            return true;
          }

          if (
            selectedMonthYear.year === adDateRangeForConverter.start.year ||
            selectedMonthYear.year === adDateRangeForConverter.end.year
          ) {
            if (
              (selectedMonthYear.year === adDateRangeForConverter.start.year &&
                month < adDateRangeForConverter.start.month) ||
              (selectedMonthYear.year === adDateRangeForConverter.end.year &&
                month > adDateRangeForConverter.end.month)
            ) {
              return true;
            }
            return false;
          }
          return false;
        };

        return (
          <tbody>
            {monthArray.map((ma, index) => {
              const i = index;
              return (
                <tr key={i}>
                  {ma.map((m, mIndex) => {
                    const monthIndex = getMonthIndex(index, mIndex);
                    const monthDisabled = isMonthDisabled(monthIndex);
                    return (
                      <td key={m}>
                        {components?.month ? (
                          components.month({
                            onClick: () =>
                              !monthDisabled
                                ? onMonthClicked(index, mIndex)
                                : null,
                            monthText: m,
                            monthNumber: monthIndex,
                            year: selectedMonthYear?.year || 0,
                            isDisabled: monthDisabled,
                          })
                        ) : (
                          <div
                            className={cn(
                              'zener-text-center zener-p-3 zener-group',
                              {
                                'zener-cursor-pointer': !monthDisabled,
                                'zener-cursor-default': monthDisabled,
                              },
                            )}
                            onClick={() =>
                              !monthDisabled
                                ? onMonthClicked(index, mIndex)
                                : null
                            }
                          >
                            <div
                              className={cn(
                                'zener-text-sm zener-flex zener-items-center zener-justify-center zener-h-[28px] zener-rounded',

                                {
                                  'group-hover:zener-bg-menu-container-item-hover':
                                    !monthDisabled,
                                  'zener-text-menu-container-text-disabled':
                                    monthDisabled,
                                },
                              )}
                            >
                              {m}
                            </div>
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        );
      }
      case 'year': {
        const range = getDecadeRange(currentYearRangeIndex);
        const groupedYears = groupArray(
          getYearsArray(range.start),
          num_columns,
        );
        const getYearIndex = (index: number, mIndex: number) =>
          index * num_columns + mIndex;

        const onYearClicked = (index: number, mIndex: number) => {
          changeMonth({
            m: selectedMonthYear?.month || 0,
            y: getYearIndex(index, mIndex) + range.start,
          });
          setSelectionMode('month');
        };

        const isYearDisabled = (year: number) => {
          if (min) {
            if (year < min.getFullYear()) {
              return true;
            }
          }

          if (max) {
            if (year > max.getFullYear()) {
              return true;
            }
          }

          if (type === 'BS') {
            return false;
          }

          if (type === 'AD' && !converterMode) {
            return year < 1;
          }
          if (
            year < adDateRangeForConverter.start.year ||
            year > adDateRangeForConverter.end.year
          ) {
            return true;
          }
          return false;
        };
        return (
          <tbody>
            {groupedYears.map((ma, index) => {
              const i = index;
              return (
                <tr key={i}>
                  {ma.map((m, mIndex) => {
                    const yearText =
                      lang === 'en'
                        ? padFourNumber(m)
                        : engToNepaliNumber(padFourNumber(m));
                    const indexNumber =
                      getYearIndex(index, mIndex) + range.start;
                    const yearDisabled = isYearDisabled(indexNumber);
                    return (
                      <td key={m}>
                        {components?.year ? (
                          components.year({
                            onClick: () =>
                              !yearDisabled
                                ? onYearClicked(index, mIndex)
                                : null,
                            yearText,
                            yearNumber: indexNumber,
                            isDisabled: yearDisabled,
                          })
                        ) : (
                          <div
                            className={cn(
                              'zener-text-center zener-p-3 zener-group',
                              {
                                'zener-cursor-pointer': !yearDisabled,
                                'zener-cursor-default': yearDisabled,
                              },
                            )}
                            onClick={() =>
                              !yearDisabled
                                ? onYearClicked(index, mIndex)
                                : null
                            }
                          >
                            <div
                              className={cn(
                                'zener-text-sm zener-flex zener-items-center zener-justify-center zener-h-[28px] zener-rounded',
                                {
                                  'group-hover:zener-bg-menu-container-item-hover':
                                    !yearDisabled,
                                  'zener-text-menu-container-text-disabled':
                                    yearDisabled,
                                },
                              )}
                            >
                              {yearText}
                            </div>
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        );
      }
      case 'day':
      default: {
        const onDayClicked = (month: string, date: number) =>
          handleOnChange(month, date);

        const isDayDisabled = (
          day: number,
          month: 'current' | 'prev' | 'next',
        ) => {
          if (!selectedMonthYear) {
            return true;
          }

          if (min) {
            if (
              (selectedMonthYear?.year === min.getFullYear() &&
                selectedMonthYear?.month === min.getMonth() &&
                ((day < min.getDate() && month !== 'next') ||
                  month === 'prev')) ||
              (selectedMonthYear.month < min.getMonth() &&
                selectedMonthYear.year === min.getFullYear()) ||
              selectedMonthYear.year < min.getFullYear()
            ) {
              return true;
            }
          }
          if (max) {
            if (
              (selectedMonthYear?.year === max.getFullYear() &&
                selectedMonthYear?.month === max.getMonth() &&
                ((day > max.getDate() && month !== 'prev') ||
                  month === 'next')) ||
              (selectedMonthYear.month > max.getMonth() &&
                selectedMonthYear.year === max.getFullYear()) ||
              selectedMonthYear.year > max.getFullYear()
            ) {
              return true;
            }
          }

          if (type === 'BS') {
            return checkDayDisabledInBs(month);
          }

          if (type === 'AD' && !converterMode) {
            return checkDayDisabledInAD(month);
          }

          if (
            selectedMonthYear.year < adDateRangeForConverter.start.year ||
            selectedMonthYear.year > adDateRangeForConverter.end.year
          ) {
            return true;
          }

          if (
            selectedMonthYear.year === adDateRangeForConverter.start.year ||
            selectedMonthYear.year === adDateRangeForConverter.end.year
          ) {
            if (
              (selectedMonthYear.year === adDateRangeForConverter.start.year &&
                selectedMonthYear.month <
                  adDateRangeForConverter.start.month) ||
              (selectedMonthYear.year === adDateRangeForConverter.end.year &&
                selectedMonthYear.month > adDateRangeForConverter.end.month)
            ) {
              return true;
            }

            if (
              (selectedMonthYear.year === adDateRangeForConverter.start.year &&
                selectedMonthYear.month ===
                  adDateRangeForConverter.start.month &&
                ((day < adDateRangeForConverter.start.date &&
                  month === 'current') ||
                  month === 'prev')) ||
              (selectedMonthYear.year === adDateRangeForConverter.end.year &&
                selectedMonthYear.month === adDateRangeForConverter.end.month &&
                adDateRangeForConverter.start.month &&
                ((day > adDateRangeForConverter.end.date &&
                  month === 'current') ||
                  month === 'next'))
            ) {
              return true;
            }

            return false;
          }
          return false;
        };
        return (
          <>
            <thead>
              <tr className="zener-text-sm">
                {(lang === 'en' ? ENGLISH_WEEK : NEPALI_WEEK).map(
                  (week, index) => (
                    <th key={week}>
                      {components?.week ? (
                        components.week({ weekText: week, weekNumber: index })
                      ) : (
                        <div className="zener-w-[28px] zener-h-[28px] zener-flex zener-items-center zener-justify-center zener-font-normal">
                          {week}
                        </div>
                      )}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {days.map((d, i) => {
                const ii = i;
                return (
                  <tr key={ii}>
                    {d.map((dd, index) => {
                      const date = dd.day < 1 ? 0 : dd.day;
                      const isSelected = isSelectedDate(date, dd.month);
                      const isToday = isTodayDate(date);
                      const dateText =
                        lang === 'en' ? date : engToNepaliNumber(date);

                      const dayDisabled = isDayDisabled(date, dd.month);

                      return (
                        <td key={dd.day}>
                          {components?.date ? (
                            components.date({
                              dateMonthType: dd.month,
                              dateText,
                              date,
                              month: selectedMonthYear?.month || 0,
                              year: selectedMonthYear?.year || 0,
                              isSelected,
                              isToday,
                              onClick: () =>
                                !dayDisabled
                                  ? onDayClicked(dd.month, date)
                                  : null,
                              isDisabled: dayDisabled,
                              weekDay: index,
                            })
                          ) : (
                            <div
                              className={cn(
                                'zener-text-center zener-p-1 zener-group',
                                {
                                  'zener-cursor-pointer': !dayDisabled,
                                  'zener-cursor-default': dayDisabled,
                                },
                              )}
                              onClick={() =>
                                !dayDisabled
                                  ? onDayClicked(dd.month, date)
                                  : null
                              }
                            >
                              <div
                                className={cn(
                                  'zener-text-sm zener-flex zener-items-center zener-justify-center zener-h-[28px] zener-w-[28px] zener-rounded',
                                  {
                                    'zener-text-menu-container-text-disabled':
                                      dd.month !== 'current' || dayDisabled,
                                    'zener-border zener-border-solid zener-box-border zener-border-menu-container-text-border':
                                      isToday &&
                                      dd.month === 'current' &&
                                      !dayDisabled,
                                    'zener-bg-menu-container-text-selected-bg zener-text-menu-container-text-selected zener-transition-none':
                                      isSelected &&
                                      dd.month === 'current' &&
                                      !dayDisabled,
                                    'zener-bg-menu-container-text-selected-disabled-bg zener-text-menu-container-text-selected-disabled zener-transition-none':
                                      isSelected &&
                                      dd.month === 'current' &&
                                      dayDisabled,
                                    'group-hover:zener-bg-menu-container-item-hover':
                                      !isSelected && !dayDisabled,
                                  },
                                )}
                              >
                                {dateText}
                              </div>
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </>
        );
      }
    }
  }, [
    lang,
    selectedMonthYear,
    currentYearRangeIndex,
    selectionMode,
    converterMode,
  ]);

  const getYearRange = useMemo(() => {
    const yearRange = `${padFourNumber(getDecadeRange(currentYearRangeIndex).start)}-${padFourNumber(getDecadeRange(currentYearRangeIndex).end)}`;
    return lang === 'en' ? yearRange : engToNepNumberFullDate(yearRange);
  }, [currentYearRangeIndex, lang]);

  const isPrevDisabled = () => {
    switch (selectionMode) {
      case 'month':
        return !canGoPrevYear();
      case 'year':
        return !canGoPrevDecade();
      case 'day':
      default:
        return !canGoPrevMonth();
    }
  };

  const isNextDisabled = () => {
    switch (selectionMode) {
      case 'month':
        return !canGoNextYear();
      case 'year':
        return !canGoNextDecade();
      case 'day':
      default:
        return !canGoNextMonth();
    }
  };

  const onNextClick = () => {
    switch (selectionMode) {
      case 'month':
        nextYear();
        break;
      case 'year':
        nextDecade();
        break;
      case 'day':
      default:
        nextMonth();
        break;
    }
  };

  const onPrevClicked = () => {
    switch (selectionMode) {
      case 'month':
        prevYear();
        break;
      case 'year':
        prevDecade();
        break;
      case 'day':
      default:
        prevMonth();
        break;
    }
  };

  const onMonthSelectClicked = () => {
    setSelectionMode('month');
  };

  const onYearSelectClicked = () => {
    setSelectionMode('year');
  };

  const getHeaderYearText = () => {
    return lang === 'en'
      ? padFourNumber(selectedMonthYear?.year || 1)
      : engToNepaliNumber(padFourNumber(selectedMonthYear?.year || 1));
  };

  const getHeaderMonthText = () => {
    if (type === 'BS') {
      return (lang === 'en' ? ENGLISH_NEPALI_MONTH : NEPALI_MONTH)[
        selectedMonthYear?.month || 0
      ];
    } else {
      return (lang === 'en' ? AD_MONTH : AD_MONTH_NEPALI)[
        selectedMonthYear?.month || 0
      ];
    }
  };

  const selectToday = () => {
    // @ts-ignore
    onChange?.(today);
  };

  return (
    <AnimatePresence>
      {show && (
        <Portal
          tabIndex={-1}
          className={cn(
            'zener-date-picker zener-pointer-events-auto zener-absolute zener-z-[9999999999999999999] zener-min-w-[282px] zener-left-0 zener-top-0',
            portalClassName || 'zener-font-sans zener-mt-1',
          )}
          style={{
            transform: `translate(${bounds.left}px,${bounds.height + bounds.top}px)`,
          }}
          ref={portalRef}
        >
          <motion.div
            {...(animation ||
              (animation === null
                ? {}
                : {
                    initial: { opacity: 0, translateY: -5 },
                    animate: { opacity: 1, translateY: 0 },
                    exit: { opacity: 0, translateY: -5 },
                    transition: { duration: 0.2 },
                  }))}
            className={cn(
              'zener-overflow-hidden zener-h-full',
              menuContainerClassName ||
                'zener-bg-menu-container-bg zener-rounded-md zener-shadow-menu zener-text-menu-container-text',
            )}
          >
            {components?.header ? (
              components.header({
                prevClick: onPrevClicked,
                nextClick: onNextClick,
                prevDisabled: isPrevDisabled(),
                nextDisabled: isNextDisabled(),
                selectionMode,
                onMonthSelectClicked,
                onYearSelectClicked,
                monthText: getHeaderMonthText(),
                yearText: getHeaderYearText(),
                monthNumber: selectedMonthYear?.month || 0,
                yearRange: getDecadeRange(currentYearRangeIndex),
                yearNumber: selectedMonthYear?.year || 0,
                yearRangeText: getYearRange,
              })
            ) : (
              <div className="zener-flex zener-flex-row zener-items-center zener-text-sm zener-justify-between zener-py-2 zener-border-0 zener-border-b zener-border-b-menu-container-top-bottom-border zener-border-solid">
                <button
                  className={cn(
                    'month-prev-button zener-p-2 zener-text-menu-header-icon hover:zener-text-menu-header-icon-hover disabled:zener-text-menu-header-icon-disabled',
                    {
                      'zener-cursor-pointer': !isPrevDisabled(),
                      '!zener-cursor-default': isPrevDisabled(),
                    },
                  )}
                  disabled={isPrevDisabled()}
                  onClick={onPrevClicked}
                  tabIndex={-1}
                >
                  <PreviousIcon size={20} />
                </button>
                {(selectionMode === 'day' || selectionMode === 'month') && (
                  <div className="zener-font-semibold zener-flex zener-flex-row zener-items-center">
                    {selectionMode === 'day' && (
                      <button
                        tabIndex={-1}
                        className="zener-py-1 zener-px-1.5 zener-rounded zener-cursor-pointer hover:zener-bg-menu-container-item-hover"
                        onClick={onMonthSelectClicked}
                      >
                        {getHeaderMonthText()}
                      </button>
                    )}
                    <button
                      tabIndex={-1}
                      className="zener-py-1 zener-px-1.5 zener-rounded zener-cursor-pointer hover:zener-bg-menu-container-item-hover"
                      onClick={onYearSelectClicked}
                    >
                      {getHeaderYearText()}
                    </button>
                  </div>
                )}
                {selectionMode === 'year' && (
                  <div className="zener-cursor-default zener-font-semibold zener-flex zener-flex-row zener-items-center">
                    {getYearRange}
                  </div>
                )}
                <button
                  className={cn(
                    'month-next-button zener-p-2 zener-text-menu-header-icon hover:zener-text-menu-header-icon-hover disabled:zener-text-menu-header-icon-disabled',
                    {
                      'zener-cursor-pointer': !isNextDisabled(),
                      '!zener-cursor-default': isNextDisabled(),
                    },
                  )}
                  tabIndex={-1}
                  disabled={isNextDisabled()}
                  onClick={onNextClick}
                >
                  <NextIcon size={20} />
                </button>
              </div>
            )}
            <div className={cn(calendarClassName || 'zener-p-2')}>
              <table className="zener-w-full zener-h-full zener-border-collapse">
                {getSelectionContent}
              </table>
            </div>
            {components?.footer ? (
              components.footer({
                onTodayClick: selectToday,
                todayText,
              })
            ) : (
              <div className="zener-flex zener-flex-row zener-items-center zener-justify-center zener-border-0 zener-border-t zener-border-solid zener-border-t-menu-container-top-bottom-border">
                <button
                  className="zener-text-menu-footer-today zener-font-normal !zener-text-sm zener-p-2 hover:zener-text-menu-footer-today-hover"
                  onClick={selectToday}
                >
                  {todayText}
                </button>
              </div>
            )}
          </motion.div>
        </Portal>
      )}
    </AnimatePresence>
  );
};

export default Menu;

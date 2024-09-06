import { AnimatePresence, motion } from "framer-motion";
import { ReactNode, RefObject, useEffect, useMemo, useState } from "react";
import { Portal } from "@radix-ui/react-portal";
import { IBounds } from "../utils/use-bounds";
import {
  getDateFromNumber,
  getDecadeRange,
  getMonthInfo,
  getYearsArray,
  groupDates,
} from "../utils/calendar";
import {
  cn,
  engToNepNumberFullDate,
  engToNepaliNumber,
  groupArray,
} from "../utils/commons";
import {
  ENGLISH_NEPALI_MONTH,
  ENGLISH_WEEK,
  NEPALI_MONTH,
  NEPALI_TODAY,
  NEPALI_WEEK,
  startDateBS,
  yearMonthDays,
} from "../utils/data";
import { NextIcon, PreviousIcon } from "../icons";
import { IBaseType, IToday } from "./nepali-date-picker";

type ISelectionMode = "day" | "month" | "year";

interface IMenu extends IBaseType {
  show: boolean;
  bounds: IBounds;
  portalRef: RefObject<HTMLDivElement>;
  today: IToday;
  selectedDate: any;
  onNextMonth: () => void;
  onPrevMonth: () => void;
}

const Menu = ({
  show,
  bounds,
  portalRef,
  today,
  onChange,
  onNextMonth,
  onPrevMonth,
  selectedDate,
  lang,
  menuContainerClassName,
  calendarClassName,
  portalClassName,
  footer,
  components,
}: IMenu) => {
  const [selectionMode, setSelectionMode] = useState<ISelectionMode>("day");
  const [currentYearRangeIndex, setCurrentYearRangeIndex] = useState(0);
  const [days, setDays] = useState<
    { day: number; month: "current" | "next" | "prev" }[][]
  >([]);
  const [selectedMonthYear, setSelectedMonthYear] = useState<{
    year: number;
    month: number;
  }>();

  const todayText = lang === "en" ? "Today" : NEPALI_TODAY;

  const changeMonth = ({ m, y }: { m: number; y: number }) => {
    const mI = getMonthInfo({
      year: y,
      //since month index start from 0 but getMonthInfo requires index from 1
      month: m + 1,
    });

    const gD = groupDates({
      ...mI,
      //since month index start from 0 but groupDates requires index from 1
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
    setSelectionMode("day");
  }, [show]);

  useEffect(() => {
    if (today || selectedDate) {
      let y = 0;
      let m = 0;
      if (selectedDate) {
        m = selectedDate.month;
        y = selectedDate.year;
      } else if (today) {
        m = today.month;
        y = today.year;
      }
      changeMonth({ m, y });
    }
  }, [today, selectedDate, show]);

  const canGoNextYear = () => {
    if (!selectedMonthYear) {
      return;
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
    const startBSYear = getDateFromNumber(startDateBS).year;
    const y = (selectedMonthYear?.year || 0) - 1;

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
    const startBSYear = getDateFromNumber(startDateBS).year;
    const endBSYear = startBSYear + yearMonthDays.length - 1;
    if (currentYearRangeIndex < getDecadeRange(endBSYear).start) {
      return true;
    }
    return false;
  };

  const canGoPrevDecade = () => {
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
    const startBSYear = getDateFromNumber(startDateBS);

    if (selectedMonthYear) {
      if (selectedMonthYear.year > startBSYear.year) {
        return true;
      } else if (selectedMonthYear.year === startBSYear.year) {
        return selectedMonthYear.month > 0;
      }
    }

    return false;
  };

  const canGoNextMonth = () => {
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

    //go to previous year and select 12th month if month is negative
    if (m < 0) {
      y = y - 1;
      m = 11;
    }

    //if year is negative let's make ie 0
    if (y < 0) {
      y = 0;
    }
    changeMonth({ m, y });
    onPrevMonth?.();
  };

  const nextMonth = () => {
    if (!selectedMonthYear) {
      return;
    }

    let m = selectedMonthYear.month + 1;
    let y = selectedMonthYear.year;

    //go to next year and select 1st month if m is greater than 11
    if (m > 11) {
      y = y + 1;
      m = 0;
    }

    //if year is negative let's make ie 0
    if (y < 0) {
      y = 0;
    }

    changeMonth({ m, y });
    onNextMonth?.();
  };

  const isSelectedDate = (date: number, month: string) => {
    if (!selectedDate || !selectedMonthYear) {
      return false;
    }
    return (
      selectedDate.year === selectedMonthYear.year &&
      selectedDate.month === selectedMonthYear.month &&
      selectedDate.date === date &&
      month === "current"
    );
  };

  const isTodayDate = (date: number) => {
    if (!today || !selectedMonthYear) {
      return false;
    }
    return (
      today.year === selectedMonthYear.year &&
      today.month === selectedMonthYear.month &&
      date === today.date
    );
  };

  const handleOnChange = (month: string, date: number, day: number) => {
    if (!selectedMonthYear) {
      return;
    }
    const startBSYear = getDateFromNumber(startDateBS);
    const endBSYear = startBSYear.year + yearMonthDays.length - 1;

    let m = selectedMonthYear.month;
    let y = selectedMonthYear.year;

    if (month === "next") {
      if (m > 10) {
        y = y + 1;
        if (y > endBSYear) {
          return;
        }
        m = 0;
      } else {
        m = m + 1;
      }
    } else if (month === "prev") {
      m = m - 1;
      if (m < 0) {
        m = 11;
        y = y - 1;
        if (y < startBSYear.year) {
          y = startBSYear.year;
        }
      }
    }

    onChange?.({
      date,
      year: y,
      month: m,
      day,
    });
  };

  const getSelectionContent = useMemo(() => {
    const num_columns = 3;
    switch (selectionMode) {
      case "month":
        const monthArray = groupArray(
          lang === "en" ? ENGLISH_NEPALI_MONTH : NEPALI_MONTH,
          num_columns,
        );
        const getMonthIndex = (index: number, mIndex: number) =>
          index * num_columns + mIndex;

        const onMonthClicked = (index: number, mIndex: number) => {
          changeMonth({
            m: getMonthIndex(index, mIndex),
            y: selectedMonthYear?.year || 0,
          });
          setSelectionMode("day");
        };

        return (
          <tbody>
            {monthArray.map((ma, index) => (
              <tr key={index}>
                {ma.map((m, mIndex) => (
                  <td key={m}>
                    {components?.month ? (
                      components.month({
                        onClick: () => onMonthClicked(index, mIndex),
                        monthText: m,
                      })
                    ) : (
                      <div
                        className="zener-text-center zener-p-3 zener-group zener-cursor-pointer"
                        onClick={() => onMonthClicked(index, mIndex)}
                      >
                        <div
                          className={cn(
                            "zener-text-sm zener-flex zener-items-center zener-justify-center zener-h-[28px] zener-rounded group-hover:zener-bg-gray-100 zener-text-black",
                          )}
                        >
                          {m}
                        </div>
                      </div>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        );
      case "year":
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
          setSelectionMode("month");
        };
        return (
          <tbody>
            {groupedYears.map((ma, index) => (
              <tr key={index}>
                {ma.map((m, mIndex) => {
                  const yearText = lang == "en" ? m : engToNepaliNumber(m);
                  return (
                    <td key={m}>
                      {components?.year ? (
                        components.year({
                          onClick: () => onYearClicked(index, mIndex),
                          yearText,
                        })
                      ) : (
                        <div
                          className="zener-text-center zener-p-3 zener-group zener-cursor-pointer"
                          onClick={() => onYearClicked}
                        >
                          <div
                            className={cn(
                              "zener-text-sm zener-flex zener-items-center zener-justify-center zener-h-[28px] zener-rounded group-hover:zener-bg-gray-100 zener-text-black",
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
            ))}
          </tbody>
        );
      case "day":
      default:
        const onDayClicked = (month: string, date: number, day: number) =>
          handleOnChange(month, date, day);
        return (
          <>
            <thead>
              <tr className="zener-text-sm zener-text-black">
                {(lang === "en" ? ENGLISH_WEEK : NEPALI_WEEK).map((week) => (
                  <th key={week}>
                    <div className="zener-w-[28px] zener-h-[28px] zener-flex zener-items-center zener-justify-center zener-font-normal">
                      {week}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {days.map((d, i) => (
                <tr key={i}>
                  {d.map((dd, index) => {
                    const isSelected = isSelectedDate(dd.day, dd.month);
                    const isToday = isTodayDate(dd.day);
                    const dateText =
                      lang == "en" ? dd.day : engToNepaliNumber(dd.day);
                    return (
                      <td key={dd.day}>
                        {components?.date ? (
                          components.date({
                            dateMonth: dd.month,
                            dateText,
                            isSelected,
                            isToday,
                            onClick: () =>
                              onDayClicked(dd.month, dd.day, index),
                          })
                        ) : (
                          <div
                            className="zener-text-center zener-p-1 zener-group zener-cursor-pointer"
                            onClick={() =>
                              onDayClicked(dd.month, dd.day, index)
                            }
                          >
                            <div
                              className={cn(
                                "zener-text-sm zener-flex zener-items-center zener-justify-center zener-h-[28px] zener-w-[28px] zener-rounded",
                                {
                                  "zener-text-gray-300": dd.month !== "current",
                                  "zener-text-black": dd.month === "current",
                                  "zener-border zener-border-solid zener-box-border zener-border-[#1D2275] ":
                                    isToday,
                                  "zener-bg-[#1D2275] zener-text-white zener-transition-none":
                                    isSelected && dd.month === "current",
                                  "group-hover:zener-bg-gray-100": !isSelected,
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
              ))}
            </tbody>
          </>
        );
    }
  }, [lang, selectedMonthYear, currentYearRangeIndex, selectionMode]);

  const getYearRange = useMemo(() => {
    const yearRange = `${getDecadeRange(currentYearRangeIndex).start}-${getDecadeRange(currentYearRangeIndex).end}`;
    return lang === "en" ? yearRange : engToNepNumberFullDate(yearRange);
  }, [currentYearRangeIndex]);

  const isPrevDisabled = () => {
    switch (selectionMode) {
      case "month":
        return !canGoPrevYear();
      case "year":
        return !canGoPrevDecade();
      case "day":
      default:
        return !canGoPrevMonth();
    }
  };

  const isNextDisabled = () => {
    switch (selectionMode) {
      case "month":
        return !canGoNextYear();
      case "year":
        return !canGoNextDecade();
      case "day":
      default:
        return !canGoNextMonth();
    }
  };

  const selectToday = () => {
    onChange?.(today);
  };

  return (
    <AnimatePresence>
      {show && (
        <Portal
          tabIndex={-1}
          className={cn(
            "zener-date-picker zener-pointer-events-auto zener-absolute zener-z-[9999999999999999999]",
            portalClassName || "zener-font-sans zener-mt-1",
          )}
          style={{
            left: bounds.left,
            top: bounds.top + bounds.height,
            minWidth: 280,
            // maxWidth: 280,
          }}
          ref={portalRef}
        >
          <motion.div
            {...{
              initial: { opacity: 0, translateY: -5 },
              animate: { opacity: 1, translateY: 0 },
              exit: { opacity: 0, translateY: -5 },
              transition: { duration: 0.2 },
            }}
            className={cn(
              "zener-overflow-hidden zener-h-full",
              menuContainerClassName ||
                "zener-bg-white zener-rounded-md zener-shadow-menu",
            )}
          >
            <div className="zener-flex zener-flex-row zener-items-center zener-text-sm zener-justify-between zener-py-2 zener-border-0 zener-border-b zener-border-b-gray-300 zener-border-solid">
              <button
                className="month-prev-button zener-p-2 zener-cursor-pointer zener-text-gray-400 hover:zener-text-black disabled:zener-text-gray-200"
                disabled={isPrevDisabled()}
                onClick={() => {
                  switch (selectionMode) {
                    case "day":
                      prevMonth();
                      break;
                    case "month":
                      prevYear();
                      break;
                    case "year":
                      prevDecade();
                      break;
                  }
                }}
                tabIndex={-1}
              >
                <PreviousIcon size={20} />
              </button>
              {(selectionMode === "day" || selectionMode === "month") && (
                <div className="zener-font-semibold zener-flex zener-flex-row zener-items-center">
                  {selectionMode === "day" && (
                    <button
                      tabIndex={-1}
                      className="zener-py-1 zener-px-1.5 zener-rounded zener-cursor-pointer zener-text-black hover:zener-bg-gray-100"
                      onClick={() => {
                        setSelectionMode("month");
                      }}
                    >
                      {
                        (lang === "en" ? ENGLISH_NEPALI_MONTH : NEPALI_MONTH)[
                          selectedMonthYear?.month || 0
                        ]
                      }
                    </button>
                  )}
                  <button
                    tabIndex={-1}
                    className="zener-py-1 zener-px-1.5 zener-rounded zener-cursor-pointer zener-text-black hover:zener-bg-gray-100"
                    onClick={() => {
                      setSelectionMode("year");
                    }}
                  >
                    {lang === "en"
                      ? selectedMonthYear?.year
                      : engToNepaliNumber(selectedMonthYear?.year || 0)}
                  </button>
                </div>
              )}
              {selectionMode === "year" && (
                <div className="zener-cursor-default zener-font-semibold zener-flex zener-flex-row zener-items-center">
                  {getYearRange}
                </div>
              )}
              <button
                className="month-next-button zener-p-2 zener-cursor-pointer zener-text-gray-400 hover:zener-text-black disabled:zener-text-gray-200"
                tabIndex={-1}
                disabled={isNextDisabled()}
                onClick={() => {
                  switch (selectionMode) {
                    case "day":
                      nextMonth();
                      break;
                    case "month":
                      nextYear();
                      break;
                    case "year":
                      nextDecade();
                      break;
                  }
                }}
              >
                <NextIcon size={20} />
              </button>
            </div>
            <div className={cn(calendarClassName || "zener-p-2")}>
              <table className="zener-w-full zener-h-full zener-border-collapse">
                {getSelectionContent}
              </table>
            </div>
            {footer ? (
              footer({
                onTodayClick: selectToday,
                todayText,
              })
            ) : (
              <div className="zener-flex zener-flex-row zener-items-center zener-justify-center zener-border-0 zener-border-t zener-border-solid zener-border-t-gray-300">
                <button
                  className="zener-text-[#1D2275] zener-font-normal !zener-text-sm zener-p-2 hover:zener-text-black"
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

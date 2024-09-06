import { ReactNode, useEffect, useRef, useState } from "react";
import Menu from "./menu";
import useBounds from "../utils/use-bounds";
import { cn, engToNepNumberFullDate } from "../utils/commons";
import {
  getCurrentDate,
  parseDateFromString,
  reg,
  stringDateFormatter,
} from "../utils/calendar";
import { NEPALI_DIGITS_TO_ENG } from "../utils/data";

export type ILang = "np" | "en";

export type IDateJSON = {
  date: number;
  year: number;
  month: number;
};

export interface IOnChange extends IDateJSON {
  day: number;
  toString: () => string;
}

export type IToday = ReturnType<typeof getCurrentDate>;

export type IBaseType = {
  onChange?: (date: IOnChange) => void;
  lang?: ILang;
  portalClassName?: string;
  menuContainerClassName?: string;
  calendarClassName?: string;
  footer?: (props: {
    onTodayClick: () => void;
    todayText: string;
  }) => ReactNode;
  header?: (props: any) => ReactNode;
  components?: {
    date: (props: {
      onClick: () => void;
      dateMonth: "current" | "prev" | "next";
      isToday: boolean;
      isSelected: boolean;
      dateText: string | number;
    }) => ReactNode;
    year: (props: {
      onClick: () => void;
      yearText: string | number;
    }) => ReactNode;
    month: (props: {
      onClick: () => void;
      monthText: string | number;
    }) => ReactNode;
  };
};

interface INepaliDatePicker extends IBaseType {
  open?: boolean;
  disabled?: boolean;
  placeholder?: string;
  prefix?: ReactNode;
  suffix?: ReactNode;
  showclear?: boolean;
  value?: string;
  className?: string;
}

const convertToLang = (lang: ILang, value: string) => {
  switch (lang) {
    case "en":
      return value;
    case "np":
    default: {
      return engToNepNumberFullDate(value);
    }
  }
};

const convertToEnglish = (value: string) => {
  let x = value.split("").map((v) => {
    //@ts-ignore
    if (NEPALI_DIGITS_TO_ENG[v]) {
      //@ts-ignore
      return NEPALI_DIGITS_TO_ENG[v];
    } else {
      return v;
    }
  });

  return x.join("");
};

const NepaliDatePicker = ({
  open,
  disabled,
  placeholder,
  onChange,
  className,
  value,
  lang = "np",
  menuContainerClassName,
  calendarClassName,
  portalClassName,
  footer,
  header,
  components,
}: INepaliDatePicker) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);
  const [selectedDate, setSelectedDate] = useState<IDateJSON>();
  const [inputValue, setInputValue] = useState<any>("");
  const [today, setToday] = useState(getCurrentDate({ type: "np" }));

  const { bounds } = useBounds({ inputRef });

  useEffect(() => {
    const d = getCurrentDate({ type: "np" });
    setToday(d);
  }, []);

  useEffect(() => {
    if (!selectedDate) {
      return;
    }
    setInputValue(
      stringDateFormatter({
        year: selectedDate.year,
        month: selectedDate.month + 1,
        date: selectedDate.date,
      }),
    );
  }, [selectedDate]);

  const closeMenu = () => {
    setShow(false);
  };

  useEffect(() => {
    setShow(!!open);
  }, [open]);

  useEffect(() => {
    if (value) {
      const parsed = parseDateFromString(value);
      if (parsed) {
        const { year, month, date } = parsed;
        setSelectedDate({ year, date, month: month - 1 });
      }
    }
  }, [value]);

  return (
    <div>
      <input
        tabIndex={0}
        ref={inputRef}
        type="text"
        role="textbox"
        disabled={disabled}
        className={cn(
          className || {
            "zener-relative zener-flex zener-flex-row zener-items-center": true,
            "zener-font-sans zener-bg-white zener-text-sm": true,
            "disabled:zener-text-black/25 disabled:zener-bg-black/5 disabled:zener-border-stone-100":
              true,
            "focus:zener-ring-1 focus:zener-ring-blue-400 zener-outline-none":
              true,
            "zener-border-solid zener-border zener-border-stone-200 zener-rounded ":
              true,
            "zener-min-h-[24px] zener-px-2 zener-py-0.5 zener-min-w-[50px]":
              true,
          },
        )}
        onClick={() => {
          if (!disabled) {
            setShow((prev) => !prev);
          }
        }}
        onBlur={(e) => {
          const rT = e.relatedTarget;
          const isInMenu = portalRef.current?.contains(rT);
          if (isInMenu) {
            inputRef.current?.focus();
            return;
          }
          if (!inputValue && selectedDate) {
            setInputValue(
              stringDateFormatter({
                year: selectedDate.year,
                month: selectedDate.month + 1,
                date: selectedDate.date,
              }),
            );
          }
          closeMenu();
        }}
        onFocus={() => {}}
        value={convertToLang(lang, inputValue)}
        onChange={(e) => {
          const value = e.target.value;
          const v = convertToEnglish(value);
          setInputValue(v);

          const parsed = parseDateFromString(v);
          if (parsed) {
            const { date, month, year } = parsed;
            setSelectedDate({
              year,
              month: month - 1,
              date,
            });
          }

          setShow(true);
        }}
        onKeyDown={(e) => {
          if (disabled) {
            return;
          }
          const { code, ctrlKey } = e;

          switch (code) {
            case "Enter":
              {
                e.preventDefault();
                const value = convertToEnglish(inputValue);
                if (reg.test(value)) {
                  setShow(false);
                }
              }
              break;
            case "ArrowUp":
            case "ArrowDown":
              e.preventDefault();
              if (!show) {
                setShow(true);
                break;
              }
              break;
            case "Space":
              if (ctrlKey) {
                e.preventDefault();
                if (show) {
                  setShow(false);
                } else {
                  setShow(true);
                }
              }
              break;
            case "Escape":
              e.preventDefault();
              closeMenu();
              break;
            default:
              break;
          }
        }}
        placeholder={placeholder}
      />
      <Menu
        lang={lang}
        portalRef={portalRef}
        show={show}
        bounds={bounds}
        today={today}
        selectedDate={selectedDate}
        onChange={(e) => {
          const { month } = e;
          setSelectedDate(e);
          onChange?.({
            ...e,
            toString: () => stringDateFormatter({ ...e, month: month + 1 }),
          });
          closeMenu();
        }}
        onNextMonth={() => {}}
        onPrevMonth={() => {}}
        menuContainerClassName={menuContainerClassName}
        portalClassName={portalClassName}
        calendarClassName={calendarClassName}
        footer={footer}
        header={header}
        components={components}
      />
    </div>
  );
};

export default NepaliDatePicker;

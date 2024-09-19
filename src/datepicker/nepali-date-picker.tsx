import { ReactNode, useEffect, useRef, useState } from 'react';
import { AnimationProps } from 'framer-motion';
import Menu from './menu';
import useBounds from '../utils/use-bounds';
import { cn, engToNepNumberFullDate } from '../utils/commons';
import { reg, stringDateFormatter } from '../utils/calendar';
import { NEPALI_DIGITS_TO_ENG } from '../utils/data';
import { CloseIcon } from '../icons';
import { NepaliDate } from '../utils/nepali-date';

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
}

const convertToLang = (lang: ILang, value: string) => {
  switch (lang) {
    case 'en':
      return value;
    case 'np':
    default: {
      return engToNepNumberFullDate(value);
    }
  }
};

const convertToEnglish = (value: string) => {
  const x = value.split('').map((v) => {
    // @ts-ignore
    if (NEPALI_DIGITS_TO_ENG[v]) {
      // @ts-ignore
      return NEPALI_DIGITS_TO_ENG[v];
    } else {
      return v;
    }
  });

  return x.join('');
};

const NepaliDatePicker = <T extends keyof DateTypeMap | undefined = 'BS'>({
  type = 'BS',
  open,
  disabled,
  placeholder,
  onChange,
  className,
  value,
  lang = 'np',
  menuContainerClassName,
  calendarClassName,
  portalClassName,
  components,
  prefix,
  suffix,
  showclear = true,
  converterMode,
  animation,
}: INepaliDatePicker<T>) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);
  const [selectedDate, setSelectedDate] = useState<NepaliDate | Date | null>();
  const [inputValue, setInputValue] = useState<any>('');
  const [today, setToday] = useState(
    type === 'BS' ? new NepaliDate() : new Date(),
  );

  const { bounds } = useBounds({ inputRef: containerRef });

  useEffect(() => {
    setToday(type === 'BS' ? new NepaliDate() : new Date());
  }, []);

  useEffect(() => {
    if (selectedDate) {
      if (type === 'BS') {
        setInputValue(selectedDate.toString());
      } else {
        setInputValue(
          stringDateFormatter({
            year: selectedDate.getFullYear() as number,
            month: (selectedDate.getMonth() as number) + 1,
            date: selectedDate.getDate() as number,
          }),
        );
      }
    } else {
      setInputValue('');
    }
  }, [selectedDate]);

  useEffect(() => {
    if (!selectedDate) {
      setToday(type === 'BS' ? new NepaliDate() : new Date());
    }
  }, [type]);

  const closeMenu = () => {
    if (!open) {
      setShow(false);
    }
  };

  useEffect(() => {
    setShow(!!open);
  }, [open]);

  useEffect(() => {
    if (value) {
      switch (type) {
        case 'AD':
          if (typeof value === 'string' || value instanceof Date) {
            setSelectedDate(new Date(value));
          }
          break;
        case 'BS':
        default:
          if (typeof value === 'string' || value instanceof NepaliDate) {
            setSelectedDate(new NepaliDate(value));
          }
          break;
      }
    } else {
      setSelectedDate(null);
    }
  }, [value]);

  // set focus on input container
  const setFocus = () => {
    if (disabled) {
      return;
    }

    if (className && typeof className === 'function' && !!className().focus) {
      containerRef.current?.classList.add(
        ...(className().focus?.split(' ') || ['']),
      );
    }
  };

  // remove focus from input container
  const removeFocus = () => {
    if (className && typeof className === 'function' && !!className().focus) {
      containerRef.current?.classList.remove(
        ...(className().focus?.split(' ') || ['']),
      );
      containerRef.current?.classList.add(
        ...(className().default?.split(' ') || ['']),
      );
    }
  };

  const clear = () => {
    setSelectedDate(undefined);
    onChange?.(null);
  };

  return (
    <div className="zener-w-full">
      <div
        ref={containerRef}
        className={cn(
          'zener-relative zener-flex zener-flex-row zener-items-center',
          {
            'zener-text-black/25 zener-bg-black/5 zener-border-stone-100':
              !className && !!disabled,
          },
          className && typeof className === 'function'
            ? `${disabled ? className().disabled : className().default}`
            : className ||
                `${!disabled ? 'focus:zener-ring-1 focus:zener-ring-blue-400 focus-within:zener-ring-1 focus-within:zener-ring-blue-400' : ''} zener-font-sans zener-bg-white zener-text-sm zener-px-2 zener-py-0.5 zener-border-solid zener-border zener-border-stone-200 zener-rounded zener-min-w-[122px] zener-outline-none zener-w-full`,
        )}
        onFocus={() => {
          if (disabled) {
            return;
          }
          setFocus();
        }}
        onBlur={() => {
          removeFocus();
        }}
      >
        {prefix && <div>{prefix}</div>}
        <input
          className="zener-outline-none zener-border-0 zener-w-fit zener-bg-transparent zener-flex-1 zener-text-inherit zener-min-h-[24px]"
          size={10}
          tabIndex={0}
          ref={inputRef}
          type="text"
          disabled={disabled}
          onClick={() => {
            if (!disabled) {
              if (!open) {
                setShow((prev) => !prev);
              }
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
              setInputValue(selectedDate.toString());
            }
            removeFocus();
            closeMenu();
          }}
          onFocus={() => {
            if (disabled) {
              return;
            }
            setFocus();
          }}
          value={convertToLang(lang, inputValue)}
          onChange={(e) => {
            const { value } = e.target;
            const v = convertToEnglish(value);
            setInputValue(v);

            const parsed = NepaliDate.parseDate(v);
            if (parsed) {
              const d = new NepaliDate(v);
              setSelectedDate(d);
            }

            setShow(true);
          }}
          onKeyDown={(e) => {
            if (disabled) {
              return;
            }
            const { code, ctrlKey } = e;

            switch (code) {
              case 'Enter':
                {
                  e.preventDefault();
                  const value = convertToEnglish(inputValue);
                  if (reg.test(value)) {
                    setShow(false);
                  }
                }
                break;
              case 'ArrowUp':
              case 'ArrowDown':
                e.preventDefault();
                if (!show) {
                  setShow(true);
                  break;
                }
                break;
              case 'Space':
                if (ctrlKey) {
                  e.preventDefault();
                  if (show) {
                    setShow(false);
                  } else {
                    setShow(true);
                  }
                }
                break;
              case 'Escape':
                e.preventDefault();
                closeMenu();
                break;
              default:
                break;
            }
          }}
          placeholder={placeholder}
        />
        {/* Suffix aka clear and dropdown icon */}

        {suffix?.({
          onClear: clear,
          isOpen: show || !!open,
          showclear,
        }) || (
          <div
            tabIndex={-1}
            className="zener-flex zener-flex-row zener-items-center gap-2 zener-h-full zener-text-inherit"
          >
            {showclear && !disabled && !!inputValue && (
              <button
                aria-label="clear"
                onClick={(e) => {
                  e.stopPropagation();
                  clear();
                }}
                tabIndex={-1}
                className="zener-cursor-pointer zener-outline-none zener-border-0 zener-opacity-80 hover:zener-opacity-100 zener-transition-all zener-bg-transparent zener-flex zener-items-center zener-justify-center zener-text-inherit"
              >
                <CloseIcon size={16} />
              </button>
            )}
          </div>
        )}
      </div>
      <Menu
        lang={lang}
        portalRef={portalRef}
        show={show}
        bounds={bounds}
        today={today}
        selectedDate={selectedDate}
        onChange={(e) => {
          setSelectedDate(e);
          // @ts-ignore
          onChange?.(e);
          closeMenu();
          inputRef.current?.focus();
        }}
        onNextMonth={() => {}}
        onPrevMonth={() => {}}
        menuContainerClassName={menuContainerClassName}
        portalClassName={portalClassName}
        calendarClassName={calendarClassName}
        components={components}
        type={type}
        converterMode={converterMode}
        animation={animation}
      />
    </div>
  );
};

export default NepaliDatePicker;

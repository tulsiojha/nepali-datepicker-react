import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import NepaliDate, { formatADDate } from '@zener/nepali-date';
import Menu from './menu';
import useBounds from '../utils/use-bounds';
import { cn } from '../utils/commons';
import { CloseIcon } from '../icons';
import { DateTypeMap, INepaliDatePicker } from './types';

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
  format = 'YYYY-MM-DD',
}: INepaliDatePicker<T>) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);
  const [selectedDate, setSelectedDate] = useState<NepaliDate | Date | null>();
  const [inputValue, setInputValue] = useState<string>('');
  const [today, setToday] = useState(
    type === 'BS' ? new NepaliDate() : new Date(),
  );

  const { bounds } = useBounds(containerRef, [show, open]);

  useEffect(() => {
    setToday(type === 'BS' ? new NepaliDate() : new Date());
  }, []);

  useEffect(() => {
    setToday(type === 'BS' ? new NepaliDate() : new Date());
  }, [type]);

  useEffect(() => {
    if (selectedDate) {
      if (type === 'BS') {
        setInputValue((selectedDate as NepaliDate).format(format, lang));
      } else {
        setInputValue(formatADDate(selectedDate as Date, format, lang));
      }
    } else {
      setInputValue('');
    }
  }, [selectedDate]);

  const closeMenu = () => {
    if (!open) {
      setShow(false);
    }
  };

  useLayoutEffect(() => {
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
  }, [value, lang, type, format]);

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
            'zener-text-input-disabled-text zener-bg-input-disabled-bg zener-border-input-disabled-border':
              !className && !!disabled,
          },
          className && typeof className === 'function'
            ? `${disabled ? className().disabled : className().default}`
            : className ||
                `${!disabled ? 'focus:zener-ring-1 focus:zener-ring-input-focus-ring focus-within:zener-ring-1 focus-within:zener-ring-input-focus-ring' : ''} zener-font-sans zener-bg-input-bg zener-text-sm zener-px-2 zener-py-0.5 zener-border-solid zener-border zener-border-input-border zener-rounded zener-min-w-[122px] zener-outline-none zener-w-full zener-text-input-text`,
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
          readOnly
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
          value={inputValue}
          onKeyDown={(e) => {
            if (disabled) {
              return;
            }
            const { code, ctrlKey } = e;

            switch (code) {
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
        {/* Suffix -- clear and dropdown icon */}

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
        }}
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

import { useState } from 'react';
import ReactDOM from 'react-dom/client';
import NepaliDatePicker, { NepaliDate } from './datepicker';
import { NextIcon, PreviousIcon } from './icons';
import { getDateFromNumber, stringDateFormatter } from './utils/calendar';
import { cn } from './utils/commons';
import { baishakOne } from './utils/data';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

const App1 = () => {
  const [value, setValue] = useState<Date | null>(new Date());
  const [lang, setLang] = useState<'np' | 'en'>('np');
  return (
    <div className="flex flex-col gap-2">
      <NepaliDatePicker
        value={value}
        onChange={(e) => setValue(e)}
        type="AD"
        placeholder={lang === 'np' ? 'मिति चयन गर्नुहोस्' : 'Select date'}
        lang={lang}
        format="dddd, MMMM DD YYYY"
      />
      <div className="flex flex-row items-center gap-4">
        <label htmlFor="np" className="flex flex-row gap-1 items-center">
          <input
            type="radio"
            id="np"
            value="np"
            checked={lang === 'np'}
            onChange={(e) => {
              setLang(e.target.value as 'np');
            }}
          />
          <span className="text-sm select-none">नेपाली</span>
        </label>
        <label htmlFor="en" className="flex flex-row gap-1 items-center">
          <input
            type="radio"
            id="en"
            value="en"
            checked={lang === 'en'}
            onChange={(e) => {
              setLang(e.target.value as 'en');
            }}
          />
          <span className="text-sm select-none">English</span>
        </label>
      </div>
    </div>
  );
};

const App = () => {
  const [value, setValue] = useState<NepaliDate | Date | null>(
    new NepaliDate(),
  );
  const [expanded, setExpanded] = useState(false);
  // console.log("date", d.toAD(), d.toJson(), x.toString())

  return (
    <div>
      <App1 />
      <div>{new NepaliDate().format('DD/MM/YYYY')}</div>
      <div>{new NepaliDate().format('YYYY-MM-DD')}</div>
      <div>{new NepaliDate().format('YYYY-M-D')}</div>
      <div>{new NepaliDate().format('MMMM DD, YYYY')}</div>

      <div>{new NepaliDate().format('MMM DD, YYYY, dd')}</div>
      <div>{new NepaliDate().format('[YYYYescape] YYYY-MM-DD')}</div>
      <button
        onClick={() => {
          function iterateDates(startDate: any, endDate: any) {
            const currentDate = new Date(startDate);
            const finalDate = new Date(endDate);

            while (currentDate <= finalDate) {
              const d = currentDate.toISOString().split('T')[0];
              // console.log(); // Print date in YYYY-MM-DD format
              const np = new NepaliDate(currentDate);
              console.log(
                'date.....',
                d ===
                  stringDateFormatter(
                    getDateFromNumber(
                      baishakOne[(np.getFullYear() as number) - 2000],
                    ),
                  )
                  ? d
                  : '',
              );
              // Increment date by 1 day
              currentDate.setDate(currentDate.getDate() + 1);
            }
          }

          const startDate = '1943-04-14';
          const endDate = '2033-04-13';

          iterateDates(startDate, endDate);
        }}
      >
        itetrate
      </button>
      <button onClick={() => setExpanded((prev) => !prev)}>expand</button>
      {expanded && (
        <div>
          The skeleton of every application is routing. This page will introduce
          you to the fundamental concepts of routing for the web and how to
          handle routing in Next.js. The skeleton of every application is
          routing. This page will introduce you to the fundamental concepts of
          routing for the web and how to handle routing in Next.js. The skeleton
          of every application is routing. This page will introduce you to the
          fundamental concepts of routing for the web and how to handle routing
        </div>
      )}
      <NepaliDatePicker
        value={value}
        onChange={(e) => {
          setValue(e);
        }}
        lang="en"
        placeholder="Select date"
        format="dddd, DD MMMM YYYY"
      />
      <NepaliDatePicker
        type="AD"
        onChange={(e) => {}}
        placeholder="Select date"
        open
        className={() => {
          const cc =
            'zener-p-1 zener-bg-[#020408] zener-rounded focus:zener-ring-1 focus:zener-ring-sky-400 focus-within:zener-ring-1 focus-within:zener-ring-sky-400 zener-w-fit zener-min-w-[122px] zener-min-h-[26px] zener-box-border';
          const c = 'zener-text-white';
          const d = 'zener-text-gray-400';
          return { focus: cn(c, cc), default: cn(c, cc), disabled: cn(cc, d) };
        }}
        menuContainerClassName="zener-bg-[#020408] zener-rounded zener-shadow-menu"
        components={{
          date: ({
            dateText,
            dateMonthType,
            isToday,
            isSelected,
            onClick,
            isDisabled,
          }) => {
            return (
              <div
                onClick={onClick}
                className={cn(
                  'zener-flex zener-items-center zener-justify-center zener-text-center zener-rounded zener-h-[28px] zener-w-[28px]',
                  {
                    'zener-text-white ': dateMonthType === 'current',
                    'zener-text-gray-500 ': dateMonthType !== 'current',
                    'zener-border zener-border-blue-400 zener-border-solid':
                      isToday,
                    'hover:zener-bg-gray-700': !isSelected && !isDisabled,
                    'zener-bg-blue-400': isSelected,
                    'zener-cursor-pointer ': !isDisabled,
                    'zener-cursor-default': isDisabled,
                  },
                )}
              >
                {dateText}
              </div>
            );
          },
          week: ({ weekText }) => (
            <div className="zener-py-1 zener-text-white zener-font-thin">
              {weekText}
            </div>
          ),
          footer: ({ todayText, onTodayClick }) => {
            return (
              <div className="zener-py-2 zener-h-full zener-w-full zener-flex zener-items-center zener-justify-center zener-border-0 zener-border-t zener-border-t-gray-500 zener-border-solid">
                <button
                  className="zener-text-blue-400 hover:zener-text-blue-300 zener-bg-transparent zener-outline-none"
                  onClick={onTodayClick}
                >
                  {todayText}
                </button>
              </div>
            );
          },
          header: ({
            monthText,
            yearText,
            selectionMode,
            onMonthSelectClicked,
            onYearSelectClicked,
            yearRangeText,
            prevClick,
            prevDisabled,
            nextClick,
            nextDisabled,
          }) => {
            return (
              <div className="zener-flex zener-flex-row zener-items-center zener-justify-between zener-font-semibold zener-text-white zener-py-2 zener-border-0 zener-border-b zener-border-b-gray-500 zener-border-solid">
                <button
                  className="zener-p-2 zener-cursor-pointer zener-text-gray-400 hover:zener-text-gray-300 disabled:zener-text-gray-600"
                  disabled={prevDisabled}
                  onClick={prevClick}
                  tabIndex={-1}
                >
                  <PreviousIcon size={20} />
                </button>
                {(selectionMode === 'day' || selectionMode === 'month') && (
                  <div className="zener-flex zener-flex-row zener-items-center zener-justify-center">
                    {selectionMode === 'day' && (
                      <button
                        onClick={onMonthSelectClicked}
                        className="zener-text-inherit hover:zener-bg-gray-700 zener-rounded"
                      >
                        {monthText}
                      </button>
                    )}
                    <button
                      onClick={onYearSelectClicked}
                      className="zener-text-inherit hover:zener-bg-gray-700 zener-rounded"
                    >
                      {yearText}
                    </button>
                  </div>
                )}
                {selectionMode === 'year' && (
                  <div className="zener-cursor-default zener-text-center">
                    {yearRangeText}
                  </div>
                )}

                <button
                  className="zener-p-2 zener-cursor-pointer zener-text-gray-400 hover:zener-text-gray-300 disabled:zener-text-gray-600"
                  tabIndex={-1}
                  disabled={nextDisabled}
                  onClick={nextClick}
                >
                  <NextIcon size={20} />
                </button>
              </div>
            );
          },
          year: ({ onClick, yearText }) => {
            return (
              <div
                onClick={onClick}
                className="zener-text-center zener-p-3 zener-group zener-cursor-pointer"
              >
                <div className="zener-text-sm zener-flex zener-items-center zener-justify-center zener-h-[28px] zener-rounded group-hover:zener-bg-gray-700 zener-text-white">
                  {yearText}
                </div>
              </div>
            );
          },
          month: ({ onClick, monthText }) => {
            return (
              <div
                onClick={onClick}
                className="zener-text-center zener-p-3 zener-group zener-cursor-pointer"
              >
                <div className="zener-text-sm zener-flex zener-items-center zener-justify-center zener-h-[28px] zener-rounded group-hover:zener-bg-gray-700 zener-text-white">
                  {monthText}
                </div>
              </div>
            );
          },
        }}
      />
    </div>
  );
};

root.render(
  <div>
    <div>
      <App />
    </div>
  </div>,
);

import ReactDOM from 'react-dom/client';
import NepaliDatePicker from './select';
import { useState } from 'react';
import { cn } from './utils/commons';
import { NextIcon, PreviousIcon } from './icons';
import { NepaliDate, toAD, toBS } from './utils/nepali-date-picker';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
const App = () => {
  const [value, setValue] = useState('2053-10-19');
  console.log(toBS('1943-4-14'));
  return (
    <div>
      <NepaliDatePicker
        value={value}
        onChange={(e) => {
          console.log(e);
          setValue(e.toString());
        }}
        placeholder="Select date"
      />
      {JSON.stringify(value)}

      <NepaliDatePicker
        value={value}
        onChange={(e) => {
          console.log(e);
          setValue(e.toString());
        }}
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
          date: ({ dateText, dateMonthType, isToday, isSelected, onClick }) => {
            return (
              <div
                onClick={onClick}
                className={cn(
                  'zener-flex zener-items-center zener-justify-center zener-text-center zener-rounded zener-cursor-pointer zener-h-[28px] zener-w-[28px]',
                  {
                    'zener-text-white ': dateMonthType === 'current',
                    'zener-text-gray-500 ': dateMonthType !== 'current',
                    'zener-border zener-border-blue-400 zener-border-solid':
                      isToday,
                    'hover:zener-bg-gray-700': !isSelected,
                    'zener-bg-blue-400': isSelected,
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
  <div style={{ width: '200vw', height: '200vh' }}>
    <div
      style={{
        width: '50vw',
        marginLeft: '300px',
        marginTop: '300px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}
    >
      <App />
    </div>
  </div>,
);

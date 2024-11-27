import { useState } from 'react';
import ReactDOM from 'react-dom/client';
import NepaliDatePicker, { NepaliDate } from './datepicker';

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
        type="AD"
        onChange={(e) => setValue(e)}
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
          /* function iterateDates(startDate: any, endDate: any) {
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
          } */
          /* const startDate = '1943-04-14'; */
          /* const endDate = '2033-04-13'; */
          /* iterateDates(startDate, endDate); */
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
        min={new NepaliDate()}
        max={new NepaliDate().add(5, 'y')}
      />
      <NepaliDatePicker
        type="AD"
        onChange={() => {}}
        value={new Date('2024-11-26')}
        placeholder="Select date"
        min={new Date()}
        max={new Date('2030-11-27')}
        open
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

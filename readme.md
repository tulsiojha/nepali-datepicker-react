# Nepali Datepicker React

Nepali Datepicker React is a lightweight, highly customizable, and feature-rich datepicker component, specifically designed for handling Nepali dates in React.js applications. It offers seamless integration, intuitive user experience, and extensive configuration options.

<a href="https://nepali-datepicker-react.ojhabikash.com.np/">Demo</a>

<img src="/images/nepali-datepicker-react.png" alt="Minimal Example"/>

## Table of Content
- [Nepali datepicker react](#nepali-datepicker-react)
- [Documentation](https://nepali-datepicker-react.ojhabikash.com.np/docs/quick-setup)
- [Installation](#installation)
- [Usage](#usage)
- [Features](#Features)

## Installation

You can install the Nepali Datepicker React component via [npm](https://www.npmjs.com/):

```bash
npm i @zener/nepali-datepicker-react
```
## Usage

#### Basic Implementation

```jsx
import NepaliDatePicker from '@zener/nepali-datepicker-react';
import '@zener/nepali-datepicker-react/index.css';

const App = () => {
  const [value, setValue] = useState()
  return (
    <NepaliDatePicker
      value={value}
      onChange={(e) => {
        setValue(e);
      }}
      placeholder="Select date"
    />
  );
};
```


## Features
- Fully customizable components
- Date converter
- Nepali and english language support
- Supports both Bikram Sambat and Gregorian calendar
- Javascript NepaliDate utility to deal with dates
- Written in TypeScript

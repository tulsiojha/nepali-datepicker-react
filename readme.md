# Nepali Datepicker React

Nepali Datepicker React is a lightweight, highly customizable, and feature-rich datepicker component, specifically designed for handling Nepali dates in React.js applications. It offers seamless integration, intuitive user experience, and extensive configuration options.

<img src="/images/nepali-datepicker-react.png" alt="Minimal Example" style="max-height:150px"/>

## Table of Content
- [Nepali datepicker react](#nepali-datepicker-react)
- [Installation](#installation)
- [Usage](#usage)

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

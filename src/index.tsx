import ReactDOM from "react-dom/client";
import NepaliDatePicker from "./select";
import { useState } from "react";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);
const App = () => {
  const [value, setValue] = useState("2053-10-19");
  return (
    <div>
      <NepaliDatePicker
        value={value}
        onChange={(e) => {
          console.log(e);
          setValue(e.toString());
        }}
      />
      {JSON.stringify(value)}
    </div>
  );
};

root.render(
  <div style={{ width: "200vw", height: "200vh" }}>
    <div
      style={{
        width: "50vw",
        marginLeft: "300px",
        marginTop: "300px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      <App />
    </div>
  </div>,
);

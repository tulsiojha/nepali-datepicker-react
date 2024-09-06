import { RefObject, useEffect, useState } from "react";

export type IBounds = {
  left: number;
  top: number;
  height: number;
  width: number;
};

const getPosition = (target: HTMLDivElement) => {
  const { left, top, height, width } = target.getBoundingClientRect();
  return {
    left: left + window.pageXOffset,
    top: top + window.pageYOffset,
    width,
    height,
  };
};

const useBounds = ({ inputRef }: { inputRef: RefObject<HTMLDivElement> }) => {
  const [bounds, setBounds] = useState<IBounds>({
    left: 0,
    top: 0,
    height: 0,
    width: 0,
  });

  // handle resizing of menu bounds
  useEffect(() => {
    setBounds(getPosition(inputRef.current as HTMLDivElement));
    const resizeListener = () => {
      if (inputRef && inputRef.current) {
        setBounds(getPosition(inputRef.current));
      }
    };
    window.addEventListener("resize", resizeListener);

    return () => {
      window.removeEventListener("resize", resizeListener);
    };
  }, [inputRef.current]);

  return { bounds, getPosition, setBounds };
};

export default useBounds;

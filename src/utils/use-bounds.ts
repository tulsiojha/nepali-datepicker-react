import { RefObject, useLayoutEffect, useState } from 'react';

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

const useBounds = (inputRef: RefObject<HTMLDivElement>, deps: any[]) => {
  const [bounds, setBounds] = useState<IBounds>({
    left: 0,
    top: 0,
    height: 0,
    width: 0,
  });

  // handle resizing of menu bounds
  useLayoutEffect(() => {
    setBounds(getPosition(inputRef.current as HTMLDivElement));
    const resizeListener = () => {
      if (inputRef && inputRef.current) {
        setBounds(getPosition(inputRef.current));
      }
    };
    window.addEventListener('resize', resizeListener);

    return () => {
      window.removeEventListener('resize', resizeListener);
    };
  }, [inputRef.current]);

  useLayoutEffect(() => {
    if (inputRef && inputRef.current) {
      setBounds(getPosition(inputRef.current));
    }
    let int = 0;
    if (deps.some((e) => !!e)) {
      int = setInterval(() => {
        setBounds(getPosition(inputRef.current as HTMLDivElement));
      }, 50);
    }
    return () => {
      clearInterval(int);
    };
  }, [inputRef.current, ...deps]);

  return { bounds, getPosition, setBounds };
};

export default useBounds;

import { RefObject, useLayoutEffect, useRef, useState } from 'react';

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

  const boundRef = useRef({
    left: 0,
    top: 0,
    height: 0,
    width: 0,
  });
  // handle resizing of menu bounds
  useLayoutEffect(() => {
    const resizeListener = () => {
      if (inputRef && inputRef.current) {
        const b = getPosition(inputRef.current);
        setBounds(b);
        boundRef.current = b;
      }
    };
    window.addEventListener('resize', resizeListener);

    resizeListener();
    return () => {
      window.removeEventListener('resize', resizeListener);
    };
  }, [inputRef.current]);

  useLayoutEffect(() => {
    if (inputRef && inputRef.current) {
      const b = getPosition(inputRef.current);
      setBounds(b);
      boundRef.current = b;
    }
    let int = 0;
    if (deps.some((e) => !!e)) {
      int = setInterval(() => {
        const b = getPosition(inputRef.current as HTMLDivElement);
        if (JSON.stringify(b) !== JSON.stringify(boundRef.current)) {
          setBounds(b);
          boundRef.current = b;
        }
      }, 50);
    } else {
      clearInterval(int);
    }
    return () => {
      clearInterval(int);
    };
  }, [inputRef.current, ...deps]);

  return { bounds, getPosition, setBounds };
};

export default useBounds;

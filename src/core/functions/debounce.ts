export const debounce = (fn: (...args: any[]) => void, wait: number) => {
  let timer: number | undefined;

  return function (this: any, ...args: any[]) {
    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      fn.apply(this, args);
    }, wait);
  };
};

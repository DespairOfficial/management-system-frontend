export function debounce(func: (args: any) => any, timeoutMs: number) {
  let timeout: NodeJS.Timeout;
  return function perform(this: any, ...args: any) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(this, args);
    }, timeoutMs);
  };
}

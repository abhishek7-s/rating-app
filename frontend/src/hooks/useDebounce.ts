import { useState, useEffect } from 'react';

// This is a generic custom hook that takes a value and a delay time.
// It will return the latest value only after the specified delay has passed
// since the last time the value changed.
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set up a timer to update the debounced value after the delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up the timer if the value changes before the delay is over
    // This prevents the old value from being set and resets the timer
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Rerun the effect if the value or delay changes

  return debouncedValue;
}
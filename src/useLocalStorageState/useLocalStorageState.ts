import { useCallback, useEffect, useState } from 'react';
import { serialize, desearlize } from '../utils';

interface useLocalStorageStateOptions<T> {
  initialState?: T,
  sync?: boolean,
};

/**
 * Hook to create reactive state variables on `localStorage`.
 * 
 * @param key key for localStorage
 * @param opts Options object
 * @returns a pair of current state and `setState` method to update the state.
 */
function useLocalStorageState<T>(key: string, opts?: useLocalStorageStateOptions<T>) {
  const options = {
    initialState: undefined,
    sync: true,
    ...opts,
  };

  const [state, setState] = useState<T>(
    () => typeof window !== 'undefined' ? desearlize<T>(window.localStorage.getItem(key)) ?? options.initialState as T : options.initialState as T
  );

  const setStateWrapper = useCallback((newVal: T | ((prev: T) => T)) => {
    if (typeof window === 'undefined') return;

    const result = newVal instanceof Function ? newVal(state) : newVal;

    const serializedResult = serialize(result);
    window.localStorage.setItem(key, serializedResult);

    // storage event is also triggered by the script so that synced hooks in the same window get up-to-date values
    const event = new StorageEvent('storage', { key, newValue: serializedResult });
    window.dispatchEvent(event);

    setState(result);
  }, [key, setState, state]);

  const handleStorage = useCallback((event: StorageEvent) => {
    if (event.key === key && desearlize(event.newValue) !== state) {
      setState(desearlize(event.newValue) ?? options.initialState as T);
    }
  }, [state, key, setState]);

  useEffect(() => {
    if (options.sync && typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorage);
      return () => window.removeEventListener('storage', handleStorage);
    }

    return () => {};
  }, [handleStorage, options.sync]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const storedData = desearlize(window.localStorage.getItem(key));
    if (storedData === null || storedData === undefined) {
      window.localStorage.setItem(key, serialize(options.initialState));
    }
  }, [key]);

  return [state, setStateWrapper] as const;
}

export default useLocalStorageState;

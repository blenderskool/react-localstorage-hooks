import { useCallback, useEffect, useState } from 'react';
import { deserialize } from '../utils';

interface useLocalStorageSelectorOptions<U> {
  equalityFn?: (prev: U, next: U) => boolean,
};


/**
 * Hook to query an data stored in the localStorage and reactively update when it changes.
 * The hook only updates when the result of `selector` method changes.
 * 
 * @param key Key of the localstorage store to be queried
 * @param selector Selector function to select items from the store
 * @param opts Options object
 * @returns Data queried by the `selector` method
 */
function useLocalStorageSelector<T, U>(
  key: string,
  selector: (state: T) => U,
  opts?: useLocalStorageSelectorOptions<U>
) {
  const options = {
    equalityFn: (prev, next) => prev === next,
    ...opts,
  };

  const [state, setState] = useState<U>(
    () => typeof window !== 'undefined' ? selector(deserialize<T>(window.localStorage.getItem(key))) : (undefined as unknown as U)
  );

  const handleStorage = useCallback((event: StorageEvent) => {
    if (event.key !== key) return;
    const selectedData = selector(deserialize<T>(event.newValue));

    if (!options.equalityFn(state, selectedData)) {
      setState(selectedData);
    }
  }, [key, setState]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [key, setState]);

  return state;
}

export default useLocalStorageSelector;

import { useCallback } from 'react';
import useLocalStorageState from '../useLocalStorageState/useLocalStorageState';
import { desearlize, serialize } from '../utils';

interface useLocalStorageReducerOptions<T> {
  initialState?: T,
  sync?: boolean,
};

type LocalStorageReducer<T> = (state: T, action: any) => T;

/**
 * A function to create a dispatcher that updates data stored on localStorage.
 * 
 * @param key key for localStorage
 * @param reducer reducer method that returns new data
 * @returns a dispatch method
 */
function createLocalStorageDispatcher<T>(key: string, reducer: LocalStorageReducer<T>) {
  return (action: any) => {
    if (typeof window === 'undefined') return;

    const data = desearlize<T>(window.localStorage.getItem(key));
    const updatedData = serialize(reducer(data, action));

    window.localStorage.setItem(key, updatedData);
    window.dispatchEvent(new StorageEvent('storage', { key, newValue: updatedData }));
  };
}

/**
 * An alternative hook to `useLocalStorageState` for managing complex state.
 * 
 * @param key key for localStorage
 * @param reducer reducer method that returns new state
 * @param opts Options object
 * @returns a pair of current state and dispatch method to dispatch actions
 */
function useLocalStorageReducer<T>(key: string, reducer: LocalStorageReducer<T>, opts?: useLocalStorageReducerOptions<T>) {
  const options = {
    initialState: undefined,
    sync: true,
    ...opts,
  };

  const [state, setState] = useLocalStorageState<T>(key, options);
  const dispatch = useCallback((action) => setState((prev: T) => reducer(prev, action)), [setState])

  return [state, dispatch] as const;
}

export { useLocalStorageReducer as default, createLocalStorageDispatcher };

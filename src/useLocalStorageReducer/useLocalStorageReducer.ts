import { useCallback } from 'react';
import useLocalStorageState from '../useLocalStorageState/useLocalStorageState';

interface useLocalStorageReducerOptions<T> {
  initialState?: T,
  sync?: boolean,
};

export type LocalStorageReducer<T> = (state: T, action: any) => T;


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

export default useLocalStorageReducer;

import { LocalStorageReducer } from '../useLocalStorageReducer/useLocalStorageReducer';
import { desearlize, serialize } from '../utils';

/**
 * A function to create a dispatcher that updates data stored on localStorage.
 * 
 * @param key key for localStorage
 * @param reducer reducer method that returns new data
 * @returns a dispatch method
 */
 function createLocalStorageDispatch<T>(key: string, reducer: LocalStorageReducer<T>) {
  return (action: any) => {
    if (typeof window === 'undefined') return;

    const data = desearlize<T>(window.localStorage.getItem(key));
    const updatedData = serialize(reducer(data, action));

    window.localStorage.setItem(key, updatedData);
    window.dispatchEvent(new StorageEvent('storage', { key, newValue: updatedData }));
  };
}

export default createLocalStorageDispatch;

import { act, renderHook } from '@testing-library/react-hooks';
import { useLocalStorageState } from '../src';

describe('useLocalStorageState', () => {
  it('keeps localstorage to null if initialState is not set', () => {
    const { result } = renderHook(() => useLocalStorageState<number>('test'));

    expect(result.current[0]).toBe(undefined);
    expect(localStorage.getItem('test')).toBe('undefined');
  });

  it('sets localstorage to initialState', () => {
    const { result } = renderHook(() => useLocalStorageState<number>('test', {
      initialState: 5,
    }));

    expect(result.current[0]).toBe(5);
    expect(localStorage.getItem('test')).toBe('5');
  });

  it('does not set a new initialState if localStorage already has a value', () => {
    localStorage.setItem('test', '5');

    const { result } = renderHook(() => useLocalStorageState<number>('test', {
      initialState: 10,
    }));

    expect(result.current[0]).toBe(5);
    expect(localStorage.getItem('test')).toBe('5');
  });

  it('updates the value of localStorage when state changes', () => {
    const { result } = renderHook(() => useLocalStorageState<number>('test'));
    expect(result.current[0]).toBe(5);
    expect(localStorage.getItem('test')).toBe('5');

    act(() => {
      result.current[1](10);
    });

    expect(result.current[0]).toBe(10);
    expect(localStorage.getItem('test')).toBe('10');

    act(() => {
      result.current[1]((value) => value + 20);
    });

    expect(result.current[0]).toBe(30);
    expect(localStorage.getItem('test')).toBe('30');
  });

  it('does not sync updates across hooks when sync is turned off', () => {
    const { result: hook1 } = renderHook(() => useLocalStorageState<number>('sync-off', {
      initialState: 5,
      sync: false,
    }));
    const { result: hook2 } = renderHook(() => useLocalStorageState<number>('sync-off', {
      initialState: 10,
      sync: false,
    }));

    expect(hook1.current[0]).toBe(5);
    expect(hook2.current[0]).toBe(5);
    expect(localStorage.getItem('sync-off')).toBe('5');

    act(() => {
      hook1.current[1](10);
    });

    expect(hook1.current[0]).toBe(10);
    expect(hook2.current[0]).toBe(5);
    expect(localStorage.getItem('sync-off')).toBe('10');

    act(() => {
      hook2.current[1](100);
    });

    expect(hook1.current[0]).toBe(10);
    expect(hook2.current[0]).toBe(100);
    expect(localStorage.getItem('sync-off')).toBe('100');
  });

  it('syncs updates across hooks when sync is turned on', () => {
    const { result: hook1 } = renderHook(() => useLocalStorageState<number>('sync-on', {
      initialState: 20,
      sync: true,
    }));
    const { result: hook2 } = renderHook(() => useLocalStorageState<number>('sync-on', {
      initialState: 25,
      sync: true,
    }));

    expect(hook1.current[0]).toBe(20);
    expect(hook2.current[0]).toBe(20);
    expect(localStorage.getItem('sync-on')).toBe('20');

    act(() => {
      hook1.current[1](10);
    });

    expect(hook1.current[0]).toBe(10);
    expect(hook2.current[0]).toBe(10);
    expect(localStorage.getItem('sync-on')).toBe('10');

    act(() => {
      hook2.current[1](30);
    });

    expect(hook1.current[0]).toBe(30);
    expect(hook2.current[0]).toBe(30);
    expect(localStorage.getItem('sync-on')).toBe('30');

    act(() => {
      localStorage.setItem('sync-on', '40');
      window.dispatchEvent(new StorageEvent('storage', { key: 'sync-on', newValue: '40' }));
    });

    expect(hook1.current[0]).toBe(40);
    expect(hook2.current[0]).toBe(40);
    expect(localStorage.getItem('sync-on')).toBe('40');
  });

  it('works on array type', () => {
    const { result } = renderHook(() => useLocalStorageState<number[]>('arrays', {
      initialState: [],
    }));

    expect(result.current[0]).toEqual([]);
    expect(localStorage.getItem('arrays')).toBe('[]');

    act(() => {
      result.current[1]([1, 2, 3]);
    });

    expect(result.current[0]).toEqual([1, 2, 3]);
    expect(localStorage.getItem('arrays')).toBe('[1,2,3]');
  });

  it('works on object type', () => {
    const initialState = {
      key1: 'value1',
      key2: 2,
      key3: ['value3']
    };

    const { result: hook1 } = renderHook(() => useLocalStorageState<typeof initialState>('objects', {
      initialState,
      sync: true,
    }));

    const { result: hook2 } = renderHook(() => useLocalStorageState<typeof initialState>('objects', {
      sync: true,
    }));

    expect(hook1.current[0]).toEqual(initialState);
    expect(hook2.current[0]).toEqual(initialState);
    expect(localStorage.getItem('objects')).toBe(JSON.stringify(initialState));

    act(() => {
      hook1.current[1]((state) => ({ ...state, key2: 5, key3: [] }));
    });

    initialState.key2 = 5;
    initialState.key3 = [];

    expect(hook1.current[0]).toEqual(initialState);
    expect(hook2.current[0]).toEqual(initialState);
    expect(localStorage.getItem('objects')).toBe(JSON.stringify(initialState));
  });
});
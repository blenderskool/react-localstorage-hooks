import { act, renderHook } from '@testing-library/react-hooks';
import useLocalStorageSelector from '../src/useLocalStorageSelector/useLocalStorageSelector';

describe('useLocalStorageSelector', () => {

  it('calls the selector', () => {
    const fn = jest.fn();
    const { result } = renderHook(() => useLocalStorageSelector('test', fn));

    expect(fn).toBeCalled();
    expect(fn.mock.calls.length).toBe(1);
    expect(fn.mock.calls[0].length).toBe(1);
    expect(fn.mock.calls[0][0]).toBe(null);
    expect(result.current).toBe(undefined);
  });

  it('returns item selected by the selector', () => {
    const data = { key1: 'val1', key2: ['val2', 'val3', 'val4'] };

    window.localStorage.setItem('selector-test', JSON.stringify(data));

    const fn = jest.fn((selector) => selector.key2);
    const { result } = renderHook(() => useLocalStorageSelector('selector-test', fn));

    expect(fn).toBeCalled();
    expect(fn.mock.calls[0][0]).toEqual(data);
    expect(fn.mock.results[0].value).toEqual(data.key2);
    expect(result.current).toEqual(data.key2);
  });

  it('returns different selected values for same key', () => {
    const data = { key1: 'val1', key2: ['val2', 'val3', 'val4'] };

    window.localStorage.setItem('selector-test', JSON.stringify(data));

    const fn1 = jest.fn((selector) => selector.key2);
    const { result: hook1 } = renderHook(() => useLocalStorageSelector('selector-test', fn1));

    const fn2 = jest.fn((selector) => selector.key1);
    const { result: hook2 } = renderHook(() => useLocalStorageSelector('selector-test', fn2));

    expect(fn1).toBeCalled();
    expect(fn1.mock.calls[0][0]).toEqual(data);
    expect(fn1.mock.results[0].value).toEqual(data.key2);
    expect(hook1.current).toEqual(data.key2);

    expect(fn2).toBeCalled();
    expect(fn2.mock.calls[0][0]).toEqual(data);
    expect(fn2.mock.results[0].value).toEqual(data.key1);
    expect(hook2.current).toEqual(data.key1);
  });

  it('does not update the return if the selected value does not change', () => {
    const data = { key1: 'val1', key2: ['val2', 'val3', 'val4'] };

    window.localStorage.setItem('selector-test', JSON.stringify(data));

    const fn = jest.fn((selector) => selector.key1);
    const { result } = renderHook(() => useLocalStorageSelector('selector-test', fn));

    expect(result.all.length).toBe(1);
    expect(result.current).toBe(data.key1);
    
    act(() => {
      data.key2 = [];
      window.localStorage.setItem('selector-test', JSON.stringify(data));
      window.dispatchEvent(new StorageEvent('storage', { key: 'selector-test', newValue: JSON.stringify(data) }));
    });

    expect(result.all.length).toBe(1);
    expect(result.current).toBe(data.key1);
    expect(fn).toBeCalledTimes(2);
  });

  it('updates the return if selected value changes', () => {
    const data = { key1: 'val1', key2: ['val2', 'val3', 'val4'] };

    window.localStorage.setItem('selector-test', JSON.stringify(data));

    const fn = jest.fn((selector) => selector.key1);
    const { result } = renderHook(() => useLocalStorageSelector('selector-test', fn));

    expect(result.all.length).toBe(1);
    expect(result.current).toBe(data.key1);
    
    act(() => {
      data.key1 = 'updated_val2';
      window.localStorage.setItem('selector-test', JSON.stringify(data));
      window.dispatchEvent(new StorageEvent('storage', { key: 'selector-test', newValue: JSON.stringify(data) }));
    });

    expect(result.all.length).toBe(2);
    expect(result.current).toBe(data.key1);
    expect(fn).toBeCalledTimes(2);
  });


  it('works with custom equalityFn', () => {
    const data = { key1: 'val1', key2: ['val2', 'val3', 'val4'] };

    window.localStorage.setItem('selector-test', JSON.stringify(data));

    const selectorFn = jest.fn((selector) => selector.key2);
    const equalityFn = jest.fn((prev, next) => prev.length === next.length);

    const { result } = renderHook(() => useLocalStorageSelector('selector-test', selectorFn, { equalityFn }));

    expect(equalityFn).not.toBeCalled();
    
    act(() => {
      data.key2[0] = 'val3';
      window.localStorage.setItem('selector-test', JSON.stringify(data));
      window.dispatchEvent(new StorageEvent('storage', { key: 'selector-test', newValue: JSON.stringify(data) }));
    });

    expect(result.current).toEqual(['val2', 'val3', 'val4']);
    expect(equalityFn).toBeCalled();


    act(() => {
      data.key2 = ['val2'];
      window.localStorage.setItem('selector-test', JSON.stringify(data));
      window.dispatchEvent(new StorageEvent('storage', { key: 'selector-test', newValue: JSON.stringify(data) }));
    });

    expect(result.current).toEqual(data.key2);
  });
});
import { act, renderHook } from '@testing-library/react-hooks';
import { useLocalStorageReducer } from '../src';

describe('useLocalStorageReducer', () => {
  it('dispatch calls the reducer with two arguments', () => {
    const reducer = jest.fn();

    const { result } = renderHook(() => useLocalStorageReducer<number>('reducer-test', reducer));

    expect(result.current.length).toBe(2);
    expect(result.current[0]).toBe(undefined);
    expect(localStorage.getItem('reducer-test')).toBe('undefined');

    act(() => {
      result.current[1]({});
    });

    expect(reducer).toBeCalled();
    expect(reducer.mock.calls[0].length).toBe(2);
  });

  it('updates state when dispatch is called', () => {
    const reducer = jest.fn((state, type: string) => {
      switch(type) {
        case 'RESET':
          return 0;
        case 'INCREMENT':
          return state + 1;
        case 'DECREMENT':
          return state - 1;
        default:
          return -1;
      };
    });

    const { result } = renderHook(() => useLocalStorageReducer<number>('reducer-test', reducer));

    expect(result.current[0]).toBe(undefined);

    act(() => result.current[1]('RESET'));

    expect(result.current[0]).toBe(0);
    expect(localStorage.getItem('reducer-test')).toBe('0');

    act(() => result.current[1]('INCREMENT'));

    expect(result.current[0]).toBe(1);
    expect(localStorage.getItem('reducer-test')).toBe('1');

    act(() => result.current[1]('INCREMENT'));

    expect(result.current[0]).toBe(2);
    expect(localStorage.getItem('reducer-test')).toBe('2');

    act(() => result.current[1]('DECREMENT'));

    expect(result.current[0]).toBe(1);
    expect(localStorage.getItem('reducer-test')).toBe('1');

    act(() => result.current[1]('INVALID_OP'));

    expect(result.current[0]).toBe(-1);
    expect(localStorage.getItem('reducer-test')).toBe('-1');

  });
  
  it('sets state and localStorage to initialState', () => {
    localStorage.removeItem('reducer-test');

    const reducer = jest.fn();
    const { result } = renderHook(() => useLocalStorageReducer<number>('reducer-test', reducer, {
      initialState: 5,
    }));

    expect(result.current[0]).toBe(5);
    expect(localStorage.getItem('reducer-test')).toBe('5');
  });

  it('does not sync updates across hooks when sync is turned off', () => {
    localStorage.removeItem('sync-off');
    const reducer = jest.fn((state, type: string) => {
      switch(type) {
        case 'RESET':
          return 0;
        case 'INCREMENT':
          return state + 1;
        case 'DECREMENT':
          return state - 1;
        default:
          return -1;
      };
    });

    const { result: hook1 } = renderHook(() => useLocalStorageReducer<number>('sync-off', reducer, {
      initialState: 5,
      sync: false,
    }));
    const { result: hook2 } = renderHook(() => useLocalStorageReducer<number>('sync-off', reducer, {
      initialState: 10,
      sync: false,
    }));

    expect(hook1.current[0]).toBe(5);
    expect(hook2.current[0]).toBe(5);
    expect(localStorage.getItem('sync-off')).toBe('5');

    act(() => {
      hook1.current[1]('INCREMENT');
    });

    expect(hook1.current[0]).toBe(6);
    expect(hook2.current[0]).toBe(5);
    expect(localStorage.getItem('sync-off')).toBe('6');

    act(() => {
      hook2.current[1]('RESET');
    });

    expect(hook1.current[0]).toBe(6);
    expect(hook2.current[0]).toBe(0);
    expect(localStorage.getItem('sync-off')).toBe('0');
  });

  it('syncs updates across hooks when sync is turned on', () => {
    localStorage.removeItem('sync-on');
    const reducer = jest.fn((state, type: string) => {
      switch(type) {
        case 'RESET':
          return 0;
        case 'MULTIPLY':
          return state * 2;
        default:
          return -1;
      };
    });

    const { result: hook1 } = renderHook(() => useLocalStorageReducer<number>('sync-on', reducer, {
      initialState: 20,
      sync: true,
    }));
    const { result: hook2 } = renderHook(() => useLocalStorageReducer<number>('sync-on', reducer, {
      initialState: 25,
      sync: true,
    }));

    expect(hook1.current[0]).toBe(20);
    expect(hook2.current[0]).toBe(20);
    expect(localStorage.getItem('sync-on')).toBe('20');

    act(() => {
      hook1.current[1]('MULTIPLY');
    });

    expect(hook1.current[0]).toBe(40);
    expect(hook2.current[0]).toBe(40);
    expect(localStorage.getItem('sync-on')).toBe('40');

    act(() => {
      hook2.current[1]('RESET');
    });

    expect(hook1.current[0]).toBe(0);
    expect(hook2.current[0]).toBe(0);
    expect(localStorage.getItem('sync-on')).toBe('0');

    act(() => {
      localStorage.setItem('sync-on', '100');
      window.dispatchEvent(new StorageEvent('storage', { key: 'sync-on', newValue: '100' }));
    });

    expect(hook1.current[0]).toBe(100);
    expect(hook2.current[0]).toBe(100);
    expect(localStorage.getItem('sync-on')).toBe('100');
  });

  it('works on complex type', () => {
    localStorage.removeItem('objects');

    const initialState = {
      todos: ['1', '2'],
      completed: ['10'],
    };

    const reducer = jest.fn((state, { type, payload }) => {
      switch(type) {
        case 'ADD_TODO':
          return {
            ...state,
            todos: [payload, ...state.todos],
          };
        case 'MARK_COMPLETE':
          return {
            ...state,
            todos: state.todos.filter((_, idx) => idx !== payload),
            completed: [ state.todos[payload], ...state.completed ],
          };
      }
    });

    const { result: hook1 } = renderHook(() => useLocalStorageReducer<typeof initialState>('objects', reducer, {
      initialState,
      sync: true,
    }));

    const { result: hook2 } = renderHook(() => useLocalStorageReducer<typeof initialState>('objects', reducer, {
      sync: true,
    }));

    expect(hook1.current[0]).toEqual(initialState);
    expect(hook2.current[0]).toEqual(initialState);
    expect(localStorage.getItem('objects')).toBe(JSON.stringify(initialState));

    act(() => {
      hook1.current[1]({ type: 'ADD_TODO', payload: 'new todo' });
    });

    initialState.todos.unshift('new todo');

    expect(hook1.current[0]).toEqual(initialState);
    expect(hook2.current[0]).toEqual(initialState);
    expect(localStorage.getItem('objects')).toBe(JSON.stringify(initialState));


    act(() => {
      hook1.current[1]({ type: 'MARK_COMPLETE', payload: 1 });
    });

    initialState.todos.splice(1, 1);
    initialState.completed.unshift('1');

    expect(hook1.current[0]).toEqual(initialState);
    expect(hook2.current[0]).toEqual(initialState);
    expect(localStorage.getItem('objects')).toBe(JSON.stringify(initialState));
  });
});

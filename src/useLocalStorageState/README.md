## `useLocalStorageState`

This hook is inspired by the [`useState`](https://reactjs.org/docs/hooks-reference.html#usestate) hook and makes it easy to create a reactive state variable that remains in sync with value stored in `localStorage`.

### Usage
```js
function Component() {
  const [count, setCount] = useLocalStorageState('counter', { initialState: 0 });

  return (
    <>
      Count: {state.count}
      <button onClick={() => setCount(count + 1)}>+</button>
      <button onClick={() => setCount((c) => c - 1)}>-</button>
    </>
  );
}
```

### Reference

```js
const [state, setState] = useLocalStorageState(key);
const [state, setState] = useLocalStorageState(key, { initialState });
const [state, setState] = useLocalStorageState(key, { initialState, sync: true });
const [state, setState] = useLocalStorageState(key, { initialState, sync: false });
```

- `key` — key for localStorage,
- `options` object:
  - `initialState` — initial value of the state if there is no value under `key` in localStorage. If some value is there in localStorage under `key`, then that is used. (default: `undefined`)
  - `sync` — flag to keep state in sync with the other hooks with the same localStorage `key`. (default: `true`)

This hook returns a pair of:
- current state,
- `setState` — method to update the state.

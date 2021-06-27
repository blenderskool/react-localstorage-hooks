## `useLocalStorageReducer`

An alternative hook to `useLocalStorageState` for managing state. This hook exposes a similar API to the default [`useReducer`](https://reactjs.org/docs/hooks-reference.html#usereducer) hook but abstracted on the `localStorage`.


### Usage
```js
function reducer(state, action) {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 };
    case 'DECREMENT':
      return { count: state.count - 1 };
    default:
      return state;
  }
}

function Counter() {
  const [state, dispatch] = useLocalStorageReducer('counter', reducer, {
    initialState: { count: 0 },
  });

  return (
    <>
      Count: {state.count}
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>+</button>
      <button onClick={() => dispatch({ type: 'DECREMENT' })}>-</button>
    </>
  );
}
```

### Reference

```js
const [state, dispatch] = useLocalStorageReducer(key, reducer);
const [state, dispatch] = useLocalStorageReducer(key, reducer, { initialState });
const [state, dispatch] = useLocalStorageReducer(key, reducer, { initialState, sync: true });
const [state, dispatch] = useLocalStorageReducer(key, reducer, { initialState, sync: false });
```


This hook accepts:
- `key` — key for localStorage,
- `reducer` — reducer function of type `(state, action) => newState`,
- `options` object:
  - `initialState` — initial value of the state if there is no value under `key` in localStorage. If some value is there in localStorage under `key`, then that is used. (default: `undefined`)
  - `sync` — flag to keep state in sync with the other hooks with the same localStorage `key`. (default: `true`)

This hook returns a pair of:
- current state,
- `dispatch` — method to dispatch actions.

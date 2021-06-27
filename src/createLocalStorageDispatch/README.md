## `createLocalStorageDispatch`

This function creates a `dispatch` method that updates the localStorage directly. It can be used as an alternative to `localStorage.setItem` but with a pattern similar to Redux. If you also want to reactively read the updated values by the reducer, use this function with [`useLocalStorageSelector`](../useLocalStorageSelector).


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

/**
 * Assumes `counter` key in localStorage was already initialized.
 */
const dispatch = createLocalStorageDispatch('counter', reducer);

function Counter() {
  const count = useLocalStorageSelector('counter', (state) => state.count);

  return (
    <>
      Count: {count}
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>+</button>
      <button onClick={() => dispatch({ type: 'DECREMENT' })}>-</button>
    </>
  );
}
```

### Reference

```js
const dispatch = createLocalStorageDispatch(key, reducer);
```

This hook accepts:
- `key` — key for localStorage,
- `reducer` — reducer function of type `(data, action) => newData`,

This hook returns:
- `dispatch` — method to dispatch actions.

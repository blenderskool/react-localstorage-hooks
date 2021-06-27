## `useLocalStorageSelector`

This hook is inspired by the [`useSelector`](https://react-redux.js.org/api/hooks#useselector) hook in `react-redux`, and makes it easy to reactively select **readonly** data from `localStorage`.

### Usage
```js
function Component() {
  /**
   * Assume { name: 'user1', email: 'user1@example.com' } is stored under
   * 'user' key in `localStorage`.
   */
  const userEmail = useLocalStorageSelector('user', (user) => user.email);

  return (
    <>
      Email: {userEmail} {/* Email: user1@example.com */}
    </>
  );
}
```

### Reference
```js
const data = useLocalStorageSelector(key, selector);
```

This hook accepts:
- `key` — key for localStorage,
- `selector` — a selector function of type `(data) => selectedData`,
- `options` object:
  - `equalityFn` — function of type `(prev, next) => boolean` to compare `selectedData` across updates. (default: `(prev, next) => prev === next`)


This hook returns:
- `selectedData` — returned by selector method.


### When does this hook update?
Similar to how [`useSelector`](https://react-redux.js.org/api/hooks#useselector) hook updates, `useLocalStorageSelector` hook only updates and forces re-render when the data returned by the selector method updates.

- A change is internally triggered in the hook when the value stored in localStorage under `key` key changes (either by another hook, or directly using `window.localStorage` API) on the same tab or different tab. This change does not immediately trigger a re-render and uses the selector and `equalityFn` methods to check if the selected data has changed.

- The selector method is of the form `(data) => selectedData`. The hook only updates the returned value and forces re-render when the value of `selectedData` changes, not just when `data` changes. This is done by checking the equality of incoming selected data with the past cached data.

- The hook by default uses the strict `===` comparison operator for comparing between the past and the new value. A custom `equalityFn` can be defined for comparison of complex objects if they are not intended to be updated in every change.

- To prevent unnecessary updates and re-renders on complex objects, `useLocalStorageSelector` may be used multiple times to return atomic values from the object.

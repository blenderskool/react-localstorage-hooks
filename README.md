<div align="center">
  <h1>
    react-localstorage-hooks
  </h1>
  <p>
    A collection of React hooks for reactively managing <code>localStorage</code>.
  </p>
  <p>
    <a href="https://www.npmjs.com/package/react-localstorage-hooks">
      <img src="https://badgen.net/npm/v/react-localstorage-hooks" />
    </a>
    <img src="https://badgen.net/bundlephobia/min/react-localstorage-hooks" />
    <img src="https://badgen.net/bundlephobia/minzip/react-localstorage-hooks?label=gzipped%20size" />
    <img src="https://badgen.net/npm/types/react-localstorage-hooks" />
    <img src="https://badgen.net/bundlephobia/tree-shaking/react-localstorage-hooks" />
  </p>
  <br />
</div>


### Installation
<pre>
npm i <a href="https://www.npmjs.com/package/react-localstorage-hooks">react-localstorage-hooks</a>
</pre>


### Documentation
- [`useLocalStorageState`](./src/useLocalStorageState/): creates reactive state variables synced with `localStorage`.
- [`useLocalStorageReducer`](./src/useLocalStorageReducer/): similar to [`useReducer`](https://reactjs.org/docs/hooks-reference.html#usereducer) but abstracted on top of `localStorage`.
- [`useLocalStorageSelector`](./src/useLocalStorageSelector/): hook to select some data from `localStorage` that automatically updates when selected data changes.
- [`createLocalStorageDispatch`](./src/createLocalStorageDispatch/): creates a `dispatch` method that directly updates `localStorage`.

### Usage
- Make sure your project is using React 16.18.0 or above.

- Install the package using `npm` or `yarn`  
  ```bash
  npm i react-localstorage-hooks
  ```

- Import the hooks either using ES6 named imports:  
  ```js
  import { useLocalStorageState } from 'react-localstorage-hooks';
  ```  
  or importing each hook directly from `lib`:
  ```js
  import useLocalStorageState from 'react-localstorage-hooks/lib/useLocalStorageState/useLocalStorageState';
  ```
  
### License
This package is licensed under [MIT](./LICENSE)

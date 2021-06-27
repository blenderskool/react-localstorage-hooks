import { createLocalStorageDispatch } from '../src';

describe('createLocalStorageDispatch', () => {
  it('updates localStorage', () => {
    localStorage.removeItem('number');

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

    const dispatcher = createLocalStorageDispatch('number', reducer);

    dispatcher('RESET');
    expect(localStorage.getItem('number')).toBe('0');

    dispatcher('INCREMENT');
    expect(localStorage.getItem('number')).toBe('1');

    dispatcher('INCREMENT');
    expect(localStorage.getItem('number')).toBe('2');

    dispatcher('INVALID_OP');
    expect(localStorage.getItem('number')).toBe('-1');
  });
});
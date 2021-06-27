module.exports = {
  preset: 'ts-jest',
  testEnvironment: process.env.TEST_ENV ?? 'jsdom',
};
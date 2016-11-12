# Clean Room [![Build Status](https://travis-ci.org/lawrencec/cleanRoom.svg?branch=master)](https://travis-ci.org/lawrencec/cleanRoom) [![Code Climate](https://img.shields.io/codeclimate/github/lawrencec/cleanRoom.svg)](https://codeclimate.com/github/lawrencec/cleanRoom) [![Test Coverage](https://img.shields.io/codeclimate/coverage/github/lawrencec/cleanRoom.svg)](https://codeclimate.com/github/lawrencec/cleanRoom/coverage) [![Latest Release](https://img.shields.io/github/release/lawrencec/cleanRoom.svg)](https://github.com/lawrencec/cleanRoom/releases)

Cleans up browser state:

- Cookies
- LocalStorage
- SessionStorage

## Why?

To ensure that unit tests clean up after themselves. Includes a `snitch` method to determine when tests are not cleaning up correctly.

## Support

- Browser globals
- RequireJS

## API

### cleanAll()

Removes all cookies, all LocalStorage and SessionStorage items

### cleanCookies()

Removes all cookies

### cleanLocalStorage()

Removes all LocalStorage items

### cleanSessionStorage()

Removes all SessionStorage items

### snitch()

Throws an error if there are any items left in cookies, LocalStorage or SessionStorage. Intended to be used in a unit test afterEach lifecycle method.

## Testing

Run `npm run test` to run tests using karma.

Run `npm run test:report` to open coverage report

Run `npm run lint` to run linting

Run `npm run` to view full list of available script tasks
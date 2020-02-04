# is-hotkey-combine

[![Build status](https://img.shields.io/travis/imcuttle/is-hotkey-combine/master.svg?style=flat-square)](https://travis-ci.org/imcuttle/is-hotkey-combine)
[![Test coverage](https://img.shields.io/codecov/c/github/imcuttle/is-hotkey-combine.svg?style=flat-square)](https://codecov.io/github/imcuttle/is-hotkey-combine?branch=master)
[![NPM version](https://img.shields.io/npm/v/is-hotkey-combine.svg?style=flat-square)](https://www.npmjs.com/package/is-hotkey-combine)
[![NPM Downloads](https://img.shields.io/npm/dm/is-hotkey-combine.svg?style=flat-square&maxAge=43200)](https://www.npmjs.com/package/is-hotkey-combine)
[![Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://prettier.io/)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg?style=flat-square)](https://conventionalcommits.org)

> The shortest way to check multi-times keydown

Inspired by [is-hotkey](https://github.com/ianstormtaylor/is-hotkey#readme)

## Installation

```bash
npm install is-hotkey-combine
# or use yarn
yarn add is-hotkey-combine
```

## Usage

```javascript
import isHotkeyCombine from 'is-hotkey-combine'

document.addEventListener('keydown', evt => {
  if (isHotkeyCombine('shift*2', evt /*, options */)) {
    // trigger when pressing `shift` twice
  }
  
  if (isHotkeyCombine('shift+a->b', evt /*, options */)) {
    // trigger when pressing `shift+a` and `b` quickly
  }

  if (isHotkeyCombine(['shift+a', 'b'], evt /*, options */)) {
    // trigger when pressing `shift+a` and `b` quickly
  }
})
```

## API

### `isHotkeyCombine(hotKey: string|string[], event: Event, options): boolean`

### Options

#### `duration`

The duration about nearby trigger.

- Type: `number`
- Default: `250`

#### `byKey`

Extends from [is-hotkey](https://github.com/ianstormtaylor/is-hotkey#readme)

## Contributing

- Fork it!
- Create your new branch:  
  `git checkout -b feature-new` or `git checkout -b fix-which-bug`
- Start your magic work now
- Make sure npm test passes
- Commit your changes:  
  `git commit -am 'feat: some description (close #123)'` or `git commit -am 'fix: some description (fix #123)'`
- Push to the branch: `git push`
- Submit a pull request :)

## Authors

This library is written and maintained by imcuttle, <a href="mailto:moyuyc95@gmail.com">moyuyc95@gmail.com</a>.

## License

MIT - [imcuttle](https://github.com/imcuttle) 🐟

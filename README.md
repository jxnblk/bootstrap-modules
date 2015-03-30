# bootstrap-modules

Modularized Bootstrap partials for publishing to NPM

## Getting started

```
npm install
bower install
```

## Create module directories with source `scss`, compiled `css`, and `package.json` files.

```
npm start
```

Results are in the `/modules` directory. See `build.js` for details.

### package.json

- Each package is namespaced with `bootstrap-`.
- Description is rewritten.
- `main` is set to the partial name.
- `style` field is added for Rework/Post CSS/etc.
- The version is from the bootstrap-sass version.
- `respository` and `bugs` fields are removed.
- `bootstrap-mixins` and `bootstrap-variables` are added as dependencies for all modules.
- `bootstrap-forms` is added as a dependency for `bootstrap-navbar` since it uses a mixin from the `_forms` partial.

## Test for valid CSS

```
npm test
```


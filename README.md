# `shadow-dom`

This repo aims to provide a polyfill for Shadow DOM v1 that is as spec-complete and correct as possible. 

## Usage:

Include `dist/shadow-dom.js` or `dist/shadow-dom.min.js` early on in `<head>` before other scripts.
It wouldn't be wise to use `async`, either. Use `defer` with caution.

If you want to **force the polyfill** to be used in browsers with native support for some reason,
set `window.forceShadowDomPolyfill = true` before the script is included.

## Priorities:

1. Making sure all of the imperative DOM query/mutation APIs are correct
2. Making sure the Event/EventTarget APIs are correct
3. Getting down and dirty with MutationObserver

## Caveats:

- There are no benchmarks yet. Correctness comes first, which means
  benchmarks come after test-verified functionality. 
- There are no plans at this time to do any CSS 'transpiling'.
- `<slot>` elements *will* be rendered. Browsers with native Shadow 
  DOM treat them as `display: contents` *by default* which simply cannot 
  be properly polyfilled. With that in mind, you may want to adopt a practice
  of explicitly specifying `display` properties for `<slot>` elements.

## License:

This project is licensed under the MIT license. See the LICENSE file.
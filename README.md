# `shadow-dom`

This repo aims to provide a polyfill for Shadow DOM v1 that is as spec-complete and correct as possible. 

## Usage:

Include `dist/shadow-dom.js` or `dist/shadow-dom.min.js` before any other scripts.
It wouldn't be wise to use `async`. Use `defer` with caution.

If you want to **force the polyfill** to be used in browsers with native support for some reason,
set `window.forceShadowDomPolyfill = true` before the script is included.

## Caveats:

- There are no benchmarks yet. Correctness comes first, which means
  benchmarks come after test-verified functionality. 
- MutationObserver is polyfilled to account for shadow boundaries,
  but Javascript does not provide any sort of weak reference, so take
  care when using MutationObservers as garbage collection is pretty
  much a manual operation here.
- Browsers with native Shadow DOM treat `<slot>` elements as `display: contents` 
  *by default* which simply cannot be properly polyfilled (think `display: flex`, 
  `display: table`, etc.) With that in mind, you may want to adopt a practice
  of explicitly specifying `display` properties for `<slot>` elements.

## License:

This project is licensed under the MIT license. See the LICENSE file.
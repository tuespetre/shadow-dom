# `shadow-dom`

This repo aims to provide a polyfill for Shadow DOM v1 that is as spec-complete and correct as possible. 

What you will get if you use it right now:

- **Shadow DOM** polyfill
  - MutationObserver support
  - Currently lacking `Range` and `HTMLElement.style` support
- **Custom Elements** polyfill
  - Built in/around the Shadow DOM polyfill
  - Shims HTMLElement and kin for browsers that have native support 
    so transpiled and ES5-style classes can work 
    (i.e. via `var self = HTMLElement.call(this)`)

## Browser Compatibility

<table>
  <thead>
    <tr>
      <th>Chrome</th>
      <th>Firefox</th>
      <th>Safari</th>
      <th>Edge</th>
      <th>Internet Explorer</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Native support!</td>
      <td>Yes</td>
      <td>10, 9 with limitations*</td>
      <td>Yes</td>
      <td>11</td>
    </tr>
  </tbody>
</table>

> **Safari 9** is supported except for some things that cannot easily be polyfilled without huge complexity and performance implications, namely `[CEReactions]` support for reflected attributes and `DOMTokenList`/`Element.classList`. 

To help with cross-browser support, this project is receiving tremendous help from **BrowserStack**.

<a href="https://browserstack.com">
  <img src="https://cdn.rawgit.com/tuespetre/shadow-dom/browserstack-logo/Logo-01.svg" height="75" alt="BrowserStack logo" />
</a>

## Usage

- Include `dist/shadow-dom.js` or `dist/shadow-dom.min.js` before any other scripts.
It wouldn't be wise to use the `async` attribute for the `<script>`. Use the `defer` 
attribute with caution.
- If you want to **force the Shadow DOM polyfill** to be used in browsers with native support for some reason,
set `window.forceShadowDomPolyfill = true` before the script is included.
- If you want to **force the Custom Elements polyfill** to be used in browsers with native support for some reason,
set `window.forceCustomElementsPolyfill = true` before the script is included.

> **Note:** For a performance boost in browsers that don't natively support `setImmediate`, it is recommended 
> to include [YuzuJS/setImmediate](https://github.com/YuzuJS/setImmediate) before you include this polyfill.

## Caveats

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

## License

This project is licensed under the MIT license. See the LICENSE file.

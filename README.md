# `shadow-dom`

This repo aims to provide a polyfill for Shadow DOM v1 that is as spec-complete and correct as possible. 

What you will get if you use it right now:

- **Shadow DOM** polyfill
  - Polyfills Shadow DOM APIs like `Element.prototype.attachShadow` and `Event.prototype.composedPath()`
  - Polyfills Event and CustomEvent constructors to allow for `composed` events
  - Augments DOM querying/traversal/manipulation APIs to account for Shadow DOM
  - Augments `MutationObserver` to account for Shadow DOM
- **Custom Elements** polyfill
  - Built in/around the Shadow DOM polyfill
  - Shims HTMLElement and kin for browsers that have native support so transpiled and ES5-style classes 
    can work (i.e. via `var self = HTMLElement.call(this)`)

Please see the **Caveats** section below for details about certain APIs that are *not* polyfilled.

## Browser Compatibility

To help with testing for cross-browser support, this project is receiving tremendous help from **BrowserStack**.

<a href="https://browserstack.com">
  <img src="https://cdn.rawgit.com/tuespetre/shadow-dom/browserstack-logo/Logo-01.svg" height="75" alt="BrowserStack logo" />
</a>

<table>
  <thead>
    <tr>
      <th>Browser</th>
      <th>Version</th>
      <th>Notes</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>Chrome</th>
      <td>43</td>
      <td>
        <ul>
          <li>Chrome natively supports Shadow DOM since version 53 and Custom Elements since version 54.</li>
        </ul>
      </td>
    </tr>
    <tr>
      <th>Safari</th>
      <td>9</td>
      <td>
        <ul>
          <li>Safari natively supports Shadow DOM since version 10.</li>
          <li>
            Safari 9 is supported except for some things that cannot easily be polyfilled without 
            considerable complexity and performance implications, namely `[CEReactions]` support 
            for reflected attributes and `DOMTokenList`/`Element.classList`.
          </li>
        </ul>
      </td>
    </tr>
    <tr>
      <th>Firefox</th>
      <td>34</td>
      <td></td>
    </tr>
    <tr>
      <th>Edge</th>
      <td>13</td>
      <td>
        <ul>
          <li>Edge 12 may be supported but it has not been verified.</li>
        </ul>
      </td>
    </tr>
    <tr>
      <th>Internet Explorer</th>
      <td>11</td>
      <td>
        <ul>
          <li>
            IE 11 requires you to bring your own Promise polyfill if you want to 
            use `customElements.whenDefined('my-element')`.
          </li>
          <li>
            IE 10 is not officially supported as it has some issues with transpiled ES6 
            custom element classes and requires you to bring your own Object.setPrototypeOf polyfill.
          </li>
        </ul>
      </td>
    </tr>
  </tbody>
</table>

## Usage

- Include `dist/shadow-dom.js` or `dist/shadow-dom.min.js` before any other scripts.
It wouldn't be wise to use the `async` attribute for the `<script>`. Use the `defer` 
attribute with caution.
- If you want to **force the Shadow DOM polyfill** to be used in browsers with native support for some reason,
set `window.forceShadowDomPolyfill = true` before the script is included.
- If you want to **force the Custom Elements polyfill** to be used in browsers with native support for some reason,
set `window.forceCustomElementsPolyfill = true` before the script is included.

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

### APIs that are not polyfilled

There are a handful of APIs that are not polyfilled due to their relative
obscurity or lack of priority. They may be investigated later. These APIs are:

- `Range`
- `NodeIterator`
- `TreeWalker`

## License

This project is licensed under the MIT license. See the LICENSE file.

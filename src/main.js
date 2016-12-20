import ShadowDOM from './shadow-dom.js';
import $ce from './custom-elements.js';
import './style-scoping.js';

let installShadowDom = false;
let installCustomElements = false;

if (window['forceShadowDomPolyfill'] || !ShadowDOM.nativeSupport) {
    installShadowDom = true;
}

if (window['forceCustomElementsPolyfill'] || !$ce.nativeSupport) {
    installShadowDom = true;
    installCustomElements = true;
}

if (installShadowDom) {
    ShadowDOM.install();
    window['shadowDomPolyfilled'] = true;
}

if (installCustomElements) {
    $ce.install();
    window['customElementsPolyfilled'] = true;
}
else {
    // TODO: Offer a way to opt out if desired. Possibly refer to:
    // https://philipwalton.com/articles/loading-polyfills-only-when-needed/
    $ce.installTranspiledClassSupport();
}
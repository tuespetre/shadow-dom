import ShadowDOM from './shadow-dom.js';
import CustomElements from './custom-elements.js';

let installShadowDom = false;
let installCustomElements = false;

if (window['forceShadowDomPolyfill'] || !ShadowDOM.nativeSupport) {
    installShadowDom = true;
}

if (window['forceCustomElementsPolyfill'] || !CustomElements.nativeSupport) {
    installShadowDom = true;
    installCustomElements = true;
}

if (installShadowDom) {
    ShadowDOM.install();
    window.shadowDomPolyfilled = true;
}

if (installCustomElements) {
    CustomElements.install();
    window.customElementsPolyfilled = true;
}
else {
    // TODO: Offer a way to opt out if desired
    CustomElements.shimHtmlConstructors();
}
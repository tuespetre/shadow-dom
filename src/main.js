import patch from './patch.js';

const nativeShadowDom = 'attachShadow' in Element.prototype;

if (!nativeShadowDom || window['forceShadowDomPolyfill']) {
    patch();
}
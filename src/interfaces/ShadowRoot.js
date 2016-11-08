/*

https://dom.spec.whatwg.org/#interface-shadowroot
https://www.w3.org/TR/shadow-dom/#the-shadowroot-interface

[Exposed=Window]
interface ShadowRoot : DocumentFragment

*/

import * as $ from '../utils.js';

export default class extends DocumentFragment {

    // TODO: tests
    get nodeName() {
        return '#shadow-root';
    }

    // TODO: tests
    get mode() {
        return $.shadow(this).mode;
    }

    // TODO: tests
    get host() {
        return $.shadow(this).host;
    }

    // TODO: impl, tests
    get innerHTML() {
    }

    // TODO: impl, tests
    set innerHTML(value) {
    }

}
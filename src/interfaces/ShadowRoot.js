// https://dom.spec.whatwg.org/#interface-shadowroot
// https://www.w3.org/TR/shadow-dom/#the-shadowroot-interface

import * as $ from '../utils.js';

export default class {

    get nodeName() {
        return '#shadow-root';
    }

    get mode() {
        return $.shadow(this).mode;
    }

    get host() {
        return $.shadow(this).host;
    }

    // TODO: tests
    get innerHTML() {
        return $.serializeHTMLFragment(this);
    }

    // TODO: tests
    set innerHTML(value) {
        const fragment = $.parseHTMLFragment(value, this);
        $.replaceAll(fragment, this);
    }

}
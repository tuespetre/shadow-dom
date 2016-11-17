// https://dom.spec.whatwg.org/#interface-shadowroot
// https://www.w3.org/TR/shadow-dom/#the-shadowroot-interface

import * as $ from '../utils.js';

import CustomElements from '../custom-elements.js';

export default class {

    get nodeName() {
        return '#shadow-root';
    }

    get mode() {
        return $.getShadowState(this).mode;
    }

    get host() {
        return $.getShadowState(this).host;
    }

    // TODO: tests
    get innerHTML() {
        return $.serializeHTMLFragment(this);
    }

    // TODO: tests
    set innerHTML(value) {
        return CustomElements.executeCEReactions(() => {
            const fragment = $.parseHTMLFragment(value, this);
            $.replaceAll(fragment, this);
        });
    }

}
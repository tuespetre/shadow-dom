// https://dom.spec.whatwg.org/#interface-shadowroot
// https://www.w3.org/TR/shadow-dom/#the-shadowroot-interface

import $dom from '../dom.js';
import $ce from '../custom-elements.js';
import $utils from '../utils.js';

export default {

    get nodeName() {
        return '#shadow-root';
    },

    get mode() {
        return $utils.getShadowState(this).mode;
    },

    get host() {
        return $utils.getShadowState(this).host;
    },

    // TODO: tests
    get innerHTML() {
        return $dom.serializeHTMLFragment(this);
    },

    // TODO: tests
    set innerHTML(value) {
        return $ce.executeCEReactions(() => {
            const fragment = $dom.parseHTMLFragment(value, this);
            $dom.replaceAll(fragment, this);
        });
    },

}
// https://dom.spec.whatwg.org/#interface-attr

import * as $ from '../utils.js';

export default class {

    get value() {
        return $.descriptors.Attr.value.get.call(this);
    }

    // TODO: MutationObserver tests
    set value(value) {
        $.setExistingAttributeValue(this, value);
    }

}
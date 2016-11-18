// https://dom.spec.whatwg.org/#interface-attr

import * as $ from '../utils.js';

import CustomElements from '../custom-elements.js';

export default {

    get value() {
        return $.descriptors.Attr.value.get.call(this);
    },

    set value(value) {
        return CustomElements.executeCEReactions(() => {
            $.setExistingAttributeValue(this, value);
        });
    },

};
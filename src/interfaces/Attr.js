// https://dom.spec.whatwg.org/#interface-attr

import $dom from '../dom.js';
import $ce from '../custom-elements.js';
import $utils from '../utils.js';

const attrValueDescriptor = $utils.descriptor(Attr, 'value');

export default {

    get value() {
        return attrValueDescriptor.get.call(this);
    },

    set value(value) {
        return $ce.executeCEReactions(() => {
            $dom.setExistingAttributeValue(this, value);
        });
    },

};
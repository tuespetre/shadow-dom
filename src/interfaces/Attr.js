// https://dom.spec.whatwg.org/#interface-attr

import $dom from '../dom.js';
import $ce from '../custom-elements.js';
import $utils from '../utils.js';

export default {
    install
};

function install() {
    // TODO: Patch attribute instances elsewhere when there are broken accessors.
    if (!$utils.brokenAccessors) {
        const originalValueDescriptor = $utils.descriptor(Attr, 'value');
        const newValueDescriptor = {
            get: originalValueDescriptor.get,
            set: function (value) {
                return $ce.executeCEReactions(() => {
                    $dom.setExistingAttributeValue(this, value);
                });
            }
        };
        $utils.defineProperty(Attr.prototype, 'value', newValueDescriptor);
    }
}
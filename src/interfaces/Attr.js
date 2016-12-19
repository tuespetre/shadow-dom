// https://dom.spec.whatwg.org/#interface-attr

import $dom from '../dom.js';
import $ce from '../custom-elements.js';
import $utils from '../utils.js';

export default {
    install,
    patchAttributeNodeIfNeeded
};

function install() {
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

    // TODO: need to ensure that parser-inserted 'slot[name]' and '*[slot]' elements'
    // name and slot attribute nodes are patched. Not high priority but worth
    // keeping track of.
}

function patchAttributeNode(attribute) {
    $utils.defineProperty(attribute, 'value', {
        get: function () {
            if (!this.ownerElement) {
                delete this.value;
                const result = (this.value);
                return result;
            }
            if (this.namespaceURI) {
                return this.ownerElement.getAttributeNS(this.namespaceURI, this.localName);
            }
            return this.ownerElement.getAttribute(this.localName);
        },
        set: function (value) {
            if (!this.ownerElement) {
                delete this.value;
                const result = (this.value = value);
                return result;
            }
            return $ce.executeCEReactions(() => {
                return $dom.setExistingAttributeValue(this, value);
            });
        }
    });
}

function patchAttributeNodeIfNeeded(attribute) {
    if ($utils.brokenAccessors) {
        patchAttributeNode(attribute);
    }
}
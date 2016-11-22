// https://html.spec.whatwg.org/multipage/scripting.html#the-slot-element

import $dom from '../dom.js';
import $utils from '../utils.js';

export default {

    // TODO: tests
    get name() {
        if (this.localName !== 'slot') {
            return;
        }

        return this.getAttribute('name') || '';
    },

    // TODO: tests
    set name(value) {
        if (this.localName !== 'slot') {
            return;
        }

        $dom.setAttributeValue(this, 'name', value);
    },

    // TODO: tests
    assignedNodes(options) {
        if (this.localName !== 'slot') {
            return;
        }

        // https://html.spec.whatwg.org/multipage/scripting.html#dom-slot-assignednodes
        // The assignedNodes(options) method, when invoked, must run these steps:

        // 1. If the value of options's flatten member is false, then return this element's assigned nodes.
        if (!options || options.flatten !== true) {
            let assignedNodes = null;
            const shadowState = $utils.getShadowState(this);
            if (shadowState) {
                assignedNodes = shadowState.assignedNodes;
            }
            return assignedNodes || [];
        }

        // 2. Return the result of finding flattened slotables with this element.
        return $dom.findFlattenedSlotables(this);
    },

}
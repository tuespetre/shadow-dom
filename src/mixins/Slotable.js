// https://dom.spec.whatwg.org/#mixin-slotable

import $dom from '../dom.js';
import $utils from '../utils.js';

export default {

    get assignedSlot() {
        // spec implementation is to run 'find a slot'
        // this uses an alternative (see https://github.com/whatwg/dom/issues/369)
        const shadowState = $utils.getShadowState(this);
        if (shadowState) {
            let slot = shadowState.assignedSlot;
            if (slot && $dom.closedShadowHidden(slot, this)) {
                return null;
            }
            return slot;
        }
        return null;
    },

};
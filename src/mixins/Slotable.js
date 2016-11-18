// https://dom.spec.whatwg.org/#mixin-slotable

import * as $ from '../utils.js';

export default function (base) {

    return class {

        get assignedSlot() {
            // spec implementation is to run 'find a slot'
            // this uses an alternative (see https://github.com/whatwg/dom/issues/369)
            const shadowState = $.getShadowState(this);
            if (shadowState) {
                let slot = shadowState.assignedSlot;
                if (slot && $.closedShadowHidden(slot, this)) {
                    slot = null;
                }
                return slot;
            }
            return null;            
        }

    };

}
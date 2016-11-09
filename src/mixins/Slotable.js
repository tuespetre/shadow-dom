/*

https://dom.spec.whatwg.org/#mixin-slotable

[NoInterfaceObject, Exposed=Window]
interface Slotable

Element implements Slotable;
Text implements Slotable;

*/

import * as $ from '../utils.js';

export default function(base) {
    
    return class {

        get assignedSlot() {
            // TODO: efficiency (https://github.com/whatwg/dom/issues/369)
            return $.findASlot(this, true);
        }

    };

}
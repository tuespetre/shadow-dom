/*

https://dom.spec.whatwg.org/#mixin-slotable

[NoInterfaceObject, Exposed=Window]
interface Slotable

Element implements Slotable;
Text implements Slotable;

*/

import * as $ from '../utils.js';

export default base => class extends base {

    // TODO: tests
    get assignedSlot() {
        // TODO: efficiency
        return $.findASlot(this, true);
    }

}
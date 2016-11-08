/*

https://html.spec.whatwg.org/multipage/scripting.html#the-slot-element

interface HTMLSlotElement : HTMLElement

dictionary AssignedNodesOptions {
    boolean flatten = false;
};

*/

import * as $ from '../utils.js';

export default class extends HTMLUnknownElement {

    // TODO: tests
    get name() {
        return this.getAttribute('name');
    }

    // TODO: tests
    set name(value) {
        this.setAttribute('name', value);
    }

    // TODO: tests
    assignedNodes(options) {
        if (this.localName !== 'slot') {
            return;
        }

        // https://html.spec.whatwg.org/multipage/scripting.html#dom-slot-assignednodes
        // The assignedNodes(options) method, when invoked, must run these steps:

        // 1. If the value of options's flatten member is false, then return this element's assigned nodes.
        if (!options || options.flatten !== true) {
            return $.shadow(this).assignedNodes;
        }

        // 2. Return the result of finding flattened slotables with this element.
        return $.findFlattenedSlotables(this);    
    }

}
// https://html.spec.whatwg.org/multipage/scripting.html#the-slot-element

import * as $ from '../utils.js';

export default class {

    // TODO: tests
    get name() {
        if (this.localName !== 'slot') {
            return;
        }

        return this.getAttribute('name');
    }

    // TODO: tests
    set name(value) {
        if (this.localName !== 'slot') {
            return;
        }

        updateSlotName(this, 'name', this.name, value, null);
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
            return $.shadow(this).assignedNodes || [];
        }

        // 2. Return the result of finding flattened slotables with this element.
        return $.findFlattenedSlotables(this);
    }

}

function updateSlotName(element, localName, oldValue, value, namespace) {
    // https://dom.spec.whatwg.org/#slotable-name
    if (localName === 'name' && namespace == null) {
        if (value === oldValue) {
            return;
        }
        if (value == null && oldValue === '') {
            return;
        }
        if (value === '' && oldValue == null) {
            return;
        }
        if (value == null || value === '') {
            $.descriptors.Element.setAttribute.value.call(element, 'name', '');
        }
        else {
            $.descriptors.Element.setAttribute.value.call(element, 'name', value);
        }
        $.assignSlotablesForATree(element);
    }
}
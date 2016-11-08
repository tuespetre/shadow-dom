/*

https://dom.spec.whatwg.org/#interface-nondocumenttypechildnode

[NoInterfaceObject, Exposed=Window]
interface NonDocumentTypeChildNode

Element implements NonDocumentTypeChildNode;
CharacterData implements NonDocumentTypeChildNode;

*/

import * as $ from '../utils.js';

export default function (base) {

    const native = {
        previousElementSibling: Object.getOwnPropertyDescriptor(base.prototype, 'previousElementSibling'),
        nextElementSibling: Object.getOwnPropertyDescriptor(base.prototype, 'nextElementSibling')
    };

    return class extends base {

        // TODO: tests
        get previousElementSibling() {
            const parentNode = $.shadow(this).parentNode;
            if (parentNode) {
                const childNodes = $.shadow(parentNode).childNodes;
                let index = childNodes.indexOf(this);

                if (index === 0) {
                    return null;
                }

                do {
                    const previous = childNodes[--index];

                    if (previous.nodeType === Node.ELEMENT_NODE) {
                        return previous;
                    }
                }
                while (index > 0);

                return null;
            }

            return native.previousElementSibling.get.call(this);
        }

        // TODO: tests
        get nextElementSibling() {
            const parentNode = $.shadow(this).parentNode;
            if (parentNode) {
                const childNodes = $.shadow(parentNode).childNodes;
                let index = childNodes.indexOf(this);

                if (index === childNodes.length - 1) {
                    return null;
                }

                do {
                    const previous = childNodes[++index];

                    if (previous.nodeType === Node.ELEMENT_NODE) {
                        return previous;
                    }
                }
                while (index < childNodes.length);

                return null;
            }

            return native.nextElementSibling.get.call(this);
        }

    };

}
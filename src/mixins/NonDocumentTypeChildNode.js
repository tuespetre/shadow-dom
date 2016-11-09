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
        previousElementSibling: $.prop(base, 'previousElementSibling'),
        nextElementSibling: $.prop(base, 'nextElementSibling')
    };

    return class {

        // TODO: tests
        get previousElementSibling() {
            let parentNode = $.shadow(this).parentNode;

            if (!parentNode) {
                if (native.previousElementSibling) {
                    return native.previousElementSibling.get(this);
                }
                parentNode = this.parentNode;
            }

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

        // TODO: tests
        get nextElementSibling() {
            let parentNode = $.shadow(this).parentNode;

            if (!parentNode) {
                if (native.nextElementSibling) {
                    return native.nextElementSibling.get(this);
                }
                parentNode = this.parentNode;
            }
            
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

    };

}
// https://dom.spec.whatwg.org/#interface-nondocumenttypechildnode

import $utils from '../utils.js';

const elementWalker = document.createTreeWalker(document, NodeFilter.SHOW_ELEMENT, null, false);

export default function (base) {

    return {

        // TODO: tests
        get previousElementSibling() {
            const nodeState = $utils.getShadowState(this);
            if (nodeState) {
                const parentNode = nodeState.parentNode;
                if (parentNode) {
                    const childNodes = $utils.getShadowState(parentNode).childNodes;
                    let index = childNodes.indexOf(this);
                    while (index > 0) {
                        const previous = childNodes[--index];
                        if (previous.nodeType === Node.ELEMENT_NODE) {
                            return previous;
                        }
                    };
                    return null;
                }
            }
            elementWalker.currentNode = this;
            return elementWalker.previousSibling();
        },

        // TODO: tests
        get nextElementSibling() {
            const nodeState = $utils.getShadowState(this);
            if (nodeState) {
                const parentNode = nodeState.parentNode;
                if (parentNode) {
                    const childNodes = $utils.getShadowState(parentNode).childNodes;
                    let index = childNodes.indexOf(this);
                    while (index < childNodes.length - 1) {
                        const next = childNodes[++index];
                        if (next.nodeType === Node.ELEMENT_NODE) {
                            return next;
                        }
                    };
                    return null;
                }
            }
            elementWalker.currentNode = this;
            return elementWalker.nextSibling();
        },

    };

}
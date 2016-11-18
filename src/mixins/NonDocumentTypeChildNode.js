// https://dom.spec.whatwg.org/#interface-nondocumenttypechildnode

import * as $ from '../utils.js';

export default function (base) {

    const native = {
        previousElementSibling: $.descriptor(base, 'previousElementSibling'),
        nextElementSibling: $.descriptor(base, 'nextElementSibling')
    };

    return {

        // TODO: tests
        get previousElementSibling() {
            let nodeState = $.getShadowState(this);
            if (nodeState && nodeState.parentNode) {
                const childNodes = $.getShadowState(nodeState.parentNode).childNodes;
                let index = childNodes.indexOf(this);
                while (index > 0) {
                    const previous = childNodes[--index];
                    if (previous.nodeType === Node.ELEMENT_NODE) {
                        return previous;
                    }
                };
                return null;
            }
            else if (native.previousElementSibling) {
                return native.previousElementSibling.get.call(this);
            }
            else {
                const getPreviousSibling = $.descriptors.Node.previousSibling.get;
                let previousSibling = this;
                while (previousSibling = getPreviousSibling.call(previousSibling)) {
                    if (previousSibling.nodeType === Node.ELEMENT_NODE) {
                        return previousSibling;
                    }
                }
                return null;
            }
        },

        // TODO: tests
        get nextElementSibling() {
            let nodeState = $.getShadowState(this);
            if (nodeState && nodeState.parentNode) {
                const childNodes = $.getShadowState(nodeState.parentNode).childNodes;
                let index = childNodes.indexOf(this);
                while (index < childNodes.length - 1) {
                    const next = childNodes[++index];
                    if (next.nodeType === Node.ELEMENT_NODE) {
                        return next;
                    }
                };
                return null;
            }
            else if (native.nextElementSibling) {
                return native.nextElementSibling.get.call(this);
            }
            else {
                const getNextSibling = $.descriptors.Node.nextSibling.get;
                let nextSibling = this;
                while (nextSibling = getNextSibling.call(nextSibling)) {
                    if (nextSibling.nodeType === Node.ELEMENT_NODE) {
                        return nextSibling;
                    }
                }
                return null;
            }
        },

    };

}
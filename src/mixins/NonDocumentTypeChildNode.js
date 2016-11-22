// https://dom.spec.whatwg.org/#interface-nondocumenttypechildnode

import $utils from '../utils.js';

export default function (base) {

    const nodePreviousSiblingDescriptor = $utils.descriptor(Node, 'previousSibling');
    const nodeNextSiblingDescriptor = $utils.descriptor(Node, 'nextSibling');
    const basePreviousElementSiblingDescriptor = $utils.descriptor(base, 'previousElementSibling');
    const baseNextElementSiblingDescriptor = $utils.descriptor(base, 'nextElementSibling');

    return {

        // TODO: tests
        get previousElementSibling() {
            let nodeState = $utils.getShadowState(this);
            if (nodeState && nodeState.parentNode) {
                const childNodes = $utils.getShadowState(nodeState.parentNode).childNodes;
                let index = childNodes.indexOf(this);
                while (index > 0) {
                    const previous = childNodes[--index];
                    if (previous.nodeType === Node.ELEMENT_NODE) {
                        return previous;
                    }
                };
                return null;
            }
            else if (basePreviousElementSiblingDescriptor) {
                return basePreviousElementSiblingDescriptor.get.call(this);
            }
            else {
                const getPreviousSibling = nodePreviousSiblingDescriptor.get;
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
            let nodeState = $utils.getShadowState(this);
            if (nodeState && nodeState.parentNode) {
                const childNodes = $utils.getShadowState(nodeState.parentNode).childNodes;
                let index = childNodes.indexOf(this);
                while (index < childNodes.length - 1) {
                    const next = childNodes[++index];
                    if (next.nodeType === Node.ELEMENT_NODE) {
                        return next;
                    }
                };
                return null;
            }
            else if (baseNextElementSiblingDescriptor) {
                return baseNextElementSiblingDescriptor.get.call(this);
            }
            else {
                const getNextSibling = nodeNextSiblingDescriptor.get;
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
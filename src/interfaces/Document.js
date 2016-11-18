// https://dom.spec.whatwg.org/#interface-document

import * as $ from '../utils.js';

import CustomElements from '../custom-elements.js';

export default {

    // TODO: tests
    getElementsByTagName(qualifiedName) {
        const results = $.descriptors.Document.getElementsByTagName.value.call(this, qualifiedName);
        return $.filterByRoot(this, results);
    },

    // TODO: tests
    getElementsByTagNameNS(ns, localName) {
        const results = $.descriptors.Document.getElementsByTagNameNS.value.call(this, ns, localName);
        return $.filterByRoot(this, results);
    },

    // TODO: tests
    getElementsByClassName(names) {
        const results = $.descriptors.Document.getElementsByClassName.value.call(this, name);
        return $.filterByRoot(this, results);
    },

    // TODO: tests
    importNode(node, deep) {
        return CustomElements.executeCEReactions(() => {
            if (node.nodeType === Node.DOCUMENT_NODE || $.isShadowRoot(node)) {
                throw $.makeError('NotSupportedError');
            }

            return $.clone(node, this, deep);
        });
    },

    // TODO: tests
    adoptNode(node) {
        return CustomElements.executeCEReactions(() => {
            return $.adopt(node, this);
        });
    },

}
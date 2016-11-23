// https://dom.spec.whatwg.org/#interface-document

import $dom from '../dom.js';
import $ce from '../custom-elements.js';
import $utils from '../utils.js';

const documentGetElementsByTagNameDescriptor = $utils.descriptor(Document, 'getElementsByTagName');
const documentGetElementsByTagNameNSDescriptor = $utils.descriptor(Document, 'getElementsByTagNameNS');
const documentGetElementsByClassNameDescriptor = $utils.descriptor(Document, 'getElementsByClassName');

export default {

    // TODO: tests
    getElementsByTagName(qualifiedName) {
        const results = documentGetElementsByTagNameDescriptor.value.call(this, qualifiedName);
        return $dom.filterByRoot(this, results);
    },

    // TODO: tests
    getElementsByTagNameNS(ns, localName) {
        const results = documentGetElementsByTagNameNSDescriptor.value.call(this, ns, localName);
        return $dom.filterByRoot(this, results);
    },

    // TODO: tests
    getElementsByClassName(names) {
        const results = documentGetElementsByClassNameDescriptor.value.call(this, names);
        return $dom.filterByRoot(this, results);
    },

    // TODO: tests
    importNode(node, deep) {
        return $ce.executeCEReactions(() => {
            if (node.nodeType === Node.DOCUMENT_NODE || $dom.isShadowRoot(node)) {
                throw $utils.makeDOMException('NotSupportedError');
            }

            return $dom.clone(node, this, deep);
        });
    },

    // TODO: tests
    adoptNode(node) {
        return $ce.executeCEReactions(() => {
            return $dom.adopt(node, this);
        });
    },

}
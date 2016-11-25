// https://dom.spec.whatwg.org/#interface-document

import $dom from '../dom.js';
import $ce from '../custom-elements.js';
import $utils from '../utils.js';

export default {

    getElementsByTagName(qualifiedName) {
        return $dom.listOfElementsWithQualifiedName(this, qualifiedName);
    },

    getElementsByTagNameNS(nameSpace, localName) {
        return $dom.listOfElementsWithNamespaceAndLocalName(this, nameSpace, localName);
    },

    getElementsByClassName(names) {
        return $dom.listOfElementsWithClassNames(this, names);
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

};
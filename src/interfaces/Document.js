/*

https://dom.spec.whatwg.org/#interface-document

[Constructor, Exposed=Window]
interface Document : Node

[Exposed=Window]
interface XMLDocument : Document {};

dictionary ElementCreationOptions {
  DOMString is;
};

*/

import * as $ from '../utils.js';

export default class {

    // TODO: tests
    getElementsByTagName(qualifiedName) {
        const collection = $.native.Document.getElementsByTagName.call(this, qualifiedName);
        const filtered = [];

        for (let i = 0; i < collection.length; i++) {
            const item = collection[i];
            if (this === item.getRootNode({ composed: false })) {
                filtered.push(item)
            }
        }

        return filtered;
    }

    // TODO: tests
    getElementsByTagNameNS(ns, localName) {
        const collection = $.native.Document.getElementsByTagNameNS.call(this, ns, localName);
        const filtered = [];

        for (let i = 0; i < collection.length; i++) {
            const item = collection[i];
            if (this === item.getRootNode({ composed: false })) {
                filtered.push(item)
            }
        }

        return filtered;
    }

    // TODO: tests
    getElementsByClassName(names) {
        const collection = $.native.Document.getElementsByClassName.call(this, name);
        const filtered = [];

        for (let i = 0; i < collection.length; i++) {
            const item = collection[i];
            if (this === item.getRootNode({ composed: false })) {
                filtered.push(item)
            }
        }

        return filtered;
    }

    // TODO: tests
    importNode(node, deep) {
        if (node.nodeType === Node.DOCUMENT_NODE || node.nodeName === '#shadow-root') {
            throw $.makeError('NotSupportedError');
        }

        return $.clone(node, this, deep);
    }

}
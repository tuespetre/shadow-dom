// https://dom.spec.whatwg.org/#interface-node

import * as $ from '../utils.js';

export default class {

    getRootNode(options) {
        const composed = options && (options.composed === true);
        return composed ? $.shadowIncludingRoot(this) : $.root(this);
    }

    get parentNode() {
        const parentNode = $.shadow(this).parentNode;
        if (parentNode) {
            return parentNode;
        }

        return $.descriptors.Node.parentNode.get.call(this);
    }

    get parentElement() {
        const parentNode = this.parentNode;
        if (parentNode && parentNode.nodeType === Node.ELEMENT_NODE) {
            return parentNode;
        }

        return null;
    }

    // TODO: tests
    hasChildNodes() {
        const childNodes = $.shadow(this).childNodes;
        if (childNodes) {
            return childNodes.length > 0;
        }

        return $.descriptors.Node.hasChildNodes.value.call(this);
    }

    // TODO: tests
    get childNodes() {
        const childNodes = $.shadow(this).childNodes;
        if (childNodes) {
            return childNodes.slice();
        }

        return $.descriptors.Node.childNodes.get.call(this);
    }

    // TODO: tests
    get firstChild() {
        const childNodes = $.shadow(this).childNodes;
        if (childNodes) {
            if (childNodes.length) {
                return childNodes[0];
            }
            return null;
        }

        return $.descriptors.Node.firstChild.get.call(this);
    }

    // TODO: tests
    get lastChild() {
        const childNodes = $.shadow(this).childNodes;
        if (childNodes) {
            if (childNodes.length) {
                return childNodes[childNodes.length - 1];
            }
            return null;
        }

        return $.descriptors.Node.lastChild.get.call(this);
    }

    // TODO: tests
    get previousSibling() {
        const parentNode = $.shadow(this).parentNode;
        if (parentNode) {
            const childNodes = $.shadow(parentNode).childNodes;
            const siblingIndex = childNodes.indexOf(this) - 1;
            return siblingIndex < 0 ? null : childNodes[siblingIndex];
        }

        return $.descriptors.Node.previousSibling.get.call(this);
    }

    // TODO: tests
    get nextSibling() {
        const parentNode = $.shadow(this).parentNode;
        if (parentNode) {
            const childNodes = $.shadow(parentNode).childNodes;
            const siblingIndex = childNodes.indexOf(this) + 1;
            return siblingIndex === childNodes.length ? null : childNodes[siblingIndex];
        }

        return $.descriptors.Node.nextSibling.get.call(this);
    }

    // TODO: implement nodeValue

    // TODO: tests
    get textContent() {
        switch (this.nodeType) {
            case Node.DOCUMENT_FRAGMENT_NODE:
            case Node.ELEMENT_NODE:
                let result = '';
                const childNodes = this.childNodes;
                for (let i = 0; i < childNodes.length; i++) {
                    result += childNodes[i].textContent;
                }
                return result;
            case Node.ATTRIBUTE_NODE:
                return this.value;
            case Node.TEXT_NODE:
            case Node.PROCESSING_INSTRUCTION_NODE:
            case Node.COMMENT_NODE:
                return this.data;
            default:
                return null;
        }
    }

    // TODO: invoke 'replace data', tests
    set textContent(value) {
        switch (this.nodeType) {
            case Node.DOCUMENT_FRAGMENT_NODE:
            case Node.ELEMENT_NODE:
                let node = null;
                if (value !== '') {
                    node = this.ownerDocument.createTextNode(value);
                }
                $.replaceAll(node, this);
                return;
        }

        return $.descriptors.Node.textContent.set.call(this, value);
    }

    // TODO: invoke 'replace data', tests
    normalize() {
        // https://dom.spec.whatwg.org/#dom-node-normalize
        // The normalize() method, when invoked, must run these steps 
        // for each descendant exclusive Text node node of context object:
        const childNodes = this.childNodes;
        for (let i = 0; i < childNodes.length; i++) {
            let childNode = childNodes[i];
            if (childNode.hasChildNodes()) {
                childNode.normalize();
            }
            else if (childNode.nodeType === Node.TEXT_NODE) {
                let length = childNode.data.length;
                if (length === 0) {
                    $.remove(childNode, this);
                    continue;
                }
                let j;
                for (j = i + 1; j < childNodes.length; j++) {
                    let nextSibling = childNodes[j];
                    if (nextSibling.nodeType !== Node.TEXT_NODE) {
                        break;
                    }
                    childNode.data += nextSibling.data;
                    i++;
                    continue;
                }
            }
        }
    }

    // TODO: tests
    cloneNode(deep) {
        // https://dom.spec.whatwg.org/#dom-node-clonenode
        // The cloneNode(deep) method, when invoked, must run these steps:

        // 1. If context object is a shadow root, then throw a NotSupportedError.
        if ($.isShadowRoot(this)) {
            throw $.makeError('NotSupportedError');
        }

        // 2. Return a clone of the context object, with the clone children flag set if deep is true.
        return $.clone(this, undefined, deep);
    }

    // TODO: tests
    isEqualNode(other) {
        // https://dom.spec.whatwg.org/#dom-node-isequalnode
        // https://dom.spec.whatwg.org/#concept-node-equals
        if (!other) {
            return false;
        }

        if (this.nodeType !== other.nodeType) {
            return false;
        }

        switch (this.nodeType) {
            case Node.DOCUMENT_TYPE_NODE:
                if (this.name !== other.name ||
                    this.publicId !== other.publicId ||
                    this.systemId !== other.systemId) {
                    return false;
                }
            case Node.ELEMENT_NODE:
                if (this.namespaceURI !== other.namespaceURI ||
                    this.prefix !== other.prefix ||
                    this.localName !== other.localName ||
                    this.attributes.length !== other.attributes.length) {
                    return false;
                }
            case Node.ATTRIBUTE_NODE:
                if (this.namespaceURI !== other.namespaceURI ||
                    this.localName !== other.localName ||
                    this.value !== other.value) {
                    return false;
                }
            case Node.PROCESSING_INSTRUCTION_NODE:
                if (this.target !== other.target ||
                    this.data !== other.data) {
                    return false;
                }
            case Node.TEXT_NODE:
            case Node.COMMENT_NODE:
                if (this.data !== other.data) {
                    return false;
                }
        }

        if (this.nodeType == Node.ELEMENT_NODE) {
            for (let i = 0; i < this.attributes.length; i++) {
                let attr1 = this.attributes[i];
                let attr2 = other.attributes[attr1.name];
                if (attr1.value !== attr2.value) {
                    return false;
                }
            }
        }

        let childNodes1 = this.childNodes;
        let childNodes2 = other.childNodes;
        if (childNodes1.length !== other.childNodes.length) {
            return false;
        }

        for (let i = 0; i < childNodes1.length; i++) {
            if (!childNodes1[i].isEqualNode(childNodes2[i])) {
                return false;
            }
        }

        return true;
    }

    // TODO: tests
    compareDocumentPosition(other) {
        // https://dom.spec.whatwg.org/#dom-node-comparedocumentposition

        if (this === other) {
            return 0;
        }

        let node1 = other;
        let node2 = this;
        let attr1 = null;
        let attr2 = null;

        if (node1.nodeType == Document.prototype.ATTRIBUTE_NODE) {
            attr1 = node1;
            node1 = attr1.ownerElement;
        }

        if (node2.nodeType == Document.prototype.ATTRIBUTE_NODE) {
            attr2 = node2;
            node2 = attr2.ownerElement;

            if (attr1 && node1 && node2 === node1) {
                let attrs = node2.atttributes;
                for (let i = 0; i < attrs.length; i++) {
                    const attr = attrs[i];
                    if (attr.isEqualNode(attr1)) {
                        return Document.prototype.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC
                            + Document.prototype.DOCUMENT_POSITION_PRECEDING;
                    }
                    else if (attr.isEqualNode(attr2)) {
                        return Document.prototype.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC
                            + Document.prototype.DOCUMENT_POSITION_FOLLOWING;
                    }
                }
            }
        }

        if (!node1 || !node2 || $.root(node1) !== $.root(node2)) {
            return Document.prototype.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC
                + Document.prototype.DOCUMENT_POSITION_FOLLOWING
                + Document.prototype.DOCUMENT_POSITION_DISCONNECTED;
        }

        if (ancestorOf(node2, node1) || ((node1 === node2) && attr2)) {
            return Document.prototype.DOCUMENT_POSITION_CONTAINS
                + Document.prototype.DOCUMENT_POSITION_PRECEDING;
        }

        if (ancestorOf(node1, node2) || ((node1 === node2) && attr1)) {
            return Document.prototype.DOCUMENT_POSITION_CONTAINS
                + Document.prototype.DOCUMENT_POSITION_FOLLOWING;
        }

        if (preceding(node1, node2)) {
            return Document.prototype.DOCUMENT_POSITION_PRECEDING;
        }

        return Document.prototype.DOCUMENT_POSITION_FOLLOWING;
    }

    // TODO: tests
    contains(node) {
        // https://dom.spec.whatwg.org/#dom-node-contains

        let parent = node.parentNode;

        if (!parent) {
            return false;
        }

        do {
            if (parent === this) {
                return true;
            }
        }
        while (parent = parent.parentNode);

        return false;
    }

    // TODO: tests
    insertBefore(node, child) {
        // https://dom.spec.whatwg.org/#dom-node-insertbefore
        // The insertBefore(node, child) method, when invoked, must return the result 
        // of pre-inserting node into context object before child.
        return $.preInsert(node, this, child);
    }

    // TODO: tests
    appendChild(node) {
        // https://dom.spec.whatwg.org/#dom-node-appendchild
        // The appendChild(node) method, when invoked, must return the result of 
        // appending node to context object.
        return $.append(node, this);
    }

    // TODO: tests
    replaceChild(node, child) {
        // https://dom.spec.whatwg.org/#dom-node-replacechild
        // The replaceChild(node, child) method, when invoked, must return the 
        // result of replacing child with node within context object.
        return $.replace(child, node, this);
    }

    // TODO: tests
    removeChild(child) {
        // https://dom.spec.whatwg.org/#dom-node-removechild
        // The removeChild(child) method, when invoked, must return the result of 
        // pre-removing child from context object.
        return $.preRemove(child, this);
    }

}

function ancestorOf(node, ancestor) {
    let parent = node.parentNode;

    do {
        if (parent === ancestor) {
            return true;
        }
    }
    while (parent = parent.parentNode);

    return false;
}

function preceding(element1, element2) {
    function precedingSiblings(parent, sibling1, sibling2) {
        let siblings = parent.childNodes;
        for (let i = 0; i < siblings.length; i++) {
            let sibling = siblings[i];
            if (sibling === sibling1) {
                return true;
            }
            else if (sibling === sibling2) {
                return false;
            }
        }
    }

    // Check if they're already siblings.
    let ancestor1 = element1.parentNode;
    let ancestor2 = element2.parentNode;

    if (ancestor1 === ancestor2) {
        return precedingSiblings(element1, element2);
    }

    // Find the closest common ancestor.
    let ancestors1 = [ancestor1];
    let ancestors2 = [ancestor2];

    while (ancestor1 = ancestor1.parentNode) {
        ancestors1.push(ancestor1);
    }

    while (ancestor2 = ancestor2.parentNode) {
        ancestors2.push(ancestor2);
    }

    ancestors1.reverse();
    ancestors2.reverse();

    let diff = Math.abs(ancestors1.length - ancestors2.length);
    let min = Math.min(ancestors1.length, ancestors2.length);

    let i = 0;
    while (ancestors1[i] === ancestors2[i]) {
        i++;
    }

    return precedingSiblings(ancestors1[i - 1], ancestors1[i], ancestors2[i]);
}
// https://dom.spec.whatwg.org/#interface-element

import * as $ from '../utils.js';

import $ShadowRoot from '../interfaces/ShadowRoot.js';

export default class {

    get slot() {
        // The slot attribute must reflect the "slot" content attribute.
        return this.getAttribute('slot');
    }

    // TODO: tests
    set slot(value) {
        $.setAttributeValue(this, 'slot', value);
    }

    // TODO: tests
    get attributes() {
        const attributes = $.descriptors.Element.attributes.get.call(this);
        $.shadow(attributes).element = this;
        return attributes;
    }

    // TODO: tests
    setAttribute(qualifiedName, value) {
        let attribute = $.descriptors.Element.attributes.get.call(this).getNamedItem(qualifiedName);
        if (!attribute) {
            attribute = this.ownerDocument.createAttribute(qualifiedName);
            $.descriptors.Attr.value.set.call(attribute, value);
            $.appendAttribute(attribute, this);
            return;
        }
        $.changeAttribute(attribute, this, value);
    }

    // TODO: tests
    setAttributeNS(namespace, qualifiedName, value) {
        const dummy = document.createAttributeNS(namespace, qualifiedName);
        $.setAttributeValue(this, dummy.localName, value, dummy.prefix, dummy.namespaceURI);
    }

    // TODO: tests
    removeAttribute(qualifiedName) {
        $.removeAttributeByName(qualifiedName, this);
    }

    // TODO: tests
    removeAttributeNS(namespace, localName) {
        $.removeAttributeByNamespace(namespace, localName, this);
    }

    // TODO: tests
    setAttributeNode(attr) {
        return $.setAttribute(attr, this);
    }

    // TODO: tests
    setAttributeNodeNS(attr) {
        return $.setAttribute(attr, this);
    }

    // TODO: tests
    removeAttributeNode(attr) {
        if (attr.ownerElement !== this) {
            throw $.makeError('NotFoundError');
        }
        $.removeAttribute(attr, this);
        return attr;
    }

    attachShadow(init) {
        // https://dom.spec.whatwg.org/#dom-element-attachshadow
        if (!init || (init.mode !== 'open' && init.mode !== 'closed')) {
            throw $.makeError('TypeError');
        }

        if (this.namespaceURI !== 'http://www.w3.org/1999/xhtml') {
            throw $.makeError('NotSupportedError');
        }

        switch (this.localName) {
            case "article": case "aside": case "blockquote": case "body":
            case "div": case "footer": case "h1": case "h2": case "h3":
            case "h4": case "h5": case "h6": case "header": case "main":
            case "nav": case "p": case "section": case "span":
                break;
            default:
                if ($.isValidCustomElementName(this.localName)) {
                    break;
                }
                throw $.makeError('NotSupportedError');
        }

        if (this.shadowRoot) {
            throw $.makeError('InvalidStateError');
        }

        const shadow = this.ownerDocument.createDocumentFragment();

        $.extend(shadow, $ShadowRoot);

        const shadowState = $.shadow(shadow);

        shadowState.host = this;
        shadowState.mode = init.mode;
        shadowState.childNodes = [];

        const childNodes = $.descriptors.Node.childNodes.get.call(this);
        const hostState = $.shadow(this);

        hostState.shadowRoot = shadow;
        hostState.childNodes = $.slice(this.childNodes);

        const removeChild = $.descriptors.Node.removeChild.value;
        for (let i = 0; i < childNodes.length; i++) {
            const childNode = childNodes[i];
            $.shadow(childNode).parentNode = this;
            removeChild.call(this, childNode);
        }

        return shadow;
    }

    get shadowRoot() {
        // https://dom.spec.whatwg.org/#dom-element-shadowroot

        let shadowRoot = $.shadow(this).shadowRoot;

        if (!shadowRoot || shadowRoot.mode === 'closed') {
            return null;
        }

        return shadowRoot;
    }

    // TODO: tests
    closest(selectors) {
        let element = this;

        do {
            if (element.matches(selectors)) {
                return element;
            }
        }
        while (element = element.parentElement);
    }

    // TODO: tests
    getElementsByTagName(qualifiedName) {
        const results = $.descriptors.Element.getElementsByTagName.value.call(this, qualifiedName);
        return $.filterByRoot(this, results);
    }

    // TODO: tests
    getElementsByTagNameNS(ns, localName) {
        const results = $.descriptors.Element.getElementsByTagNameNS.value.call(this, ns, localName);
        return $.filterByRoot(this, results);
    }

    // TODO: tests
    getElementsByClassName(names) {
        const results = $.descriptors.Element.getElementsByClassName.value.call(this, name);
        return $.filterByRoot(this, results);
    }

    // TODO: tests
    insertAdjacentElement(where, element) {
        // https://dom.spec.whatwg.org/#dom-element-insertadjacentelement
        return $.insertAdjacent(this, where, element);
    }

    // TODO: tests
    insertAdjacentText(where, data) {
        // https://dom.spec.whatwg.org/#dom-element-insertadjacenttext
        const text = this.ownerDocument.createTextNode(data);
        $.insertAdjacent(this, where, text);
        return;
    }

    // https://w3c.github.io/DOM-Parsing/#extensions-to-the-element-interface

    // TODO: more thorough tests of the serialization
    get innerHTML() {
        // https://w3c.github.io/DOM-Parsing/#dom-element-innerhtml
        return $.serializeHTMLFragment(this);
    }

    // TODO: MutationObserver tests
    set innerHTML(value) {
        // https://w3c.github.io/DOM-Parsing/#dom-element-innerhtml
        const fragment = $.parseHTMLFragment(value, this);
        $.replaceAll(fragment, this);
    }

    // TODO: tests
    get outerHTML() {
        // https://w3c.github.io/DOM-Parsing/#dom-element-outerhtml
        return $.serializeHTMLFragment({ childNodes: [this] });
    }

    // TODO: tests
    set outerHTML(value) {
        // https://w3c.github.io/DOM-Parsing/#dom-element-outerhtml
        let parent = this.parentNode;
        if (parent === null) {
            return;
        }
        if (parent.nodeType === Node.DOCUMENT_NODE) {
            throw $.makeError('NoModificationAllowedError');
        }
        if (parent.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
            parent = this.ownerDocument.createElement('body');
        }
        const fragment = $.parseHTMLFragment(value, parent);
        $.replace(this, fragment, this.parentNode);
    }

    // TODO: tests
    insertAdjacentHTML(position, text) {
        // https://w3c.github.io/DOM-Parsing/#dom-element-insertadjacenthtml
        // We aren't going to go exactly by the books for this one.
        const fragment = $.parseHTMLFragment(text, this);
        $.insertAdjacent(this, position, fragment);
    }

}
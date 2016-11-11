// https://dom.spec.whatwg.org/#interface-element

import * as $ from '../utils.js';

import $ShadowRoot from '../interfaces/ShadowRoot.js';

export default class {

    // TODO: Override setAttribute, setAttributeNS, removeAttribute,
    // removeAttributeNS, setAttributeNode, setAttributeNodeNS, 
    // and removeAttributeNode to detect slot changes and work with
    // MutationObservers.

    get slot() {
        // The slot attribute must reflect the "slot" content attribute.
        return this.getAttribute('slot');
    }

    // TODO: tests
    set slot(value) {
        updateSlotableName(this, 'slot', this.slot, value, null);
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

        $.shadow(shadow).host = this;
        $.shadow(shadow).mode = init.mode;
        $.shadow(shadow).childNodes = [];

        const childNodes = $.descriptors.Node.childNodes.get.call(this);

        $.shadow(this).shadowRoot = shadow;
        $.shadow(this).childNodes = $.slice(this.childNodes);
        
        for (let i = 0; i < childNodes.length; i++) {
            $.shadow(childNodes[i]).parentNode = this;
        }

        $.descriptors.Element.innerHTML.set.call(this, null);

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

    // TODO: tests
    get innerHTML() {
        // https://w3c.github.io/DOM-Parsing/#dom-element-innerhtml
        return $.serializeHTMLFragment(this);
    }

    // TODO: tests
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

function updateSlotableName(element, localName, oldValue, value, namespace) {
    // https://dom.spec.whatwg.org/#slotable-name
    if (localName === 'slot' && namespace == null) {
        if (value === oldValue) {
            return;
        }
        if (value == null && oldValue === '') {
            return;
        }
        if (value === '' && oldValue == null) {
            return;
        }
        if (value == null || value === '') {
            $.descriptors.Element.setAttribute.value.call(element, 'slot', '');
        }
        else {
            $.descriptors.Element.setAttribute.value.call(element, 'slot', value);
        }
        const assignedSlot = $.shadow(element).assignedSlot;
        if (assignedSlot) {
            $.assignSlotables(assignedSlot);
        }
        $.assignASlot(element);
    }
}
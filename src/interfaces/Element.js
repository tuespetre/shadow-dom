/*

https://dom.spec.whatwg.org/#interface-element
https://www.w3.org/TR/DOM-Parsing/#extensions-to-the-element-interface

[Exposed=Window]
interface Element : Node

dictionary ShadowRootInit {
  required ShadowRootMode mode;
};

*/

import * as $ from '../utils.js';

import $ShadowRoot from '../interfaces/ShadowRoot.js';

const native = {
    getElementsByTagName: Element.prototype.getElementsByTagName,
    getElementsByTagNameNS: Element.prototype.getElementsByTagNameNS,
    getElementsByClassName: Element.prototype.getElementsByClassName,
    innerHTML: Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML'),
    outerHTML: Object.getOwnPropertyDescriptor(Element.prototype, 'outerHTML'),
    insertAdjacentElement: Element.prototype.insertAdjacentElement,
    insertAdjacentHTML: Element.prototype.insertAdjacentHTML,
    insertAdjacentText: Element.prototype.insertAdjacentText
};

export default class extends Element {

    get slot() {
        // The slot attribute must reflect the "slot" content attribute.
        return this.getAttribute('slot');
    }

    // TODO: impl, tests
    // Track slot name changes
    // Possibly need to intercept setAttribute?
    set slot(value) {
        // The slot attribute must reflect the "slot" content attribute.
        this.setAttribute('slot', value);
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

        $.shadow(shadow, {
            host: this,
            mode: init.mode,
            childNodes: []
        });

        $.shadow(this, {
            shadowRoot: shadow,
            childNodes: Array.prototype.slice.call(this.childNodes)
        });

        const childNodes = $.shadow(this).childNodes;
        for (let i = 0; i < childNodes.length; i++) {
            $.shadow(childNodes[i], {
                parentNode: this
            });
        }

        native.innerHTML.set.call(this, null);

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
        const contextRoot = this.getRootNode({ composed: false });
        const collection = native.getElementsByTagName.call(this, qualifiedName);
        const filtered = [];

        for (let i = 0; i < collection.length; i++) {
            const item = collection[i];
            if (contextRoot === item.getRootNode({ composed: false })) {
                filtered.push(item)
            }
        }

        return filtered;
    }

    // TODO: tests
    getElementsByTagNameNS(ns, localName) {
        const contextRoot = this.getRootNode({ composed: false });
        const collection = native.getElementsByTagNameNS.call(this, ns, localName);
        const filtered = [];

        for (let i = 0; i < collection.length; i++) {
            const item = collection[i];
            if (contextRoot === item.getRootNode({ composed: false })) {
                filtered.push(item)
            }
        }

        return filtered;
    }

    // TODO: tests
    getElementsByClassName(names) {
        const contextRoot = this.getRootNode({ composed: false });
        const collection = native.getElementsByClassName.call(this, name);
        const filtered = [];

        for (let i = 0; i < collection.length; i++) {
            const item = collection[i];
            if (contextRoot === item.getRootNode({ composed: false })) {
                filtered.push(item)
            }
        }

        return filtered;
    }

    // TODO: impl, tests
    insertAdjacentElement(where, element) {
        return native.insertAdjacentElement.call(this, where, text);
    }

    // TODO: impl, tests
    insertAdjacentText(where, data) {
        return native.insertAdjacentText.call(this, where, data);
    }

    // https://w3c.github.io/DOM-Parsing/#extensions-to-the-element-interface

    // TODO: impl, tests
    get innerHTML() {
        return native.innerHTML.get.call(this);
    }

    // TODO: impl, tests
    set innerHTML(value) {
        return native.innerHTML.set.call(this, value);
    }

    // TODO: impl, tests
    get outerHTML() {
        return native.outerHTML.get.call(this);
    }

    // TODO: impl, tests
    set outerHTML(value) {
        return native.outerHTML.set.call(this, value);
    }

    // TODO: impl, tests
    insertAdjacentHTML(position, text) {
        return native.insertAdjacentHTML.call(this, position, text);
    }

}
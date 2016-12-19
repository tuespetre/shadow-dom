// https://dom.spec.whatwg.org/#interface-element

import $dom from '../dom.js';
import $ce from '../custom-elements.js';
import $utils from '../utils.js';
import $Attr from '../interfaces/Attr.js';
import $ShadowRoot from '../interfaces/ShadowRoot.js';

export default {
    install() {
        // Element.matches(selectors) polyfill from MDN
        // https://developer.mozilla.org/en-US/docs/Web/API/Element/matches#Polyfill
        // Purposefully chop out the polyfill function that uses querySelectorAll.
        if (!Element.prototype.matches) {
            Element.prototype.matches =
                Element.prototype.matchesSelector ||
                Element.prototype.mozMatchesSelector ||
                Element.prototype.msMatchesSelector ||
                Element.prototype.oMatchesSelector ||
                Element.prototype.webkitMatchesSelector;
        }

        if ($utils.brokenAccessors) {
            const attributesDescriptor = {
                get: function () {
                    delete HTMLElement.prototype['attributes'];
                    const attributes = this.attributes;
                    $utils.defineProperty(HTMLElement.prototype, 'attributes', attributesDescriptor);
                    const shadowState = $utils.getShadowState(attributes);
                    if (!shadowState) {
                        $utils.setShadowState(attributes, { element: this });
                    }
                    return attributes;
                }
            };

            $utils.extend(Element, elementMixin);
            $utils.extend(HTMLElement, htmlElementMixin);
            $utils.defineProperty(HTMLElement.prototype, 'attributes', attributesDescriptor);
        }
        else {
            const attributesDescriptor = {
                get: function () {
                    const attributes = elementAttributesDescriptor.get.call(this);
                    const shadowState = $utils.getShadowState(attributes);
                    if (!shadowState) {
                        $utils.setShadowState(attributes, { element: this });
                    }
                    return attributes;
                }
            };

            $utils.extend(Element, elementMixin);
            $utils.extend(Element, htmlElementMixin);
            $utils.defineProperty(Element.prototype, 'attributes', attributesDescriptor);

            // Cleanup for IE, Edge
            $utils.deleteProperty(HTMLElement, 'classList');
            $utils.deleteProperty(HTMLElement, 'children');
            $utils.deleteProperty(HTMLElement, 'parentElement');
            $utils.deleteProperty(HTMLElement, 'innerHTML');
            $utils.deleteProperty(HTMLElement, 'outerHTML');
            $utils.deleteProperty(HTMLElement, 'contains');
            $utils.deleteProperty(HTMLElement, 'insertAdjacentText');
            $utils.deleteProperty(HTMLElement, 'insertAdjacentElement');
            $utils.deleteProperty(HTMLElement, 'insertAdjacentHTML');
        }
    }
}

const elementSetAttributeDescriptor = $utils.descriptor(Element, 'setAttribute');
const elementSetAttributeNSDescriptor = $utils.descriptor(Element, 'setAttributeNS');
const nodeRemoveChildDescriptor = $utils.descriptor(Node, 'removeChild');
const elementAttributesDescriptor = $utils.descriptor(Element, 'attributes') || $utils.descriptor(Node, 'attributes');

const elementMixin = {

    get slot() {
        return this.hasAttribute('slot') ? this.getAttribute('slot') : '';
    },

    set slot(value) {
        this.setAttribute('slot', value);
    },

    // TODO: tests
    setAttribute(qualifiedName, value) {
        return $ce.executeCEReactions(() => {
            const attributes = this.attributes;
            let attribute = attributes.getNamedItem(qualifiedName);
            if (!attribute) {
                elementSetAttributeDescriptor.value.call(this, qualifiedName, value);
                attribute = attributes.getNamedItem(qualifiedName);
                $Attr.patchAttributeNodeIfNeeded(attribute);
                $dom.appendAttribute(attribute, this);
            }
            else {
                $dom.changeAttribute(attribute, this, value);
            }
        });
    },

    // TODO: tests
    setAttributeNS(nameSpace, qualifiedName, value) {
        return $ce.executeCEReactions(() => {
            const attributes = this.attributes;
            const parts = qualifiedName.split(':', 2);
            const localName = parts[parts.length - 1];
            let attribute = attributes.getNamedItemNS(nameSpace, localName);
            if (!attribute) {
                elementSetAttributeNSDescriptor.value.call(this, nameSpace, qualifiedName, value);
                attribute = attributes.getNamedItemNS(nameSpace, localName);
                $Attr.patchAttributeNodeIfNeeded(attribute);
                $dom.appendAttribute(attribute, this);
            }
            else {
                $dom.changeAttribute(attribute, this, value);
            }
        });
    },

    // TODO: tests
    removeAttribute(qualifiedName) {
        return $ce.executeCEReactions(() => {
            $dom.removeAttributeByName(qualifiedName, this);
        });
    },

    // TODO: tests
    removeAttributeNS(nameSpace, localName) {
        return $ce.executeCEReactions(() => {
            $dom.removeAttributeByNamespace(nameSpace, localName, this);
        });
    },

    // TODO: tests
    setAttributeNode(attr) {
        $Attr.patchAttributeNodeIfNeeded(attr);
        return $ce.executeCEReactions(() => {
            return $dom.setAttribute(attr, this);
        });
    },

    // TODO: tests
    setAttributeNodeNS(attr) {
        $Attr.patchAttributeNodeIfNeeded(attr);
        return $ce.executeCEReactions(() => {
            return $dom.setAttribute(attr, this);
        });
    },

    // TODO: tests
    removeAttributeNode(attr) {
        return $ce.executeCEReactions(() => {
            if (attr.ownerElement !== this) {
                throw $utils.makeDOMException('NotFoundError');
            }
            $dom.removeAttribute(attr, this);
            return attr;
        });
    },

    attachShadow(init) {
        // https://dom.spec.whatwg.org/#dom-element-attachshadow
        if (!init || (init.mode !== 'open' && init.mode !== 'closed')) {
            throw $utils.makeDOMException('TypeError');
        }

        if (this.namespaceURI !== 'http://www.w3.org/1999/xhtml') {
            throw $utils.makeDOMException('NotSupportedError');
        }

        switch (this.localName) {
            case "article": case "aside": case "blockquote": case "body":
            case "div": case "footer": case "h1": case "h2": case "h3":
            case "h4": case "h5": case "h6": case "header": case "main":
            case "nav": case "p": case "section": case "span":
                break;
            default:
                if ($ce.isValidCustomElementName(this.localName)) {
                    break;
                }
                throw $utils.makeDOMException('NotSupportedError');
        }

        if (this.shadowRoot) {
            throw $utils.makeDOMException('InvalidStateError');
        }

        const shadow = this.ownerDocument.createDocumentFragment();

        $utils.extend(shadow, $ShadowRoot);

        $utils.setShadowState(shadow, {
            host: this,
            mode: init.mode,
            childNodes: []
        });

        const savedChildNodes = Array.prototype.slice.call(this.childNodes);
        const savedChildNodesCount = savedChildNodes.length;
        for (let i = 0; i < savedChildNodesCount; i++) {
            const savedChildNode = savedChildNodes[i];
            const childState = $utils.getShadowState(savedChildNode) || $utils.setShadowState(savedChildNode, {});
            childState.parentNode = this;
            nodeRemoveChildDescriptor.value.call(this, savedChildNode);
        }

        let hostState = $utils.getShadowState(this);
        if (!hostState) {
            hostState = {};
            $utils.setShadowState(this, hostState);
        }
        hostState.shadowRoot = shadow;
        hostState.childNodes = savedChildNodes;

        return shadow;
    },

    get shadowRoot() {
        // https://dom.spec.whatwg.org/#dom-element-shadowroot
        let shadowRoot = null;
        let shadowState = $utils.getShadowState(this);
        if (shadowState) {
            shadowRoot = shadowState.shadowRoot;
            if (!shadowRoot || shadowRoot.mode === 'closed') {
                return null;
            }
        }
        return shadowRoot;
    },

    // TODO: tests
    closest(selectors) {
        let element = this;

        do {
            if (element.matches(selectors)) {
                return element;
            }
        }
        while (element = element.parentElement);
    },

    getElementsByTagName(qualifiedName) {
        return $dom.listOfElementsWithQualifiedName(this, qualifiedName);
    },

    getElementsByTagNameNS(ns, localName) {
        return $dom.listOfElementsWithNamespaceAndLocalName(this, ns, localName);
    },

    getElementsByClassName(names) {
        return $dom.listOfElementsWithClassNames(this, names);
    },

    // TODO: tests
    insertAdjacentElement(where, element) {
        return $ce.executeCEReactions(() => {
            // https://dom.spec.whatwg.org/#dom-element-insertadjacentelement
            return $dom.insertAdjacent(this, where, element);
        });
    },

    // TODO: tests
    insertAdjacentText(where, data) {
        // https://dom.spec.whatwg.org/#dom-element-insertadjacenttext
        const text = this.ownerDocument.createTextNode(data);
        $dom.insertAdjacent(this, where, text);
        return;
    },

    // TODO: tests
    insertAdjacentHTML(position, text) {
        return $ce.executeCEReactions(() => {
            // https://w3c.github.io/DOM-Parsing/#dom-element-insertadjacenthtml
            // We aren't going to go exactly by the books for this one.
            const fragment = $dom.parseHTMLFragment(text, this);
            $dom.insertAdjacent(this, position, fragment);
        });
    },

};

const htmlElementMixin = {

    // https://w3c.github.io/DOM-Parsing/#extensions-to-the-element-interface

    // TODO: more thorough tests of the serialization
    get innerHTML() {
        // https://w3c.github.io/DOM-Parsing/#dom-element-innerhtml
        return $dom.serializeHTMLFragment(this);
    },

    // TODO: MutationObserver tests
    set innerHTML(value) {
        return $ce.executeCEReactions(() => {
            // https://w3c.github.io/DOM-Parsing/#dom-element-innerhtml
            const fragment = $dom.parseHTMLFragment(value, this);
            const content = this['content'];
            if (content instanceof DocumentFragment) {
                $dom.replaceAll(fragment, content);
            }
            else {
                $dom.replaceAll(fragment, this);
            }
        });
    },

    // TODO: tests
    get outerHTML() {
        // https://w3c.github.io/DOM-Parsing/#dom-element-outerhtml
        return $dom.serializeHTMLFragment({ childNodes: [this] });
    },

    // TODO: tests
    set outerHTML(value) {
        return $ce.executeCEReactions(() => {
            // https://w3c.github.io/DOM-Parsing/#dom-element-outerhtml
            let parent = this.parentNode;
            if (parent === null) {
                return;
            }
            if (parent.nodeType === Node.DOCUMENT_NODE) {
                throw $utils.makeDOMException('NoModificationAllowedError');
            }
            if (parent.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
                parent = this.ownerDocument.createElement('body');
            }
            const fragment = $dom.parseHTMLFragment(value, parent);
            $dom.replace(this, fragment, this.parentNode);
        });
    },
    
};
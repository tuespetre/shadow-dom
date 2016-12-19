// https://dom.spec.whatwg.org/#interface-document

import $dom from '../dom.js';
import $ce from '../custom-elements.js';
import $mo from '../mutation-observers.js';
import $utils from '../utils.js';

const originalCreateCDATASection = Document.prototype.createCDATASection;
const originalCreateComment = Document.prototype.createComment;
const originalCreateDocumentFragment = Document.prototype.createDocumentFragment;
const originalCreateElement = Document.prototype.createElement;
const originalCreateElementNS = Document.prototype.createElementNS;
const originalCreateProcessingInstruction = Document.prototype.createProcessingInstruction;
const originalCreateTextNode = Document.prototype.createTextNode;

export default {
    
    createCDATASection(data) {
        const section = originalCreateCDATASection.call(this, data);
        $mo.registerForMutationObservers(section);
        return section;
    },
    
    createComment(data) {
        const comment = originalCreateComment.call(this, data);
        $mo.registerForMutationObservers(comment);
        return comment;
    },

    createDocumentFragment() {
        const fragment = originalCreateDocumentFragment.call(this);
        $mo.registerForMutationObservers(fragment);
        return fragment;
    },

    createElement(name, options) {
        const element = originalCreateElement.call(this, name, options);
        $mo.registerForMutationObservers(element);
        return element;
    },

    createElementNS(namespaceURI, qualifiedName, options) {
        const element = originalCreateElementNS.call(this, namespaceURI, qualifiedName, options);
        $mo.registerForMutationObservers(element);
        return element;
    },

    createProcessingInstruction(target, data) {
        const instruction = originalCreateProcessingInstruction.call(this, target, data);
        $mo.registerForMutationObservers(instruction);
        return instruction;
    },

    createTextNode(data) {
        const text = originalCreateTextNode.call(this, data);
        $mo.registerForMutationObservers(text);
        return text;
    },

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
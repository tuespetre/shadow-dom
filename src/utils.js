import CustomElements from './custom-elements.js';

export const slice = array => Array.prototype.slice.call(array);

export const descriptor = (type, name) => Object.getOwnPropertyDescriptor(type.prototype, name);

export const descriptors = {
    Attr: {
        value: descriptor(Attr, 'value')
    },
    CharacterData: {
        data: descriptor(CharacterData, 'data')
    },
    Document: {
        activeElement: descriptor(Document, 'activeElement'),
        getElementsByTagName: descriptor(Document, 'getElementsByTagName'),
        getElementsByTagNameNS: descriptor(Document, 'getElementsByTagNameNS'),
        getElementsByClassName: descriptor(Document, 'getElementsByClassName')
    },
    Element: {
        attributes: descriptor(Element, 'attributes') || descriptor(Node, 'attributes'),
        getElementsByTagName: descriptor(Element, 'getElementsByTagName'),
        getElementsByTagNameNS: descriptor(Element, 'getElementsByTagNameNS'),
        getElementsByClassName: descriptor(Element, 'getElementsByClassName'),
        innerHTML: descriptor(Element, 'innerHTML') || descriptor(HTMLElement, 'innerHTML'),
        setAttribute: descriptor(Element, 'setAttribute'),
        setAttributeNodeNS: descriptor(Element, 'setAttributeNodeNS'),
        removeAttributeNode: descriptor(Element, 'removeAttributeNode')
    },
    Event: {
        currentTarget: descriptor(Event, 'currentTarget'),
        target: descriptor(Event, 'target')
    },
    FocusEvent: {
        relatedTarget: descriptor(FocusEvent, 'relatedTarget')
    },
    MouseEvent: {
        relatedTarget: descriptor(MouseEvent, 'relatedTarget')
    },
    Node: {
        parentNode: descriptor(Node, 'parentNode'),
        hasChildNodes: descriptor(Node, 'hasChildNodes'),
        childNodes: descriptor(Node, 'childNodes'),
        firstChild: descriptor(Node, 'firstChild'),
        lastChild: descriptor(Node, 'lastChild'),
        previousSibling: descriptor(Node, 'previousSibling'),
        nextSibling: descriptor(Node, 'nextSibling'),
        nodeValue: descriptor(Node, 'nodeValue'),
        cloneNode: descriptor(Node, 'cloneNode'),
        insertBefore: descriptor(Node, 'insertBefore'),
        removeChild: descriptor(Node, 'removeChild'),
        appendChild: descriptor(Node, 'appendChild')
    }
};

// TODO: add a note about importing YuzuJS/setImmediate before this polyfill if better performance is desired.
// TODO: what about IE9?
export const setImmediate = 'setImmediate' in window ? window.setImmediate : function (callback, ...args) {
    return setTimeout(callback, 0, ...args);
};

// TODO: analyze usages and provide brief but descriptive messages
export function makeError(name, message) {
    try {
        const sacrifice = document.createElement('div');
        descriptors.Node.appendChild.call(sacrifice, sacrifice);
    }
    catch (error) {
        error.message = message;
        error.name = name;
        return error;
    }
}

export function reportError(error) {
    if ('console' in window && 'error' in window.console) {
        window.console.error(error);
    }
}

export function extend(object, ...mixins) {
    for (let i = 0; i < mixins.length; i++) {
        const mixin = mixins[i];
        const prototype = mixin.prototype || mixin;
        const names = Object.getOwnPropertyNames(prototype);
        for (let j = 0; j < names.length; j++) {
            const name = names[j];
            if (name === 'constructor') {
                continue;
            }
            const descriptor = Object.getOwnPropertyDescriptor(prototype, name);
            Object.defineProperty(object.prototype || object, name, descriptor);
        }
    }
}

export function getShadowState(object) {
    return object._shadow;
}

export function setShadowState(object, state) {
    return object._shadow = state;
}

function forEachShadowIncludingDescendant(node, action) {
    let shadowState = null;
    let shadowRoot = null;
    if ((shadowState = getShadowState(node)) && (shadowRoot = shadowState.shadowRoot)) {
        action(shadowRoot);
        forEachShadowIncludingInclusiveDescendant(shadowRoot, action);
    }
    const childNodes = node.childNodes;
    for (let i = 0; i < childNodes.length; i++) {
        const childNode = childNodes[i];
        action(childNode);
        forEachShadowIncludingInclusiveDescendant(childNode, action);
    }
}

function forEachShadowIncludingInclusiveDescendant(node, action) {
    action(node);
    let shadowState = null;
    let shadowRoot = null;
    if ((shadowState = getShadowState(node)) && (shadowRoot = shadowState.shadowRoot)) {
        forEachShadowIncludingInclusiveDescendant(shadowRoot, action);
    }
    const childNodes = node.childNodes;
    for (let i = 0; i < childNodes.length; i++) {
        forEachShadowIncludingInclusiveDescendant(childNodes[i], action);
    }
}

export function treeOrderRecursiveSelectAll(node, results, match) {
    if (match(node)) {
        results[results.length] = node;
    }
    const firstChild = node.firstChild;
    if (firstChild) {
        treeOrderRecursiveSelectAll(firstChild, results, match);
    }
    const nextSibling = node.nextSibling;
    if (nextSibling) {
        treeOrderRecursiveSelectAll(nextSibling, results, match);
    }
}

export function treeOrderRecursiveSelectFirst(node, match) {
    if (match(node)) {
        return node;
    }
    const firstChild = node.firstChild;
    if (firstChild) {
        let result = treeOrderRecursiveSelectFirst(firstChild, match);
        if (result) {
            return result;
        }
    }
    const nextSibling = node.nextSibling;
    if (nextSibling) {
        return treeOrderRecursiveSelectFirst(nextSibling, match);
    }
    return null;
}

export function filterByRoot(node, descendants) {
    const contextRoot = root(node);
    const filtered = new Array(descendants.length);
    let filteredCount = 0;
    for (let i = 0; i < descendants.length; i++) {
        const item = descendants[i];
        if (root(item) === contextRoot) {
            filtered[filteredCount++] = item;
        }
    }
    filtered.length = filteredCount;
    return filtered;
}

export function isShadowRoot(node) {
    return node.nodeName === '#shadow-root';
}

// https://www.w3.org/TR/DOM-Parsing/

// PERF: This function uses a recycled div element
// and a recycled document fragment stored in the passed 
// element's owner document so it can avoid allocation.
// Callers must empty the returned fragment.
export function parseHTMLFragment(markup, context) {
    const document = context.ownerDocument;
    const documentState = getShadowState(document) || setShadowState(document, {});
    let parsingElement = documentState.parsingElement;
    if (!parsingElement) {
        parsingElement = documentState.parsingElement = document.createElement('div');
    }
    let parsingFragment = documentState.parsingFragment;
    if (!documentState.parsingFragment) {
        parsingFragment = documentState.parsingFragment = document.createDocumentFragment();
    }
    descriptors.Element.innerHTML.set.call(parsingElement, markup);
    const nodeFirstChildGet = descriptors.Node.firstChild.get;
    const nodeAppendChildValue = descriptors.Node.appendChild.value;
    let firstChild;
    while (firstChild = nodeFirstChildGet.call(parsingElement)) {
        nodeAppendChildValue.call(parsingFragment, firstChild);
    }
    return parsingFragment;
}

export function serializeHTMLFragment(node) {
    // https://www.w3.org/TR/html5/single-page.html#html-fragment-serialization-algorithm

    // 1. Let s be a string, and initialize it to the empty string.
    let s = '';

    // 2. If the node is a template element, then let the node instead be the 
    // template element's template contents (a DocumentFragment node).
    if (node.localName === 'template') {
        const content = node.content;
        if (content) {
            node = content;
        }
    }

    // 3. For each child node of the node, in tree order, run the following steps:
    const childNodes = node.childNodes;
    for (let i = 0; i < childNodes.length; i++) {
        // 1. Let current node be the child node being processed.
        const currentNode = childNodes[i];
        // 2. Append the appropriate string from the following list to s:
        switch (currentNode.nodeType) {
            case Node.ELEMENT_NODE:
                let tagName;
                switch (currentNode.namespaceURI) {
                    case 'http://www.w3.org/1999/xhtml':
                    case 'http://www.w3.org/1998/Math/MathML':
                    case 'http://www.w3.org/2000/svg':
                        tagName = currentNode.localName;
                        break;
                    default:
                        tagName = currentNode.qualifiedName;
                        break;
                }
                s += '<' + tagName;
                const attributes = descriptors.Element.attributes.get.call(currentNode);
                for (let j = 0; j < attributes.length; j++) {
                    const attribute = attributes[j];
                    s += ' ' + serializeAttributeName(attribute);
                    s += '="' + escapeString(attribute.value) + '"';
                }
                s += '>';
                switch (currentNode.localName) {
                    case 'area': case 'base': case 'basefont': case 'bgsound':
                    case 'br': case 'col': case 'embed': case 'frame': case 'hr':
                    case 'img': case 'input': case 'keygen': case 'link': case 'meta':
                    case 'param': case 'source': case 'track': case 'wbr':
                        continue;
                    case 'pre': case 'textarea': case 'listing':
                        const firstChild = currentNode.firstChild;
                        if (firstChild &&
                            firstChild.nodeType === Node.TEXT_NODE &&
                            firstChild.data[0] === '\n') {
                            s += '\n';
                        }
                        break;
                }
                s += serializeHTMLFragment(currentNode);
                s += '</' + tagName + '>';
                break;
            case Node.TEXT_NODE:
                switch (currentNode.parentNode.localName) {
                    case 'style': case 'script': case 'xmp': case 'iframe':
                    case 'noembed': case 'noframes': case 'plaintext': case 'noscript':
                        s += currentNode.data;
                        break;
                    default:
                        s += escapeString(currentNode.data);
                        break;
                }
                break;
            case Node.COMMENT_NODE:
                s += '<!--' + currentNode.data + '-->';
                break;
            case Node.PROCESSING_INSTRUCTION_NODE:
                s += '<?' + currentNode.target + ' ' + currentNode.data + '>';
                break;
            case Node.DOCUMENT_TYPE_NODE:
                s += '<!DOCTYPE ' + currentNode.name + '>';
                break;
        }
    }

    // 4. The result of the algorithm is the string s.
    return s;

    function escapeString(string, attributeMode) {
        if (!string || !string.length) {
            return '';
        }

        string = string.replace('&', '&amp;');
        string = string.replace('\xA0', '&nbsp;');

        if (attributeMode) {
            string = string.replace('"', '&quot;');
        }
        else {
            string = string.replace('<', '&lt;');
            string = string.replace('>', '&gt;');
        }

        return string;
    }

    function serializeAttributeName(attribute) {
        const namespaceURI = attribute.namespaceURI;
        const localName = attribute.localName;
        if (!namespaceURI) {
            return localName;
        }
        switch (namespaceURI) {
            case 'http://www.w3.org/XML/1998/namespace':
                return 'xml:' + localName;
            case 'http://www.w3.org/2000/xmlns/':
                if (localName === 'xmlns') {
                    return localName;
                }
                return 'xmlns:' + localName;
            case 'http://www.w3.org/1999/xlink':
                return 'xlink:' + localName;
            default:
                return attribute.name;
        }
    }
}

// https://dom.spec.whatwg.org/#trees

export function root(node) {
    let root = node;
    let parent = root.parentNode;

    while (parent != null) {
        root = parent;
        parent = root.parentNode;
    }

    return root;
}

export function descendant(nodeA, nodeB) {
    let parent = nodeA.parentNode;

    while (parent != null) {
        if (nodeB === parent) {
            return true;
        }
        parent = parent.parentNode;
    }

    return false;
}

export function inclusiveDescendant(nodeA, nodeB) {
    return nodeA === nodeB || descendant(nodeA, nodeB);
}

export function ancestor(nodeA, nodeB) {
    let parent = nodeB.parentNode;

    while (parent != null) {
        if (nodeA === parent) {
            return true;
        }
        parent = parent.parentNode;
    }

    return false;
}

export function inclusiveAncestor(nodeA, nodeB) {
    return nodeA === nodeB || ancestor(nodeA, nodeB);
}

// https://dom.spec.whatwg.org/#interface-parentnode

export function convertNodesIntoANode(nodes, document) {
    let node = null;

    for (let i = 0; i < nodes.length; i++) {
        const item = nodes[i];

        if (typeof item === "string") {
            nodes[i] = document.createTextNode(item);
        }
    }

    if (nodes.length === 1) {
        node = nodes[0];
    }
    else {
        node = document.createDocumentFragment();

        for (let i = 0; i < nodes.length; i++) {
            node.appendChild(nodes[i]);
        }
    }

    return node;
}

// https://dom.spec.whatwg.org/#interface-node

export function clone(node, document, cloneChildren) {
    // https://dom.spec.whatwg.org/#concept-node-clone
    // To clone a node, with an optional document and clone children flag, run these steps:

    // 1. If document is not given, let document be node’s node document.
    document = document || node.ownerDocument;

    // Use a shortcut here
    // 2. If node is an element, then:
    // 3. Otherwise, let copy be a node that implements the same interfaces 
    // as node, and fulfills these additional requirements, switching on node:
    // 4. Set copy’s node document and document to copy, if copy is a document, 
    // and set copy’s node document to document otherwise.
    // 5. Run any cloning steps defined for node in other applicable 
    // specifications and pass copy, node, document and the clone children 
    // flag if set, as parameters.
    const copy = descriptors.Node.cloneNode.value.call(node, false);
    if (CustomElements.isInstalled()) {
        CustomElements.tryToUpgradeElement(copy);
    }

    // 6. If the clone children flag is set, clone all the children of node 
    // and append them to copy, with document as specified and the clone 
    // children flag being set.
    if (cloneChildren === true) {
        const childNodes = node.childNodes;
        for (let i = 0; i < childNodes.length; i++) {
            append(childNodes[i].cloneNode(true), copy);
        }
    }

    return copy;
}

export function adopt(node, document) {
    // https://dom.spec.whatwg.org/#concept-node-adopt

    // 1. Let oldDocument be node’s node document.
    let oldDocument = node.ownerDocument;

    // 2. If node’s parent is not null, remove node from its parent.
    const parent = node.parentNode;
    if (parent != null) {
        remove(node, parent);
    }

    // 3. If document is not the same as oldDocument, run these substeps:
    if (document != oldDocument && CustomElements.isInstalled()) {
        forEachShadowIncludingInclusiveDescendant(node, function (inclusiveDescendant) {
            if (CustomElements.isCustom(inclusiveDescendant)) {
                CustomElements.enqueueCallbackReaction(inclusiveDescendant, 'adoptedCallback', [oldDocument, document]);
            }
        });
    }
}

// https://dom.spec.whatwg.org/#interface-documentfragment

export function hostIncludingInclusiveAncestor(nodeA, nodeB) {
    if (inclusiveAncestor(nodeA, nodeB)) {
        return true;
    }

    const host = root(nodeB).host;

    if (host && hostIncludingInclusiveAncestor(nodeA, host)) {
        return true;
    }

    return false;
}

// https://dom.spec.whatwg.org/#interface-shadowroot

export function shadowIncludingRoot(node) {
    let rootNode = root(node);
    if (isShadowRoot(rootNode)) {
        rootNode = shadowIncludingRoot(rootNode.host);
    }
    return rootNode;
}

export function shadowIncludingDescendant(nodeA, nodeB) {
    do {
        if (isShadowRoot(nodeA)) {
            nodeA = nodeA.host;
        }
        else {
            nodeA = nodeA.parentNode;
        }
        if (nodeA === nodeB) {
            return true;
        }
    }
    while (nodeA != null);

    return false;
}

export function shadowIncludingInclusiveDescendant(nodeA, nodeB) {
    return nodeA === nodeB || shadowIncludingDescendant(nodeA, nodeB);
}

export function shadowIncludingAncestor(nodeA, nodeB) {
    return shadowIncludingDescendant(nodeB, nodeA);
}

export function shadowIncludingInclusiveAncestor(nodeA, nodeB) {
    return nodeA === nodeB || shadowIncludingAncestor(nodeA, nodeB);
}

export function closedShadowHidden(nodeA, nodeB) {
    // https://dom.spec.whatwg.org/#concept-closed-shadow-hidden
    const rootNode = root(nodeA);

    if (!isShadowRoot(rootNode)) {
        return false;
    }

    if (shadowIncludingInclusiveAncestor(rootNode, nodeB)) {
        return false;
    }

    if (rootNode.mode === 'closed' || closedShadowHidden(rootNode.host, nodeB)) {
        return true;
    }

    return false;
}

export function retarget(nodeA, nodeB) {
    // https://dom.spec.whatwg.org/#retarget
    // To retarget an object A against an object B, repeat these steps 
    // until they return an object:

    let rootNode;
    while (rootNode = root(nodeA)) {
        // 1. If A’s root is not a shadow root, or A’s root is a shadow-including 
        // inclusive ancestor of B, then return A.
        if (!isShadowRoot(rootNode) || shadowIncludingInclusiveAncestor(rootNode, nodeB)) {
            return nodeA;
        }
        // 2. Set A to A’s root’s host.
        nodeA = rootNode.host;
    }
}

// https://dom.spec.whatwg.org/#interface-element

function updateSlotName(element, localName, oldValue, value, nameSpace) {
    // https://dom.spec.whatwg.org/#slot-name
    if (element.localName === 'slot') {
        if (localName === 'name' && nameSpace == null) {
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
                descriptors.Element.setAttribute.value.call(element, 'name', '');
            }
            else {
                descriptors.Element.setAttribute.value.call(element, 'name', value);
            }
            assignSlotablesForATree(element);
        }
    }
}

function updateSlotableName(element, localName, oldValue, value, nameSpace) {
    // https://dom.spec.whatwg.org/#slotable-name
    if (localName === 'slot' && nameSpace == null) {
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
            descriptors.Element.setAttribute.value.call(element, 'slot', '');
        }
        else {
            descriptors.Element.setAttribute.value.call(element, 'slot', value);
        }
        const elementState = getShadowState(element);
        if (elementState && elementState.assignedSlot) {
            assignSlotables(elementState.assignedSlot);
        }
        assignASlot(element);
    }
}

function attributeChangeSteps(element, localName, oldValue, value, nameSpace) {
    updateSlotName(element, localName, oldValue, value, nameSpace);
    updateSlotableName(element, localName, oldValue, value, nameSpace);
}

export function changeAttribute(attribute, element, value) {
    // https://dom.spec.whatwg.org/#concept-element-attributes-change

    const name = attribute.localName;
    const nameSpace = attribute.namespaceURI;
    const oldValue = descriptors.Attr.value.get.call(attribute);
    const newValue = value;

    // 1. Queue a mutation record...
    queueMutationRecord('attributes', element, name, nameSpace, oldValue);

    // 2. If element is custom...
    if (CustomElements.isInstalled() && CustomElements.isCustom(element)) {
        const args = [name, oldValue, newValue, nameSpace];
        CustomElements.enqueueCallbackReaction(element, 'attributeChangedCallback', args);
    }

    // 3. Run the attribute change steps...
    attributeChangeSteps(element, name, oldValue, newValue, nameSpace);

    // 4. Set attribute's value...
    descriptors.Attr.value.set.call(attribute, newValue);
}

export function appendAttribute(attribute, element) {
    // https://dom.spec.whatwg.org/#concept-element-attributes-append

    const name = attribute.localName;
    const nameSpace = attribute.namespaceURI;
    const oldValue = null;
    const newValue = descriptors.Attr.value.get.call(attribute);

    // 1. Queue a mutation record...
    queueMutationRecord('attributes', element, name, nameSpace, oldValue);

    // 2. If element is custom...
    if (CustomElements.isInstalled() && CustomElements.isCustom(element)) {
        const args = [name, oldValue, newValue, nameSpace];
        CustomElements.enqueueCallbackReaction(element, 'attributeChangedCallback', args);
    }

    // 3. Run the attribute change steps...
    attributeChangeSteps(element, name, oldValue, newValue, nameSpace);

    // 4. Append the attribute to the element’s attribute list.
    descriptors.Element.setAttributeNodeNS.value.call(element, attribute);

    // Skip (native)
    // 5. Set attribute’s element to element.
}

export function removeAttribute(attribute, element) {
    // https://dom.spec.whatwg.org/#concept-element-attributes-remove

    const name = attribute.localName;
    const nameSpace = attribute.namespaceURI;
    const oldValue = descriptors.Attr.value.get.call(attribute);
    const newValue = null;

    // 1. Queue a mutation record...
    queueMutationRecord('attributes', element, name, nameSpace, oldValue);

    // 2. If element is custom...
    if (CustomElements.isInstalled() && CustomElements.isCustom(element)) {
        const args = [name, oldValue, newValue, nameSpace];
        CustomElements.enqueueCallbackReaction(element, 'attributeChangedCallback', args);
    }

    // 3. Run the attribute change steps...
    attributeChangeSteps(element, name, oldValue, null, nameSpace);

    // 4. Remove attribute from the element’s attribute list.
    descriptors.Element.removeAttributeNode.value.call(element, attribute);

    // Skip (native)
    // 5. Set attribute’s element to null.
}

function replaceAttribute(oldAttr, newAttr, element) {
    // Used by 'set an attribute'
    // https://dom.spec.whatwg.org/#concept-element-attributes-replace

    const name = oldAttr.localName;
    const nameSpace = oldAttr.namespaceURI;
    const oldValue = descriptors.Attr.value.get.call(oldAttr);
    const newValue = descriptors.Attr.value.get.call(newAttr);

    // 1. Queue a mutation record...
    queueMutationRecord('attributes', element, name, nameSpace, oldValue);

    // 2. If element is custom...
    if (CustomElements.isInstalled() && CustomElements.isCustom(element)) {
        const args = [name, oldValue, newValue, nameSpace];
        CustomElements.enqueueCallbackReaction(element, 'attributeChangedCallback', args);
    }

    // 3. Run the attribute change steps...
    attributeChangeSteps(element, name, oldValue, newValue, nameSpace);

    // 4. Replace oldAttr by newAttr in the element’s attribute list.
    descriptors.Element.setAttributeNodeNS.value.call(element, newAttr);

    // Skip (native)
    // 5. Set oldAttr’s element to null.
    // 6. Set newAttr’s element to element.
}

export function setAttribute(attr, element) {
    if (attr.ownerElement != null && attr.ownerElement !== element) {
        throw makeError('InUseAttributeError');
    }
    const attributes = descriptors.Element.attributes.get.call(element);
    const oldAttr = attributes.getNamedItemNS(attr.namespaceURI, attr.localName);
    if (oldAttr === attr) {
        return attr;
    }
    if (oldAttr) {
        replaceAttribute(oldAttr, attr, element);
    }
    else {
        appendAttribute(attr, element);
    }
    return oldAttr;
}

export function setAttributeValue(element, localName, value, prefix, ns) {
    prefix = prefix || null;
    ns = ns || null;
    const attributes = descriptors.Element.attributes.get.call(element);
    let attribute = attributes.getNamedItemNS(ns, localName);
    if (!attribute) {
        attribute = element.ownerDocument.createAttributeNS(ns, localName);
        descriptors.Attr.value.set.call(attribute, value);
        appendAttribute(attribute, element);
        return;
    }
    changeAttribute(attribute, element, value);
}

export function removeAttributeByName(qualifiedName, element) {
    const attributes = descriptors.Element.attributes.get.call(element);
    const attr = attributes.getNamedItem(qualifiedName);
    if (attr) {
        removeAttribute(attr, element);
    }
    return attr;
}

export function removeAttributeByNamespace(nameSpace, localName, element) {
    const attributes = descriptors.Element.attributes.get.call(element);
    const attr = attributes.getNamedItemNS(nameSpace, localName);
    if (attr) {
        removeAttribute(attr, element);
    }
    return attr;
}

export function insertAdjacent(element, where, node) {
    if (!(node instanceof Node)) {
        throw makeError('TypeError');
    }
    let parent;
    // https://dom.spec.whatwg.org/#insert-adjacent
    switch ((where || '').toLowerCase()) {
        case "beforebegin":
            if (parent = element.parentNode) {
                return preInsert(node, parent, element);
            }
            return null;
        case "afterbegin":
            return preInsert(node, element, element.firstChild);
        case "beforeend":
            return preInsert(node, element, null);
        case "afterend":
            if (parent = element.parentNode) {
                return preInsert(node, parent, element.nextSibling);
            }
            return null;
        default:
            throw makeError('SyntaxError');
    }
}

// https://dom.spec.whatwg.org/#attr

export function setExistingAttributeValue(attribute, value) {
    if (attribute.ownerElement == null) {
        descriptors.Attr.value.set.call(attribute, value);
    }
    else {
        changeAttribute(attribute, attribute.ownerElement, value);
    }
}

// https://dom.spec.whatwg.org/#interface-characterdata

export function replaceData(node, offset, count, data) {
    // https://dom.spec.whatwg.org/#concept-cd-replace
    if (data == null) {
        data = '';
    }
    const dataDescriptor = descriptors.CharacterData.data;
    const oldValue = dataDescriptor.get.call(node);
    const length = oldValue.length;
    if (offset > length) {
        throw makeError('IndexSizeError');
    }
    if (offset + count > length) {
        count = length - offset;
    }
    queueMutationRecord('characterData', node, null, null, oldValue);
    dataDescriptor.set.call(node, oldValue.slice(0, offset) + data + oldValue.slice(offset + count));
    // TODO: (Range)
}

// https://dom.spec.whatwg.org/#finding-slots-and-slotables

function findASlot(slotable, open) {
    // https://dom.spec.whatwg.org/#find-a-slot
    // To find a slot for a given slotable slotable and an optional 
    // open flag (unset unless stated otherwise), run these steps:

    // 1. If slotable’s parent is null, then return null.
    const parent = slotable.parentNode;
    if (!parent) {
        return null;
    }

    // 2. Let shadow be slotable’s parent’s shadow root.
    const parentState = getShadowState(parent);

    // 3. If shadow is null, then return null.
    if (!parentState || !parentState.shadowRoot) {
        return null;
    }

    // 4. If the open flag is set and shadow’s mode is not "open", then return null.
    if (open === true && parentState.shadowRoot.mode !== 'open') {
        return null;
    }

    // 5. Return the first slot in shadow’s tree whose name is slotable’s name, if any, and null otherwise.
    if (!parentState.shadowRoot.firstChild) {
        return null;
    }

    const name = slotable instanceof Element ? slotable.slot : null;

    return treeOrderRecursiveSelectFirst(parentState.shadowRoot.firstChild, function (node) {
        return node.localName === 'slot' && node.name === name;
    });
}

function findSlotables(slot) {
    // https://dom.spec.whatwg.org/#find-slotables
    // To find slotables for a given slot slot, run these steps:

    // 1. Let result be an empty list.
    // PERF: allocations later on in algorithm
    let result;

    // 2. If slot’s root is not a shadow root, then return result.
    const slotRoot = root(slot);
    if (!isShadowRoot(slotRoot)) {
        // PERF: 'an empty list' from step 1
        return [];
    }

    // 3. Let host be slot’s root’s host.
    const host = slotRoot.host;

    // 4. For each slotable child of host, slotable, in tree order, run these substeps:
    const slotableChildren = host.childNodes;
    // PERF: allocation of result
    result = new Array(slotableChildren.length);
    let pushed = 0;
    for (let i = 0; i < slotableChildren.length; i++) {
        const slotable = slotableChildren[i];
        if (slotable.nodeType === Node.ELEMENT_NODE
            || slotable.nodeType === Node.TEXT_NODE) {
            // 1. Let foundSlot be the result of finding a slot given slotable.
            const foundSlot = findASlot(slotable);
            // 2. If foundSlot is slot, then append slotable to result.
            if (foundSlot === slot) {
                result[pushed++] = slotable;
            }
        }
    }
    // PERF: set the actual length
    result.length = pushed;

    // 5. Return result.
    return result;
}

export function findFlattenedSlotables(slot) {
    // https://dom.spec.whatwg.org/#find-flattened-slotables
    // To find flattened slotables for a given slot slot, run these steps:

    // 1. Let result be an empty list.
    let result = [];

    // 2. Let slotables be the result of finding slotables given slot.
    const slotables = findSlotables(slot);

    // 3. If slotables is the empty list, then append each slotable child of slot, in tree order, to slotables.
    if (slotables.length === 0) {
        const slotableChildren = slot.childNodes;
        const slotableChildrenLength = slotableChildren.length;
        slotables.length = slotableChildrenLength;
        let slotablesPushed = 0;
        for (let i = 0; i < slotableChildrenLength; i++) {
            const slotableChild = slotableChildren[i];
            if (slotableChild.nodeType === Node.ELEMENT_NODE
                || slotableChild.nodeType === Node.TEXT_NODE) {
                slotables[slotablesPushed++] = slotableChild;
            }
        }
        slotables.length = slotablesPushed;
    }

    // 4. For each node in slotables, run these substeps:
    for (let i = 0; i < slotables.length; i++) {
        const node = slotables[i];
        // 1. If node is a slot, run these subsubsteps:
        if (node.localName === 'slot') {
            const temporaryResult = findFlattenedSlotables(node);
            const resultLength = resultLength;
            result.length += temporaryResult.length;
            for (let j = 0; j < temporaryResult.length; j++) {
                result[resultLength + j] = temporaryResult[k];
            }
        }
        else {
            result[result.length] = node;
        }
    }

    // 5. Return result.
    return result;
}

// https://dom.spec.whatwg.org/#assigning-slotables-and-slots

function assignSlotables(slot, suppressSignaling) {
    // https://dom.spec.whatwg.org/#assign-slotables
    // To assign slotables, for a slot slot with an optional suppress 
    // signaling flag (unset unless stated otherwise), run these steps:

    // 1. Let slotables be the result of finding slotables for slot.
    const slotables = findSlotables(slot);

    // 2. If suppress signaling flag is unset, and slotables and slot’s assigned 
    // nodes are not identical, then run signal a slot change for slot.
    let identical = true;
    const slotState = getShadowState(slot) || setShadowState(slot, {});
    const assignedNodes = slotState.assignedNodes || [];
    for (let i = 0; i < slotables.length; i++) {
        if (slotables[i] !== assignedNodes[i]) {
            identical = false;
            break;
        }
    }
    if (!suppressSignaling && !identical) {
        signalASlotChange(slot);
    }

    // 3. Set slot’s assigned nodes to slotables.
    slotState.assignedNodes = slotables;

    // 4. For each slotable in slotables, set slotable’s assigned slot to slot.
    for (let i = 0; i < slotables.length; i++) {
        const slotable = slotables[i];
        // If it's a slotable it should already have an associated state object.
        getShadowState(slotable).assignedSlot = slot;
    }

    // 4a. If we haven't tracked them yet, track the slot's logical children
    if (!slotState.childNodes) {
        const slotChildNodes = descriptors.Node.childNodes.get.call(slot);
        const slotChildNodesLength = slotChildNodes.length;
        slotState.childNodes = new Array(slotChildNodesLength);
        for (let i = 0; i < slotChildNodesLength; i++) {
            slotState.childNodes[i] = slotChildNodes[i];
        }
    }

    // function call avoiding closure for performance.
    if (!identical) {
        setImmediate(renderSlotablesAsync, slot);
    }
}

function renderSlotablesAsync(slot) {
    const slotState = getShadowState(slot);
    const slotables = slotState.assignedNodes;

    // 4b. Clean out the slot
    let firstChild;
    while (firstChild = descriptors.Node.firstChild.get.call(slot)) {
        descriptors.Node.removeChild.value.call(slot, firstChild);
    }

    // 4c. Append the slotables, if any
    for (let i = 0; i < slotables.length; i++) {
        const slotable = slotables[i];
        descriptors.Node.appendChild.value.call(slot, slotable);
    }

    // 4d. Append the fallback content, if no slots
    if (!slotables.length) {
        const childNodes = slotState.childNodes;
        for (let i = 0; i < childNodes.length; i++) {
            descriptors.Node.appendChild.value.call(slot, childNodes[i]);
        }
    }
}

function assignSlotablesForATree(tree, noSignalSlots) {
    // https://dom.spec.whatwg.org/#assign-slotables-for-a-tree
    // To assign slotables for a tree, given a tree tree and an optional set of slots noSignalSlots
    // (empty unless stated otherwise), run these steps for each slot slot in tree, in tree order:
    const slots = [];

    if (tree.localName === 'slot') {
        slots[0] = tree;
    }

    treeOrderRecursiveSelectAll(tree, slots, function (descendant) {
        return descendant.localName === 'slot';
    });

    for (let i = 0; i < slots.length; i++) {
        const slot = slots[i];

        // 1. Let suppress signaling flag be set, if slot is in noSignalSlots, and unset otherwise.
        const suppressSignaling = noSignalSlots && noSignalSlots.indexOf(slot) !== -1;

        // 2. Run assign slotables for slot with suppress signaling flag.
        assignSlotables(slot, suppressSignaling);
    }
}

function assignASlot(slotable) {
    const slot = findASlot(slotable);

    if (slot != null) {
        assignSlotables(slot);
    }
}

// https://dom.spec.whatwg.org/#signaling-slot-change

function signalASlotChange(slot) {
    // https://dom.spec.whatwg.org/#signal-a-slot-change
    // To signal a slot change, for a slot slot, run these steps:

    // 1. If slot is not in unit of related similar-origin browsing contexts' 
    // signal slot list, append slot to unit of related similar-origin browsing 
    // contexts' signal slot list.
    if (signalSlotList.indexOf(slot) === -1) {
        signalSlotList.push(slot);
    }

    // 2. Queue a mutation observer compound microtask.
    queueMutationObserverCompoundMicrotask();
}

// https://dom.spec.whatwg.org/#mutation-algorithms

function ensurePreInsertionValidity(node, parent, child) {
    // https://dom.spec.whatwg.org/#concept-node-ensure-pre-insertion-validity
    // To ensure pre-insertion validity of a node into a parent before a child, run these steps:

    // Skip (native)
    // 1. If parent is not a Document, DocumentFragment, or Element node, throw a HierarchyRequestError.

    // 2. If node is a host-including inclusive ancestor of parent, throw a HierarchyRequestError.
    if (hostIncludingInclusiveAncestor(node, parent)) {
        throw makeError('HierarchyRequestError');
    }

    // 3. If child is not null and its parent is not parent, then throw a NotFoundError.
    if (child != null && child.parentNode !== parent) {
        throw makeError('NotFoundError');
    }

    // Skip (native)
    // 4. If node is not a DocumentFragment, DocumentType, Element, Text, ProcessingInstruction, 
    // or Comment node, throw a HierarchyRequestError.
    // 5. If either node is a Text node and parent is a document, or node is a doctype 
    // and parent is not a document, throw a HierarchyRequestError.
    // 6. If parent is a document, and any of the statements below, switched on node, 
    // are true, throw a HierarchyRequestError.
}

export function preInsert(node, parent, child) {
    // https://dom.spec.whatwg.org/#concept-node-pre-insert
    // To pre-insert a node into a parent before a child, run these steps:

    // 1. Ensure pre-insertion validity of node into parent before child.
    ensurePreInsertionValidity(node, parent, child);

    // 2. Let reference child be child.
    let referenceChild = child;

    // 3. If reference child is node, set it to node’s next sibling.
    referenceChild === node && (referenceChild = node.nextSibling);

    // 4. Adopt node into parent’s node document.
    // https://dom.spec.whatwg.org/#concept-node-adopt
    adopt(node, parent.ownerDocument);

    // 5. Insert node into parent before reference child.
    // https://dom.spec.whatwg.org/#concept-node-insert
    insert(node, parent, referenceChild);

    // 6. Return node.
    return node;
}

export function insert(node, parent, child, suppressObservers) {
    // https://dom.spec.whatwg.org/#concept-node-insert
    // To insert a node into a parent before a child, with an optional suppress observers flag, run these steps:

    // 1. Let count be the number of children of node if it is a DocumentFragment node, and one otherwise.
    let count = 1;
    let nodeChildNodes;
    if (node.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
        nodeChildNodes = node.childNodes;
        count = nodeChildNodes.length;
    }

    // Skip (Range)
    // 2. If child is non-null, run these substeps:

    // 3. Let nodes be node’s children if node is a DocumentFragment node, 
    // and a list containing solely node otherwise.
    let nodes = new Array(count);

    // 4. If node is a DocumentFragment node, remove its children with the suppress observers flag set.
    if (node.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
        for (let i = 0; i < count; i++) {
            nodes[i] = nodeChildNodes[i];
        }
        for (let i = 0; i < count; i++) {
            remove(nodes[i], node, true);
        }
        // 5. If node is a DocumentFragment node, queue a mutation record of "childList" for node with removedNodes nodes.
        queueMutationRecord('childList', node, null, null, null, null, nodes);
    }
    else {
        nodes[0] = node;
    }

    // 6. For each node in nodes, in tree order, run these substeps:
    const parentState = getShadowState(parent);
    const parentIsShadow = isShadowRoot(parent);
    const parentStateChildNodes = parentState ? parentState.childNodes : null;
    const parentIsConnected = parent.isConnected;
    for (let i = 0; i < count; i++) {
        const node = nodes[i];
        // 1. Insert node into parent before child or at the end of parent if child is null.
        if (parentStateChildNodes) {
            if (child) {
                const childIndex = parentStateChildNodes.indexOf(child);
                // TODO: PERF: Probably not worth the readability sacrifice to manually 
                // roll a splice algorithm here, but will come back to this later
                parentStateChildNodes.splice(childIndex, 0, node);
            }
            else {
                parentStateChildNodes.push(node);
            }
            const nodeState = getShadowState(node) || setShadowState(node, {});
            nodeState.parentNode = parent;
            // If it's a shadow root, perform physical insert on the host.
            if (parentIsShadow) {
                descriptors.Node.insertBefore.value.call(parentState.host, node, child);
            }
        }
        else {
            descriptors.Node.insertBefore.value.call(parent, node, child);
        }

        // 2. If parent is a shadow host and node is a slotable, then assign a slot for node.
        if (parentState && parentState.shadowRoot && 'assignedSlot' in node) {
            assignASlot(node);
        }

        // 3. If parent is a slot whose assigned nodes is the empty list, 
        // then run signal a slot change for parent.
        if (parent.localName === 'slot' && 
            (!parentState || !parentState.assignedNodes || parentState.assignedNodes.length === 0)) {
            // 3a. Physically append the child into the slot.
            descriptors.Node.appendChild.value.call(parent, node);
            // 3b. Do what the spec said
            signalASlotChange(parent);
        }

        // 4. Run assign slotables for a tree with node’s tree and a set containing 
        // each inclusive descendant of node that is a slot.
        const inclusiveSlotDescendants = [];
        if (node.localName === 'slot') {
            inclusiveSlotDescendants[0] = node;
        }
        treeOrderRecursiveSelectAll(node, inclusiveSlotDescendants, function (descendant) {
            return descendant.localName === 'slot';
        });
        assignSlotablesForATree(node, inclusiveSlotDescendants);

        if (!CustomElements.isInstalled() || !parentIsConnected) {
            continue;
        }

        // 5. For each shadow-including inclusive descendant inclusiveDescendant of node, 
        // in shadow-including tree order, run these subsubsteps:
        forEachShadowIncludingInclusiveDescendant(node, function(inclusiveDescendant) {
            // Skip (other)
            // 1. Run the insertion steps with inclusiveDescendant
            // PERF: moved this check out of the loop.
            // 2. If inclusiveDescendant is connected, then...
            // 1. If inclusiveDescendant is custom, then enqueue a custom element 
            // callback reaction with inclusiveDescendant, callback name 
            // "connectedCallback", and an empty argument list.
            if (CustomElements.isCustom(inclusiveDescendant)) {
                CustomElements.enqueueCallbackReaction(inclusiveDescendant, 'connectedCallback', []);
            }
            // 2. Otherwise, try to upgrade inclusiveDescendant.
            else {
                CustomElements.tryToUpgradeElement(inclusiveDescendant);
            }
        });
    }

    // 7. If suppress observers flag is unset, queue a mutation record of "childList" for parent 
    // with addedNodes nodes, nextSibling child, and previousSibling child’s previous sibling or 
    // parent’s last child if child is null.
    if (!suppressObservers) {
        const previousSibling = child ? child.previousSibling : parent.lastChild;
        queueMutationRecord('childList', parent, null, null, null, nodes, null, previousSibling, child);
    }
}

export function append(node, parent) {
    // https://dom.spec.whatwg.org/#concept-node-append
    // To append a node to a parent, pre-insert node into parent before null.
    preInsert(node, parent, null);
}

export function replace(child, node, parent) {
    // https://dom.spec.whatwg.org/#concept-node-replace
    // To replace a child with node within a parent, run these steps:

    // Skip (native)
    // 1. If parent is not a Document, DocumentFragment, or Element node, throw a HierarchyRequestError.

    // 2. If node is a host-including inclusive ancestor of parent, throw a HierarchyRequestError.
    if (hostIncludingInclusiveAncestor(node, parent)) {
        throw makeError('HierarchyRequestError');
    }

    // 3. If child’s parent is not parent, then throw a NotFoundError.
    if (child.parentNode !== parent) {
        throw makeError('NotFoundError');
    }

    // Skip (native)
    // 4. If node is not a DocumentFragment, DocumentType, Element, Text, ProcessingInstruction, or Comment node, throw a HierarchyRequestError.
    // 5. If either node is a Text node and parent is a document, or node is a doctype and parent is not a document, throw a HierarchyRequestError.
    // 6. If parent is a document, and any of the statements below, switched on node, are true, throw a HierarchyRequestError.

    // 7. Let reference child be child’s next sibling.
    let referenceChild = child.nextSibling;

    // 8. If reference child is node, set it to node’s next sibling.
    if (referenceChild === node) {
        referenceChild = node.nextSibling;
    }

    // 9. Let previousSibling be child’s previous sibling.
    const previousSibling = child.previousSibling;

    // 10. Adopt node into parent’s node document.
    adopt(node, parent.ownerDocument);

    // 11. Let removedNodes be the empty list.
    const removedNodes = [];

    // 12. If child’s parent is not null, run these substeps:
    const childParent = child.parentNode;
    if (childParent != null) {
        // 1. Set removedNodes to a list solely containing child.
        removedNodes[0] = child;
        // 2. Remove child from its parent with the suppress observers flag set.
        remove(child, parent, true);
    }

    // 13. Let nodes be node’s children if node is a DocumentFragment node, and a list containing solely node otherwise.
    let nodes;
    if (node instanceof DocumentFragment) {
        const childNodes = node.childNodes;
        const childNodesLength = childNodes.length;
        nodes = new Array(childNodesLength);
        for (let i = 0; i < childNodesLength; i++) {
            nodes[i] = childNodes[i];
        }
    }
    else {
        nodes = [node];
    }

    // 14. Insert node into parent before reference child with the suppress observers flag set.
    insert(node, parent, referenceChild, true);

    // 15. Queue a mutation record of "childList" for target parent with addedNodes nodes, 
    // removedNodes removedNodes, nextSibling reference child, and previousSibling previousSibling.
    queueMutationRecord('childList', parent, null, null, null, nodes, removedNodes, previousSibling, referenceChild);
}

export function replaceAll(node, parent) {
    // https://dom.spec.whatwg.org/#concept-node-replace-all
    // To replace all with a node within a parent, run these steps:

    // 1. If node is not null, adopt node into parent’s node document.
    if (node != null) {
        adopt(node, parent.ownerDocument);
    }

    // 2. Let removedNodes be parent’s children.
    const parentChildNodes = parent.childNodes;
    const removedNodesCount = parentChildNodes.length;
    const removedNodes = new Array(removedNodesCount);
    for (let i = 0; i < removedNodesCount; i++) {
        removedNodes[i] = parentChildNodes[i];
    }

    // 3. Let addedNodes be the empty list if node is null, node’s children if 
    // node is a DocumentFragment node, and a list containing node otherwise.
    let addedNodes;
    if (node == null) {
        addedNodes = [];
    }
    else if (node.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
        const nodeChildNodes = node.childNodes;
        const nodeChildNodesLength = nodeChildNodes.length;
        addedNodes = new Array(nodeChildNodesLength);
        for (let i = 0; i < nodeChildNodesLength; i++) {
            addedNodes[i] = nodeChildNodes[i];
        }
    }
    else {
        addedNodes = [node];
    }

    // 4. Remove all parent’s children, in tree order, with the suppress observers flag set.
    for (let i = 0; i < removedNodesCount; i++) {
        remove(removedNodes[i], parent, true);
    }

    // 5. If node is not null, insert node into parent before null with the suppress observers flag set.
    if (node != null) {
        insert(node, parent, null, true);
    }

    // 6. Queue a mutation record of "childList" for parent with addedNodes addedNodes and removedNodes removedNodes.
    queueMutationRecord('childList', parent, null, null, null, addedNodes, removedNodes);
}

export function preRemove(child, parent) {
    // https://dom.spec.whatwg.org/#concept-node-pre-remove
    // To pre-remove a child from a parent, run these steps:

    // 1. If child’s parent is not parent, then throw a NotFoundError.
    if (child.parentNode !== parent) {
        throw makeError('NotFoundError');
    }

    // 2. Remove child from parent.
    remove(child, parent);

    // 3. Return child.
    return child;
}

export function remove(node, parent, suppressObservers) {
    // https://dom.spec.whatwg.org/#concept-node-remove
    // To remove a node from a parent, with an optional suppress observers flag, run these steps:

    // Skip (Range)
    // 1. Let index be node’s index.
    // 2. For each range whose start node is an inclusive descendant of node, set its start to (parent, index).
    // 3. For each range whose end node is an inclusive descendant of node, set its end to (parent, index).
    // 4. For each range whose start node is parent and start offset is greater than index, decrease its start offset by one.
    // 5. For each range whose end node is parent and end offset is greater than index, decrease its end offset by one.

    // Skip (NodeIterator)
    // 6. For each NodeIterator object iterator whose root’s node document is node’s node document, 
    // run the NodeIterator pre-removing steps given node and iterator.

    // 7. Let oldPreviousSibling be node’s previous sibling.
    const oldPreviousSibling = node.previousSibling;

    // 8. Let oldNextSibling be node’s next sibling.
    const oldNextSibling = node.nextSibling;

    // 9. Remove node from its parent.
    const nodeState = getShadowState(node);
    const parentState = getShadowState(parent);
    if (parentState && parentState.childNodes) {
        const nodeIndex = parentState.childNodes.indexOf(node);
        parentState.childNodes.splice(nodeIndex, 1);
        // Should always have nodeState if we got here.
        nodeState.parentNode = null;
        const parentNode = descriptors.Node.parentNode.get.call(node);
        descriptors.Node.removeChild.value.call(parentNode, node);
    }
    else {
        descriptors.Node.removeChild.value.call(parent, node);
    }

    // 10. If node is assigned, then run assign slotables for node’s assigned slot.
    if (nodeState && nodeState.assignedSlot) {
        assignSlotables(nodeState.assignedSlot);
        nodeState.assignedSlot = null;
    }

    // 11. If parent is a slot whose assigned nodes is the empty list,
    // then run signal a slot change for parent.
    if (parent.localName === 'slot' && 
        (!parentState || !parentState.assignedNodes || parentState.assignedNodes.length === 0)) {
        signalASlotChange(parent);
    }

    // 12. If node has an inclusive descendant that is a slot, then:
    const inclusiveSlotDescendants = [];
    if (node.localName === 'slot') {
        inclusiveSlotDescendants[0] = node;
    }
    treeOrderRecursiveSelectAll(node, inclusiveSlotDescendants, function (descendant) {
        return descendant.localName === 'slot';
    });
    if (inclusiveSlotDescendants.length) {
        // 1. Run assign slotables for a tree with parent’s tree.
        assignSlotablesForATree(parent);
        // 2. Run assign slotables for a tree with node’s tree and a 
        // set containing each inclusive descendant of node that is a slot.
        assignSlotablesForATree(node, inclusiveSlotDescendants);
    }

    // Skip (other)
    // 13. Run the removing steps with node and parent.

    if (CustomElements.isInstalled()) {
        // 14. If node is custom, then enqueue a custom element callback reaction 
        // with node, callback name "disconnectedCallback", and an empty argument list.
        if (CustomElements.isCustom(node)) {
            CustomElements.enqueueCallbackReaction(node, 'disconnectedCallback', []);
        }

        // 15. For each shadow-including descendant descendant of node, in 
        // shadow-including tree order, run these substeps:
        forEachShadowIncludingDescendant(node, function (descendant) {
            // Skip (other)
            // 1. Run the removing steps with descendant.

            // 2. If descendant is custom, then enqueue a custom element 
            // callback reaction with descendant, callback name "disconnectedCallback", 
            // and an empty argument list.
            if (CustomElements.isCustom(descendant)) {
                CustomElements.enqueueCallbackReaction(descendant, 'disconnectedCallback', []);
            }
        });
    }

    // 16. For each inclusive ancestor inclusiveAncestor of parent...
    let inclusiveAncestor = parent;
    while (inclusiveAncestor) {
        // ...if inclusiveAncestor has any registered observers whose options' 
        // subtree is true, then for each such registered observer registered... 
        const ancestorState = getShadowState(inclusiveAncestor);
        if (ancestorState && ancestorState.observers) {
            const ancestorObservers = ancestorState.observers;
            for (let i = 0; i < ancestorObservers.length; i++) {
                const registeredObserver = ancestorObservers[i];
                if (registeredObserver.options.subtree) {
                    // ...append a transient registered observer whose observer and options are 
                    // identical to those of registered and source which is registered to node’s 
                    // list of registered observers.
                    const observer = registeredObserver.instance;
                    const options = registeredObserver.options;
                    const transientObserver = createTransientObserver(observer, node, options);
                    mutationObservers.push(transientObserver);
                }
            }
        }
        inclusiveAncestor = inclusiveAncestor.parentNode;
    }

    // 17. If suppress observers flag is unset, queue a mutation record of "childList" 
    // for parent with removedNodes a list solely containing node, nextSibling 
    // oldNextSibling, and previousSibling oldPreviousSibling.
    if (!suppressObservers) {
        queueMutationRecord('childList', parent, null, null, null, null, [node], oldPreviousSibling, oldNextSibling);
    }
}

// https://dom.spec.whatwg.org/#mutation-observers

// TODO: test everything that queues mutation records

// TODO: move mutation observers into a separately installed feature.
// It should be installed automatically when ShadowDOM is installed,
// with an option to opt out if desired for performance

function getOrCreateNodeObservers(node) {
    const nodeState = getShadowState(node) || setShadowState(node, {});
    const observers = nodeState.observers;
    return observers ? observers : nodeState.observers = [];
}

export function createMutationObserver(callback) {
    return {
        callback: callback,
        queue: [],
        nodes: [],
        observe: function (node, options) {
            if (this.nodes.length === 0) {
                mutationObservers.push(this);
            }
            const nodeObservers = getOrCreateNodeObservers(node);
            nodeObservers.push({ instance: this, options });
            this.nodes.push(node);
        },
        disconnect: function () {
            let index = mutationObservers.indexOf(this);
            mutationObservers.splice(index, 1);
            for (let i = 0; i < this.nodes.length; i++) {
                const nodeObservers = getOrCreateNodeObservers(this.nodes[i]);
                for (let j = 0; j < nodeObservers.length; j++) {
                    if (nodeObservers[j].instance === this) {
                        nodeObservers.splice(j, 1);
                        break;
                    }
                }
            }
            this.nodes = [];
        }
    };
}

function createTransientObserver(observer, node, options) {
    const transientObserver = {
        observer: observer,
        callback: observer.callback,
        options: options,
        queue: [],
        node: node,
        disconnect: function () {
            const nodeObservers = getOrCreateNodeObservers(this.node);
            for (let j = 0; j < nodeObservers.length; j++) {
                if (nodeObservers[j].instance === this) {
                    nodeObservers.splice(j, 1);
                    break;
                }
            }
        }
    };

    const nodeObservers = getOrCreateNodeObservers(node);
    nodeObservers.push({ instance: transientObserver, options });

    return transientObserver;
}

let mutationObserverCompoundMicrotaskQueuedFlag = false;

const mutationObservers = [];
const signalSlotList = [];
const theEmptyList = Object.freeze([]);

function queueMutationRecord(type, target, name, nameSpace, oldValue, addedNodes, removedNodes, previousSibling, nextSibling) {
    // PERF: This is an out-of-spec optimization
    if (mutationObservers.length === 0) {
        return;
    }

    // https://dom.spec.whatwg.org/#queueing-a-mutation-record
    // 1. Let interested observers be an initially empty set of 
    // MutationObserver objects optionally paired with a string.
    const interestedObservers = [];
    const pairedStrings = [];
    // 2. Let nodes be the inclusive ancestors of target.
    const nodes = [target];
    let ancestor = target;
    while (ancestor = ancestor.parentNode) {
        nodes.push(ancestor)
    }
    // 3. Then, for each node in nodes... 
    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const nodeState = getShadowState(node);
        if (!nodeState || !nodeState.observers) {
            continue;
        }
        // ...and then for each registered observer (with registered 
        // observer’s options as options) in node’s list of registered 
        // observers...
        for (let j = 0; j < nodeState.observers.length; j++) {
            const registeredObserver = nodeState.observers[j];
            const options = registeredObserver.options;
            // ...run these substeps:
            // 1. If none of the following are true:
            if (node != target && !options.subtree) {
                continue;
            }
            if (type === 'attributes') {
                if (!options.attributes) {
                    continue;
                }
                // if options' attributeFilter is present, and options' attributeFilter
                // does not contain name or namespace is non-null
                if (options.attributeFilter &&
                    (options.attributeFilter.indexOf(name) === -1 ||
                        nameSpace != null)) {
                    continue;
                }
            }
            if (type === 'characterData' && !options.characterData) {
                continue;
            }
            if (type === 'childList' && !options.childList) {
                continue;
            }
            // ...then run the subsubsteps:
            // 1. If registered observer’s observer is not in interested observers, 
            // append registered observer’s observer to interested observers.
            const observer = registeredObserver.instance;
            let index = interestedObservers.indexOf(observer);
            if (index === -1) {
                index = interestedObservers.length;
                interestedObservers[index] = observer;
            }
            // 2. If either type is "attributes" and options’ attributeOldValue is true, 
            // or type is "characterData" and options’ characterDataOldValue is true, 
            // set the paired string of registered observer’s observer in interested observers to oldValue.
            if ((type === 'attributes' && options.attributeOldValue) ||
                (type === 'characterData' && options.characterDataOldValue)) {
                pairedStrings[index] = oldValue;
            }
        }
    }

    // PERF: This is an out-of-spec optimization
    if (interestedObservers.length === 0) {
        return;
    }

    // 4. Then, for each observer in interested observers, run these substeps:
    for (let i = 0; i < interestedObservers.length; i++) {
        const observer = interestedObservers[i];
        // 1. Let record be a new MutationRecord object with its type set to type and target set to target.
        const record = {
            type,
            target,
            attributeName: null,
            attributeNamespace: null,
            addedNodes: theEmptyList,
            removedNodes: theEmptyList,
            previousSibling: null,
            nextSibling: null,
            oldValue: null
        };
        // 2. If name and namespace are given, set record’s attributeName to name, and record’s attributeNamespace to namespace.
        if (name) {
            record.attributeName = name;
            record.attributeNamespace = nameSpace;
        }
        // 3. If addedNodes is given, set record’s addedNodes to addedNodes.
        if (addedNodes) {
            record.addedNodes = Object.freeze(addedNodes);
        }
        // 4. If removedNodes is given, set record’s removedNodes to removedNodes.
        if (removedNodes) {
            record.removedNodes = Object.freeze(removedNodes);
        }
        // 5. If previousSibling is given, set record’s previousSibling to previousSibling.
        if (previousSibling) {
            record.previousSibling = previousSibling;
        }
        // 6. If nextSibling is given, set record’s nextSibling to nextSibling.
        if (nextSibling) {
            record.nextSibling = nextSibling;
        }
        // 7. If observer has a paired string, set record’s oldValue to observer’s paired string.
        record.oldValue = pairedStrings[i];
        // 8. Append record to observer’s record queue.
        Object.freeze(record);
        observer.queue.push(record);
    }

    // 5. Queue a mutation observer compound microtask.
    queueMutationObserverCompoundMicrotask();
}

function queueMutationObserverCompoundMicrotask() {
    if (mutationObserverCompoundMicrotaskQueuedFlag) {
        return;
    }
    mutationObserverCompoundMicrotaskQueuedFlag = true;
    setImmediate(notifyMutationObservers);
}

function notifyMutationObservers() {
    mutationObserverCompoundMicrotaskQueuedFlag = false;
    const mutationObserversLength = mutationObservers.length;
    const notifyList = new Array(mutationObserversLength);
    for (let i = 0; i < mutationObserversLength; i++) {
        notifyList[i] = mutationObservers[i];
    }
    const signalList = signalSlotList.splice(0, signalSlotList.length);
    for (let i = 0; i < notifyList.length; i++) {
        const observer = notifyList[i];
        const queue = observer.queue.splice(0, observer.queue.length);
        for (let j = mutationObservers.length - 1; j >= 0; j--) {
            const transientObserver = mutationObservers[j];
            if (transientObserver.observer === observer) {
                mutationObservers.splice(j, 1);
                transientObserver.disconnect();
            }
        }
        if (queue.length) {
            try {
                observer.callback.call(observer.interface, queue, observer.interface);
            }
            catch (error) {
                reportError(error);
            }
        }
    }
    for (let i = 0; i < signalList.length; i++) {
        const slot = signalList[i];
        const event = slot.ownerDocument.createEvent('event');
        event.initEvent('slotchange', true, false);
        try {
            slot.dispatchEvent(event);
        }
        catch (error) {
            reportError(error);
        }
    }
}
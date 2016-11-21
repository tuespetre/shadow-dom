// https://html.spec.whatwg.org/multipage/scripting.html#custom-elements

// TODO: CEReactions annotations for Range in the DOM spec
// TODO: CEReactions for interfaces in the HTML spec

const nativeSupport = 'customElements' in window;
const promisesSupported = 'Promise' in window;
const originalHTMLElement = window.HTMLElement;
const originalCreateElement = Document.prototype.createElement;
const originalCreateElementNS = Document.prototype.createElementNS;
const htmlNamespace = 'http://www.w3.org/1999/xhtml';
const alreadyConstructedMarker = 1;
const upgradeReactionType = 1;
const callbackReactionType = 2;

export default {
    nativeSupport,
    install,
    uninstall,
    isInstalled,
    shimHtmlConstructors,
    isCustom,
    tryToUpgradeElement,
    enqueueCallbackReaction,
    executeCEReactions,
    isValidCustomElementName
};

const setImmediate = 'setImmediate' in window ? window.setImmediate : function (callback, ...args) {
    return setTimeout(callback, 0, ...args);
};

const setPrototypeOf = (function () {
    if (Object.setPrototypeOf) {
        return Object.setPrototypeOf;
    }

    const test = {};
    const proto = {};
    test.__proto__ = proto;
    if (Object.getPrototypeOf(test) === proto) {
        return function (object, proto) {
            object.__proto__ = proto;
            return object;
        }
    }

    return function (object, proto) {
        const names = Object.getOwnPropertyNames(proto);
        for (let i = 0; i < names.length; i++) {
            const name = names[i];
            const descriptor = Object.getOwnPropertyDescriptor(proto, name);
            Object.defineProperty(object, name, descriptor);
        }
    }
})();

// Installation/uninstallation

function install() {
    const installation = {};

    installation.builtInElementInterfaces = installHtmlConstructors();

    Object.defineProperty(window, 'customElements', {
        value: new CustomElementRegistry(),
        writable: false,
        configurable: true,
        enumerable: true
    });

    Document.prototype.createElement = createElement;
    Document.prototype.createElementNS = createElementNS;

    window.document.addEventListener('DOMContentLoaded', function () {
        // Upgrading elements initially present in the document
        // TODO: Improve this, possibly with a MutationEvent or something
        treeOrderShadowInclusiveForEach(document, tryToUpgradeElement);
    });

    installation.customElementsReactionStack = [];
    installation.backupElementQueue = [];
    installation.processingBackupElementQueue = false;

    setInstallation(window, installation);
}

function uninstall() {
    const windowState = getPrivateState(window);

    if (!windowState) {
        return;
    }

    uninstallHtmlConstructors(windowState.builtInElementInterfaces);

    delete window['customElements'];

    Document.prototype.createElement = originalCreateElement;
    Document.prototype.createElementNS = originalCreateElementNS;

    setPrivateState(window, undefined);
}

function isInstalled() {
    return getInstallation(window) != null;
}

function gatherBuiltInElementInterfaces() {
    const builtInElementInterfaces = [];
    const windowPropertyNames = Object.getOwnPropertyNames(window);
    for (let i = 0; i < windowPropertyNames.length; i++) {
        const name = windowPropertyNames[i];
        if (/^webkit/.test(name)) {
            // This just avoids a slew of warnings.
            continue;
        }
        const object = window[name];
        if (object && object instanceof originalHTMLElement || object === originalHTMLElement) {
            builtInElementInterfaces.push({ name, object, constructor: object.prototype.constructor });
        }
    }
    return builtInElementInterfaces;
}

function shimHtmlConstructors() {
    try {
        // Ensure that we are only shimming browsers that support ES2015 class syntax.
        new Function('return class {}');

        const makeHtmlConstructor = new Function('originalHTMLElement',
            'return function(){const newTarget=new.target||this.constructor;' +
            'return Reflect.construct(originalHTMLElement, [], newTarget);}');

        const builtInElementInterfaces = gatherBuiltInElementInterfaces();
        for (let i = 0; i < builtInElementInterfaces.length; i++) {
            const { name, object } = builtInElementInterfaces[i];
            const htmlConstructor = makeHtmlConstructor(object);
            htmlConstructor.prototype = object.prototype;
            Object.defineProperty(object.prototype, 'constructor', {
                value: htmlConstructor,
                writable: true,
                configurable: true
            });
            window[name] = htmlConstructor;
        }
    }
    catch (error) {
        return;
    }
}

function installHtmlConstructors() {
    const builtInElementInterfaces = gatherBuiltInElementInterfaces();
    for (let i = 0; i < builtInElementInterfaces.length; i++) {
        const { name, object } = builtInElementInterfaces[i];
        const htmlConstructor = makeHtmlConstructor();
        htmlConstructor.prototype = object.prototype;
        Object.defineProperty(object.prototype, 'constructor', {
            value: htmlConstructor,
            writable: true,
            configurable: true
        });
        window[name] = htmlConstructor;
    }
    return builtInElementInterfaces;
}

function uninstallHtmlConstructors(builtInElementInterfaces) {
    for (let i = 0; i < builtInElementInterfaces.length; i++) {
        const { name, object, constructor } = builtInElementInterfaces[i];
        Object.defineProperty(object.prototype, 'constructor', {
            value: constructor,
            writable: true,
            configurable: true
        });
        window[name] = object;
    }
}

function makeHtmlConstructor() {
    return function htmlConstructor() {
        const thisPrototype = Object.getPrototypeOf(this);

        // 1. Let registry...
        const registry = window['customElements'];
        const registryState = getPrivateState(registry);

        // 2. If NewTarget...
        if (thisPrototype.constructor === htmlConstructor) {
            throw new TypeError('Illegal constructor');
        }

        // 3. Let definition...
        let definition;
        for (let i = 0; i < registryState.definitions.length; i++) {
            const current = registryState.definitions[i];
            if (current.constructor === thisPrototype.constructor) {
                definition = current;
                break;
            }
        }
        if (!definition) {
            throw new TypeError();
        }

        // 4. If definition's local name is equal...
        // 5. Otherwise... (customized built-in)
        if (htmlConstructor !== definition.htmlConstructor) {
            // TODO: assert this is the correct HTML___Element
            throw new TypeError('Illegal constructor');
        }

        // 6. let prototype...
        const prototype = thisPrototype;

        // 7. if prototype is not Object...
        // in this polyfill, this should always be true

        // 8. If construction stack is empty...
        const constructionStack = definition.constructionStack;
        if (constructionStack.length === 0) {
            const element = originalCreateElement.call(window.document, definition.localName);
            setPrototypeOf(element, prototype);
            setPrivateState(element, {
                customElementState: 'custom',
                customElementDefinition: definition
            });
            return element;
        }

        const lastIndex = constructionStack.length - 1;
        // 9. Let element be the last entry
        const element = constructionStack[lastIndex];
        // 10. if alreadyConstructedMarker
        if (element === alreadyConstructedMarker) {
            throw makeDOMException('InvalidStateError', 'This element instance is already constructed');
        }
        // 11. set prototype
        setPrototypeOf(element, prototype);
        // 12. replace last entry
        constructionStack[lastIndex] = alreadyConstructedMarker;
        // 13. return element
        return element;
    }
}

// DOM element creation

function createAnElement(document, qualifiedOrLocalName, nameSpace, prefix, is, synchronousCustomElements) {
    is = is || null;
    let result = null;
    let definition = lookupCustomElementDefinition(document, nameSpace, qualifiedOrLocalName, is);
    if (definition && definition.name != definition.localName) {
        result = originalCreateElement.call(document, qualifiedOrLocalName);
        setPrivateState(result, {
            customElementState: 'undefined',
            customElementDefinition: null,
            isValue: is
        });
        if (synchronousCustomElements) {
            upgradeElement(result, definition);
        }
        else {
            enqueueUpgradeReaction(result, definition);
        }
    }
    else if (definition) {
        if (synchronousCustomElements) {
            try {
                result = new definition.constructor();
                if (!(result instanceof HTMLElement)) {
                    throw new TypeError('Illegal constructor');
                }
                if (result.attributes.length !== 0 ||
                    result.hasChildNodes() ||
                    result.parentNode ||
                    result.ownerDocument !== document ||
                    result.namespaceURI !== htmlNamespace ||
                    result.localName !== qualifiedOrLocalName) {
                    const error = new Error('Invalid state manipulation during custom element construction');
                    error.name = 'NotSupportedError';
                    throw error;
                }
            }
            catch (error) {
                reportError(error);
                result = originalCreateElement.call(document, qualifiedOrLocalName);
                // should be HTMLUnknownElement already
                setPrivateState(result, {
                    customElementState: 'failed'
                });
            }
        }
        else {
            result = originalCreateElement.call(document, qualifiedOrLocalName);
            Object.setPrototypeOf(result, HTMLElement.prototype);
            enqueueUpgradeReaction(result, definition);
        }
    }
    else {
        result = nameSpace
            ? originalCreateElementNS.call(document, nameSpace, qualifiedOrLocalName)
            : originalCreateElement.call(document, qualifiedOrLocalName);
        // skip setting the custom element state to 'undefined' in order
        // to avoid unnecessary allocation.
    }
    return result;
}

function createElement(localName, options) {
    let nameSpace = null;
    //if (this instanceof HTMLDocument) {
    localName = localName.toLowerCase();
    nameSpace = htmlNamespace;
    //}
    let is = options ? (options.is || null) : null;
    const element = createAnElement(this, localName, nameSpace, null, is, true);
    if (is != null) {
        element.setAttribute('is', is);
    }
    return element;
}

function createElementNS(nameSpace, qualifiedName, options) {
    let is = options ? (options.is || null) : null;
    const element = createAnElement(this, qualifiedName, nameSpace, null, is, true);
    if (is != null) {
        element.setAttribute('is', is);
    }
    return element;
}

// Custom Element spec

function isCustom(node) {
    if (node.nodeType != Node.ELEMENT_NODE) {
        return false;
    }
    const nodeState = getPrivateState(node);
    if (!nodeState) {
        return false;
    }
    return nodeState.customElementState === 'custom';
}

function isValidCustomElementName(localName) {
    // https://html.spec.whatwg.org/multipage/scripting.html#valid-custom-element-name
    switch (localName) {
        case "annotation-xml":
        case "color-profile":
        case "font-face":
        case "font-face-src":
        case "font-face-uri":
        case "font-face-format":
        case "font-face-name":
        case "missing-glyph":
            return false;
    }

    const nameLength = localName.length;

    if (nameLength < 2) {
        return false;
    }

    const firstCode = localName.charCodeAt(0);
    if (firstCode < 0x61 /* a */ ||
        firstCode > 0x7A /* z */) {
        return false;
    }

    let foundHyphen = false;

    for (let i = 1; i < nameLength; i++) {
        const code = localName.charCodeAt(i);
        if (code >= 0x61 /* a */ &&
            code <= 0x7A /* z */) {
            continue;
        }
        if (code === 0x2D /* - */) {
            foundHyphen = true;
            continue;
        }
        if (code === 0x2E /* . */ ||
            code === 0x5F /* _ */ ||
            code === 0xB7 /* · */) {
            continue;
        }
        if (code >= 0x30 /* 0 */ &&
            code <= 0x39 /* 9 */) {
            continue;
        }
        if (code < 0x00C0) {
            return false;
        }
        if (code >= 0xC0 && code <= 0xD6) {
            continue;
        }
        if (code >= 0xD8 && code <= 0xF6) {
            continue;
        }
        if (code >= 0xF8 && code <= 0x37D) {
            continue;
        }
        if (code >= 0x37F && code <= 0x1FFF) {
            continue;
        }
        if (code >= 0x200C && code <= 0x200D) {
            continue;
        }
        if (code >= 0x203F && code <= 0x2040) {
            continue;
        }
        if (code >= 0x2070 && code <= 0x218F) {
            continue;
        }
        if (code >= 0x2C00 && code <= 0x2FEF) {
            continue;
        }
        if (code >= 0x3001 && code <= 0xD7FF) {
            continue;
        }
        if (code >= 0xF900 && code <= 0xFDCF) {
            continue;
        }
        if (code >= 0xFDF0 && code <= 0xFFFD) {
            continue;
        }
        if (code >= 0x10000 && code <= 0xEFFFF) {
            continue;
        }
        return false;
    }

    return foundHyphen;
}

function lookupCustomElementDefinition(document, nameSpace, localName, is) {
    if (nameSpace !== htmlNamespace) {
        return null;
    }
    if (!document.defaultView) {
        return null;
    }
    const registry = document.defaultView.customElements;
    const privateState = getPrivateState(registry);
    for (let i = 0; i < privateState.definitions.length; i++) {
        const definition = privateState.definitions[i];
        if (definition.localName === localName) {
            if (definition.name === localName || definition.name === is) {
                return definition;
            }
        }
    }
    return null;
}

function CustomElementRegistry() {
    setPrivateState(this, {
        definitions: [],
        elementDefinitionIsRunning: false,
        whenDefinedPromiseMap: {}
    });
}

CustomElementRegistry.prototype = {

    define(name, constructor, options) {
        const privateState = getPrivateState(this);
        if (constructor !== constructor.prototype.constructor) {
            throw new TypeError('The passed argument must be a constructor');
        }
        if (!isValidCustomElementName(name)) {
            throw makeDOMException('SyntaxError');
        }
        // TODO: check for already defined name
        // TODO: check for already defined constructor
        let localName = name;
        let extensionOf = options ? options.extends : null;
        let htmlConstructor = window.HTMLElement;
        if (extensionOf != null) {
            if (isValidCustomElementName(extensionOf)) {
                throw makeDOMException('NotSupportedError');
            }
            const testElement = originalCreateElement.call(window.document, extensionOf);
            if (testElement instanceof HTMLUnknownElement) {
                // TODO: check for HTMLUnknownElement
            }
            localName = extensionOf;
            htmlConstructor = Object.getPrototypeOf(testElement).constructor;
        }
        if (privateState.elementDefinitionIsRunning) {
            throw makeDOMException('NotSupportedError');
        }
        privateState.elementDefinitionIsRunning = true;
        let caught = null;
        let observedAttributes = [];
        let lifecycleCallbacks;
        let nativeInterface;
        try {
            const prototype = constructor.prototype;
            if (!(prototype instanceof Object)) {
                throw new TypeError('Invalid prototype');
            }
            lifecycleCallbacks = {
                'connectedCallback': getCallback(prototype, 'connectedCallback'),
                'disconnectedCallback': getCallback(prototype, 'disconnectedCallback'),
                'adoptedCallback': getCallback(prototype, 'adoptedCallback'),
                'attributeChangedCallback': getCallback(prototype, 'attributeChangedCallback')
            };
            if (lifecycleCallbacks['attributeChangedCallback']) {
                const observedAttributesIterable = constructor.observedAttributes;
                if (observedAttributesIterable) {
                    observedAttributes = observedAttributesIterable.slice();
                }
            }
        }
        catch (error) {
            caught = error;
        }
        privateState.elementDefinitionIsRunning = false;
        if (caught) {
            throw caught;
        }
        const definition = {
            name: name,
            localName: localName,
            constructor: constructor,
            observedAttributes,
            lifecycleCallbacks,
            constructionStack: [],
            htmlConstructor
        };
        privateState.definitions.push(definition);
        const document = window.document;
        treeOrderShadowInclusiveForEach(document, function (node) {
            if (node.nodeType === Node.ELEMENT_NODE &&
                node.namespaceURI === htmlNamespace &&
                node.localName === localName) {
                if (extensionOf) {
                    const nodeState = getPrivateState(node);
                    if (nodeState.isValue !== extensionOf) {
                        return;
                    }
                }
                enqueueUpgradeReaction(element, definition);
            }
        });
        const entry = privateState.whenDefinedPromiseMap[name];
        if (entry) {
            entry.resolve();
            privateState.whenDefinedPromiseMap[name] = null;
        }
    },

    get(name) {
        const privateState = getPrivateState(this);
        for (let i = 0; i < privateState.definitions.length; i++) {
            const definition = privateState.definitions[i];
            if (definition.name === name) {
                return definition.constructor;
            }
        }
        return undefined;
    },

    whenDefined(name) {
        if (!promisesSupported) {
            throw new Error('Please include a promise polyfill.');
        }
        if (!isValidCustomElementName(name)) {
            throw makeDOMException('SyntaxError', 'Invalid custom element name');
        }
        const privateState = getPrivateState(this);
        for (let i = 0; i < privateState.definitions.length; i++) {
            const definition = privateState.definitions[i];
            if (name === definition.name) {
                return Promise.resolve();
            }
        }
        let entry = privateState.whenDefinedPromiseMap[name];
        if (!entry) {
            entry = { promise: null, resolve: null };
            entry.promise = new Promise(function (resolve, reject) {
                entry.resolve = resolve;
            });
            privateState.whenDefinedPromiseMap[name] = entry;
        }
        return entry.promise;
    },

};

function upgradeElement(element, definition) {
    // https://html.spec.whatwg.org/multipage/scripting.html#concept-upgrade-an-element
    const elementState = getPrivateState(element) || setPrivateState(element, { reactionQueue: [] });
    if (elementState.customElementState === 'custom' ||
        elementState.customElementState === 'failed') {
        return;
    }
    const attributes = element.attributes;
    for (var i = 0; i < attributes.length; i++) {
        const attribute = attributes[i];
        const args = [attribute.localName, null, attribute.value, attribute.namespaceURI];
        enqueueCallbackReaction(element, 'attributeChangedCallback', args)
    }
    if (element.isConnected) {
        enqueueCallbackReaction(element, 'connectedCallback', []);
    }
    definition.constructionStack.push(element);
    let caught = null;
    try {
        const constructResult = new definition.constructor;
        if (constructResult !== element) {
            throw makeDOMException('InvalidStateError');
        }
    }
    catch (error) {
        caught = error;
        delete element.prototype;
        elementState.customElementState = 'failed';
        elementState.reactionQueue.splice(0, elementState.reactionQueue.length);
    }
    definition.constructionStack.pop();
    if (caught) {
        throw caught;
    }
    elementState.customElementState = 'custom';
    elementState.customElementDefinition = definition;
}

function tryToUpgradeElement(element) {
    const elementState = getPrivateState(element);
    let isValue = null;
    if (elementState) {
        isValue = elementState.isValue;
    }
    const definition = lookupCustomElementDefinition(element.ownerDocument, element.namespaceURI, element.localName, isValue);
    if (definition) {
        enqueueUpgradeReaction(element, definition);
    }
}

function enqueueElementOnAppropriateElementQueue(element) {
    const installation = getInstallation(window);
    if (!installation) {
        return;
    }
    // https://html.spec.whatwg.org/multipage/scripting.html#enqueue-an-element-on-the-appropriate-element-queue
    // 1. If the custom element reactions stack is empty, then:
    const stack = installation.customElementsReactionStack;
    if (stack.length === 0) {
        // 1. Add element to the backup element queue.
        installation.backupElementQueue.push(element);
        // 2. If the processing the backup element queue flag is set, abort this algorithm.
        if (installation.processingBackupElementQueue) {
            return;
        }
        // 3. Set the processing the backup element queue flag.
        installation.processingBackupElementQueue = true;
        // 4. Queue a microtask to perform the following steps:
        setImmediate(function () {
            // 1. Invoke custom element reactions in the backup element queue.
            invokeReactions(installation.backupElementQueue);
            // 2. Unset the processing the backup element queue flag.
            installation.processingBackupElementQueue = false;
        });
    }
    // 2. Otherwise, add element to the current element queue.
    else {
        stack[stack.length - 1].push(element);
    }
}

function enqueueCallbackReaction(element, callbackName, args) {
    // https://html.spec.whatwg.org/multipage/scripting.html#enqueue-a-custom-element-callback-reaction
    const elementState = getPrivateState(element);
    const definition = elementState.customElementDefinition;
    const callback = definition.lifecycleCallbacks[callbackName];
    if (callback == null) {
        return;
    }
    if (callbackName === 'attributeChangedCallback') {
        const attributeName = args[0];
        if (definition.observedAttributes.indexOf(attributeName) === -1) {
            return;
        }
    }
    if (!elementState.reactionQueue) {
        elementState.reactionQueue = [];
    }
    elementState.reactionQueue.push({ type: callbackReactionType, callback, args });
    enqueueElementOnAppropriateElementQueue(element);
}

function enqueueUpgradeReaction(element, definition) {
    // https://html.spec.whatwg.org/multipage/scripting.html#enqueue-a-custom-element-upgrade-reaction
    const elementState = getPrivateState(element) || setPrivateState(element, { reactionQueue: [] });
    elementState.customElementDefinition = definition;
    elementState.reactionQueue.push({ type: upgradeReactionType, definition });
    enqueueElementOnAppropriateElementQueue(element);
}

function invokeReactions(queue) {
    // https://html.spec.whatwg.org/multipage/scripting.html#invoke-custom-element-reactions
    for (let i = 0; i < queue.length; i++) {
        const element = queue[i];
        const reactions = getPrivateState(element).reactionQueue;
        while (reactions.length) {
            try {
                const splicedOut = reactions.splice(0, 1);
                const reaction = splicedOut[0];
                switch (reaction.type) {
                    case upgradeReactionType:
                        upgradeElement(element, reaction.definition);
                        break;
                    case callbackReactionType:
                        reaction.callback.apply(element, reaction.args);
                        break;
                }
            }
            catch (error) {
                reportError(error);
            }
        }
    }
}

function executeCEReactions(callback) {
    const installation = getInstallation(window);
    if (installation) {
        const stack = installation.customElementsReactionStack;
        stack.push([]);
        const result = callback();
        invokeReactions(stack.pop());
        return result;
    }
    return callback();
}

// Utility functions

function makeDOMException(name, message) {
    try {
        const sacrifice = originalCreateElement.call(window.document, 'div');
        descriptors.Node.appendChild.call(sacrifice, sacrifice);
    }
    catch (error) {
        error.message = message;
        error.name = name;
        return error;
    }
}

function getCallback(prototype, callbackName) {
    const callback = prototype[callbackName];
    if (callback && typeof callback === 'function') {
        return callback;
    }
    return null;
}

function getPrivateState(object) {
    return object._custom;
}

function setPrivateState(object, state) {
    return object._custom = state;
}

function getInstallation(window) {
    return window._custom;
}

function setInstallation(window, installation) {
    window._custom = installation;
}

function treeOrderShadowInclusiveForEach(node, callback) {
    callback(node);
    const shadowRoot = node.shadowRoot;
    if (shadowRoot) {
        treeOrderShadowInclusiveForEach(shadowRoot, callback);
    }
    const childNodes = node.childNodes;
    for (let i = 0; i < childNodes.length; i++) {
        treeOrderShadowInclusiveForEach(childNodes[i], callback);
    }
}

function reportError(error) {
    if ('console' in window && 'error' in window.console) {
        window.console.error(error);
    }
}
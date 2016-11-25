// https://html.spec.whatwg.org/multipage/scripting.html#custom-elements

import $utils from './utils.js';

// TODO: CEReactions annotations for Range in the DOM spec
// TODO: CEReactions for interfaces in the HTML spec

// TODO: Document in the README that a Promise polyfill 
// should be brought in to support whenDefined

const nativeHTMLElement = window.HTMLElement;
const nativeCreateElement = Document.prototype.createElement;
const nativeCreateElementNS = Document.prototype.createElementNS;
const nativeMutationObserver = window.MutationObserver;

const htmlNamespace = 'http://www.w3.org/1999/xhtml';
const alreadyConstructedMarker = 1;
const upgradeReactionType = 1;
const callbackReactionType = 2;
const CE_STATE_FAILED = 'failed';
const CE_STATE_CUSTOM = 'custom';
const CE_STATE_UNDEFINED = 'undefined';
const CE_PROP_NAME = 'customElements';
const CE_CALLBACK_CONNECTED = 'connectedCallback';
const CE_CALLBACK_DISCONNECTED = 'disconnectedCallback';
const CE_CALLBACK_ADOPTED = 'adoptedCallback';
const CE_CALLBACK_ATTRIBUTE_CHANGED = 'attributeChangedCallback';
const DOM_CONTENT_LOADED = 'DOMContentLoaded';
const CTOR_PROP_NAME = 'constructor';
const ATTR_IS_NAME = 'is';

const nativeSupport = CE_PROP_NAME in window;
const promisesSupported = 'Promise' in window;

export default {
    nativeSupport,
    install,
    uninstall,
    isInstalled,
    installTranspiledClassSupport,
    isCustom,
    tryToUpgradeElement,
    enqueueConnectedReaction,
    enqueueDisconnectedReaction,
    enqueueAdoptedReaction,
    enqueueAttributeChangedReaction,
    executeCEReactions,
    isValidCustomElementName,
};

// Installation/uninstallation

function install() {
    const installation = {};

    installation.builtInElementInterfaces = installHtmlConstructors();
    installation.registry = new CustomElementRegistry();

    Object.defineProperty(window, CE_PROP_NAME, {
        value: installation.registry,
        writable: false,
        configurable: true,
        enumerable: true
    });

    Document.prototype.createElement = createElement;
    Document.prototype.createElementNS = createElementNS;

    if (window.document.readyState === 'loading') {
        // This can provide faster upgrades on browsers that support it.
        if (nativeMutationObserver) {
            const observer = new nativeMutationObserver(function (records) {
                for (let i = 0; i < records.length; i++) {
                    for (let j = 0; j < records[i].addedNodes.length; j++) {
                        let added = records[i].addedNodes[j];
                        if (added.nodeType === Node.ELEMENT_NODE) {
                            tryToUpgradeElementSync(added);
                        }
                    }
                }
            });
            observer.observe(window.document, {
                childList: true,
                subtree: true
            });
            window.document.addEventListener(DOM_CONTENT_LOADED, function () {
                observer.disconnect();
            });
        }
    }
    else {
        performInitialUpgrades();
    }
    
    // For browsers that don't support the above.
    // Not all browsers run MutationObservers during parsing,
    // or they display timing issues one way or another, so this covers them
    // too.
    window.document.addEventListener(DOM_CONTENT_LOADED, performInitialUpgrades, { once: true });

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

    delete window[CE_PROP_NAME];

    Document.prototype.createElement = nativeCreateElement;
    Document.prototype.createElementNS = nativeCreateElementNS;

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
        if (object && object instanceof nativeHTMLElement || object === nativeHTMLElement) {
            builtInElementInterfaces.push({ name, object, constructor: object.prototype.constructor });
        }
    }
    return builtInElementInterfaces;
}

function installTranspiledClassSupport() {
    try {
        // Ensure that we are only shimming browsers that support ES2015 class syntax.
        new Function('return class {}');

        const makeHtmlConstructor = new Function('nativeHTMLElement',
            'return function(){const newTarget=new.target||this.constructor;' +
            'return Reflect.construct(nativeHTMLElement, [], newTarget);}');

        const builtInElementInterfaces = gatherBuiltInElementInterfaces();
        for (let i = 0; i < builtInElementInterfaces.length; i++) {
            const { name, object } = builtInElementInterfaces[i];
            const htmlConstructor = makeHtmlConstructor(object);
            htmlConstructor.prototype = object.prototype;
            Object.defineProperty(object.prototype, CTOR_PROP_NAME, {
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
        Object.defineProperty(object.prototype, CTOR_PROP_NAME, {
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
        Object.defineProperty(object.prototype, CTOR_PROP_NAME, {
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
        const registry = window[CE_PROP_NAME];
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
            const element = nativeCreateElement.call(window.document, definition.localName);
            $utils.setPrototypeOf(element, prototype);
            setPrivateState(element, {
                customElementState: CE_STATE_CUSTOM,
                customElementDefinition: definition
            });
            return element;
        }

        const lastIndex = constructionStack.length - 1;
        // 9. Let element be the last entry
        const element = constructionStack[lastIndex];
        // 10. if alreadyConstructedMarker
        if (element === alreadyConstructedMarker) {
            throw $utils.makeDOMException('InvalidStateError', 'This element instance is already constructed');
        }
        // 11. set prototype
        $utils.setPrototypeOf(element, prototype);
        // 12. replace last entry
        constructionStack[lastIndex] = alreadyConstructedMarker;
        // 13. return element
        return element;
    }
}

function performInitialUpgrades() {
    // Upgrading elements initially present in the document
    const elements = [];
    treeOrderShadowInclusiveForEach(window.document, function (element) { elements.push(element); });
    elements.forEach(tryToUpgradeElementSync);
}

// DOM element creation

function createAnElement(document, qualifiedOrLocalName, nameSpace, prefix, is, synchronousCustomElements) {
    is = is || null;
    let result = null;
    let definition = lookupCustomElementDefinition(document, nameSpace, qualifiedOrLocalName, is);
    if (definition && definition.name != definition.localName) {
        result = nativeCreateElement.call(document, qualifiedOrLocalName);
        setPrivateState(result, {
            customElementState: CE_STATE_UNDEFINED,
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
                $utils.reportError(error);
                result = nativeCreateElement.call(document, qualifiedOrLocalName);
                // should be HTMLUnknownElement already
                setPrivateState(result, {
                    customElementState: CE_STATE_FAILED
                });
            }
        }
        else {
            result = nativeCreateElement.call(document, qualifiedOrLocalName);
            $utils.setPrototypeOf(result, HTMLElement.prototype);
            enqueueUpgradeReaction(result, definition);
        }
    }
    else {
        result = nameSpace
            ? nativeCreateElementNS.call(document, nameSpace, qualifiedOrLocalName)
            : nativeCreateElement.call(document, qualifiedOrLocalName);
        // PERF: forgo setting the custom element state to CE_STATE_UNDEFINED in order
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
        element.setAttribute(ATTR_IS_NAME, is);
    }
    return element;
}

function createElementNS(nameSpace, qualifiedName, options) {
    let is = options ? (options.is || null) : null;
    const element = createAnElement(this, qualifiedName, nameSpace, null, is, true);
    if (is != null) {
        element.setAttribute(ATTR_IS_NAME, is);
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
    return nodeState.customElementState === CE_STATE_CUSTOM;
}

function isValidCustomElementName(localName) {
    // https://html.spec.whatwg.org/multipage/scripting.html#valid-custom-element-name
    switch (localName) {
        case 'annotation-xml':
        case 'color-profile':
        case 'font-face':
        case 'font-face-src':
        case 'font-face-uri':
        case 'font-face-format':
        case 'font-face-name':
        case 'missing-glyph':
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
        executeCEReactions(() => {
            const privateState = getPrivateState(this);
            if (constructor !== constructor.prototype.constructor) {
                throw new TypeError('The passed argument must be a constructor');
            }
            if (!isValidCustomElementName(name)) {
                throw $utils.makeDOMException('SyntaxError');
            }
            // TODO: check for already defined name
            // TODO: check for already defined constructor
            let localName = name;
            let extensionOf = options ? options.extends : null;
            let htmlConstructor = window.HTMLElement;
            if (extensionOf != null) {
                if (isValidCustomElementName(extensionOf)) {
                    throw $utils.makeDOMException('NotSupportedError');
                }
                const testElement = nativeCreateElement.call(window.document, extensionOf);
                if (testElement instanceof HTMLUnknownElement) {
                    // TODO: check for HTMLUnknownElement
                }
                localName = extensionOf;
                htmlConstructor = Object.getPrototypeOf(testElement).constructor;
            }
            if (privateState.elementDefinitionIsRunning) {
                throw $utils.makeDOMException('NotSupportedError');
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
                lifecycleCallbacks = {};
                lifecycleCallbacks[CE_CALLBACK_CONNECTED] = getCallback(prototype, CE_CALLBACK_CONNECTED);
                lifecycleCallbacks[CE_CALLBACK_DISCONNECTED] = getCallback(prototype, CE_CALLBACK_DISCONNECTED);
                lifecycleCallbacks[CE_CALLBACK_ADOPTED] = getCallback(prototype, CE_CALLBACK_ADOPTED);
                lifecycleCallbacks[CE_CALLBACK_ATTRIBUTE_CHANGED] = getCallback(prototype, CE_CALLBACK_ATTRIBUTE_CHANGED);
                if (lifecycleCallbacks[CE_CALLBACK_ATTRIBUTE_CHANGED]) {
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
                    enqueueUpgradeReaction(node, definition);
                }
            });
            const entry = privateState.whenDefinedPromiseMap[name];
            if (entry) {
                $utils.setImmediate(function () {
                    entry.resolve();
                    privateState.whenDefinedPromiseMap[name] = null;
                });
            }
        });
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
            throw $utils.makeDOMException('SyntaxError', 'Invalid custom element name');
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
    let elementState = getPrivateState(element);
    if (!elementState) {
        elementState = setPrivateState(element, { 
            reactionQueue: [],
            customElementDefinition: definition
        });
    }
    else if (shouldNotUpgrade(elementState)) {
        return;
    }
    const attributes = element.attributes;
    for (var i = 0; i < attributes.length; i++) {
        const attribute = attributes[i];
        const args = [attribute.localName, null, attribute.value, attribute.namespaceURI];
        enqueueCallbackReaction(element, CE_CALLBACK_ATTRIBUTE_CHANGED, args)
    }
    if (element.isConnected) {
        enqueueCallbackReaction(element, CE_CALLBACK_CONNECTED, []);
    }
    definition.constructionStack.push(element);
    let caught = null;
    try {
        const constructResult = new definition.constructor;
        if (constructResult !== element) {
            throw $utils.makeDOMException('InvalidStateError');
        }
    }
    catch (error) {
        caught = error;
        delete element.prototype;
        elementState.customElementState = CE_STATE_FAILED;
        elementState.customElementDefinition = null;
        elementState.reactionQueue.splice(0, elementState.reactionQueue.length);
    }
    definition.constructionStack.pop();
    if (caught) {
        throw caught;
    }
    elementState.customElementState = CE_STATE_CUSTOM;
}

function tryToUpgradeElementSync(element) {
    const elementState = getPrivateState(element);
    let isValue = null;
    if (elementState) {
        if (shouldNotUpgrade(elementState)) {
            return;
        }
        isValue = elementState.isValue;
    }
    const definition = lookupCustomElementDefinition(element.ownerDocument, element.namespaceURI, element.localName, isValue);
    if (definition) {
        upgradeElement(element, definition);
    }
}

function tryToUpgradeElement(element) {
    const elementState = getPrivateState(element);
    let isValue = null;
    if (elementState) {
        if (shouldNotUpgrade(elementState)) {
            return;
        }
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
        $utils.setImmediate(function () {
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
    if (callbackName === CE_CALLBACK_ATTRIBUTE_CHANGED) {
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

function enqueueConnectedReaction(element, args) {
    enqueueCallbackReaction(element, CE_CALLBACK_CONNECTED, args);
}

function enqueueDisconnectedReaction(element, args) {
    enqueueCallbackReaction(element, CE_CALLBACK_DISCONNECTED, args);
}

function enqueueAdoptedReaction(element, args) {
    enqueueCallbackReaction(element, CE_CALLBACK_ADOPTED, args);
}

function enqueueAttributeChangedReaction(element, args) {
    enqueueCallbackReaction(element, CE_CALLBACK_ATTRIBUTE_CHANGED, args);
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
                $utils.reportError(error);
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

function shouldNotUpgrade(privateState) {
    return privateState && (
        privateState.customElementState === CE_STATE_CUSTOM ||
        privateState.customElementState === CE_STATE_FAILED);
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
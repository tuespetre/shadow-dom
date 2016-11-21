(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
// https://html.spec.whatwg.org/multipage/scripting.html#custom-elements

// TODO: CEReactions annotations for Range in the DOM spec
// TODO: CEReactions for interfaces in the HTML spec

var nativeSupport = 'customElements' in window;
var originalHTMLElement = window.HTMLElement;
var originalCreateElement = Document.prototype.createElement;
var originalCreateElementNS = Document.prototype.createElementNS;
var htmlNamespace = 'http://www.w3.org/1999/xhtml';
var alreadyConstructedMarker = 1;
var upgradeReactionType = 1;
var callbackReactionType = 2;

exports.default = {
    nativeSupport: nativeSupport,
    install: install,
    uninstall: uninstall,
    isInstalled: isInstalled,
    shimHtmlConstructors: shimHtmlConstructors,
    isCustom: isCustom,
    tryToUpgradeElement: tryToUpgradeElement,
    enqueueCallbackReaction: enqueueCallbackReaction,
    executeCEReactions: executeCEReactions,
    isValidCustomElementName: isValidCustomElementName
};


var setImmediate = 'setImmediate' in window ? window.setImmediate : function (callback) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
    }

    return setTimeout.apply(undefined, [callback, 0].concat(args));
};

var setPrototypeOf = function () {
    if (Object.setPrototypeOf) {
        return Object.setPrototypeOf;
    }

    var test = {};
    var proto = {};
    test.__proto__ = proto;
    if (Object.getPrototypeOf(test) === proto) {
        return function (object, proto) {
            object.__proto__ = proto;
            return object;
        };
    }

    return function (object, proto) {
        var names = Object.getOwnPropertyNames(proto);
        for (var i = 0; i < names.length; i++) {
            var name = names[i];
            var descriptor = Object.getOwnPropertyDescriptor(proto, name);
            Object.defineProperty(object, name, descriptor);
        }
    };
}();

// Installation/uninstallation

function install() {
    var installation = {};

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
    var windowState = getPrivateState(window);

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
    var builtInElementInterfaces = [];
    var windowPropertyNames = Object.getOwnPropertyNames(window);
    for (var i = 0; i < windowPropertyNames.length; i++) {
        var name = windowPropertyNames[i];
        if (/^webkit/.test(name)) {
            // This just avoids a slew of warnings.
            continue;
        }
        var object = window[name];
        if (object && object instanceof originalHTMLElement || object === originalHTMLElement) {
            builtInElementInterfaces.push({ name: name, object: object, constructor: object.prototype.constructor });
        }
    }
    return builtInElementInterfaces;
}

function shimHtmlConstructors() {
    try {
        // Ensure that we are only shimming browsers that support ES2015 class syntax.
        new Function('return class {}');

        var _makeHtmlConstructor = new Function('originalHTMLElement', 'return function(){const newTarget=new.target||this.constructor;' + 'return Reflect.construct(originalHTMLElement, [], newTarget);}');

        var builtInElementInterfaces = gatherBuiltInElementInterfaces();
        for (var i = 0; i < builtInElementInterfaces.length; i++) {
            var _builtInElementInterf = builtInElementInterfaces[i],
                name = _builtInElementInterf.name,
                object = _builtInElementInterf.object;

            var htmlConstructor = _makeHtmlConstructor(object);
            htmlConstructor.prototype = object.prototype;
            Object.defineProperty(object.prototype, 'constructor', {
                value: htmlConstructor,
                writable: true,
                configurable: true
            });
            window[name] = htmlConstructor;
        }
    } catch (error) {
        return;
    }
}

function installHtmlConstructors() {
    var builtInElementInterfaces = gatherBuiltInElementInterfaces();
    for (var i = 0; i < builtInElementInterfaces.length; i++) {
        var _builtInElementInterf2 = builtInElementInterfaces[i],
            name = _builtInElementInterf2.name,
            object = _builtInElementInterf2.object;

        var htmlConstructor = makeHtmlConstructor();
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
    for (var i = 0; i < builtInElementInterfaces.length; i++) {
        var _builtInElementInterf3 = builtInElementInterfaces[i],
            name = _builtInElementInterf3.name,
            object = _builtInElementInterf3.object,
            _constructor = _builtInElementInterf3.constructor;

        Object.defineProperty(object.prototype, 'constructor', {
            value: _constructor,
            writable: true,
            configurable: true
        });
        window[name] = object;
    }
}

function makeHtmlConstructor() {
    return function htmlConstructor() {
        var thisPrototype = Object.getPrototypeOf(this);

        // 1. Let registry...
        var registry = window['customElements'];
        var registryState = getPrivateState(registry);

        // 2. If NewTarget...
        if (thisPrototype.constructor === htmlConstructor) {
            throw new TypeError('Illegal constructor');
        }

        // 3. Let definition...
        var definition = void 0;
        for (var i = 0; i < registryState.definitions.length; i++) {
            var current = registryState.definitions[i];
            if (current.constructor === thisPrototype.constructor) {
                definition = current;
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
        var prototype = thisPrototype;

        // 7. if prototype is not Object...
        // in this polyfill, this should always be true

        // 8. If construction stack is empty...
        var constructionStack = definition.constructionStack;
        if (constructionStack.length === 0) {
            var _element = originalCreateElement.call(window.document, definition.localName);
            setPrototypeOf(_element, prototype);
            setPrivateState(_element, {
                customElementState: 'custom',
                customElementDefinition: definition
            });
            return _element;
        }

        var lastIndex = constructionStack.length - 1;
        // 9. Let element be the last entry
        var element = constructionStack[lastIndex];
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
    };
}

// DOM element creation

function createAnElement(document, qualifiedOrLocalName, nameSpace, prefix, is, synchronousCustomElements) {
    is = is || null;
    var result = null;
    var definition = lookupCustomElementDefinition(document, nameSpace, qualifiedOrLocalName, is);
    if (definition && definition.name != definition.localName) {
        result = originalCreateElement.call(document, qualifiedOrLocalName);
        setPrivateState(result, {
            customElementState: 'undefined',
            customElementDefinition: null,
            isValue: is
        });
        if (synchronousCustomElements) {
            upgradeElement(result, definition);
        } else {
            enqueueUpgradeReaction(result, definition);
        }
    } else if (definition) {
        if (synchronousCustomElements) {
            try {
                result = new definition.constructor();
                if (!(result instanceof HTMLElement)) {
                    throw new TypeError('Illegal constructor');
                }
                if (result.attributes.length !== 0 || result.hasChildNodes() || result.parentNode || result.ownerDocument !== document || result.namespaceURI !== htmlNamespace || result.localName !== qualifiedOrLocalName) {
                    var error = new Error('Invalid state manipulation during custom element construction');
                    error.name = 'NotSupportedError';
                    throw error;
                }
            } catch (error) {
                reportError(error);
                result = originalCreateElement.call(document, qualifiedOrLocalName);
                // should be HTMLUnknownElement already
                setPrivateState(result, {
                    customElementState: 'failed'
                });
            }
        } else {
            result = originalCreateElement.call(document, qualifiedOrLocalName);
            Object.setPrototypeOf(result, HTMLElement.prototype);
            enqueueUpgradeReaction(result, definition);
        }
    } else {
        result = nameSpace ? originalCreateElementNS.call(document, nameSpace, qualifiedOrLocalName) : originalCreateElement.call(document, qualifiedOrLocalName);
        // skip setting the custom element state to 'undefined' in order
        // to avoid unnecessary allocation.
    }
    return result;
}

function createElement(localName, options) {
    var nameSpace = null;
    //if (this instanceof HTMLDocument) {
    localName = localName.toLowerCase();
    nameSpace = htmlNamespace;
    //}
    var is = options ? options.is || null : null;
    var element = createAnElement(this, localName, nameSpace, null, is, true);
    if (is != null) {
        element.setAttribute('is', is);
    }
    return element;
}

function createElementNS(nameSpace, qualifiedName, options) {
    var is = options ? options.is || null : null;
    var element = createAnElement(this, qualifiedName, nameSpace, null, is, true);
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
    var nodeState = getPrivateState(node);
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

    var nameLength = localName.length;

    if (nameLength < 2) {
        return false;
    }

    var firstCode = localName.charCodeAt(0);
    if (firstCode < 0x61 /* a */ || firstCode > 0x7A /* z */) {
            return false;
        }

    var foundHyphen = false;

    for (var i = 1; i < nameLength; i++) {
        var code = localName.charCodeAt(i);
        if (code >= 0x61 /* a */ && code <= 0x7A /* z */) {
                continue;
            }
        if (code === 0x2D /* - */) {
                foundHyphen = true;
                continue;
            }
        if (code === 0x2E /* . */ || code === 0x5F /* _ */ || code === 0xB7 /* · */) {
                continue;
            }
        if (code >= 0x30 /* 0 */ && code <= 0x39 /* 9 */) {
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
    var registry = document.defaultView.customElements;
    var privateState = getPrivateState(registry);
    for (var i = 0; i < privateState.definitions.length; i++) {
        var definition = privateState.definitions[i];
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
    define: function define(name, constructor, options) {
        var privateState = getPrivateState(this);
        if (constructor !== constructor.prototype.constructor) {
            throw new TypeError('The passed argument must be a constructor');
        }
        if (!isValidCustomElementName(name)) {
            throw makeDOMException('SyntaxError');
        }
        // TODO: check for already defined name
        // TODO: check for already defined constructor
        var localName = name;
        var extensionOf = options ? options.extends : null;
        var htmlConstructor = window.HTMLElement;
        if (extensionOf != null) {
            if (isValidCustomElementName(extensionOf)) {
                throw makeDOMException('NotSupportedError');
            }
            var testElement = originalCreateElement.call(window.document, extensionOf);
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
        var caught = null;
        var observedAttributes = [];
        var lifecycleCallbacks = void 0;
        var nativeInterface = void 0;
        try {
            var prototype = constructor.prototype;
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
                var observedAttributesIterable = constructor.observedAttributes;
                if (observedAttributesIterable) {
                    observedAttributes = observedAttributesIterable.slice();
                }
            }
        } catch (error) {
            caught = error;
        }
        privateState.elementDefinitionIsRunning = false;
        if (caught) {
            throw caught;
        }
        var definition = {
            name: name,
            localName: localName,
            constructor: constructor,
            observedAttributes: observedAttributes,
            lifecycleCallbacks: lifecycleCallbacks,
            constructionStack: [],
            htmlConstructor: htmlConstructor
        };
        privateState.definitions.push(definition);
        var document = window.document;
        treeOrderShadowInclusiveForEach(document, function (node) {
            if (node.nodeType === Node.ELEMENT_NODE && node.namespaceURI === htmlNamespace && node.localName === localName) {
                if (extensionOf) {
                    var nodeState = getPrivateState(node);
                    if (nodeState.isValue !== extensionOf) {
                        return;
                    }
                }
                enqueueUpgradeReaction(element, definition);
            }
        });
        // 16. when-defined promise map
        // TODO: impl
    },
    get: function get(name) {
        var privateState = getPrivateState(this);
        for (var i = 0; i < privateState.definitions.length; i++) {
            var definition = privateState.definitions[i];
            if (definition.name === name) {
                return definition.constructor;
            }
        }
        return undefined;
    },
    whenDefined: function whenDefined(name) {
        // TODO: impl
        throw new Error('Not implemented yet');
    }
};

function upgradeElement(element, definition) {
    // https://html.spec.whatwg.org/multipage/scripting.html#concept-upgrade-an-element
    var elementState = getPrivateState(element) || setPrivateState(element, { reactionQueue: [] });
    if (elementState.customElementState === 'custom' || elementState.customElementState === 'failed') {
        return;
    }
    var attributes = element.attributes;
    for (var i = 0; i < attributes.length; i++) {
        var attribute = attributes[i];
        var _args = [attribute.localName, null, attribute.value, attribute.namespaceURI];
        enqueueCallbackReaction(element, 'attributeChangedCallback', _args);
    }
    if (element.isConnected) {
        enqueueCallbackReaction(element, 'connectedCallback', []);
    }
    definition.constructionStack.push(element);
    var caught = null;
    try {
        var constructResult = new definition.constructor();
        if (constructResult !== element) {
            throw makeDOMException('InvalidStateError');
        }
    } catch (error) {
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
    var elementState = getPrivateState(element);
    var isValue = null;
    if (elementState) {
        isValue = elementState.isValue;
    }
    var definition = lookupCustomElementDefinition(element.ownerDocument, element.namespaceURI, element.localName, isValue);
    if (definition) {
        enqueueUpgradeReaction(element, definition);
    }
}

function enqueueElementOnAppropriateElementQueue(element) {
    var installation = getInstallation(window);
    if (!installation) {
        return;
    }
    // https://html.spec.whatwg.org/multipage/scripting.html#enqueue-an-element-on-the-appropriate-element-queue
    // 1. If the custom element reactions stack is empty, then:
    var stack = installation.customElementsReactionStack;
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
    var elementState = getPrivateState(element);
    var definition = elementState.customElementDefinition;
    var callback = definition.lifecycleCallbacks[callbackName];
    if (callback == null) {
        return;
    }
    if (callbackName === 'attributeChangedCallback') {
        var attributeName = args[0];
        if (definition.observedAttributes.indexOf(attributeName) === -1) {
            return;
        }
    }
    if (!elementState.reactionQueue) {
        elementState.reactionQueue = [];
    }
    elementState.reactionQueue.push({ type: callbackReactionType, callback: callback, args: args });
    enqueueElementOnAppropriateElementQueue(element);
}

function enqueueUpgradeReaction(element, definition) {
    // https://html.spec.whatwg.org/multipage/scripting.html#enqueue-a-custom-element-upgrade-reaction
    var elementState = getPrivateState(element) || setPrivateState(element, { reactionQueue: [] });
    elementState.customElementDefinition = definition;
    elementState.reactionQueue.push({ type: upgradeReactionType, definition: definition });
    enqueueElementOnAppropriateElementQueue(element);
}

function invokeReactions(queue) {
    // https://html.spec.whatwg.org/multipage/scripting.html#invoke-custom-element-reactions
    for (var i = 0; i < queue.length; i++) {
        var _element2 = queue[i];
        var reactions = getPrivateState(_element2).reactionQueue;
        while (reactions.length) {
            try {
                var splicedOut = reactions.splice(0, 1);
                var reaction = splicedOut[0];
                switch (reaction.type) {
                    case upgradeReactionType:
                        upgradeElement(_element2, reaction.definition);
                        break;
                    case callbackReactionType:
                        reaction.callback.apply(_element2, reaction.args);
                        break;
                }
            } catch (error) {
                reportError(error);
            }
        }
    }
}

function executeCEReactions(callback) {
    var installation = getInstallation(window);
    if (installation) {
        var stack = installation.customElementsReactionStack;
        stack.push([]);
        var result = callback();
        invokeReactions(stack.pop());
        return result;
    }
    return callback();
}

// Utility functions

function makeDOMException(name, message) {
    try {
        var sacrifice = originalCreateElement.call(window.document, 'div');
        descriptors.Node.appendChild.call(sacrifice, sacrifice);
    } catch (error) {
        error.message = message;
        error.name = name;
        return error;
    }
}

function getCallback(prototype, callbackName) {
    var callback = prototype[callbackName];
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
    var shadowRoot = node.shadowRoot;
    if (shadowRoot) {
        treeOrderShadowInclusiveForEach(shadowRoot, callback);
    }
    var childNodes = node.childNodes;
    for (var i = 0; i < childNodes.length; i++) {
        treeOrderShadowInclusiveForEach(childNodes[i], callback);
    }
}

function reportError(error) {
    if ('console' in window && 'error' in window.console) {
        window.console.error(error);
    }
}

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _utils = require('../utils.js');

var $ = _interopRequireWildcard(_utils);

var _customElements = require('../custom-elements.js');

var _customElements2 = _interopRequireDefault(_customElements);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// https://dom.spec.whatwg.org/#interface-attr

exports.default = {

    get value() {
        return $.descriptors.Attr.value.get.call(this);
    },

    set value(value) {
        var _this = this;

        return _customElements2.default.executeCEReactions(function () {
            $.setExistingAttributeValue(_this, value);
        });
    }

};

},{"../custom-elements.js":1,"../utils.js":28}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _utils = require('../utils.js');

var $ = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var getData = $.descriptors.CharacterData.data.get; // https://dom.spec.whatwg.org/#interface-characterdata

exports.default = {

    get data() {
        return getData.call(this);
    },

    set data(value) {
        var length = getData.call(this).length;
        $.replaceData(this, 0, length, value);
    },

    appendData: function appendData(data) {
        var length = getData.call(this).length;
        $.replaceData(this, length, 0, data);
    },
    insertData: function insertData(offset, data) {
        $.replaceData(this, offset, 0, data);
    },
    deleteData: function deleteData(offset, count) {
        $.replaceData(this, offset, count, '');
    },
    replaceData: function replaceData(offset, count, data) {
        $.replaceData(this, offset, count, data);
    }
};

},{"../utils.js":28}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = $CustomEvent;

var _utils = require('../utils.js');

var $ = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function $CustomEvent(type, init) {
    var bubbles = false;
    var cancelable = false;
    var composed = false;
    var detail = null;
    if (init) {
        bubbles = init.bubbles === true;
        cancelable = init.cancelable === true;
        composed = init.composed === true;
        detail = init.detail || null;
    }
    var event = document.createEvent('CustomEvent');
    event.initCustomEvent(type, bubbles, cancelable, detail);
    $.setShadowState(event, { composed: composed });
    return event;
} // https://dom.spec.whatwg.org/#interface-customevent

$CustomEvent.prototype = window.CustomEvent.prototype;

},{"../utils.js":28}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getOrCreateDOMTokenList = getOrCreateDOMTokenList;

var _utils = require('../utils.js');

var $ = _interopRequireWildcard(_utils);

var _customElements = require('../custom-elements.js');

var _customElements2 = _interopRequireDefault(_customElements);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// https://dom.spec.whatwg.org/#interface-domtokenlist

exports.default = {

    get length() {
        var state = $.getShadowState(this);
        return state.tokens.length;
    },

    // TODO: Caveat about indexer expressions?
    item: function item(index) {
        var state = $.getShadowState(this);
        return index >= state.tokens.length ? null : state.tokens[index];
    },
    contains: function contains(token) {
        var state = $.getShadowState(this);
        return state.tokens.indexOf(token) !== -1;
    },
    add: function add() {
        var _this = this;

        for (var _len = arguments.length, tokens = Array(_len), _key = 0; _key < _len; _key++) {
            tokens[_key] = arguments[_key];
        }

        return _customElements2.default.executeCEReactions(function () {
            validateTokens(tokens);
            var state = $.getShadowState(_this);
            for (var i = 0; i < tokens.length; i++) {
                var token = tokens[i];
                var index = state.tokens.indexOf(token);
                if (index === -1) {
                    state.tokens.push(token);
                }
            }
            state.tokens.sort();
            $.setAttributeValue(state.element, state.localName, state.tokens.join(' '));
        });
    },
    remove: function remove() {
        var _this2 = this;

        for (var _len2 = arguments.length, tokens = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            tokens[_key2] = arguments[_key2];
        }

        return _customElements2.default.executeCEReactions(function () {
            validateTokens(tokens);
            var state = $.getShadowState(_this2);
            for (var i = 0; i < tokens.length; i++) {
                var token = tokens[i];
                var index = state.tokens.indexOf(token);
                if (index !== -1) {
                    state.tokens.splice(index, 1);
                }
            }
            $.setAttributeValue(state.element, state.localName, state.tokens.join(' '));
        });
    },
    toggle: function toggle(token, force) {
        var _this3 = this,
            _arguments = arguments;

        return _customElements2.default.executeCEReactions(function () {
            validateToken(token);
            var state = $.getShadowState(_this3);
            var index = state.tokens.indexOf(token);
            if (index !== -1) {
                if (_arguments.length === 1 || force === false) {
                    state.tokens.splice(index, 1);
                    $.setAttributeValue(state.element, state.localName, state.tokens.join(' '));
                    return false;
                } else {
                    return true;
                }
            } else {
                if (force === false) {
                    return false;
                } else {
                    state.tokens.push(token);
                    state.tokens.sort();
                    $.setAttributeValue(state.element, state.localName, state.tokens.join(' '));
                    return true;
                }
            }
        });
    },
    replace: function replace(token, newToken) {
        var _this4 = this;

        return _customElements2.default.executeCEReactions(function () {
            validateToken(token);
            validateToken(newToken);
            var state = $.getShadowState(_this4);
            var index = state.tokens.indexOf(token);
            if (index === -1) {
                return;
            }
            state.tokens[index] = newToken;
            state.tokens.sort();
            $.setAttributeValue(state.element, state.localName, state.tokens.join(' '));
        });
    },


    get value() {
        var state = $.getShadowState(this);
        return state.element.getAttribute(state.localName) || '';
    },

    set value(value) {
        var _this5 = this;

        return _customElements2.default.executeCEReactions(function () {
            var state = $.getShadowState(_this5);
            $.setAttributeValue(state.element, state.localName, value);
            // TODO: Remove usage of slice in favor of direct parse
            state.tokens = $.slice(_this5);
        });
    }

};


function validateTokens(tokens) {
    for (var i = 0; i < tokens.length; i++) {
        validateToken(tokens[i]);
    }
}

function validateToken(token) {
    if (token == '') {
        throw $.makeError('SyntaxError');
    }
    if (/\s/.test(token)) {
        throw $.makeError('InvalidCharacterError');
    }
}

function createDOMTokenList(element, localName) {
    // TODO: run the steps per the DOM spec for 'when a DOMTokenList is created'
    var originalValue = element.getAttribute(localName);
    var tokens = originalValue ? originalValue.split(/\s/).sort() : [];
    var tokenList = Object.create(DOMTokenList.prototype);
    $.setShadowState(tokenList, { element: element, localName: localName, tokens: tokens });
    return tokenList;
}

function getOrCreateDOMTokenList(element, localName) {
    var elementState = $.getShadowState(element) || $.setShadowState(element, { tokenLists: {} });
    if (!elementState.tokenLists) {
        elementState.tokenLists = {};
    }
    var tokenList = void 0;
    if (tokenList = elementState.tokenLists[localName]) {
        return tokenList;
    }
    return elementState.tokenLists[localName] = createDOMTokenList(element, localName);
}

},{"../custom-elements.js":1,"../utils.js":28}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _utils = require('../utils.js');

var $ = _interopRequireWildcard(_utils);

var _customElements = require('../custom-elements.js');

var _customElements2 = _interopRequireDefault(_customElements);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// https://dom.spec.whatwg.org/#interface-document

exports.default = {

    // TODO: tests
    getElementsByTagName: function getElementsByTagName(qualifiedName) {
        var results = $.descriptors.Document.getElementsByTagName.value.call(this, qualifiedName);
        return $.filterByRoot(this, results);
    },


    // TODO: tests
    getElementsByTagNameNS: function getElementsByTagNameNS(ns, localName) {
        var results = $.descriptors.Document.getElementsByTagNameNS.value.call(this, ns, localName);
        return $.filterByRoot(this, results);
    },


    // TODO: tests
    getElementsByClassName: function getElementsByClassName(names) {
        var results = $.descriptors.Document.getElementsByClassName.value.call(this, name);
        return $.filterByRoot(this, results);
    },


    // TODO: tests
    importNode: function importNode(node, deep) {
        var _this = this;

        return _customElements2.default.executeCEReactions(function () {
            if (node.nodeType === Node.DOCUMENT_NODE || $.isShadowRoot(node)) {
                throw $.makeError('NotSupportedError');
            }

            return $.clone(node, _this, deep);
        });
    },


    // TODO: tests
    adoptNode: function adoptNode(node) {
        var _this2 = this;

        return _customElements2.default.executeCEReactions(function () {
            return $.adopt(node, _this2);
        });
    }
};

},{"../custom-elements.js":1,"../utils.js":28}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _utils = require('../utils.js');

var $ = _interopRequireWildcard(_utils);

var _customElements = require('../custom-elements.js');

var _customElements2 = _interopRequireDefault(_customElements);

var _ShadowRoot = require('../interfaces/ShadowRoot.js');

var _ShadowRoot2 = _interopRequireDefault(_ShadowRoot);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

exports.default = {

    // TODO: tests
    get attributes() {
        var attributes = $.descriptors.Element.attributes.get.call(this);
        var shadowState = $.getShadowState(attributes);
        if (!shadowState) {
            $.setShadowState(attributes, { element: this });
        }
        return attributes;
    },

    // TODO: tests
    setAttribute: function setAttribute(qualifiedName, value) {
        var _this = this;

        return _customElements2.default.executeCEReactions(function () {
            var attribute = $.descriptors.Element.attributes.get.call(_this).getNamedItem(qualifiedName);
            if (!attribute) {
                attribute = _this.ownerDocument.createAttribute(qualifiedName);
                $.descriptors.Attr.value.set.call(attribute, value);
                $.appendAttribute(attribute, _this);
                return;
            }
            $.changeAttribute(attribute, _this, value);
        });
    },


    // TODO: tests
    setAttributeNS: function setAttributeNS(namespace, qualifiedName, value) {
        var _this2 = this;

        return _customElements2.default.executeCEReactions(function () {
            var dummy = document.createAttributeNS(namespace, qualifiedName);
            $.setAttributeValue(_this2, dummy.localName, value, dummy.prefix, dummy.namespaceURI);
        });
    },


    // TODO: tests
    removeAttribute: function removeAttribute(qualifiedName) {
        var _this3 = this;

        return _customElements2.default.executeCEReactions(function () {
            $.removeAttributeByName(qualifiedName, _this3);
        });
    },


    // TODO: tests
    removeAttributeNS: function removeAttributeNS(namespace, localName) {
        var _this4 = this;

        return _customElements2.default.executeCEReactions(function () {
            $.removeAttributeByNamespace(namespace, localName, _this4);
        });
    },


    // TODO: tests
    setAttributeNode: function setAttributeNode(attr) {
        var _this5 = this;

        return _customElements2.default.executeCEReactions(function () {
            return $.setAttribute(attr, _this5);
        });
    },


    // TODO: tests
    setAttributeNodeNS: function setAttributeNodeNS(attr) {
        var _this6 = this;

        return _customElements2.default.executeCEReactions(function () {
            return $.setAttribute(attr, _this6);
        });
    },


    // TODO: tests
    removeAttributeNode: function removeAttributeNode(attr) {
        var _this7 = this;

        return _customElements2.default.executeCEReactions(function () {
            if (attr.ownerElement !== _this7) {
                throw $.makeError('NotFoundError');
            }
            $.removeAttribute(attr, _this7);
            return attr;
        });
    },
    attachShadow: function attachShadow(init) {
        // https://dom.spec.whatwg.org/#dom-element-attachshadow
        if (!init || init.mode !== 'open' && init.mode !== 'closed') {
            throw $.makeError('TypeError');
        }

        if (this.namespaceURI !== 'http://www.w3.org/1999/xhtml') {
            throw $.makeError('NotSupportedError');
        }

        switch (this.localName) {
            case "article":case "aside":case "blockquote":case "body":
            case "div":case "footer":case "h1":case "h2":case "h3":
            case "h4":case "h5":case "h6":case "header":case "main":
            case "nav":case "p":case "section":case "span":
                break;
            default:
                if (_customElements2.default.isValidCustomElementName(this.localName)) {
                    break;
                }
                throw $.makeError('NotSupportedError');
        }

        if (this.shadowRoot) {
            throw $.makeError('InvalidStateError');
        }

        var shadow = this.ownerDocument.createDocumentFragment();

        $.extend(shadow, _ShadowRoot2.default);

        $.setShadowState(shadow, {
            host: this,
            mode: init.mode,
            childNodes: []
        });

        var originalChildNodes = $.descriptors.Node.childNodes.get.call(this);
        var removeChild = $.descriptors.Node.removeChild.value;
        var savedChildNodes = new Array(originalChildNodes.length);
        var firstChild = void 0;
        var i = 0;
        while (firstChild = originalChildNodes[0]) {
            var childState = $.getShadowState(firstChild) || $.setShadowState(firstChild, {});
            childState.parentNode = this;
            savedChildNodes[i++] = firstChild;
            removeChild.call(this, firstChild);
        }

        var hostState = $.getShadowState(this);
        if (!hostState) {
            hostState = {};
            $.setShadowState(this, hostState);
        }
        hostState.shadowRoot = shadow;
        hostState.childNodes = savedChildNodes;

        return shadow;
    },


    get shadowRoot() {
        // https://dom.spec.whatwg.org/#dom-element-shadowroot
        var shadowRoot = null;
        var shadowState = $.getShadowState(this);
        if (shadowState) {
            shadowRoot = shadowState.shadowRoot;
            if (!shadowRoot || shadowRoot.mode === 'closed') {
                return null;
            }
        }
        return shadowRoot;
    },

    // TODO: tests
    closest: function closest(selectors) {
        var element = this;

        do {
            if (element.matches(selectors)) {
                return element;
            }
        } while (element = element.parentElement);
    },


    // TODO: tests
    getElementsByTagName: function getElementsByTagName(qualifiedName) {
        var results = $.descriptors.Element.getElementsByTagName.value.call(this, qualifiedName);
        return $.filterByRoot(this, results);
    },


    // TODO: tests
    getElementsByTagNameNS: function getElementsByTagNameNS(ns, localName) {
        var results = $.descriptors.Element.getElementsByTagNameNS.value.call(this, ns, localName);
        return $.filterByRoot(this, results);
    },


    // TODO: tests
    getElementsByClassName: function getElementsByClassName(names) {
        var results = $.descriptors.Element.getElementsByClassName.value.call(this, name);
        return $.filterByRoot(this, results);
    },


    // TODO: tests
    insertAdjacentElement: function insertAdjacentElement(where, element) {
        var _this8 = this;

        return _customElements2.default.executeCEReactions(function () {
            // https://dom.spec.whatwg.org/#dom-element-insertadjacentelement
            return $.insertAdjacent(_this8, where, element);
        });
    },


    // TODO: tests
    insertAdjacentText: function insertAdjacentText(where, data) {
        // https://dom.spec.whatwg.org/#dom-element-insertadjacenttext
        var text = this.ownerDocument.createTextNode(data);
        $.insertAdjacent(this, where, text);
        return;
    },


    // https://w3c.github.io/DOM-Parsing/#extensions-to-the-element-interface

    // TODO: more thorough tests of the serialization
    get innerHTML() {
        // https://w3c.github.io/DOM-Parsing/#dom-element-innerhtml
        return $.serializeHTMLFragment(this);
    },

    // TODO: MutationObserver tests
    set innerHTML(value) {
        var _this9 = this;

        return _customElements2.default.executeCEReactions(function () {
            // https://w3c.github.io/DOM-Parsing/#dom-element-innerhtml
            var fragment = $.parseHTMLFragment(value, _this9);
            var content = _this9['content'];
            if (content instanceof DocumentFragment) {
                $.replaceAll(fragment, content);
            } else {
                $.replaceAll(fragment, _this9);
            }
        });
    },

    // TODO: tests
    get outerHTML() {
        // https://w3c.github.io/DOM-Parsing/#dom-element-outerhtml
        return $.serializeHTMLFragment({ childNodes: [this] });
    },

    // TODO: tests
    set outerHTML(value) {
        var _this10 = this;

        return _customElements2.default.executeCEReactions(function () {
            // https://w3c.github.io/DOM-Parsing/#dom-element-outerhtml
            var parent = _this10.parentNode;
            if (parent === null) {
                return;
            }
            if (parent.nodeType === Node.DOCUMENT_NODE) {
                throw $.makeError('NoModificationAllowedError');
            }
            if (parent.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
                parent = _this10.ownerDocument.createElement('body');
            }
            var fragment = $.parseHTMLFragment(value, parent);
            $.replace(_this10, fragment, _this10.parentNode);
        });
    },

    // TODO: tests
    insertAdjacentHTML: function insertAdjacentHTML(position, text) {
        var _this11 = this;

        return _customElements2.default.executeCEReactions(function () {
            // https://w3c.github.io/DOM-Parsing/#dom-element-insertadjacenthtml
            // We aren't going to go exactly by the books for this one.
            var fragment = $.parseHTMLFragment(text, _this11);
            $.insertAdjacent(_this11, position, fragment);
        });
    }
}; // https://dom.spec.whatwg.org/#interface-element

},{"../custom-elements.js":1,"../interfaces/ShadowRoot.js":17,"../utils.js":28}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.hasRelatedTarget = undefined;
exports.default = $Event;

var _utils = require('../utils.js');

var $ = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function $Event(type, init) {
    var bubbles = false;
    var cancelable = false;
    var composed = false;
    if (init) {
        bubbles = init.bubbles === true;
        cancelable = init.cancelable === true;
        composed = init.composed === true;
    }
    var event = document.createEvent('event');
    event.initEvent(type, bubbles, cancelable);
    $.setShadowState(event, { composed: composed });
    return event;
} // https://dom.spec.whatwg.org/#interface-event

$Event.prototype = {

    get currentTarget() {
        return $.getShadowState(this).currentTarget;
    },

    get target() {
        return $.getShadowState(this).target;
    },

    stopImmediatePropagation: function stopImmediatePropagation() {
        this.stopPropagation();
        $.getShadowState(this).stopImmediatePropagationFlag = true;
    },
    composedPath: function composedPath() {
        // https://dom.spec.whatwg.org/#dom-event-composedpath

        // 1. Let composedPath be a new empty list.
        var composedPath = [];

        // 2. Let currentTarget be context object’s currentTarget attribute value.
        var currentTarget = this.currentTarget;

        // 3. For each tuple in context object’s path:
        var path = $.getShadowState(this).path;

        if (path) {
            var c = 0;
            for (var i = 0; i < path.length; i++) {
                var item = path[i][0];
                if (currentTarget instanceof Window) {
                    if (!(item instanceof Node) || !$.closedShadowHidden(item, $.shadowIncludingRoot(item))) {
                        composedPath[c++] = item;
                    }
                } else if (currentTarget instanceof Node) {
                    if (!$.closedShadowHidden(item, currentTarget)) {
                        composedPath[c++] = item;
                    }
                } else {
                    composedPath[c++] = item;
                }
            }
        }

        // 4. return composedPath.
        return composedPath;
    },


    get composed() {
        // TODO: Compare against the actual prototype instead of just the type strings
        return $.getShadowState(this).composed || builtInComposedEvents.indexOf(this.type) !== -1;
    }

};

// FocusEvent:
// relatedTarget will be the element losing or gaining focus
// MouseEvent:
// relatedTarget will be the element being moved into or out of
var hasRelatedTarget = exports.hasRelatedTarget = {

    get relatedTarget() {
        return $.getShadowState(this).relatedTarget;
    }

};

var builtInComposedEvents = [
// FocusEvent
'blur', 'focus', 'focusin', 'focusout',
// MouseEvent
'click', 'dblclick', 'mousedown', 'mouseenter', 'mouseleave', 'mousemove', 'mouseout', 'mouseover', 'mouseup',
// WheelEvent
'wheel',
// InputEvent
'beforeinput', 'input',
// KeyboardEvent
'keydown', 'keyup',
// CompositionEvent
'compositionstart', 'compositionupdate', 'compositionend',
// Legacy UIEvent
'DOMActivate',
// Legacy FocusEvent
'DOMFocusIn', 'DOMFocusOut',
// Legacy KeyboardEvent
'keypress'];

},{"../utils.js":28}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (base) {

    var native = {
        addEventListener: base.prototype.addEventListener,
        removeEventListener: base.prototype.removeEventListener,
        dispatchEvent: base.prototype.dispatchEvent
    };

    return {
        addEventListener: function addEventListener(type, callback, options) {
            if (typeof callback !== 'function') {
                return;
            }

            var listener = { callback: callback };
            var capture = false;

            if (typeof options === 'boolean') {
                capture = options;
            } else if (typeof options !== 'undefined') {
                capture = options.capture === true;
                listener.once = options.once === true;
                // we don't do anything with passive.
                listener.passive = options.passive === true;
            }

            var collection = EventListenerCollection.get(this, type, capture) || EventListenerCollection.create(this, type, capture);

            collection.addListener(this, listener);
            collection.attach(native.addEventListener);
        },
        removeEventListener: function removeEventListener(type, callback, options) {
            if (typeof callback !== 'function') {
                return;
            }

            var listener = { callback: callback };
            var capture = false;

            if (typeof options === 'boolean') {
                capture = options;
            } else if (typeof options !== 'undefined') {
                capture = options.capture === true;
            }

            var collection = EventListenerCollection.get(this, type, capture);

            if (!collection) {
                return;
            }

            collection.removeListener(this, listener);

            if (collection.empty) {
                collection.detach(native.removeEventListener);
            }
        }
    };
};

var _utils = require('../utils.js');

var $ = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// https://dom.spec.whatwg.org/#interface-eventtarget

var EventListenerCollection = function EventListenerCollection(target, type, capture) {
    var _this = this;

    this.target = target;
    this.type = type;
    this.capture = capture;

    this.hostListeners = [];
    this.shadowListeners = [];

    this.callback = function (event) {
        var shadowRoot = null;
        var targetState = $.getShadowState(target);
        if (targetState) {
            shadowRoot = targetState.shadowRoot;
        }
        switch (event.eventPhase) {
            case Event.prototype.CAPTURING_PHASE:
                _this.invokeListeners(event, _this.target, _this.hostListeners);
                if (shadowRoot) {
                    _this.invokeListeners(event, shadowRoot, _this.shadowListeners);
                }
                break;
            case Event.prototype.AT_TARGET:
                var nativeTarget = $.descriptors.Event.target.get.call(event);
                _this.invokeListeners(event, nativeTarget, _this.getListeners(nativeTarget));
                break;
            case Event.prototype.BUBBLING_PHASE:
                if (shadowRoot) {
                    _this.invokeListeners(event, shadowRoot, _this.shadowListeners);
                }
                _this.invokeListeners(event, _this.target, _this.hostListeners);
                break;
        }
    };
};

EventListenerCollection.get = function (target, type, capture) {
    var targetState = $.getShadowState(target);
    var nativeTarget = target;
    var nativeTargetState = targetState;
    if (targetState && targetState.host) {
        nativeTarget = targetState.host;
        nativeTargetState = $.getShadowState(nativeTarget);
    }
    if (!nativeTargetState || !nativeTargetState.listeners) {
        return null;
    }
    var collections = nativeTargetState.listeners;
    for (var i = 0; i < collections.length; i++) {
        var collection = collections[i];
        if (collection.target === nativeTarget && collection.type === type && collection.capture === capture) {
            return collection;
        }
    }
    return null;
};

EventListenerCollection.create = function (target, type, capture) {
    var targetState = $.getShadowState(target);
    var nativeTarget = target;
    var nativeTargetState = targetState;
    if (targetState && targetState.host) {
        nativeTarget = targetState.host;
        nativeTargetState = $.getShadowState(nativeTarget);
    }
    if (!nativeTargetState) {
        nativeTargetState = $.setShadowState(nativeTarget, { listeners: [] });
    } else if (!nativeTargetState.listeners) {
        nativeTargetState.listeners = [];
    }
    var collection = new EventListenerCollection(nativeTarget, type, capture);
    nativeTargetState.listeners.push(collection);
    return collection;
};

EventListenerCollection.prototype = {

    get empty() {
        return this.hostListeners.length === 0 && this.shadowListeners.length === 0;
    },

    getListeners: function getListeners(target) {
        var targetState = $.getShadowState(target);
        if (targetState && targetState.host) {
            return this.shadowListeners;
        }
        return this.hostListeners;
    },
    addListener: function addListener(target, listener) {
        var listeners = this.getListeners(target);

        for (var i = 0; i < listeners.length; i++) {
            if (listener.callback === listeners[i].callback) {
                return;
            }
        }

        listeners.push(listener);
    },
    removeListener: function removeListener(target, listener) {
        var listeners = this.getListeners(target);

        for (var i = 0; i < listeners.length; i++) {
            var other = listeners[i];
            if (listener.callback === other.callback) {
                listeners.splice(i, 1);
                break;
            }
        }
    },
    invokeListeners: function invokeListeners(event, currentTarget, listeners) {
        var eventState = $.getShadowState(event) || $.setShadowState(event, {});
        var path = eventState.calculatedPath;
        if (!path) {
            path = eventState.calculatedPath = calculatePath(event);
        }
        // if there is no target, the event is not composed and should be stopped
        var target = calculateTarget(currentTarget, path);
        if (!target) {
            event.stopImmediatePropagation();
        } else {
            var relatedTarget = calculateRelatedTarget(currentTarget, path);
            var remove = void 0;

            eventState.path = path;
            eventState.currentTarget = currentTarget;
            eventState.target = target;
            eventState.relatedTarget = relatedTarget;

            for (var i = 0; i < listeners.length; i++) {
                var listener = listeners[i];
                var result = listener.callback.call(currentTarget, event);
                if (listener.once) {
                    if (!remove) {
                        remove = [listener];
                    } else {
                        remove.push[listener];
                    }
                }
                if (eventState.stopImmediatePropagationFlag) {
                    break;
                }
            }

            eventState.path = null;
            eventState.currentTarget = null;

            if (remove) {
                for (var _i = 0; _i < remove.length; _i++) {
                    var index = listeners.indexOf(remove[_i]);
                    listeners.splice(index, 1);
                }
            }
        }
    },
    attach: function attach(descriptor) {
        descriptor.call(this.target, this.type, this.callback, this.capture);
    },
    detach: function detach(descriptor) {
        descriptor.call(this.target, this.type, this.callback, this.capture);
    }
};

function calculatePath(event) {
    // https://dom.spec.whatwg.org/#concept-event-dispatch

    var path = [];
    var p = 0;

    var target = $.descriptors.Event.target.get.call(event);

    var relatedTargetDescriptor = null;

    if (event instanceof FocusEvent) {
        relatedTargetDescriptor = $.descriptors.FocusEvent.relatedTarget;
    } else if (event instanceof MouseEvent) {
        relatedTargetDescriptor = $.descriptors.MouseEvent.relatedTarget;
    }

    // Skip (native)
    // 1. Set event’s dispatch flag.

    // 2. Let targetOverride be target, if legacy target override flag is 
    // not given, and target’s associated Document otherwise. 
    var targetOverride = target;

    // 3. Let relatedTarget be the result of retargeting event’s relatedTarget 
    // against target if event’s relatedTarget is non-null, and null otherwise.
    var originalRelatedTarget = null;
    var relatedTarget = null;
    if (relatedTargetDescriptor) {
        originalRelatedTarget = relatedTargetDescriptor.get.call(event);
        if (originalRelatedTarget) {
            relatedTarget = $.retarget(originalRelatedTarget, target);
        }
    }

    // Skip (native)
    // 4. If target is relatedTarget and target is not event’s relatedTarget, then return true.

    // 5. Append (target, targetOverride, relatedTarget) to event’s path.
    path[p++] = [target, targetOverride, relatedTarget];

    // Skip (native)
    // 6. Let isActivationEvent be true, if event is a MouseEvent object and 
    // event’s type attribute is "click", and false otherwise.
    // 7. Let activationTarget be target, if isActivationEvent is true and 
    //target has activation behavior, and null otherwise.

    // 8. Let parent be the result of invoking target’s get the parent with event.
    var parent = getTheParent(target, event, path);

    // 9. While parent is non-null:
    while (parent != null) {
        // 1. Let relatedTarget be the result of retargeting event’s relatedTarget
        // against parent if event’s relatedTarget is non-null, and null otherwise.
        if (originalRelatedTarget) {
            relatedTarget = $.retarget(originalRelatedTarget, parent);
        }
        // 2. If target’s root is a shadow-including inclusive ancestor of parent, then... 
        // append (parent, null, relatedTarget) to event’s path.
        if ($.shadowIncludingInclusiveAncestor($.root(target), parent)) {
            path[p++] = [parent, null, relatedTarget];
            parent = getTheParent(parent, event, path);
            continue;
        }
        // 3. Otherwise, if parent and relatedTarget are identical, then set parent to null.
        else if (parent === relatedTarget) {
                break;
            }
            // 4. Otherwise, set target to parent and then... 
            // append (parent, target, relatedTarget) to event’s path.
            else {
                    target = parent;
                    path[p++] = [parent, target, relatedTarget];
                    parent = getTheParent(parent, event, path);
                    continue;
                }
        // 5. If parent is non-null, then set parent to the result of 
        // invoking parent’s get the parent with event.
        // NOTE: This step was duplicated above to save some cycles.
    }

    return path;
}

function getTheParent(node, event, path) {
    // https://dom.spec.whatwg.org/#get-the-parent
    // Each EventTarget object also has an associated get the parent 
    // algorithm, which takes an event event, and returns an EventTarget 
    // object. Unless specified otherwise it returns null.

    // A node’s get the parent algorithm, given an event, 
    // returns the node’s assigned slot, if node is assigned, 
    // and node’s parent otherwise.

    // A document’s get the parent algorithm, given an event, returns null if event’s 
    // type attribute value is "load" or document does not have a browsing context, 
    // and the document’s associated Window object otherwise.

    // A shadow root’s get the parent algorithm, given an event, returns null if 
    // event’s composed flag is unset and shadow root is the root of event’s 
    // path’s first tuple’s item, and shadow root’s host otherwise.

    if (node instanceof Node) {
        if (node.nodeType === Node.DOCUMENT_NODE) {
            if (event.type === 'load') {
                // or browsing context?
                return null;
            }
            return node.defaultView;
        } else if ($.isShadowRoot(node)) {
            if (!event.composed) {
                var item = path[0][0];
                if ($.root(item) === node) {
                    return null;
                }
            }
            return node.host;
        }
        return node.assignedSlot || node.parentNode;
    }

    return null;
}

function calculateRelatedTarget(currentTarget, path) {
    for (var i = 0; i < path.length; i++) {
        var item = path[i][0];
        var relatedTarget = path[i][2];
        if (item === currentTarget) {
            return relatedTarget;
        }
    }
    return null;
}

function calculateTarget(currentTarget, path) {
    for (var i = 0; i < path.length; i++) {
        var item = path[i][0];
        if (item === currentTarget) {
            for (var j = i; j >= 0; j--) {
                var target = path[j][1];
                if (target != null) {
                    return target;
                }
            }
            return null;
        }
    }
    return null;
}

},{"../utils.js":28}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _utils = require('../utils.js');

var $ = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

exports.default = {

    // TODO: tests
    get name() {
        if (this.localName !== 'slot') {
            return;
        }

        return this.getAttribute('name');
    },

    // TODO: tests
    set name(value) {
        if (this.localName !== 'slot') {
            return;
        }

        $.setAttributeValue(this, 'name', value);
    },

    // TODO: tests
    assignedNodes: function assignedNodes(options) {
        if (this.localName !== 'slot') {
            return;
        }

        // https://html.spec.whatwg.org/multipage/scripting.html#dom-slot-assignednodes
        // The assignedNodes(options) method, when invoked, must run these steps:

        // 1. If the value of options's flatten member is false, then return this element's assigned nodes.
        if (!options || options.flatten !== true) {
            var assignedNodes = null;
            var shadowState = $.getShadowState(this);
            if (shadowState) {
                assignedNodes = shadowState.assignedNodes;
            }
            return assignedNodes || [];
        }

        // 2. Return the result of finding flattened slotables with this element.
        return $.findFlattenedSlotables(this);
    }
}; // https://html.spec.whatwg.org/multipage/scripting.html#the-slot-element

},{"../utils.js":28}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _utils = require('../utils.js');

var $ = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

exports.default = {

    // TODO: tests
    deleteCaption: function deleteCaption() {
        var caption = this.caption;
        if (caption) {
            $.remove(caption, this);
        }
    },


    // TODO: tests
    deleteTHead: function deleteTHead() {
        var tHead = this.tHead;
        if (tHead) {
            $.remove(tHead, this);
        }
    },


    // TODO: tests
    deleteTFoot: function deleteTFoot() {
        var tFoot = this.tFoot;
        if (tFoot) {
            $.remove(tFoot, this);
        }
    },


    // TODO: tests
    deleteRow: function deleteRow(index) {
        // https://www.w3.org/TR/html5/single-page.html#dom-table-deleterow
        if (index === -1) {
            index = this.rows.length - 1;
        }
        if (index < 0 || index >= this.rows.length) {
            throw $.makeError('IndexSizeError');
        }
        this.rows[index].remove();
    }
}; // https://www.w3.org/TR/html5/single-page.html#the-table-element

},{"../utils.js":28}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _utils = require('../utils.js');

var $ = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

exports.default = {

    // TODO: tests
    deleteCell: function deleteCell(index) {
        // https://www.w3.org/TR/html5/single-page.html#dom-tr-deletecell
        if (index === -1) {
            index = this.cells.length - 1;
        }
        if (index < 0 || index >= this.cells.length) {
            throw $.makeError('IndexSizeError');
        }
        this.cells[index].remove();
    }
}; // https://www.w3.org/TR/html5/single-page.html#the-tr-element

},{"../utils.js":28}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _utils = require('../utils.js');

var $ = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

exports.default = {

    // TODO: tests
    deleteRow: function deleteRow(index) {
        // https://www.w3.org/TR/html5/single-page.html#dom-tbody-deleterow
        if (index < 0 || index >= this.rows.length) {
            throw $.makeError('IndexSizeError');
        }
        this.rows[index].remove();
    }
}; // https://www.w3.org/TR/html5/single-page.html#the-tbody-element

},{"../utils.js":28}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = $MutationObserver;

var _utils = require('../utils.js');

var $ = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function $MutationObserver(callback) {
    var observer = $.createMutationObserver(callback);
    $.setShadowState(this, { observer: observer });
    observer.interface = this;
} // https://dom.spec.whatwg.org/#interface-mutationobserver

$MutationObserver.prototype = {
    observe: function observe(target, options) {
        $.getShadowState(this).observer.observe(target, options);
    },
    disconnect: function disconnect() {
        $.getShadowState(this).observer.disconnect();
    },
    takeRecords: function takeRecords() {
        var records = $.getShadowState(this).observer.queue;
        return records.splice(0, records.length);
    }
};

},{"../utils.js":28}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _utils = require('../utils.js');

var $ = _interopRequireWildcard(_utils);

var _customElements = require('../custom-elements.js');

var _customElements2 = _interopRequireDefault(_customElements);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// https://dom.spec.whatwg.org/#interface-namednodemap

exports.default = {

    // TODO: tests
    setNamedItem: function setNamedItem(attr) {
        var _this = this;

        return _customElements2.default.executeCEReactions(function () {
            var shadowState = $.getShadowState(_this);
            return $.setAttribute(attr, shadowState.element);
        });
    },


    // TODO: tests
    setNamedItemNS: function setNamedItemNS(attr) {
        var _this2 = this;

        return _customElements2.default.executeCEReactions(function () {
            var shadowState = $.getShadowState(_this2);
            return $.setAttribute(attr, shadowState.element);
        });
    },


    // TODO: tests
    removeNamedItem: function removeNamedItem(qualifiedName) {
        var _this3 = this;

        return _customElements2.default.executeCEReactions(function () {
            var shadowState = $.getShadowState(_this3);
            var attr = $.removeAttributeByName(qualifiedName, shadowState.element);
            if (!attr) {
                throw $.makeError('NotFoundError');
            }
            return attr;
        });
    },


    // TODO: tests
    removeNamedItemNS: function removeNamedItemNS(namespace, localName) {
        var _this4 = this;

        return _customElements2.default.executeCEReactions(function () {
            var shadowState = $.getShadowState(_this4);
            var attr = $.removeAttributeByNamespace(namespace, localName, shadowState.element);
            if (!attr) {
                throw $.makeError('NotFoundError');
            }
            return attr;
        });
    }
};

},{"../custom-elements.js":1,"../utils.js":28}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _utils = require('../utils.js');

var $ = _interopRequireWildcard(_utils);

var _customElements = require('../custom-elements.js');

var _customElements2 = _interopRequireDefault(_customElements);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// https://dom.spec.whatwg.org/#interface-node

exports.default = {

    get isConnected() {
        return $.shadowIncludingRoot(this).nodeType === Node.DOCUMENT_NODE;
    },

    getRootNode: function getRootNode(options) {
        var composed = options && options.composed === true;
        return composed ? $.shadowIncludingRoot(this) : $.root(this);
    },


    get parentNode() {
        var parentNode = void 0;
        var nodeState = $.getShadowState(this);
        if (nodeState) {
            parentNode = nodeState.parentNode;
        }

        return parentNode || $.descriptors.Node.parentNode.get.call(this);
    },

    get parentElement() {
        var parentNode = this.parentNode;
        if (parentNode && parentNode.nodeType === Node.ELEMENT_NODE) {
            return parentNode;
        }

        return null;
    },

    // TODO: tests
    hasChildNodes: function hasChildNodes() {
        var nodeState = $.getShadowState(this);
        if (nodeState) {
            var childNodes = nodeState.childNodes;
            if (childNodes) {
                return childNodes.length > 0;
            }
        }

        return $.descriptors.Node.hasChildNodes.value.call(this);
    },


    // TODO: tests
    get childNodes() {
        var nodeState = $.getShadowState(this);
        if (nodeState) {
            var childNodes = nodeState.childNodes;
            if (childNodes) {
                var childNodesLength = childNodes.length;
                var result = new Array(childNodesLength);
                for (var i = 0; i < childNodesLength; i++) {
                    result[i] = childNodes[i];
                }
                return result;
            }
        }

        return $.descriptors.Node.childNodes.get.call(this);
    },

    // TODO: tests
    get firstChild() {
        var nodeState = $.getShadowState(this);
        if (nodeState) {
            var childNodes = nodeState.childNodes;
            if (childNodes) {
                if (childNodes.length) {
                    return childNodes[0];
                }
                return null;
            }
        }

        return $.descriptors.Node.firstChild.get.call(this);
    },

    // TODO: tests
    get lastChild() {
        var nodeState = $.getShadowState(this);
        if (nodeState) {
            var childNodes = nodeState.childNodes;
            if (childNodes) {
                if (childNodes.length) {
                    return childNodes[childNodes.length - 1];
                }
                return null;
            }
        }

        return $.descriptors.Node.lastChild.get.call(this);
    },

    // TODO: tests
    get previousSibling() {
        var nodeState = $.getShadowState(this);
        if (nodeState) {
            var parentNode = nodeState.parentNode;
            if (parentNode) {
                var childNodes = $.getShadowState(parentNode).childNodes;
                var siblingIndex = childNodes.indexOf(this) - 1;
                return siblingIndex < 0 ? null : childNodes[siblingIndex];
            }
        }

        return $.descriptors.Node.previousSibling.get.call(this);
    },

    // TODO: tests
    get nextSibling() {
        var nodeState = $.getShadowState(this);
        if (nodeState) {
            var parentNode = nodeState.parentNode;
            if (parentNode) {
                var childNodes = $.getShadowState(parentNode).childNodes;
                var siblingIndex = childNodes.indexOf(this) + 1;
                return siblingIndex === childNodes.length ? null : childNodes[siblingIndex];
            }
        }

        return $.descriptors.Node.nextSibling.get.call(this);
    },

    // TODO: consider creating a raw property descriptor
    // that uses the native get instead of a pass-through function
    get nodeValue() {
        return $.descriptors.Node.nodeValue.get.call(this);
    },

    // TODO: MutationObserver tests
    set nodeValue(value) {
        var _this = this;

        return _customElements2.default.executeCEReactions(function () {
            switch (_this.nodeType) {
                case Node.ATTRIBUTE_NODE:
                    $.setExistingAttributeValue(_this, value);
                    break;
                case Node.TEXT_NODE:
                case Node.PROCESSING_INSTRUCTION_NODE:
                case Node.COMMENT_NODE:
                    var length = $.descriptors.CharacterData.data.get.call(_this).length;
                    $.replaceData(_this, 0, length, value);
                    break;
            }
        });
    },

    get textContent() {
        switch (this.nodeType) {
            case Node.DOCUMENT_FRAGMENT_NODE:
            case Node.ELEMENT_NODE:
                return elementTextContent(this);
            case Node.ATTRIBUTE_NODE:
                return $.descriptors.Attr.value.get.call(this);
            case Node.TEXT_NODE:
            case Node.PROCESSING_INSTRUCTION_NODE:
            case Node.COMMENT_NODE:
                return $.descriptors.CharacterData.data.get.call(this);
            default:
                return null;
        }
    },

    // TODO: MutationObserver tests
    set textContent(value) {
        var _this2 = this;

        return _customElements2.default.executeCEReactions(function () {
            switch (_this2.nodeType) {
                case Node.DOCUMENT_FRAGMENT_NODE:
                case Node.ELEMENT_NODE:
                    var node = null;
                    if (value !== '') {
                        node = _this2.ownerDocument.createTextNode(value);
                    }
                    $.replaceAll(node, _this2);
                    break;
                case Node.ATTRIBUTE_NODE:
                    $.setExistingAttributeValue(_this2, value);
                    break;
                case Node.TEXT_NODE:
                case Node.PROCESSING_INSTRUCTION_NODE:
                case Node.COMMENT_NODE:
                    $.replaceData(_this2, 0, _this2.data.length, value);
                    break;
            }
        });
    },

    // TODO: tests
    normalize: function normalize() {
        var _this3 = this;

        return _customElements2.default.executeCEReactions(function () {
            // https://dom.spec.whatwg.org/#dom-node-normalize
            // The normalize() method, when invoked, must run these steps 
            // for each descendant exclusive Text node node of context object:
            var childNodes = _this3.childNodes;
            var dataDescriptor = $.descriptors.CharacterData.data;
            for (var i = 0; i < childNodes.length; i++) {
                var childNode = childNodes[i];
                if (childNode.nodeType === Node.TEXT_NODE) {
                    var length = dataDescriptor.get.call(childNode).length;
                    if (length === 0) {
                        $.remove(childNode, _this3);
                        continue;
                    }
                    var data = '';
                    var contiguousTextNodes = new Array(childNodes.length);
                    var contiguousCount = 0;
                    var next = childNode;
                    while (next = next.nextSibling && next.nodeType === Node.TEXT_NODE) {
                        data += dataDescriptor.get.call(next);
                        contiguousTextNodes[contiguousCount++] = next;
                    }
                    $.replaceData(childNode, length, 0, data);
                    // TODO: (Range)
                    for (var j = 0; j < contiguousCount; j++) {
                        $.remove(contiguousTextNodes[j], _this3);
                    }
                } else {
                    childNode.normalize();
                }
            }
        });
    },


    // TODO: tests
    cloneNode: function cloneNode(deep) {
        var _this4 = this;

        return _customElements2.default.executeCEReactions(function () {
            // https://dom.spec.whatwg.org/#dom-node-clonenode
            // The cloneNode(deep) method, when invoked, must run these steps:

            // 1. If context object is a shadow root, then throw a NotSupportedError.
            if ($.isShadowRoot(_this4)) {
                throw $.makeError('NotSupportedError');
            }

            // 2. Return a clone of the context object, with the clone children flag set if deep is true.
            return $.clone(_this4, undefined, deep);
        });
    },


    // TODO: tests
    isEqualNode: function isEqualNode(other) {
        // https://dom.spec.whatwg.org/#dom-node-isequalnode
        // https://dom.spec.whatwg.org/#concept-node-equals
        if (!other) {
            return false;
        }

        if (this.nodeType !== other.nodeType) {
            return false;
        }

        var thisAttributes = void 0;
        var otherAttributes = void 0;

        switch (this.nodeType) {
            case Node.DOCUMENT_TYPE_NODE:
                if (this.name !== other.name || this.publicId !== other.publicId || this.systemId !== other.systemId) {
                    return false;
                }
                break;
            case Node.ELEMENT_NODE:
                if (this.namespaceURI !== other.namespaceURI || this.prefix !== other.prefix || this.localName !== other.localName) {
                    return false;
                }
                thisAttributes = $.descriptors.Element.attributes.get.call(this);
                otherAttributes = $.descriptors.Element.attributes.get.call(other);
                if (thisAttributes.length != otherAttributes.length) {
                    return false;
                }
                break;
            case Node.ATTRIBUTE_NODE:
                if (this.namespaceURI !== other.namespaceURI || this.localName !== other.localName || this.value !== other.value) {
                    return false;
                }
                break;
            case Node.PROCESSING_INSTRUCTION_NODE:
                if (this.target !== other.target || this.data !== other.data) {
                    return false;
                }
                break;
            case Node.TEXT_NODE:
            case Node.COMMENT_NODE:
                if (this.data !== other.data) {
                    return false;
                }
                break;
        }

        if (this.nodeType == Node.ELEMENT_NODE) {
            for (var i = 0; i < thisAttributes.length; i++) {
                var attr1 = thisAttributes[i];
                var attr2 = otherAttributes[attr1.name];
                if (attr1.value !== attr2.value) {
                    return false;
                }
            }
        }

        var childNodes1 = this.childNodes;
        var childNodes2 = other.childNodes;
        if (childNodes1.length !== other.childNodes.length) {
            return false;
        }

        for (var _i = 0; _i < childNodes1.length; _i++) {
            if (!childNodes1[_i].isEqualNode(childNodes2[_i])) {
                return false;
            }
        }

        return true;
    },


    // TODO: tests
    compareDocumentPosition: function compareDocumentPosition(other) {
        // https://dom.spec.whatwg.org/#dom-node-comparedocumentposition

        if (this === other) {
            return 0;
        }

        var node1 = other;
        var node2 = this;
        var attr1 = null;
        var attr2 = null;

        if (node1.nodeType == Document.prototype.ATTRIBUTE_NODE) {
            attr1 = node1;
            node1 = attr1.ownerElement;
        }

        if (node2.nodeType == Document.prototype.ATTRIBUTE_NODE) {
            attr2 = node2;
            node2 = attr2.ownerElement;

            if (attr1 && node1 && node2 === node1) {
                var attrs = node2.atttributes;
                for (var i = 0; i < attrs.length; i++) {
                    var attr = attrs[i];
                    if (attr.isEqualNode(attr1)) {
                        return Document.prototype.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC + Document.prototype.DOCUMENT_POSITION_PRECEDING;
                    } else if (attr.isEqualNode(attr2)) {
                        return Document.prototype.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC + Document.prototype.DOCUMENT_POSITION_FOLLOWING;
                    }
                }
            }
        }

        if (!node1 || !node2 || $.root(node1) !== $.root(node2)) {
            return Document.prototype.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC + Document.prototype.DOCUMENT_POSITION_FOLLOWING + Document.prototype.DOCUMENT_POSITION_DISCONNECTED;
        }

        if (ancestorOf(node2, node1) || node1 === node2 && attr2) {
            return Document.prototype.DOCUMENT_POSITION_CONTAINS + Document.prototype.DOCUMENT_POSITION_PRECEDING;
        }

        if (ancestorOf(node1, node2) || node1 === node2 && attr1) {
            return Document.prototype.DOCUMENT_POSITION_CONTAINS + Document.prototype.DOCUMENT_POSITION_FOLLOWING;
        }

        if (preceding(node1, node2)) {
            return Document.prototype.DOCUMENT_POSITION_PRECEDING;
        }

        return Document.prototype.DOCUMENT_POSITION_FOLLOWING;
    },


    // TODO: tests
    contains: function contains(node) {
        // https://dom.spec.whatwg.org/#dom-node-contains

        var parent = node.parentNode;

        if (!parent) {
            return false;
        }

        do {
            if (parent === this) {
                return true;
            }
        } while (parent = parent.parentNode);

        return false;
    },


    // TODO: tests
    insertBefore: function insertBefore(node, child) {
        var _this5 = this;

        return _customElements2.default.executeCEReactions(function () {
            // https://dom.spec.whatwg.org/#dom-node-insertbefore
            // The insertBefore(node, child) method, when invoked, must return the result 
            // of pre-inserting node into context object before child.
            return $.preInsert(node, _this5, child);
        });
    },


    // TODO: tests
    appendChild: function appendChild(node) {
        var _this6 = this;

        return _customElements2.default.executeCEReactions(function () {
            // https://dom.spec.whatwg.org/#dom-node-appendchild
            // The appendChild(node) method, when invoked, must return the result of 
            // appending node to context object.
            return $.append(node, _this6);
        });
    },


    // TODO: tests
    replaceChild: function replaceChild(node, child) {
        var _this7 = this;

        return _customElements2.default.executeCEReactions(function () {
            // https://dom.spec.whatwg.org/#dom-node-replacechild
            // The replaceChild(node, child) method, when invoked, must return the 
            // result of replacing child with node within context object.
            return $.replace(child, node, _this7);
        });
    },


    // TODO: tests
    removeChild: function removeChild(child) {
        var _this8 = this;

        return _customElements2.default.executeCEReactions(function () {
            // https://dom.spec.whatwg.org/#dom-node-removechild
            // The removeChild(child) method, when invoked, must return the result of 
            // pre-removing child from context object.
            return $.preRemove(child, _this8);
        });
    }
};


function ancestorOf(node, ancestor) {
    var parent = node.parentNode;

    do {
        if (parent === ancestor) {
            return true;
        }
    } while (parent = parent.parentNode);

    return false;
}

function preceding(element1, element2) {
    function precedingSiblings(parent, sibling1, sibling2) {
        var siblings = parent.childNodes;
        for (var _i2 = 0; _i2 < siblings.length; _i2++) {
            var sibling = siblings[_i2];
            if (sibling === sibling1) {
                return true;
            } else if (sibling === sibling2) {
                return false;
            }
        }
    }

    // Check if they're already siblings.
    var ancestor1 = element1.parentNode;
    var ancestor2 = element2.parentNode;

    if (ancestor1 === ancestor2) {
        return precedingSiblings(element1, element2);
    }

    // Find the closest common ancestor.
    var ancestors1 = [ancestor1];
    var ancestors2 = [ancestor2];

    while (ancestor1 = ancestor1.parentNode) {
        ancestors1.push(ancestor1);
    }

    while (ancestor2 = ancestor2.parentNode) {
        ancestors2.push(ancestor2);
    }

    ancestors1.reverse();
    ancestors2.reverse();

    var diff = Math.abs(ancestors1.length - ancestors2.length);
    var min = Math.min(ancestors1.length, ancestors2.length);

    var i = 0;
    while (ancestors1[i] === ancestors2[i]) {
        i++;
    }

    return precedingSiblings(ancestors1[i - 1], ancestors1[i], ancestors2[i]);
}

function elementTextContent(element) {
    var result = '';
    var childNodes = element.childNodes;
    for (var i = 0; i < childNodes.length; i++) {
        var childNode = childNodes[i];
        switch (childNode.nodeType) {
            case Node.ELEMENT_NODE:
                result += elementTextContent(childNode);
                break;
            case Node.TEXT_NODE:
                result += $.descriptors.CharacterData.data.get.call(childNode);
                break;
        }
    }
    return result;
}

},{"../custom-elements.js":1,"../utils.js":28}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _utils = require('../utils.js');

var $ = _interopRequireWildcard(_utils);

var _customElements = require('../custom-elements.js');

var _customElements2 = _interopRequireDefault(_customElements);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// https://dom.spec.whatwg.org/#interface-shadowroot
// https://www.w3.org/TR/shadow-dom/#the-shadowroot-interface

exports.default = {

    get nodeName() {
        return '#shadow-root';
    },

    get mode() {
        return $.getShadowState(this).mode;
    },

    get host() {
        return $.getShadowState(this).host;
    },

    // TODO: tests
    get innerHTML() {
        return $.serializeHTMLFragment(this);
    },

    // TODO: tests
    set innerHTML(value) {
        var _this = this;

        return _customElements2.default.executeCEReactions(function () {
            var fragment = $.parseHTMLFragment(value, _this);
            $.replaceAll(fragment, _this);
        });
    }

};

},{"../custom-elements.js":1,"../utils.js":28}],18:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _utils = require('../utils.js');

var $ = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

exports.default = {

    // TODO: tests
    splitText: function splitText(offset) {
        var length = this.length;
        if (offset > length) {
            throw $.makeError('IndexSizeError');
        }
        var count = length - offset;
        var newData = this.data.slice(offset, count);
        var newNode = this.ownerDocument.createTextNode(newData);
        var parent = this.parentNode;
        if (parent) {
            $.insert(newNode, parent, this.nextSibling);
            // TODO: (Range)
        }
        $.replaceData(this, offset, count, '');
        // TODO: (Range)
        // if (!parent) { }
        return newNode;
    }
}; // https://dom.spec.whatwg.org/#interface-text

},{"../utils.js":28}],19:[function(require,module,exports){
'use strict';

var _shadowDom = require('./shadow-dom.js');

var _shadowDom2 = _interopRequireDefault(_shadowDom);

var _customElements = require('./custom-elements.js');

var _customElements2 = _interopRequireDefault(_customElements);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var installShadowDom = false;
var installCustomElements = false;

if (window['forceShadowDomPolyfill'] || !_shadowDom2.default.nativeSupport) {
    installShadowDom = true;
}

if (window['forceCustomElementsPolyfill'] || !_customElements2.default.nativeSupport) {
    installShadowDom = true;
    installCustomElements = true;
}

if (installShadowDom) {
    _shadowDom2.default.install();
    window.shadowDomPolyfilled = true;
}

if (installCustomElements) {
    _customElements2.default.install();
    window.customElementsPolyfilled = true;
} else {
    // TODO: Offer a way to opt out if desired
    _customElements2.default.shimHtmlConstructors();
}

},{"./custom-elements.js":1,"./shadow-dom.js":27}],20:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (base) {

    return {

        // TODO: tests
        before: function before() {
            var _this = this;

            for (var _len = arguments.length, nodes = Array(_len), _key = 0; _key < _len; _key++) {
                nodes[_key] = arguments[_key];
            }

            return _customElements2.default.executeCEReactions(function () {
                // https://dom.spec.whatwg.org/#dom-childnode-before
                // The before(nodes) method, when invoked, must run these steps:

                // 1. Let parent be context object’s parent.
                var parent = _this.parentNode;

                // 2. If parent is null, terminate these steps.
                if (!parent) {
                    return;
                }

                // 3. Let viablePreviousSibling be context object’s first preceding 
                // sibling not in nodes, and null otherwise.
                var viablePreviousSibling = _this.previousSibling;
                while (viablePreviousSibling && nodes.indexOf(viablePreviousSibling) !== -1) {
                    viablePreviousSibling = viablePreviousSibling.previousSibling;
                }

                // 4. Let node be the result of converting nodes into a node, given 
                // nodes and context object’s node document. Rethrow any exceptions.
                var node = $.convertNodesIntoANode(nodes, _this.ownerDocument);

                // 5. If viablePreviousSibling is null, set it to parent’s first child, 
                // and to viablePreviousSibling’s next sibling otherwise.
                if (viablePreviousSibling === null) {
                    viablePreviousSibling = parent.firstChild;
                } else {
                    viablePreviousSibling = viablePreviousSibling.nextSibling;
                }

                // 6. Pre-insert node into parent before viablePreviousSibling. 
                // Rethrow any exceptions.
                $.preInsert(node, parent, viablePreviousSibling);
            });
        },


        // TODO: tests
        after: function after() {
            var _this2 = this;

            for (var _len2 = arguments.length, nodes = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                nodes[_key2] = arguments[_key2];
            }

            return _customElements2.default.executeCEReactions(function () {
                // https://dom.spec.whatwg.org/#dom-childnode-after
                // The after(nodes) method, when invoked, must run these steps:

                // 1. Let parent be context object’s parent.
                var parent = _this2.parentNode;

                // 2. If parent is null, terminate these steps.
                if (!parent) {
                    return;
                }

                // 3. Let viableNextSibling be context object’s first following 
                // sibling not in nodes, and null otherwise.
                var viableNextSibling = _this2.nextSibling;
                while (viableNextSibling && nodes.indexOf(viableNextSibling) !== -1) {
                    viableNextSibling = viableNextSibling.nextSibling;
                }

                // 4. Let node be the result of converting nodes into a node, given 
                // nodes and context object’s node document. Rethrow any exceptions.
                var node = $.convertNodesIntoANode(nodes, _this2.ownerDocument);

                // 5. Pre-insert node into parent before viableNextSibling. Rethrow 
                // any exceptions.
                $.preInsert(node, parent, viableNextSibling);
            });
        },


        // TODO: tests
        replaceWith: function replaceWith() {
            var _this3 = this;

            for (var _len3 = arguments.length, nodes = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                nodes[_key3] = arguments[_key3];
            }

            return _customElements2.default.executeCEReactions(function () {
                // https://dom.spec.whatwg.org/#dom-childnode-replacewith
                // The replaceWith(nodes) method, when invoked, must run these steps:

                // 1. Let parent be context object’s parent.
                var parent = _this3.parentNode;

                // 2. If parent is null, terminate these steps.
                if (!parent) {
                    return;
                }

                // 3. Let viableNextSibling be context object’s first following 
                // sibling not in nodes, and null otherwise.
                var viableNextSibling = _this3.nextSibling;
                while (viableNextSibling && nodes.indexOf(viableNextSibling) !== -1) {
                    viableNextSibling = viableNextSibling.nextSibling;
                }

                // 4. Let node be the result of converting nodes into a node, given 
                // nodes and context object’s node document. Rethrow any exceptions.
                var node = $.convertNodesIntoANode(nodes, _this3.ownerDocument);

                // 5. If context object’s parent is parent, replace the context object 
                // with node within parent. Rethrow any exceptions.
                if (_this3.parentNode == parent) {
                    $.replace(_this3, node, parent);
                }
                // 6. Otherwise, pre-insert node into parent before viableNextSibling. 
                // Rethrow any exceptions.
                else {
                        $.preInsert(node, parent, viableNextSibling);
                    }
            });
        },


        // TODO: tests
        remove: function remove() {
            var _this4 = this;

            return _customElements2.default.executeCEReactions(function () {
                // https://dom.spec.whatwg.org/#dom-childnode-remove
                // The remove() method, when invoked, must run these steps:

                // 1. If context object’s parent is null, terminate these steps.
                var parent = _this4.parentNode;

                if (!parent) {
                    return;
                }

                // 2. Remove the context object from context object’s parent.
                $.remove(_this4, parent);
            });
        }
    };
};

var _utils = require('../utils.js');

var $ = _interopRequireWildcard(_utils);

var _customElements = require('../custom-elements.js');

var _customElements2 = _interopRequireDefault(_customElements);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

},{"../custom-elements.js":1,"../utils.js":28}],21:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _utils = require('../utils.js');

var $ = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

exports.default = {

    // TODO: consider getSelection()
    // TODO: consider elementFromPoint(double x, double y)
    // TODO: consider elementsFromPoint(double x, double y)
    // TODO: consider get styleSheets()

    // TODO: tests
    get activeElement() {
        var document = this.ownerDocument || this;
        var nativeActiveElement = native.activeElement.get.call(document);

        if (!nativeActiveElement || document != $.shadowIncludingRoot(this)) {
            return null;
        }

        return $.retarget(nativeActiveElement, this);
    }

}; // https://dom.spec.whatwg.org/#mixin-documentorshadowroot
// https://www.w3.org/TR/shadow-dom/#extensions-to-the-documentorshadowroot-mixin

},{"../utils.js":28}],22:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (base) {

    var native = {
        previousElementSibling: $.descriptor(base, 'previousElementSibling'),
        nextElementSibling: $.descriptor(base, 'nextElementSibling')
    };

    return {

        // TODO: tests
        get previousElementSibling() {
            var nodeState = $.getShadowState(this);
            if (nodeState && nodeState.parentNode) {
                var childNodes = $.getShadowState(nodeState.parentNode).childNodes;
                var index = childNodes.indexOf(this);
                while (index > 0) {
                    var previous = childNodes[--index];
                    if (previous.nodeType === Node.ELEMENT_NODE) {
                        return previous;
                    }
                };
                return null;
            } else if (native.previousElementSibling) {
                return native.previousElementSibling.get.call(this);
            } else {
                var getPreviousSibling = $.descriptors.Node.previousSibling.get;
                var previousSibling = this;
                while (previousSibling = getPreviousSibling.call(previousSibling)) {
                    if (previousSibling.nodeType === Node.ELEMENT_NODE) {
                        return previousSibling;
                    }
                }
                return null;
            }
        },

        // TODO: tests
        get nextElementSibling() {
            var nodeState = $.getShadowState(this);
            if (nodeState && nodeState.parentNode) {
                var childNodes = $.getShadowState(nodeState.parentNode).childNodes;
                var index = childNodes.indexOf(this);
                while (index < childNodes.length - 1) {
                    var next = childNodes[++index];
                    if (next.nodeType === Node.ELEMENT_NODE) {
                        return next;
                    }
                };
                return null;
            } else if (native.nextElementSibling) {
                return native.nextElementSibling.get.call(this);
            } else {
                var getNextSibling = $.descriptors.Node.nextSibling.get;
                var nextSibling = this;
                while (nextSibling = getNextSibling.call(nextSibling)) {
                    if (nextSibling.nodeType === Node.ELEMENT_NODE) {
                        return nextSibling;
                    }
                }
                return null;
            }
        }

    };
};

var _utils = require('../utils.js');

var $ = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

},{"../utils.js":28}],23:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (base) {

    return {
        getElementById: function getElementById(id) {
            // https://dom.spec.whatwg.org/#dom-nonelementparentnode-getelementbyid

            if (id === '' || /\s/.test(id)) {
                return null;
            }

            var firstChild = this.firstChild;

            if (!firstChild) {
                return null;
            }

            return $.treeOrderRecursiveSelectFirst(firstChild, function (node) {
                return node.id === id;
            });
        }
    };
};

var _utils = require('../utils.js');

var $ = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

},{"../utils.js":28}],24:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (base) {

    var native = {
        children: $.descriptor(base, 'children'),
        firstElementChild: $.descriptor(base, 'firstElementChild'),
        lastElementChild: $.descriptor(base, 'lastElementChild'),
        childElementCount: $.descriptor(base, 'childElementCount')
    };

    return {

        get children() {
            var childNodes = void 0;

            var shadowState = $.getShadowState(this);
            if (shadowState) {
                childNodes = shadowState.childNodes;
            }

            if (!childNodes) {
                if (native.children) {
                    return native.children.get.call(this);
                }
                childNodes = this.childNodes;
            }

            var childNodesLength = childNodes.length;
            var elements = new Array(childNodesLength);
            var pushed = 0;
            for (var i = 0; i < childNodesLength; i++) {
                var node = childNodes[i];
                if (node.nodeType == Node.ELEMENT_NODE) {
                    elements[pushed++] = node;
                }
            }
            elements.length = pushed;

            return elements;
        },

        get firstElementChild() {
            var childNodes = void 0;

            var shadowState = $.getShadowState(this);
            if (shadowState) {
                childNodes = shadowState.childNodes;
            }

            if (!childNodes) {
                if (native.firstElementChild) {
                    return native.firstElementChild.get.call(this);
                }
                childNodes = this.childNodes;
            }

            for (var i = 0; i < childNodes.length; i++) {
                var node = childNodes[i];
                if (node.nodeType == Node.ELEMENT_NODE) {
                    return node;
                }
            }

            return null;
        },

        get lastElementChild() {
            var childNodes = void 0;

            var shadowState = $.getShadowState(this);
            if (shadowState) {
                childNodes = shadowState.childNodes;
            }

            if (!childNodes) {
                if (native.lastElementChild) {
                    return native.lastElementChild.get.call(this);
                }
                childNodes = this.childNodes;
            }

            for (var i = childNodes.length - 1; i >= 0; i--) {
                var node = childNodes[i];
                if (node.nodeType == Node.ELEMENT_NODE) {
                    return node;
                }
            }

            return null;
        },

        get childElementCount() {
            var childNodes = void 0;

            var shadowState = $.getShadowState(this);
            if (shadowState) {
                childNodes = shadowState.childNodes;
            }

            if (!childNodes) {
                if (native.childElementCount) {
                    return native.childElementCount.get.call(this);
                }
                childNodes = this.childNodes;
            }

            var count = 0;

            for (var i = 0; i < childNodes.length; i++) {
                var node = childNodes[i];
                if (node.nodeType == Node.ELEMENT_NODE) {
                    count++;
                }
            }

            return count;
        },

        // TODO: tests
        prepend: function prepend() {
            var _this = this;

            for (var _len = arguments.length, nodes = Array(_len), _key = 0; _key < _len; _key++) {
                nodes[_key] = arguments[_key];
            }

            return _customElements2.default.executeCEReactions(function () {
                // https://dom.spec.whatwg.org/#dom-parentnode-prepend
                // The prepend(nodes) method, when invoked, must run these steps:

                // 1. Let node be the result of converting nodes into a node given 
                // nodes and context object’s node document. Rethrow any exceptions.
                var node = $.convertNodesIntoANode(nodes, _this.ownerDocument || _this);

                // 2. Pre-insert node into context object before the context object’s 
                // first child. Rethrow any exceptions.
                $.preInsert(node, _this, _this.firstChild);
            });
        },


        // TODO: tests
        append: function append() {
            var _this2 = this;

            for (var _len2 = arguments.length, nodes = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                nodes[_key2] = arguments[_key2];
            }

            return _customElements2.default.executeCEReactions(function () {
                // https://dom.spec.whatwg.org/#dom-parentnode-append
                // The append(nodes) method, when invoked, must run these steps:

                // 1. Let node be the result of converting nodes into a node given 
                // nodes and context object’s node document. Rethrow any exceptions.
                var node = $.convertNodesIntoANode(nodes, _this2.ownerDocument || _this2);

                // 2. Append node to context object. Rethrow any exceptions.
                $.append(node, _this2);
            });
        },


        // TODO: tests
        querySelector: function querySelector(selectors) {
            var results = this.querySelectorAll(selectors);

            if (results.length) {
                return results[0];
            }

            return null;
        },


        // TODO: tests
        querySelectorAll: function querySelectorAll(selectors) {
            // https://dom.spec.whatwg.org/#scope-match-a-selectors-string
            // this is horrible, performance-wise.
            // it's about 100x slower than native querySelectorAll.
            // that might not amount to much in practice, though.
            // after all, this is a polyfill.

            var results = [];

            var firstChild = this.firstChild;

            if (!firstChild) {
                return results;
            }

            $.treeOrderRecursiveSelectAll(firstChild, results, function (node) {
                return node.nodeType === Node.ELEMENT_NODE && node.matches(selectors);
            });

            return results;
        }
    };
};

var _utils = require('../utils.js');

var $ = _interopRequireWildcard(_utils);

var _customElements = require('../custom-elements.js');

var _customElements2 = _interopRequireDefault(_customElements);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

},{"../custom-elements.js":1,"../utils.js":28}],25:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (base) {

    return {

        get assignedSlot() {
            // spec implementation is to run 'find a slot'
            // this uses an alternative (see https://github.com/whatwg/dom/issues/369)
            var shadowState = $.getShadowState(this);
            if (shadowState) {
                var slot = shadowState.assignedSlot;
                if (slot && $.closedShadowHidden(slot, this)) {
                    slot = null;
                }
                return slot;
            }
            return null;
        }

    };
};

var _utils = require('../utils.js');

var $ = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

},{"../utils.js":28}],26:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.patchAll = patchAll;

var _utils = require('./utils.js');

var $ = _interopRequireWildcard(_utils);

var _DOMTokenList = require('./interfaces/DOMTokenList.js');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// Fear not the single page
// https://www.w3.org/TR/html/single-page.html

// TODO: implement on demand
// These might be a bit much considering we can't do anything about inline script handlers
// GlobalEventHandlers
// DocumentAndElementEventHandlers

// TODO: implement on demand
// This would be useful to polyfill considering most current browsers don't implement it yet
// HTMLHyperlinkElementUtils (Anchor, Area)

// An index of IDL attributes that should reflect a corresponding content attribute.

var interfaces = {
    'Element': {
        'id': reflectString(),
        'className': reflectString('class'),
        'classList': reflectDOMTokenList('class'),
        'slot': reflectString()
    },
    'HTMLElement': {
        'title': reflectString(),
        'lang': reflectString(),
        'translate': reflectString(),
        'dir': reflectString(),
        // TODO: implement on demand
        //'dataset': reflect.DOMStringMap('data'),
        'hidden': reflectBoolean(),
        'tabIndex': reflectInteger(null, 0),
        'accessKey': reflectString(),
        'draggable': reflectString(),
        'contextMenu': reflectHTMLElement(window.HTMLMenuElement),
        'spellcheck': reflectString(),
        // ElementContentEditable
        'contentEditable': reflectString()
    },
    'HTMLAnchorElement': {
        'target': reflectString(),
        'download': reflectString(),
        'rel': reflectString(),
        'rev': reflectString(),
        'relList': reflectDOMTokenList('rel'),
        'hreflang': reflectString(),
        'type': reflectString(),
        'text': reflectTextContent()
    },
    'HTMLAreaElement': {
        'alt': reflectString(),
        'coords': reflectString(),
        'shape': reflectString(),
        'target': reflectString(),
        'download': reflectString(),
        'rel': reflectString(),
        'relList': reflectDOMTokenList('rel'),
        'hreflang': reflectString(),
        'type': reflectString()
    },
    'HTMLBaseElement': {
        'href': reflectString(),
        'target': reflectString()
    },
    'HTMLButtonElement': {
        'autofocus': reflectBoolean(),
        'disabled': reflectBoolean(),
        'form': reflectHTMLElement(HTMLFormElement, true),
        'formAction': reflectString(),
        'formEnctype': reflectString(),
        'formMethod': reflectString(),
        'formNoValidate': reflectBoolean(),
        'formTarget': reflectString(),
        'name': reflectString(),
        'type': reflectString(),
        'value': reflectString(),
        'menu': reflectHTMLElement(window.HTMLMenuElement)
    },
    'HTMLCanvasElement': {
        'width': reflectInteger(null, 0),
        'height': reflectInteger(null, 0)
    },
    'HTMLDataElement': {
        'value': reflectString()
    },
    'HTMLDetailsElement': {
        'open': reflectBoolean()
    },
    'HTMLEmbedElement': {
        'src': reflectString(),
        'type': reflectString(),
        'width': reflectInteger(null, 0),
        'height': reflectInteger(null, 0)
    },
    'HTMLFieldSetElement': {
        'disabled': reflectBoolean(),
        'form': reflectHTMLElement(HTMLFormElement, true),
        'name': reflectString()
    },
    'HTMLFormElement': {
        'acceptCharset': reflectString('accept-charset'),
        'action': reflectString(),
        'autocomplete': reflectString(),
        'enctype': reflectString(),
        'encoding': reflectString('enctype'),
        'method': reflectString(),
        'name': reflectString(),
        'noValidate': reflectBoolean(),
        'target': reflectString()
    },
    'HTMLIFrameElement': {
        'src': reflectString(),
        'srcdoc': reflectString(),
        'name': reflectString(),
        'sandbox': reflectDOMTokenList('sandbox'),
        'allowFullscreen': reflectBoolean(),
        'width': reflectInteger(null, 0),
        'height': reflectInteger(null, 0)
    },
    'HTMLImageElement': {
        'alt': reflectString(),
        'src': reflectString(),
        'srcset': reflectString(),
        'crossOrigin': reflectString(),
        'useMap': reflectString(),
        'isMap': reflectBoolean(),
        'width': reflectInteger(null, 0),
        'height': reflectInteger(null, 0)
    },
    // TODO: caveat about feature testing input elements using anything besides 'type'
    'HTMLInputElement': {
        'accept': reflectString(),
        'alt': reflectString(),
        'autocomplete': reflectString(),
        'autofocus': reflectBoolean(),
        'defaultChecked': reflectBoolean('checked'),
        'dirName': reflectString(),
        'disabled': reflectBoolean(),
        'form': reflectHTMLElement(HTMLFormElement, true),
        'formAction': reflectString(),
        'formEnctype': reflectString(),
        'formMethod': reflectString(),
        'formNoValidate': reflectBoolean(),
        'formTarget': reflectString(),
        'height': reflectInteger(null, 0),
        'inputMode': reflectString(),
        // TODO: investigate whether we should bother with 'list'.
        // Browsers without native Shadow DOM could end up not
        // pulling suggestions from the correct list anyways.
        // Possibly needs to be a caveat about this.
        //'list': reflectSuggestionSourceElement(),
        'max': reflectString(),
        'maxLength': reflectInteger(0, 0),
        'min': reflectString(),
        'minLength': reflectInteger(0, 0),
        'multiple': reflectBoolean(),
        'name': reflectString(),
        'pattern': reflectString(),
        'placeholder': reflectString(),
        'readOnly': reflectBoolean(),
        'required': reflectBoolean(),
        'size': reflectInteger(1, 1),
        'src': reflectString(),
        'step': reflectString(),
        'type': reflectString(),
        'defaultValue': reflectString('value'),
        'width': reflectInteger(null, 0)
    },
    'HTMLKeygenElement': {
        'autofocus': reflectBoolean(),
        'challenge': reflectString(),
        'disabled': reflectBoolean(),
        'form': reflectHTMLElement(HTMLFormElement, true),
        'keytype': reflectString(),
        'name': reflectString()
    },
    'HTMLLabelElement': {
        'form': reflectHTMLElement(HTMLFormElement, true),
        'htmlFor': reflectString('for')
    },
    'HTMLLegendElement': {
        'form': reflectHTMLElement(HTMLFormElement, true)
    },
    'HTMLLIElement': {
        'value': reflectString()
    },
    'HTMLLinkElement': {
        'href': reflectString(),
        'crossOrigin': reflectString(),
        'rel': reflectString(),
        'rev': reflectString(),
        'relList': reflectDOMTokenList('rel'),
        'media': reflectString(),
        'hreflang': reflectString(),
        'type': reflectString(),
        'sizes': reflectDOMTokenList('sizes')
    },
    'HTMLMapElement': {
        'name': reflectString()
    },
    'HTMLMediaElement': {
        'src': reflectString(),
        'crossOrigin': reflectString(),
        'preload': reflectString(),
        'loop': reflectBoolean(),
        'autoplay': reflectBoolean(),
        'mediaGroup': reflectString(),
        'controls': reflectBoolean(),
        'defaultMuted': reflectBoolean('muted')
    },
    'HTMLMenuElement': {
        'type': reflectString(),
        'label': reflectString()
    },
    'HTMLMenuItemElement': {
        'type': reflectString(),
        'label': reflectString(),
        'icon': reflectString(),
        'disabled': reflectBoolean(),
        'checked': reflectBoolean('checked'),
        'radiogroup': reflectString(),
        'default': reflectBoolean()
    },
    'HTMLMetaElement': {
        'name': reflectString(),
        'httpEquiv': reflectString('http-equiv'),
        'content': reflectString()
    },
    'HTMLMeterElement': {
        'value': reflectFloat(null, 0),
        'min': reflectFloat(null, 0),
        'max': reflectFloat(null, 0),
        'low': reflectFloat(null, 0),
        'high': reflectFloat(null, 0),
        'optimum': reflectFloat(null, 0)
    },
    'HTMLModElement': {
        'cite': reflectString(),
        'dateTime': reflectString()
    },
    'HTMLObjectElement': {
        'data': reflectString(),
        'type': reflectString(),
        'typeMustMatch': reflectBoolean(),
        'name': reflectString(),
        'form': reflectHTMLElement(HTMLFormElement, true),
        'width': reflectInteger(null, 0),
        'height': reflectInteger(null, 0)
    },
    'HTMLOListElement': {
        'reversed': reflectBoolean(),
        'start': reflectInteger(null, 0),
        'type': reflectString()
    },
    'HTMLOptGroupElement': {
        'disabled': reflectBoolean(),
        'label': reflectString()
    },
    'HTMLOptionElement': {
        'disabled': reflectBoolean(),
        'form': reflectHTMLElement(HTMLFormElement, true),
        'label': reflectString(),
        'defaultSelected': reflectBoolean('selected'),
        'value': reflectString()
    },
    'HTMLOutputElement': {
        'htmlFor': reflectDOMTokenList('for'),
        'form': reflectHTMLElement(HTMLFormElement, true),
        'name': reflectString(),
        'defaultValue': reflectString('value')
    },
    'HTMLParamElement': {
        'name': reflectString(),
        'value': reflectString()
    },
    'HTMLProgressElement': {
        'value': reflectFloat(null, 0),
        'max': reflectFloat(null, 0)
    },
    'HTMLQuoteElement': {
        'cite': reflectString()
    },
    'HTMLScriptElement': {
        'src': reflectString(),
        'type': reflectString(),
        'charset': reflectString(),
        'async': reflectBoolean(),
        'defer': reflectBoolean(),
        'crossOrigin': reflectString(),
        // TODO: implement on demand
        // 'text': reflectScriptText(),
        'nonce': reflectString()
    },
    'HTMLSelectElement': {
        'autocomplete': reflectString(),
        'autofocus': reflectBoolean(),
        'disabled': reflectBoolean(),
        'form': reflectHTMLElement(HTMLFormElement, true),
        'multiple': reflectBoolean(),
        'name': reflectString(),
        'required': reflectBoolean(),
        'size': reflectInteger(1, 1)
    },
    'HTMLSourceElement': {
        'src': reflectString(),
        'type': reflectString(),
        'media': reflectString()
    },
    'HTMLStyleElement': {
        'media': reflectString(),
        'nonce': reflectString(),
        'type': reflectString()
    },
    'HTMLTableCellElement': {
        'colSpan': reflectInteger(0, -1),
        'rowSpan': reflectInteger(0, -1),
        'headers': reflectDOMTokenList('headers')
    },
    'HTMLTableColElement': {
        'span': reflectInteger(1, 1)
    },
    'HTMLTableHeaderCellElement': {
        'scope': reflectString(),
        'abbr': reflectString()
    },
    'HTMLTextAreaElement': {
        'autocomplete': reflectString(),
        'autofocus': reflectBoolean(),
        'cols': reflectString(),
        'dirName': reflectString(),
        'disabled': reflectBoolean(),
        'form': reflectHTMLElement(HTMLFormElement, true),
        'inputMode': reflectString(),
        'maxLength': reflectInteger(0, 0),
        'minLength': reflectInteger(0, 0),
        'name': reflectString(),
        'placeholder': reflectString(),
        'readOnly': reflectBoolean(),
        'required': reflectBoolean(),
        'rows': reflectInteger(1, 1),
        'wrap': reflectString(),
        'defaultValue': reflectTextContent()
    },
    'HTMLTimeElement': {
        'dateTime': reflectString()
    },
    'HTMLTrackElement': {
        'kind': reflectString(),
        'src': reflectString(),
        'srclang': reflectString(),
        'label': reflectString(),
        'default': reflectBoolean()
    },
    'HTMLVideoElement': {
        'width': reflectInteger(null, 0),
        'height': reflectInteger(null, 0),
        'poster': reflectString()
    }
};

// https://www.w3.org/TR/html/single-page.html#reflection

function reflectString(attributeName) {
    return function (type, name) {
        attributeName = attributeName || name.toLowerCase();
        var descriptor = $.descriptor(type, name);
        Object.defineProperty(type.prototype, name, {
            configurable: true,
            enumerable: true,
            get: descriptor ? descriptor.get : function () {
                return this.getAttribute(attributeName) || '';
            },
            set: function set(value) {
                $.setAttributeValue(this, attributeName, value);
            }
        });
    };
}

function reflectBoolean(attributeName) {
    return function (type, name) {
        attributeName = attributeName || name.toLowerCase();
        Object.defineProperty(type.prototype, name, {
            configurable: true,
            enumerable: true,
            get: function get() {
                return this.hasAttribute(attributeName);
            },
            set: function set(value) {
                if (value === false) {
                    $.removeAttributeByName(attributeName, this);
                } else {
                    $.setAttributeValue(this, attributeName, value);
                }
            }
        });
    };
}

// TODO: minValue, errors
function reflectInteger(minValue, defaultValue) {
    return function (type, name) {
        var attributeName = name.toLowerCase();
        defaultValue = defaultValue || 0;
        Object.defineProperty(type.prototype, name, {
            configurable: true,
            enumerable: true,
            get: function get() {
                var value = this.getAttribute(attributeName);
                return parseInt(value) || defaultValue;
            },
            set: function set(value) {
                if (typeof value !== 'number') {
                    throw $.makeError('TypeError');
                }
                $.setAttributeValue(this, attributeName, value.toString());
            }
        });
    };
}

// TODO: minValue, errors
function reflectFloat(minValue, defaultValue) {
    return function (type, name) {
        var attributeName = name.toLowerCase();
        defaultValue = defaultValue || 0;
        Object.defineProperty(type.prototype, name, {
            configurable: true,
            enumerable: true,
            get: function get() {
                var value = this.getAttribute(attributeName);
                return parseFloat(value) || defaultValue;
            },
            set: function set(value) {
                if (typeof value !== 'number') {
                    throw $.makeError('TypeError');
                }
                $.setAttributeValue(this, attributeName, value.toString());
            }
        });
    };
}

function reflectDOMTokenList(localName) {
    return function (type, name) {
        Object.defineProperty(type.prototype, name, {
            configurable: true,
            enumerable: true,
            get: function get() {
                return (0, _DOMTokenList.getOrCreateDOMTokenList)(this, localName);
            },
            set: function set(value) {
                (0, _DOMTokenList.getOrCreateDOMTokenList)(this, localName).value = value;
            }
        });
    };
}

function reflectHTMLElement(candidateType, readOnly) {
    return function (type, name) {
        var attributeName = name.toLowerCase();
        Object.defineProperty(type.prototype, name, {
            configurable: true,
            enumerable: true,
            get: function get() {
                if (!this.hasAttribute(attributeName)) {
                    return null;
                }
                var id = this.getAttribute(attributeName);
                var candidate = this.ownerDocument.getElementById(id);
                if (candidate == null || !(candidate instanceof candidateType)) {
                    return null;
                }
                return candidate;
            },
            set: readOnly ? undefined : function (value) {
                if (!(value instanceof candidateType)) {
                    throw $.makeError('TypeError');
                }
                if (value.hasAttribute('id')) {
                    var found = this.ownerDocument.getElementById(value.id);
                    if (value === found) {
                        this.setAttribute(attributeName, value.id);
                        return;
                    }
                }
                this.setAttribute(attributeName, '');
            }
        });
    };
}

function reflectTextContent() {
    return function (type, name) {
        Object.defineProperty(type.prototype, name, {
            configurable: true,
            enumerable: true,
            get: function get() {
                return this.textContent;
            },
            set: function set(value) {
                this.textContent = value;
            }
        });
    };
}

function patchAll() {
    var identifiers = Object.getOwnPropertyNames(interfaces);
    for (var i = 0; i < identifiers.length; i++) {
        var identifier = identifiers[i];
        if (identifier in window) {
            var type = window[identifier];
            var attributes = Object.getOwnPropertyNames(interfaces[identifier]);
            for (var j = 0; j < attributes.length; j++) {
                var attribute = attributes[j];
                interfaces[identifier][attribute](type, attribute);
            }
        }
    }
}

},{"./interfaces/DOMTokenList.js":5,"./utils.js":28}],27:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _utils = require('./utils.js');

var $ = _interopRequireWildcard(_utils);

var _reflect = require('./reflect.js');

var reflect = _interopRequireWildcard(_reflect);

var _Attr = require('./interfaces/Attr.js');

var _Attr2 = _interopRequireDefault(_Attr);

var _CharacterData = require('./interfaces/CharacterData.js');

var _CharacterData2 = _interopRequireDefault(_CharacterData);

var _CustomEvent = require('./interfaces/CustomEvent.js');

var _CustomEvent2 = _interopRequireDefault(_CustomEvent);

var _Document = require('./interfaces/Document.js');

var _Document2 = _interopRequireDefault(_Document);

var _DOMTokenList = require('./interfaces/DOMTokenList.js');

var _DOMTokenList2 = _interopRequireDefault(_DOMTokenList);

var _Element = require('./interfaces/Element.js');

var _Element2 = _interopRequireDefault(_Element);

var _Event = require('./interfaces/Event.js');

var _Event2 = _interopRequireDefault(_Event);

var _EventTarget = require('./interfaces/EventTarget.js');

var _EventTarget2 = _interopRequireDefault(_EventTarget);

var _HTMLSlotElement = require('./interfaces/HTMLSlotElement.js');

var _HTMLSlotElement2 = _interopRequireDefault(_HTMLSlotElement);

var _HTMLTableElement = require('./interfaces/HTMLTableElement.js');

var _HTMLTableElement2 = _interopRequireDefault(_HTMLTableElement);

var _HTMLTableRowElement = require('./interfaces/HTMLTableRowElement.js');

var _HTMLTableRowElement2 = _interopRequireDefault(_HTMLTableRowElement);

var _HTMLTableSectionElement = require('./interfaces/HTMLTableSectionElement.js');

var _HTMLTableSectionElement2 = _interopRequireDefault(_HTMLTableSectionElement);

var _MutationObserver = require('./interfaces/MutationObserver.js');

var _MutationObserver2 = _interopRequireDefault(_MutationObserver);

var _NamedNodeMap = require('./interfaces/NamedNodeMap.js');

var _NamedNodeMap2 = _interopRequireDefault(_NamedNodeMap);

var _Node = require('./interfaces/Node.js');

var _Node2 = _interopRequireDefault(_Node);

var _ShadowRoot = require('./interfaces/ShadowRoot.js');

var _ShadowRoot2 = _interopRequireDefault(_ShadowRoot);

var _Text = require('./interfaces/Text.js');

var _Text2 = _interopRequireDefault(_Text);

var _ChildNode = require('./mixins/ChildNode.js');

var _ChildNode2 = _interopRequireDefault(_ChildNode);

var _DocumentOrShadowRoot = require('./mixins/DocumentOrShadowRoot.js');

var _DocumentOrShadowRoot2 = _interopRequireDefault(_DocumentOrShadowRoot);

var _NonDocumentTypeChildNode = require('./mixins/NonDocumentTypeChildNode.js');

var _NonDocumentTypeChildNode2 = _interopRequireDefault(_NonDocumentTypeChildNode);

var _NonElementParentNode = require('./mixins/NonElementParentNode.js');

var _NonElementParentNode2 = _interopRequireDefault(_NonElementParentNode);

var _ParentNode = require('./mixins/ParentNode.js');

var _ParentNode2 = _interopRequireDefault(_ParentNode);

var _Slotable = require('./mixins/Slotable.js');

var _Slotable2 = _interopRequireDefault(_Slotable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var nativeSupport = 'attachShadow' in Element.prototype;

exports.default = {
    nativeSupport: nativeSupport,
    install: install
};


function install() {

    // Hacky setting in case you want to use ShadyCSS.
    window['ShadyDOM'] = { 'inUse': true };

    // Reflected attributes
    reflect.patchAll();

    // Element.matches(selectors) polyfill from MDN
    // https://developer.mozilla.org/en-US/docs/Web/API/Element/matches#Polyfill
    // Purposefully chop out the polyfill function that uses querySelectorAll.
    if (!Element.prototype.matches) {
        Element.prototype.matches = Element.prototype.matchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.msMatchesSelector || Element.prototype.oMatchesSelector || Element.prototype.webkitMatchesSelector;
    }

    // Attr interface
    $.extend(Attr, _Attr2.default);

    // CharacterData interface
    $.extend(CharacterData, _CharacterData2.default);

    // CustomEvent interface
    window.CustomEvent = _CustomEvent2.default;

    // Document interface
    $.extend(Document, _Document2.default);

    // DOMTokenList interface
    if ('DOMTokenList' in window) {
        // TODO: what about IE9?
        $.extend(DOMTokenList, _DOMTokenList2.default);
    }

    // Element interface
    $.extend(Element, _Element2.default);

    // Event interface
    $.extend(Event, _Event2.default);
    $.extend(FocusEvent, _Event.hasRelatedTarget);
    $.extend(MouseEvent, _Event.hasRelatedTarget);
    _Event2.default.prototype = Event.prototype;
    window.Event = _Event2.default;

    // EventTarget
    if ('EventTarget' in Window) {
        $.extend(EventTarget, (0, _EventTarget2.default)(EventTarget));
    } else {
        // In IE, EventTarget is not exposed and Window's
        // EventTarget methods are not the same as Node's.
        $.extend(Window, (0, _EventTarget2.default)(Window));
        $.extend(Node, (0, _EventTarget2.default)(Node));
    }

    // HTMLSlotElement interface
    $.extend('HTMLSlotElement' in window ? HTMLSlotElement : HTMLUnknownElement, _HTMLSlotElement2.default);

    // HTMLTableElement interface
    $.extend(HTMLTableElement, _HTMLTableElement2.default);

    // HTMLTableRowElement interface
    $.extend(HTMLTableRowElement, _HTMLTableRowElement2.default);

    // HTMLTableSectionElement interface
    $.extend(HTMLTableSectionElement, _HTMLTableSectionElement2.default);

    // MutationObserver interface
    window.MutationObserver = _MutationObserver2.default;

    // NamedNodeMap interface
    $.extend(NamedNodeMap, _NamedNodeMap2.default);

    // Node interface
    $.extend(Node, _Node2.default);

    // TODO: implement Range interface

    // Text interface
    $.extend(Text, _Text2.default);

    // ChildNode mixin
    $.extend(DocumentType, (0, _ChildNode2.default)(DocumentType));
    $.extend(Element, (0, _ChildNode2.default)(Element));
    $.extend(CharacterData, (0, _ChildNode2.default)(CharacterData));

    // DocumentOrShadowRoot mixin
    $.extend(Document, _DocumentOrShadowRoot2.default);
    $.extend(_ShadowRoot2.default, _DocumentOrShadowRoot2.default);

    // NonDocumentTypeChildNode mixin
    $.extend(Element, (0, _NonDocumentTypeChildNode2.default)(Element));
    $.extend(CharacterData, (0, _NonDocumentTypeChildNode2.default)(CharacterData));

    // NonElementParentNode mixin
    $.extend(Document, (0, _NonElementParentNode2.default)(Document));
    $.extend(DocumentFragment, (0, _NonElementParentNode2.default)(DocumentFragment));

    // ParentNode mixin
    $.extend(Document, (0, _ParentNode2.default)(Document));
    $.extend(DocumentFragment, (0, _ParentNode2.default)(DocumentFragment));
    $.extend(Element, (0, _ParentNode2.default)(Element));

    // Slotable mixin
    $.extend(Element, (0, _Slotable2.default)(Element));
    $.extend(Text, (0, _Slotable2.default)(Text));

    // Cleanup for IE, Edge
    delete Node.prototype.attributes;
    delete HTMLElement.prototype.classList;
    delete HTMLElement.prototype.children;
    delete HTMLElement.prototype.parentElement;
    delete HTMLElement.prototype.innerHTML;
    delete HTMLElement.prototype.outerHTML;
    delete HTMLElement.prototype.insertAdjacentText;
    delete HTMLElement.prototype.insertAdjacentElement;
    delete HTMLElement.prototype.insertAdjacentHTML;
}

},{"./interfaces/Attr.js":2,"./interfaces/CharacterData.js":3,"./interfaces/CustomEvent.js":4,"./interfaces/DOMTokenList.js":5,"./interfaces/Document.js":6,"./interfaces/Element.js":7,"./interfaces/Event.js":8,"./interfaces/EventTarget.js":9,"./interfaces/HTMLSlotElement.js":10,"./interfaces/HTMLTableElement.js":11,"./interfaces/HTMLTableRowElement.js":12,"./interfaces/HTMLTableSectionElement.js":13,"./interfaces/MutationObserver.js":14,"./interfaces/NamedNodeMap.js":15,"./interfaces/Node.js":16,"./interfaces/ShadowRoot.js":17,"./interfaces/Text.js":18,"./mixins/ChildNode.js":20,"./mixins/DocumentOrShadowRoot.js":21,"./mixins/NonDocumentTypeChildNode.js":22,"./mixins/NonElementParentNode.js":23,"./mixins/ParentNode.js":24,"./mixins/Slotable.js":25,"./reflect.js":26,"./utils.js":28}],28:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.setImmediate = exports.descriptors = exports.descriptor = exports.slice = undefined;
exports.makeError = makeError;
exports.reportError = reportError;
exports.extend = extend;
exports.getShadowState = getShadowState;
exports.setShadowState = setShadowState;
exports.treeOrderRecursiveSelectAll = treeOrderRecursiveSelectAll;
exports.treeOrderRecursiveSelectFirst = treeOrderRecursiveSelectFirst;
exports.filterByRoot = filterByRoot;
exports.isShadowRoot = isShadowRoot;
exports.parseHTMLFragment = parseHTMLFragment;
exports.serializeHTMLFragment = serializeHTMLFragment;
exports.root = root;
exports.descendant = descendant;
exports.inclusiveDescendant = inclusiveDescendant;
exports.ancestor = ancestor;
exports.inclusiveAncestor = inclusiveAncestor;
exports.convertNodesIntoANode = convertNodesIntoANode;
exports.clone = clone;
exports.adopt = adopt;
exports.hostIncludingInclusiveAncestor = hostIncludingInclusiveAncestor;
exports.shadowIncludingRoot = shadowIncludingRoot;
exports.shadowIncludingDescendant = shadowIncludingDescendant;
exports.shadowIncludingInclusiveDescendant = shadowIncludingInclusiveDescendant;
exports.shadowIncludingAncestor = shadowIncludingAncestor;
exports.shadowIncludingInclusiveAncestor = shadowIncludingInclusiveAncestor;
exports.closedShadowHidden = closedShadowHidden;
exports.retarget = retarget;
exports.changeAttribute = changeAttribute;
exports.appendAttribute = appendAttribute;
exports.removeAttribute = removeAttribute;
exports.setAttribute = setAttribute;
exports.setAttributeValue = setAttributeValue;
exports.removeAttributeByName = removeAttributeByName;
exports.removeAttributeByNamespace = removeAttributeByNamespace;
exports.insertAdjacent = insertAdjacent;
exports.setExistingAttributeValue = setExistingAttributeValue;
exports.replaceData = replaceData;
exports.findFlattenedSlotables = findFlattenedSlotables;
exports.preInsert = preInsert;
exports.insert = insert;
exports.append = append;
exports.replace = replace;
exports.replaceAll = replaceAll;
exports.preRemove = preRemove;
exports.remove = remove;
exports.createMutationObserver = createMutationObserver;

var _customElements = require('./custom-elements.js');

var _customElements2 = _interopRequireDefault(_customElements);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var slice = exports.slice = function slice(array) {
    return Array.prototype.slice.call(array);
};

var descriptor = exports.descriptor = function descriptor(type, name) {
    return Object.getOwnPropertyDescriptor(type.prototype, name);
};

var descriptors = exports.descriptors = {
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

var setImmediate = exports.setImmediate = 'setImmediate' in window ? window.setImmediate : function (callback) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
    }

    return setTimeout.apply(undefined, [callback, 0].concat(args));
};

// TODO: analyze usages and provide brief but descriptive messages
function makeError(name, message) {
    try {
        var sacrifice = document.createElement('div');
        descriptors.Node.appendChild.call(sacrifice, sacrifice);
    } catch (error) {
        error.message = message;
        error.name = name;
        return error;
    }
}

function reportError(error) {
    if ('console' in window && 'error' in window.console) {
        window.console.error(error);
    }
}

function extend(object) {
    for (var _len2 = arguments.length, mixins = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        mixins[_key2 - 1] = arguments[_key2];
    }

    for (var i = 0; i < mixins.length; i++) {
        var mixin = mixins[i];
        var prototype = mixin.prototype || mixin;
        var names = Object.getOwnPropertyNames(prototype);
        for (var j = 0; j < names.length; j++) {
            var name = names[j];
            if (name === 'constructor') {
                continue;
            }
            var _descriptor = Object.getOwnPropertyDescriptor(prototype, name);
            Object.defineProperty(object.prototype || object, name, _descriptor);
        }
    }
}

function getShadowState(object) {
    return object._shadow;
}

function setShadowState(object, state) {
    return object._shadow = state;
}

function forEachShadowIncludingDescendant(node, action) {
    var shadowState = null;
    var shadowRoot = null;
    if ((shadowState = getShadowState(node)) && (shadowRoot = shadowState.shadowRoot)) {
        action(shadowRoot);
        forEachShadowIncludingInclusiveDescendant(shadowRoot, action);
    }
    var childNodes = node.childNodes;
    for (var i = 0; i < childNodes.length; i++) {
        var childNode = childNodes[i];
        action(childNode);
        forEachShadowIncludingInclusiveDescendant(childNode, action);
    }
}

function forEachShadowIncludingInclusiveDescendant(node, action) {
    action(node);
    var shadowState = null;
    var shadowRoot = null;
    if ((shadowState = getShadowState(node)) && (shadowRoot = shadowState.shadowRoot)) {
        forEachShadowIncludingInclusiveDescendant(shadowRoot, action);
    }
    var childNodes = node.childNodes;
    for (var i = 0; i < childNodes.length; i++) {
        forEachShadowIncludingInclusiveDescendant(childNodes[i], action);
    }
}

function treeOrderRecursiveSelectAll(node, results, match) {
    if (match(node)) {
        results[results.length] = node;
    }
    var firstChild = node.firstChild;
    if (firstChild) {
        treeOrderRecursiveSelectAll(firstChild, results, match);
    }
    var nextSibling = node.nextSibling;
    if (nextSibling) {
        treeOrderRecursiveSelectAll(nextSibling, results, match);
    }
}

function treeOrderRecursiveSelectFirst(node, match) {
    if (match(node)) {
        return node;
    }
    var firstChild = node.firstChild;
    if (firstChild) {
        var result = treeOrderRecursiveSelectFirst(firstChild, match);
        if (result) {
            return result;
        }
    }
    var nextSibling = node.nextSibling;
    if (nextSibling) {
        return treeOrderRecursiveSelectFirst(nextSibling, match);
    }
    return null;
}

function filterByRoot(node, descendants) {
    var contextRoot = root(node);
    var filtered = new Array(descendants.length);
    var filteredCount = 0;
    for (var i = 0; i < descendants.length; i++) {
        var item = descendants[i];
        if (root(item) === contextRoot) {
            filtered[filteredCount++] = item;
        }
    }
    filtered.length = filteredCount;
    return filtered;
}

function isShadowRoot(node) {
    return node.nodeName === '#shadow-root';
}

// https://www.w3.org/TR/DOM-Parsing/

// PERF: This function uses a recycled div element
// and a recycled document fragment stored in the passed 
// element's owner document so it can avoid allocation.
// Callers must empty the returned fragment.
function parseHTMLFragment(markup, context) {
    var document = context.ownerDocument;
    var documentState = getShadowState(document) || setShadowState(document, {});
    var parsingElement = documentState.parsingElement;
    if (!parsingElement) {
        parsingElement = documentState.parsingElement = document.createElement('div');
    }
    var parsingFragment = documentState.parsingFragment;
    if (!documentState.parsingFragment) {
        parsingFragment = documentState.parsingFragment = document.createDocumentFragment();
    }
    descriptors.Element.innerHTML.set.call(parsingElement, markup);
    var nodeFirstChildGet = descriptors.Node.firstChild.get;
    var nodeAppendChildValue = descriptors.Node.appendChild.value;
    var firstChild = void 0;
    while (firstChild = nodeFirstChildGet.call(parsingElement)) {
        nodeAppendChildValue.call(parsingFragment, firstChild);
    }
    return parsingFragment;
}

function serializeHTMLFragment(node) {
    // https://www.w3.org/TR/html5/single-page.html#html-fragment-serialization-algorithm

    // 1. Let s be a string, and initialize it to the empty string.
    var s = '';

    // 2. If the node is a template element, then let the node instead be the 
    // template element's template contents (a DocumentFragment node).
    if (node.localName === 'template') {
        var content = node.content;
        if (content) {
            node = content;
        }
    }

    // 3. For each child node of the node, in tree order, run the following steps:
    var childNodes = node.childNodes;
    for (var i = 0; i < childNodes.length; i++) {
        // 1. Let current node be the child node being processed.
        var currentNode = childNodes[i];
        // 2. Append the appropriate string from the following list to s:
        switch (currentNode.nodeType) {
            case Node.ELEMENT_NODE:
                var tagName = void 0;
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
                var attributes = descriptors.Element.attributes.get.call(currentNode);
                for (var j = 0; j < attributes.length; j++) {
                    var attribute = attributes[j];
                    s += ' ' + serializeAttributeName(attribute);
                    s += '="' + escapeString(attribute.value) + '"';
                }
                s += '>';
                switch (currentNode.localName) {
                    case 'area':case 'base':case 'basefont':case 'bgsound':
                    case 'br':case 'col':case 'embed':case 'frame':case 'hr':
                    case 'img':case 'input':case 'keygen':case 'link':case 'meta':
                    case 'param':case 'source':case 'track':case 'wbr':
                        continue;
                    case 'pre':case 'textarea':case 'listing':
                        var firstChild = currentNode.firstChild;
                        if (firstChild && firstChild.nodeType === Node.TEXT_NODE && firstChild.data[0] === '\n') {
                            s += '\n';
                        }
                        break;
                }
                s += serializeHTMLFragment(currentNode);
                s += '</' + tagName + '>';
                break;
            case Node.TEXT_NODE:
                switch (currentNode.parentNode.localName) {
                    case 'style':case 'script':case 'xmp':case 'iframe':
                    case 'noembed':case 'noframes':case 'plaintext':case 'noscript':
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
        } else {
            string = string.replace('<', '&lt;');
            string = string.replace('>', '&gt;');
        }

        return string;
    }

    function serializeAttributeName(attribute) {
        var namespaceURI = attribute.namespaceURI;
        var localName = attribute.localName;
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

function root(node) {
    var root = node;
    var parent = root.parentNode;

    while (parent != null) {
        root = parent;
        parent = root.parentNode;
    }

    return root;
}

function descendant(nodeA, nodeB) {
    var parent = nodeA.parentNode;

    while (parent != null) {
        if (nodeB === parent) {
            return true;
        }
        parent = parent.parentNode;
    }

    return false;
}

function inclusiveDescendant(nodeA, nodeB) {
    return nodeA === nodeB || descendant(nodeA, nodeB);
}

function ancestor(nodeA, nodeB) {
    var parent = nodeB.parentNode;

    while (parent != null) {
        if (nodeA === parent) {
            return true;
        }
        parent = parent.parentNode;
    }

    return false;
}

function inclusiveAncestor(nodeA, nodeB) {
    return nodeA === nodeB || ancestor(nodeA, nodeB);
}

// https://dom.spec.whatwg.org/#interface-parentnode

function convertNodesIntoANode(nodes, document) {
    var node = null;

    for (var i = 0; i < nodes.length; i++) {
        var item = nodes[i];

        if (typeof item === "string") {
            nodes[i] = document.createTextNode(item);
        }
    }

    if (nodes.length === 1) {
        node = nodes[0];
    } else {
        node = document.createDocumentFragment();

        for (var _i = 0; _i < nodes.length; _i++) {
            node.appendChild(nodes[_i]);
        }
    }

    return node;
}

// https://dom.spec.whatwg.org/#interface-node

function clone(node, document, cloneChildren) {
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
    var copy = descriptors.Node.cloneNode.value.call(node, false);
    if (_customElements2.default.isInstalled()) {
        _customElements2.default.tryToUpgradeElement(copy);
    }

    // 6. If the clone children flag is set, clone all the children of node 
    // and append them to copy, with document as specified and the clone 
    // children flag being set.
    if (cloneChildren === true) {
        var childNodes = node.childNodes;
        for (var i = 0; i < childNodes.length; i++) {
            append(childNodes[i].cloneNode(true), copy);
        }
    }

    return copy;
}

function adopt(node, document) {
    // https://dom.spec.whatwg.org/#concept-node-adopt

    // 1. Let oldDocument be node’s node document.
    var oldDocument = node.ownerDocument;

    // 2. If node’s parent is not null, remove node from its parent.
    var parent = node.parentNode;
    if (parent != null) {
        remove(node, parent);
    }

    // 3. If document is not the same as oldDocument, run these substeps:
    if (document != oldDocument && _customElements2.default.isInstalled()) {
        forEachShadowIncludingInclusiveDescendant(node, function (inclusiveDescendant) {
            if (_customElements2.default.isCustom(inclusiveDescendant)) {
                _customElements2.default.enqueueCallbackReaction(inclusiveDescendant, 'adoptedCallback', [oldDocument, document]);
            }
        });
    }
}

// https://dom.spec.whatwg.org/#interface-documentfragment

function hostIncludingInclusiveAncestor(nodeA, nodeB) {
    if (inclusiveAncestor(nodeA, nodeB)) {
        return true;
    }

    var host = root(nodeB).host;

    if (host && hostIncludingInclusiveAncestor(nodeA, host)) {
        return true;
    }

    return false;
}

// https://dom.spec.whatwg.org/#interface-shadowroot

function shadowIncludingRoot(node) {
    var rootNode = root(node);
    if (isShadowRoot(rootNode)) {
        rootNode = shadowIncludingRoot(rootNode.host);
    }
    return rootNode;
}

function shadowIncludingDescendant(nodeA, nodeB) {
    do {
        if (isShadowRoot(nodeA)) {
            nodeA = nodeA.host;
        } else {
            nodeA = nodeA.parentNode;
        }
        if (nodeA === nodeB) {
            return true;
        }
    } while (nodeA != null);

    return false;
}

function shadowIncludingInclusiveDescendant(nodeA, nodeB) {
    return nodeA === nodeB || shadowIncludingDescendant(nodeA, nodeB);
}

function shadowIncludingAncestor(nodeA, nodeB) {
    return shadowIncludingDescendant(nodeB, nodeA);
}

function shadowIncludingInclusiveAncestor(nodeA, nodeB) {
    return nodeA === nodeB || shadowIncludingAncestor(nodeA, nodeB);
}

function closedShadowHidden(nodeA, nodeB) {
    // https://dom.spec.whatwg.org/#concept-closed-shadow-hidden
    var rootNode = root(nodeA);

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

function retarget(nodeA, nodeB) {
    // https://dom.spec.whatwg.org/#retarget
    // To retarget an object A against an object B, repeat these steps 
    // until they return an object:

    var rootNode = void 0;
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
            } else {
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
        } else {
            descriptors.Element.setAttribute.value.call(element, 'slot', value);
        }
        var elementState = getShadowState(element);
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

function changeAttribute(attribute, element, value) {
    // https://dom.spec.whatwg.org/#concept-element-attributes-change

    var name = attribute.localName;
    var nameSpace = attribute.namespaceURI;
    var oldValue = descriptors.Attr.value.get.call(attribute);
    var newValue = value;

    // 1. Queue a mutation record...
    queueMutationRecord('attributes', element, name, nameSpace, oldValue);

    // 2. If element is custom...
    if (_customElements2.default.isInstalled() && _customElements2.default.isCustom(element)) {
        var _args = [name, oldValue, newValue, nameSpace];
        _customElements2.default.enqueueCallbackReaction(element, 'attributeChangedCallback', _args);
    }

    // 3. Run the attribute change steps...
    attributeChangeSteps(element, name, oldValue, newValue, nameSpace);

    // 4. Set attribute's value...
    descriptors.Attr.value.set.call(attribute, newValue);
}

function appendAttribute(attribute, element) {
    // https://dom.spec.whatwg.org/#concept-element-attributes-append

    var name = attribute.localName;
    var nameSpace = attribute.namespaceURI;
    var oldValue = null;
    var newValue = descriptors.Attr.value.get.call(attribute);

    // 1. Queue a mutation record...
    queueMutationRecord('attributes', element, name, nameSpace, oldValue);

    // 2. If element is custom...
    if (_customElements2.default.isInstalled() && _customElements2.default.isCustom(element)) {
        var _args2 = [name, oldValue, newValue, nameSpace];
        _customElements2.default.enqueueCallbackReaction(element, 'attributeChangedCallback', _args2);
    }

    // 3. Run the attribute change steps...
    attributeChangeSteps(element, name, oldValue, newValue, nameSpace);

    // 4. Append the attribute to the element’s attribute list.
    descriptors.Element.setAttributeNodeNS.value.call(element, attribute);

    // Skip (native)
    // 5. Set attribute’s element to element.
}

function removeAttribute(attribute, element) {
    // https://dom.spec.whatwg.org/#concept-element-attributes-remove

    var name = attribute.localName;
    var nameSpace = attribute.namespaceURI;
    var oldValue = descriptors.Attr.value.get.call(attribute);
    var newValue = null;

    // 1. Queue a mutation record...
    queueMutationRecord('attributes', element, name, nameSpace, oldValue);

    // 2. If element is custom...
    if (_customElements2.default.isInstalled() && _customElements2.default.isCustom(element)) {
        var _args3 = [name, oldValue, newValue, nameSpace];
        _customElements2.default.enqueueCallbackReaction(element, 'attributeChangedCallback', _args3);
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

    var name = oldAttr.localName;
    var nameSpace = oldAttr.namespaceURI;
    var oldValue = descriptors.Attr.value.get.call(oldAttr);
    var newValue = descriptors.Attr.value.get.call(newAttr);

    // 1. Queue a mutation record...
    queueMutationRecord('attributes', element, name, nameSpace, oldValue);

    // 2. If element is custom...
    if (_customElements2.default.isInstalled() && _customElements2.default.isCustom(element)) {
        var _args4 = [name, oldValue, newValue, nameSpace];
        _customElements2.default.enqueueCallbackReaction(element, 'attributeChangedCallback', _args4);
    }

    // 3. Run the attribute change steps...
    attributeChangeSteps(element, name, oldValue, newValue, nameSpace);

    // 4. Replace oldAttr by newAttr in the element’s attribute list.
    descriptors.Element.setAttributeNodeNS.value.call(element, newAttr);

    // Skip (native)
    // 5. Set oldAttr’s element to null.
    // 6. Set newAttr’s element to element.
}

function setAttribute(attr, element) {
    if (attr.ownerElement != null && attr.ownerElement !== element) {
        throw makeError('InUseAttributeError');
    }
    var attributes = descriptors.Element.attributes.get.call(element);
    var oldAttr = attributes.getNamedItemNS(attr.namespaceURI, attr.localName);
    if (oldAttr === attr) {
        return attr;
    }
    if (oldAttr) {
        replaceAttribute(oldAttr, attr, element);
    } else {
        appendAttribute(attr, element);
    }
    return oldAttr;
}

function setAttributeValue(element, localName, value, prefix, ns) {
    prefix = prefix || null;
    ns = ns || null;
    var attributes = descriptors.Element.attributes.get.call(element);
    var attribute = attributes.getNamedItemNS(ns, localName);
    if (!attribute) {
        attribute = element.ownerDocument.createAttributeNS(ns, localName);
        descriptors.Attr.value.set.call(attribute, value);
        appendAttribute(attribute, element);
        return;
    }
    changeAttribute(attribute, element, value);
}

function removeAttributeByName(qualifiedName, element) {
    var attributes = descriptors.Element.attributes.get.call(element);
    var attr = attributes.getNamedItem(qualifiedName);
    if (attr) {
        removeAttribute(attr, element);
    }
    return attr;
}

function removeAttributeByNamespace(nameSpace, localName, element) {
    var attributes = descriptors.Element.attributes.get.call(element);
    var attr = attributes.getNamedItemNS(nameSpace, localName);
    if (attr) {
        removeAttribute(attr, element);
    }
    return attr;
}

function insertAdjacent(element, where, node) {
    if (!(node instanceof Node)) {
        throw makeError('TypeError');
    }
    var parent = void 0;
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

function setExistingAttributeValue(attribute, value) {
    if (attribute.ownerElement == null) {
        descriptors.Attr.value.set.call(attribute, value);
    } else {
        changeAttribute(attribute, attribute.ownerElement, value);
    }
}

// https://dom.spec.whatwg.org/#interface-characterdata

function replaceData(node, offset, count, data) {
    // https://dom.spec.whatwg.org/#concept-cd-replace
    if (data == null) {
        data = '';
    }
    var dataDescriptor = descriptors.CharacterData.data;
    var oldValue = dataDescriptor.get.call(node);
    var length = oldValue.length;
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
    var parent = slotable.parentNode;
    if (!parent) {
        return null;
    }

    // 2. Let shadow be slotable’s parent’s shadow root.
    var parentState = getShadowState(parent);

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

    var name = slotable instanceof Element ? slotable.slot : null;

    return treeOrderRecursiveSelectFirst(parentState.shadowRoot.firstChild, function (node) {
        return node.localName === 'slot' && node.name === name;
    });
}

function findSlotables(slot) {
    // https://dom.spec.whatwg.org/#find-slotables
    // To find slotables for a given slot slot, run these steps:

    // 1. Let result be an empty list.
    // PERF: allocations later on in algorithm
    var result = void 0;

    // 2. If slot’s root is not a shadow root, then return result.
    var slotRoot = root(slot);
    if (!isShadowRoot(slotRoot)) {
        // PERF: 'an empty list' from step 1
        return [];
    }

    // 3. Let host be slot’s root’s host.
    var host = slotRoot.host;

    // 4. For each slotable child of host, slotable, in tree order, run these substeps:
    var slotableChildren = host.childNodes;
    // PERF: allocation of result
    result = new Array(slotableChildren.length);
    var pushed = 0;
    for (var i = 0; i < slotableChildren.length; i++) {
        var slotable = slotableChildren[i];
        if (slotable.nodeType === Node.ELEMENT_NODE || slotable.nodeType === Node.TEXT_NODE) {
            // 1. Let foundSlot be the result of finding a slot given slotable.
            var foundSlot = findASlot(slotable);
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

function findFlattenedSlotables(slot) {
    // https://dom.spec.whatwg.org/#find-flattened-slotables
    // To find flattened slotables for a given slot slot, run these steps:

    // 1. Let result be an empty list.
    var result = [];

    // 2. Let slotables be the result of finding slotables given slot.
    var slotables = findSlotables(slot);

    // 3. If slotables is the empty list, then append each slotable child of slot, in tree order, to slotables.
    if (slotables.length === 0) {
        var slotableChildren = slot.childNodes;
        var slotableChildrenLength = slotableChildren.length;
        slotables.length = slotableChildrenLength;
        var slotablesPushed = 0;
        for (var i = 0; i < slotableChildrenLength; i++) {
            var slotableChild = slotableChildren[i];
            if (slotableChild.nodeType === Node.ELEMENT_NODE || slotableChild.nodeType === Node.TEXT_NODE) {
                slotables[slotablesPushed++] = slotableChild;
            }
        }
        slotables.length = slotablesPushed;
    }

    // 4. For each node in slotables, run these substeps:
    for (var _i2 = 0; _i2 < slotables.length; _i2++) {
        var node = slotables[_i2];
        // 1. If node is a slot, run these subsubsteps:
        if (node.localName === 'slot') {
            var temporaryResult = findFlattenedSlotables(node);
            var resultLength = resultLength;
            result.length += temporaryResult.length;
            for (var j = 0; j < temporaryResult.length; j++) {
                result[resultLength + j] = temporaryResult[k];
            }
        } else {
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
    var slotables = findSlotables(slot);

    // 2. If suppress signaling flag is unset, and slotables and slot’s assigned 
    // nodes are not identical, then run signal a slot change for slot.
    var identical = true;
    var slotState = getShadowState(slot) || setShadowState(slot, {});
    var assignedNodes = slotState.assignedNodes || [];
    for (var i = 0; i < slotables.length; i++) {
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
    for (var _i3 = 0; _i3 < slotables.length; _i3++) {
        var slotable = slotables[_i3];
        // If it's a slotable it should already have an associated state object.
        getShadowState(slotable).assignedSlot = slot;
    }

    // 4a. If we haven't tracked them yet, track the slot's logical children
    if (!slotState.childNodes) {
        var slotChildNodes = descriptors.Node.childNodes.get.call(slot);
        var slotChildNodesLength = slotChildNodes.length;
        slotState.childNodes = new Array(slotChildNodesLength);
        for (var _i4 = 0; _i4 < slotChildNodesLength; _i4++) {
            slotState.childNodes[_i4] = slotChildNodes[_i4];
        }
    }

    // function call avoiding closure for performance.
    if (!identical) {
        setImmediate(renderSlotablesAsync, slot);
    }
}

function renderSlotablesAsync(slot) {
    var slotState = getShadowState(slot);
    var slotables = slotState.assignedNodes;

    // 4b. Clean out the slot
    var firstChild = void 0;
    while (firstChild = descriptors.Node.firstChild.get.call(slot)) {
        descriptors.Node.removeChild.value.call(slot, firstChild);
    }

    // 4c. Append the slotables, if any
    for (var i = 0; i < slotables.length; i++) {
        var slotable = slotables[i];
        descriptors.Node.appendChild.value.call(slot, slotable);
    }

    // 4d. Append the fallback content, if no slots
    if (!slotables.length) {
        var childNodes = slotState.childNodes;
        for (var _i5 = 0; _i5 < childNodes.length; _i5++) {
            descriptors.Node.appendChild.value.call(slot, childNodes[_i5]);
        }
    }
}

function assignSlotablesForATree(tree, noSignalSlots) {
    // https://dom.spec.whatwg.org/#assign-slotables-for-a-tree
    // To assign slotables for a tree, given a tree tree and an optional set of slots noSignalSlots
    // (empty unless stated otherwise), run these steps for each slot slot in tree, in tree order:
    var slots = [];

    if (tree.localName === 'slot') {
        slots[0] = tree;
    }

    treeOrderRecursiveSelectAll(tree, slots, function (descendant) {
        return descendant.localName === 'slot';
    });

    for (var i = 0; i < slots.length; i++) {
        var slot = slots[i];

        // 1. Let suppress signaling flag be set, if slot is in noSignalSlots, and unset otherwise.
        var suppressSignaling = noSignalSlots && noSignalSlots.indexOf(slot) !== -1;

        // 2. Run assign slotables for slot with suppress signaling flag.
        assignSlotables(slot, suppressSignaling);
    }
}

function assignASlot(slotable) {
    var slot = findASlot(slotable);

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

function preInsert(node, parent, child) {
    // https://dom.spec.whatwg.org/#concept-node-pre-insert
    // To pre-insert a node into a parent before a child, run these steps:

    // 1. Ensure pre-insertion validity of node into parent before child.
    ensurePreInsertionValidity(node, parent, child);

    // 2. Let reference child be child.
    var referenceChild = child;

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

function insert(node, parent, child, suppressObservers) {
    // https://dom.spec.whatwg.org/#concept-node-insert
    // To insert a node into a parent before a child, with an optional suppress observers flag, run these steps:

    // 1. Let count be the number of children of node if it is a DocumentFragment node, and one otherwise.
    var count = 1;
    var nodeChildNodes = void 0;
    if (node.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
        nodeChildNodes = node.childNodes;
        count = nodeChildNodes.length;
    }

    // Skip (Range)
    // 2. If child is non-null, run these substeps:

    // 3. Let nodes be node’s children if node is a DocumentFragment node, 
    // and a list containing solely node otherwise.
    var nodes = new Array(count);

    // 4. If node is a DocumentFragment node, remove its children with the suppress observers flag set.
    if (node.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
        for (var i = 0; i < count; i++) {
            nodes[i] = nodeChildNodes[i];
        }
        for (var _i6 = 0; _i6 < count; _i6++) {
            remove(nodes[_i6], node, true);
        }
        // 5. If node is a DocumentFragment node, queue a mutation record of "childList" for node with removedNodes nodes.
        queueMutationRecord('childList', node, null, null, null, null, nodes);
    } else {
        nodes[0] = node;
    }

    // 6. For each node in nodes, in tree order, run these substeps:
    var parentState = getShadowState(parent);
    var parentIsShadow = isShadowRoot(parent);
    var parentStateChildNodes = parentState ? parentState.childNodes : null;
    var parentIsConnected = parent.isConnected;
    for (var _i7 = 0; _i7 < count; _i7++) {
        var _node = nodes[_i7];
        // 1. Insert node into parent before child or at the end of parent if child is null.
        if (parentStateChildNodes) {
            if (child) {
                var childIndex = parentStateChildNodes.indexOf(child);
                // TODO: PERF: Probably not worth the readability sacrifice to manually 
                // roll a splice algorithm here, but will come back to this later
                parentStateChildNodes.splice(childIndex, 0, _node);
            } else {
                parentStateChildNodes.push(_node);
            }
            var nodeState = getShadowState(_node) || setShadowState(_node, {});
            nodeState.parentNode = parent;
            // If it's a shadow root, perform physical insert on the host.
            if (parentIsShadow) {
                descriptors.Node.insertBefore.value.call(parentState.host, _node, child);
            }
        } else {
            descriptors.Node.insertBefore.value.call(parent, _node, child);
        }

        // 2. If parent is a shadow host and node is a slotable, then assign a slot for node.
        if (parentState && parentState.shadowRoot && 'assignedSlot' in _node) {
            assignASlot(_node);
        }

        // 3. If parent is a slot whose assigned nodes is the empty list, 
        // then run signal a slot change for parent.
        if (parent.localName === 'slot' && (!parentState || !parentState.assignedNodes || parentState.assignedNodes.length === 0)) {
            // 3a. Physically append the child into the slot.
            descriptors.Node.appendChild.value.call(parent, _node);
            // 3b. Do what the spec said
            signalASlotChange(parent);
        }

        // 4. Run assign slotables for a tree with node’s tree and a set containing 
        // each inclusive descendant of node that is a slot.
        var inclusiveSlotDescendants = [];
        if (_node.localName === 'slot') {
            inclusiveSlotDescendants[0] = _node;
        }
        treeOrderRecursiveSelectAll(_node, inclusiveSlotDescendants, function (descendant) {
            return descendant.localName === 'slot';
        });
        assignSlotablesForATree(_node, inclusiveSlotDescendants);

        if (!_customElements2.default.isInstalled() || !parentIsConnected) {
            continue;
        }

        // 5. For each shadow-including inclusive descendant inclusiveDescendant of node, 
        // in shadow-including tree order, run these subsubsteps:
        forEachShadowIncludingInclusiveDescendant(_node, function (inclusiveDescendant) {
            // Skip (other)
            // 1. Run the insertion steps with inclusiveDescendant
            // PERF: moved this check out of the loop.
            // 2. If inclusiveDescendant is connected, then...
            // 1. If inclusiveDescendant is custom, then enqueue a custom element 
            // callback reaction with inclusiveDescendant, callback name 
            // "connectedCallback", and an empty argument list.
            if (_customElements2.default.isCustom(inclusiveDescendant)) {
                _customElements2.default.enqueueCallbackReaction(inclusiveDescendant, 'connectedCallback', []);
            }
            // 2. Otherwise, try to upgrade inclusiveDescendant.
            else {
                    _customElements2.default.tryToUpgradeElement(inclusiveDescendant);
                }
        });
    }

    // 7. If suppress observers flag is unset, queue a mutation record of "childList" for parent 
    // with addedNodes nodes, nextSibling child, and previousSibling child’s previous sibling or 
    // parent’s last child if child is null.
    if (!suppressObservers) {
        var previousSibling = child ? child.previousSibling : parent.lastChild;
        queueMutationRecord('childList', parent, null, null, null, nodes, null, previousSibling, child);
    }
}

function append(node, parent) {
    // https://dom.spec.whatwg.org/#concept-node-append
    // To append a node to a parent, pre-insert node into parent before null.
    preInsert(node, parent, null);
}

function replace(child, node, parent) {
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
    var referenceChild = child.nextSibling;

    // 8. If reference child is node, set it to node’s next sibling.
    if (referenceChild === node) {
        referenceChild = node.nextSibling;
    }

    // 9. Let previousSibling be child’s previous sibling.
    var previousSibling = child.previousSibling;

    // 10. Adopt node into parent’s node document.
    adopt(node, parent.ownerDocument);

    // 11. Let removedNodes be the empty list.
    var removedNodes = [];

    // 12. If child’s parent is not null, run these substeps:
    var childParent = child.parentNode;
    if (childParent != null) {
        // 1. Set removedNodes to a list solely containing child.
        removedNodes[0] = child;
        // 2. Remove child from its parent with the suppress observers flag set.
        remove(child, parent, true);
    }

    // 13. Let nodes be node’s children if node is a DocumentFragment node, and a list containing solely node otherwise.
    var nodes = void 0;
    if (node instanceof DocumentFragment) {
        var childNodes = node.childNodes;
        var childNodesLength = childNodes.length;
        nodes = new Array(childNodesLength);
        for (var i = 0; i < childNodesLength; i++) {
            nodes[i] = childNodes[i];
        }
    } else {
        nodes = [node];
    }

    // 14. Insert node into parent before reference child with the suppress observers flag set.
    insert(node, parent, referenceChild, true);

    // 15. Queue a mutation record of "childList" for target parent with addedNodes nodes, 
    // removedNodes removedNodes, nextSibling reference child, and previousSibling previousSibling.
    queueMutationRecord('childList', parent, null, null, null, nodes, removedNodes, previousSibling, referenceChild);
}

function replaceAll(node, parent) {
    // https://dom.spec.whatwg.org/#concept-node-replace-all
    // To replace all with a node within a parent, run these steps:

    // 1. If node is not null, adopt node into parent’s node document.
    if (node != null) {
        adopt(node, parent.ownerDocument);
    }

    // 2. Let removedNodes be parent’s children.
    var parentChildNodes = parent.childNodes;
    var removedNodesCount = parentChildNodes.length;
    var removedNodes = new Array(removedNodesCount);
    for (var i = 0; i < removedNodesCount; i++) {
        removedNodes[i] = parentChildNodes[i];
    }

    // 3. Let addedNodes be the empty list if node is null, node’s children if 
    // node is a DocumentFragment node, and a list containing node otherwise.
    var addedNodes = void 0;
    if (node == null) {
        addedNodes = [];
    } else if (node.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
        var nodeChildNodes = node.childNodes;
        var nodeChildNodesLength = nodeChildNodes.length;
        addedNodes = new Array(nodeChildNodesLength);
        for (var _i8 = 0; _i8 < nodeChildNodesLength; _i8++) {
            addedNodes[_i8] = nodeChildNodes[_i8];
        }
    } else {
        addedNodes = [node];
    }

    // 4. Remove all parent’s children, in tree order, with the suppress observers flag set.
    for (var _i9 = 0; _i9 < removedNodesCount; _i9++) {
        remove(removedNodes[_i9], parent, true);
    }

    // 5. If node is not null, insert node into parent before null with the suppress observers flag set.
    if (node != null) {
        insert(node, parent, null, true);
    }

    // 6. Queue a mutation record of "childList" for parent with addedNodes addedNodes and removedNodes removedNodes.
    queueMutationRecord('childList', parent, null, null, null, addedNodes, removedNodes);
}

function preRemove(child, parent) {
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

function remove(node, parent, suppressObservers) {
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
    var oldPreviousSibling = node.previousSibling;

    // 8. Let oldNextSibling be node’s next sibling.
    var oldNextSibling = node.nextSibling;

    // 9. Remove node from its parent.
    var nodeState = getShadowState(node);
    var parentState = getShadowState(parent);
    if (parentState && parentState.childNodes) {
        var nodeIndex = parentState.childNodes.indexOf(node);
        parentState.childNodes.splice(nodeIndex, 1);
        // Should always have nodeState if we got here.
        nodeState.parentNode = null;
        var parentNode = descriptors.Node.parentNode.get.call(node);
        descriptors.Node.removeChild.value.call(parentNode, node);
    } else {
        descriptors.Node.removeChild.value.call(parent, node);
    }

    // 10. If node is assigned, then run assign slotables for node’s assigned slot.
    if (nodeState && nodeState.assignedSlot) {
        assignSlotables(nodeState.assignedSlot);
        nodeState.assignedSlot = null;
    }

    // 11. If parent is a slot whose assigned nodes is the empty list,
    // then run signal a slot change for parent.
    if (parent.localName === 'slot' && (!parentState || !parentState.assignedNodes || parentState.assignedNodes.length === 0)) {
        signalASlotChange(parent);
    }

    // 12. If node has an inclusive descendant that is a slot, then:
    var inclusiveSlotDescendants = [];
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

    if (_customElements2.default.isInstalled()) {
        // 14. If node is custom, then enqueue a custom element callback reaction 
        // with node, callback name "disconnectedCallback", and an empty argument list.
        if (_customElements2.default.isCustom(node)) {
            _customElements2.default.enqueueCallbackReaction(node, 'disconnectedCallback', []);
        }

        // 15. For each shadow-including descendant descendant of node, in 
        // shadow-including tree order, run these substeps:
        forEachShadowIncludingDescendant(node, function (descendant) {
            // Skip (other)
            // 1. Run the removing steps with descendant.

            // 2. If descendant is custom, then enqueue a custom element 
            // callback reaction with descendant, callback name "disconnectedCallback", 
            // and an empty argument list.
            if (_customElements2.default.isCustom(descendant)) {
                _customElements2.default.enqueueCallbackReaction(descendant, 'disconnectedCallback', []);
            }
        });
    }

    // 16. For each inclusive ancestor inclusiveAncestor of parent...
    var inclusiveAncestor = parent;
    while (inclusiveAncestor) {
        // ...if inclusiveAncestor has any registered observers whose options' 
        // subtree is true, then for each such registered observer registered... 
        var ancestorState = getShadowState(inclusiveAncestor);
        if (ancestorState && ancestorState.observers) {
            var ancestorObservers = ancestorState.observers;
            for (var i = 0; i < ancestorObservers.length; i++) {
                var registeredObserver = ancestorObservers[i];
                if (registeredObserver.options.subtree) {
                    // ...append a transient registered observer whose observer and options are 
                    // identical to those of registered and source which is registered to node’s 
                    // list of registered observers.
                    var observer = registeredObserver.instance;
                    var options = registeredObserver.options;
                    var transientObserver = createTransientObserver(observer, node, options);
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
    var nodeState = getShadowState(node) || setShadowState(node, {});
    var observers = nodeState.observers;
    return observers ? observers : nodeState.observers = [];
}

function createMutationObserver(callback) {
    return {
        callback: callback,
        queue: [],
        nodes: [],
        observe: function observe(node, options) {
            if (this.nodes.length === 0) {
                mutationObservers.push(this);
            }
            var nodeObservers = getOrCreateNodeObservers(node);
            nodeObservers.push({ instance: this, options: options });
            this.nodes.push(node);
        },
        disconnect: function disconnect() {
            var index = mutationObservers.indexOf(this);
            mutationObservers.splice(index, 1);
            for (var i = 0; i < this.nodes.length; i++) {
                var nodeObservers = getOrCreateNodeObservers(this.nodes[i]);
                for (var j = 0; j < nodeObservers.length; j++) {
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
    var transientObserver = {
        observer: observer,
        callback: observer.callback,
        options: options,
        queue: [],
        node: node,
        disconnect: function disconnect() {
            var nodeObservers = getOrCreateNodeObservers(this.node);
            for (var j = 0; j < nodeObservers.length; j++) {
                if (nodeObservers[j].instance === this) {
                    nodeObservers.splice(j, 1);
                    break;
                }
            }
        }
    };

    var nodeObservers = getOrCreateNodeObservers(node);
    nodeObservers.push({ instance: transientObserver, options: options });

    return transientObserver;
}

var mutationObserverCompoundMicrotaskQueuedFlag = false;

var mutationObservers = [];
var signalSlotList = [];
var theEmptyList = Object.freeze([]);

function queueMutationRecord(type, target, name, nameSpace, oldValue, addedNodes, removedNodes, previousSibling, nextSibling) {
    // PERF: This is an out-of-spec optimization
    if (mutationObservers.length === 0) {
        return;
    }

    // https://dom.spec.whatwg.org/#queueing-a-mutation-record
    // 1. Let interested observers be an initially empty set of 
    // MutationObserver objects optionally paired with a string.
    var interestedObservers = [];
    var pairedStrings = [];
    // 2. Let nodes be the inclusive ancestors of target.
    var nodes = [target];
    var ancestor = target;
    while (ancestor = ancestor.parentNode) {
        nodes.push(ancestor);
    }
    // 3. Then, for each node in nodes... 
    for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        var nodeState = getShadowState(node);
        if (!nodeState || !nodeState.observers) {
            continue;
        }
        // ...and then for each registered observer (with registered 
        // observer’s options as options) in node’s list of registered 
        // observers...
        for (var j = 0; j < nodeState.observers.length; j++) {
            var registeredObserver = nodeState.observers[j];
            var options = registeredObserver.options;
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
                if (options.attributeFilter && (options.attributeFilter.indexOf(name) === -1 || nameSpace != null)) {
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
            var observer = registeredObserver.instance;
            var index = interestedObservers.indexOf(observer);
            if (index === -1) {
                index = interestedObservers.length;
                interestedObservers[index] = observer;
            }
            // 2. If either type is "attributes" and options’ attributeOldValue is true, 
            // or type is "characterData" and options’ characterDataOldValue is true, 
            // set the paired string of registered observer’s observer in interested observers to oldValue.
            if (type === 'attributes' && options.attributeOldValue || type === 'characterData' && options.characterDataOldValue) {
                pairedStrings[index] = oldValue;
            }
        }
    }

    // PERF: This is an out-of-spec optimization
    if (interestedObservers.length === 0) {
        return;
    }

    // 4. Then, for each observer in interested observers, run these substeps:
    for (var _i10 = 0; _i10 < interestedObservers.length; _i10++) {
        var _observer = interestedObservers[_i10];
        // 1. Let record be a new MutationRecord object with its type set to type and target set to target.
        var record = {
            type: type,
            target: target,
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
        record.oldValue = pairedStrings[_i10];
        // 8. Append record to observer’s record queue.
        _observer.queue.push(record);
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
    var mutationObserversLength = mutationObservers.length;
    var notifyList = new Array(mutationObserversLength);
    for (var i = 0; i < mutationObserversLength; i++) {
        notifyList[i] = mutationObservers[i];
    }
    var signalList = signalSlotList.splice(0, signalSlotList.length);
    for (var _i11 = 0; _i11 < notifyList.length; _i11++) {
        var observer = notifyList[_i11];
        var queue = observer.queue.splice(0, observer.queue.length);
        for (var j = mutationObservers.length - 1; j >= 0; j--) {
            var transientObserver = mutationObservers[j];
            if (transientObserver.observer === observer) {
                mutationObservers.splice(j, 1);
                transientObserver.disconnect();
            }
        }
        if (queue.length) {
            try {
                observer.callback.call(observer.interface, queue, observer.interface);
            } catch (error) {
                reportError(error);
            }
        }
    }
    for (var _i12 = 0; _i12 < signalList.length; _i12++) {
        var slot = signalList[_i12];
        var event = slot.ownerDocument.createEvent('event');
        event.initEvent('slotchange', true, false);
        try {
            slot.dispatchEvent(event);
        } catch (error) {
            reportError(error);
        }
    }
}

},{"./custom-elements.js":1}]},{},[19]);

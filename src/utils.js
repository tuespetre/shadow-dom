// NOTE: setTimeout with args does not work in IE9. There is a note in the README about this.
const setImmediate = 'setImmediate' in window ? window.setImmediate.bind(window) : function (callback, ...args) {
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

const nodeAppendChildDescriptor = descriptor(Node, 'appendChild');
const documentCreateElementDescriptor = descriptor(Document, 'createElement');

export default {
    descriptor,
    setImmediate,
    setPrototypeOf,
    makeDOMException,
    reportError,
    extend,
    getShadowState,
    setShadowState,
    isElementNode,
    getUniqueSortedTokens,
    hasAll
};

function descriptor(type, name) {
    return Object.getOwnPropertyDescriptor(type.prototype, name);
}

// TODO: analyze usages and provide brief but descriptive messages
function makeDOMException(name, message) {
    try {
        const sacrifice = documentCreateElementDescriptor.value.call(window.document, 'div');
        nodeAppendChildDescriptor.value.call(sacrifice, sacrifice);
    }
    catch (caught) {
        return Object.create(caught, {
            'message': {
                get: function () {
                    return message;
                }
            },
            'name': {
                get: function () {
                    return name;
                }
            },
            'code': {
                get: function () {
                    return caught.code;
                }
            },
            'toString': {
                value: function () {
                    if (message) {
                        return name + ': ' + message;
                    }
                    return name;
                }
            }
        });
    }
}

function reportError(error) {
    if ('console' in window && 'error' in window.console) {
        window.console.error(error);
    }
}

function extend(object, ...mixins) {
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

function getShadowState(object) {
    return object._shadow;
}

function setShadowState(object, state) {
    return object._shadow = state;
}

function isElementNode(node) {
    return node.nodeType === Node.ELEMENT_NODE;
}

function hasAll(desiredItems, itemsInQuestion) {
    // depends on sorted, unique input.
    if (itemsInQuestion.length < desiredItems.length) {
        return false;
    }

    let d = 0;
    let i = 0;
    let desiredItem = desiredItems[0];
    let itemInQuestion = itemsInQuestion[0];
    let iLength = itemsInQuestion.length;
    let dLength = desiredItems.length;
    do {
        if (itemInQuestion === desiredItem) {
            desiredItem = desiredItems[++d];
        }
        itemInQuestion = itemsInQuestion[++d];
    }
    while (d <= dLength && i <= iLength);
    return d > dLength;
}

function getUniqueSortedTokens(tokens) {        
    if (tokens === null || tokens === undefined || tokens === '') {
        return null;
    }

    tokens = tokens.trim().split(/\s+/).sort();

    if (tokens.length > 1) {
        let last = tokens[0];
        const unique = [last];
        for (let i = 1; i < tokens.length; i++) {
            const current = tokens[i];
            if (current === last) {
                continue;
            }
            unique.push(current);
            last = current;
        }
        tokens = unique;
    }

    return tokens;
}
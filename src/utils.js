const setImmediate = 'setImmediate' in window ? window.setImmediate.bind(window) : function (callback, ...args) {
    return setTimeout(callback, 0, ...args);
};

const brokenAccessors = typeof descriptor(Node, 'childNodes').get === 'undefined';

const nodeAppendChildDescriptor = descriptor(Node, 'appendChild');
const documentCreateElementDescriptor = descriptor(Document, 'createElement');

export default {
    brokenAccessors,
    descriptor,
    setImmediate,
    makeDOMException,
    reportError,
    extend,
    defineProperty,
    deleteProperty,
    getShadowState,
    setShadowState,
    isElementNode,
    getUniqueSortedTokens,
    hasAll
};

function descriptor(type, name) {
    return Object.getOwnPropertyDescriptor(type.prototype || type, name);
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

function reportWarning(message) {
    if ('console' in window && 'warn' in window.console) {
        window.console.warn(message);
    }
}

function reportError(error) {
    if ('console' in window && 'error' in window.console) {
        window.console.error(error);
    }
}

function extend(extending, mixin) {
    mixin = mixin.prototype || mixin;
    const names = Object.getOwnPropertyNames(mixin);
    for (let j = 0; j < names.length; j++) {
        const name = names[j];
        if (name === 'constructor') {
            continue;
        }
        const newDescriptor = Object.getOwnPropertyDescriptor(mixin, name);
        newDescriptor.configurable = true;
        if (extending.prototype) {
            const oldDescriptor = Object.getOwnPropertyDescriptor(extending.prototype, name);
            if (oldDescriptor) {
                if ('value' in newDescriptor) {
                    if (!oldDescriptor.writable) {
                        //reportWarning('Unable to configure data property: ' + name);
                        continue;
                    }
                    extending.prototype[name] = newDescriptor.value;
                    continue;
                }
                if (('get' in newDescriptor || 'set' in newDescriptor) && !oldDescriptor.configurable) {
                    //reportWarning('Unable to configure accessor property: ' + name);
                    continue;
                }
            }
            Object.defineProperty(extending.prototype, name, newDescriptor);
        }
        else {
            Object.defineProperty(extending, name, newDescriptor);
        }
    }
}

function defineProperty(prototype, name, newDescriptor) {
    newDescriptor.configurable = true;
    newDescriptor.enumerable = true;
    const oldDescriptor = Object.getOwnPropertyDescriptor(prototype, name);
    if ('value' in newDescriptor) {
        newDescriptor.writable = true;
        if (oldDescriptor && !oldDescriptor.configurable) {
            prototype[name] = newDescriptor.value;
            return;
        }
    }
    Object.defineProperty(prototype, name, newDescriptor);
}

function deleteProperty(constructor, name) {
    const descriptor = Object.getOwnPropertyDescriptor(constructor.prototype, name);
    if (!descriptor) {
        return;
    }
    if (!descriptor.configurable) {
        console.warn(`Warning: unable to delete property '${name}' of ${constructor.name}`);
        return;
    }
    delete constructor.prototype[name];
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
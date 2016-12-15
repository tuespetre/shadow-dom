// https://dom.spec.whatwg.org/#interface-eventtarget

import $dom from '../dom.js';
import $utils from '../utils.js';
import $Event from './Event.js';

export default {
    install
};

const ieBrowserToolsCallbackMagicString = 'function __BROWSERTOOLS_CONSOLE_SAFEFUNC(){try{return n(arguments)}catch(i){t(i)}}';

const eventTargetDescriptor = $utils.descriptor(Event, 'target');

const focusEventRelatedTargetDescriptor = $utils.descriptor(FocusEvent, 'relatedTarget');
const mouseEventRelatedTargetDescriptor = $utils.descriptor(MouseEvent, 'relatedTarget');

let getEventTarget = event => eventTargetDescriptor.get.call(event);
let getFocusEventRelatedTarget = event => focusEventRelatedTargetDescriptor.get.call(event);
let getMouseEventRelatedTarget = event => mouseEventRelatedTargetDescriptor.get.call(event);

if ($utils.brokenAccessors) {
    getEventTarget = function (event) {
        const state = $utils.getShadowState(event);
        return state.nativeEvent.target;
    };
    getFocusEventRelatedTarget = function (event) {
        const state = $utils.getShadowState(event);
        return state.nativeEvent.relatedTarget;
    };
    getMouseEventRelatedTarget = getFocusEventRelatedTarget;
}

const $EventTarget = function (base) {

    const native = {
        addEventListener: base.prototype.addEventListener,
        removeEventListener: base.prototype.removeEventListener,
        dispatchEvent: base.prototype.dispatchEvent
    };

    return {

        addEventListener(type, callback, options) {
            if (typeof (callback) !== 'function') {
                return;
            }

            if (this instanceof Document && callback.toString() === ieBrowserToolsCallbackMagicString) {
                native.addEventListener.call(this, type, callback, options);
                return;
            }

            const listener = { callback };
            let capture = false;

            if (typeof options === 'boolean') {
                capture = options;
            }
            else if (typeof options !== 'undefined') {
                capture = options.capture === true;
                listener.once = options.once === true;
                // we don't do anything with passive.
                listener.passive = options.passive === true;
            }

            let collection =
                getEventListenerCollection(this, type, capture) ||
                createEventListenerCollection(this, type, capture);

            collection.addListener(this, listener);
            collection.attach(native.addEventListener);
        },

        removeEventListener(type, callback, options) {
            if (typeof (callback) !== 'function') {
                return;
            }

            if (this instanceof Document && callback.toString() === ieBrowserToolsCallbackMagicString) {
                native.removeEventListener.call(this, type, callback, options);
                return;
            }

            const listener = { callback };
            let capture = false;

            if (typeof options === 'boolean') {
                capture = options;
            }
            else if (typeof options !== 'undefined') {
                capture = options.capture === true;
            }

            let collection = getEventListenerCollection(this, type, capture);

            if (!collection) {
                return;
            }

            collection.removeListener(this, listener);

            if (collection.empty) {
                collection.detach(native.removeEventListener);
            }
        },

    };

}

function install() {
    // In IE and Safari < 10, EventTarget is not exposed and Window's
    // EventTarget methods are not the same as Node's.
    if ('EventTarget' in Window) {
        $utils.extend(EventTarget, $EventTarget(EventTarget));
    }
    else {
        $utils.extend(Window, $EventTarget(Window));
        $utils.extend(Node, $EventTarget(Node));
    }
}

const EventListenerCollection = function (target, type, capture) {
    this.target = target;
    this.type = type;
    this.capture = capture;
    this.hostListeners = [];
    this.shadowListeners = [];

    this.callback = event => {
        const phase = event.eventPhase;
        switch (phase) {
            case Event.prototype.CAPTURING_PHASE:
                if (this.hostListeners.length) {
                    this.invokeListeners(event, this.target, this.hostListeners);
                }
                if (this.shadowListeners.length) {
                    this.invokeListeners(event, $utils.getShadowState(target).shadowRoot, this.shadowListeners);
                }
                break;
            case Event.prototype.AT_TARGET:
                const nativeTarget = getEventTarget(event);
                const listeners = this.getListeners(nativeTarget);
                if (listeners.length) {
                    this.invokeListeners(event, nativeTarget, listeners);
                }
                break;
            case Event.prototype.BUBBLING_PHASE:
                if (this.shadowListeners.length) {
                    this.invokeListeners(event, $utils.getShadowState(target).shadowRoot, this.shadowListeners);
                }
                if (this.hostListeners.length) {
                    this.invokeListeners(event, this.target, this.hostListeners);
                }
                break;
        }
    };

    if ($utils.brokenAccessors) {
        const innerCallback = this.callback;
        this.callback = event => {
            const wrapper = wrapEventWithBrokenAccessors(event);
            innerCallback(wrapper);
        };
    }
};

function getEventListenerCollection(target, type, capture) {
    let targetState = $utils.getShadowState(target);
    let nativeTarget = target;
    let nativeTargetState = targetState;
    if (targetState && targetState.host) {
        nativeTarget = targetState.host;
        nativeTargetState = $utils.getShadowState(nativeTarget);
    }
    if (!nativeTargetState || !nativeTargetState.listeners) {
        return null;
    }
    const collections = nativeTargetState.listeners;
    for (let i = 0; i < collections.length; i++) {
        const collection = collections[i];
        if (collection.target === nativeTarget &&
            collection.type === type &&
            collection.capture === capture) {
            return collection;
        }
    }
    return null;
};

function createEventListenerCollection(target, type, capture) {
    let targetState = $utils.getShadowState(target);
    let nativeTarget = target;
    let nativeTargetState = targetState;
    if (targetState && targetState.host) {
        nativeTarget = targetState.host;
        nativeTargetState = $utils.getShadowState(nativeTarget);
    }
    if (!nativeTargetState) {
        nativeTargetState = $utils.setShadowState(nativeTarget, { listeners: [] });
    }
    else if (!nativeTargetState.listeners) {
        nativeTargetState.listeners = [];
    }
    const collection = new EventListenerCollection(nativeTarget, type, capture);
    nativeTargetState.listeners.push(collection);
    return collection;
};

EventListenerCollection.prototype = {

    get empty() {
        return this.hostListeners.length === 0
            && this.shadowListeners.length === 0;
    },

    getListeners(target) {
        let targetState = $utils.getShadowState(target);
        if (targetState && targetState.host) {
            return this.shadowListeners;
        }
        return this.hostListeners;
    },

    addListener(target, listener) {
        const listeners = this.getListeners(target);

        for (let i = 0; i < listeners.length; i++) {
            if (listener.callback === listeners[i].callback) {
                return;
            }
        }

        listeners.push(listener);
    },

    removeListener(target, listener) {
        const listeners = this.getListeners(target);

        for (let i = 0; i < listeners.length; i++) {
            const other = listeners[i];
            if (listener.callback === other.callback) {
                listeners.splice(i, 1);
                break;
            }
        }
    },

    invokeListeners(event, currentTarget, listeners) {
        const eventState = $utils.getShadowState(event) || $utils.setShadowState(event, {});
        let path = eventState.calculatedPath;
        if (!path) {
            path = eventState.calculatedPath = calculatePath(event);
        }
        // if there is no target, the event is not composed and should be stopped
        const target = calculateTarget(currentTarget, path);
        if (!target) {
            event.stopImmediatePropagation();
        }
        else {
            const relatedTarget = calculateRelatedTarget(currentTarget, path);
            let remove;

            eventState.path = path;
            eventState.currentTarget = currentTarget;
            eventState.target = target;
            eventState.relatedTarget = relatedTarget;

            for (let i = 0; i < listeners.length; i++) {
                const listener = listeners[i];
                const result = listener.callback.call(currentTarget, event);
                if (listener.once) {
                    if (!remove) {
                        remove = [listener];
                    }
                    else {
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
                for (let i = 0; i < remove.length; i++) {
                    let index = listeners.indexOf(remove[i]);
                    listeners.splice(index, 1);
                }
            }
        }
    },

    attach(descriptor) {
        descriptor.call(this.target, this.type, this.callback, this.capture);
    },

    detach(descriptor) {
        descriptor.call(this.target, this.type, this.callback, this.capture);
    },

}

function calculatePath(event) {
    // https://dom.spec.whatwg.org/#concept-event-dispatch

    const path = [];
    let p = 0;

    let target = getEventTarget(event);

    let getRelatedTarget = null;

    if (event instanceof FocusEvent) {
        getRelatedTarget = getFocusEventRelatedTarget;
    }
    else if (event instanceof MouseEvent) {
        getRelatedTarget = getMouseEventRelatedTarget;
    }

    // 1. Set event’s dispatch flag.
    // SKIP: native

    // 2. Let targetOverride be target, if legacy target override flag is 
    // not given, and target’s associated Document otherwise. 
    const targetOverride = target;

    // 3. Let relatedTarget be the result of retargeting event’s relatedTarget 
    // against target if event’s relatedTarget is non-null, and null otherwise.
    let originalRelatedTarget = null;
    let relatedTarget = null;
    if (getRelatedTarget) {
        originalRelatedTarget = getRelatedTarget(event);
        if (originalRelatedTarget) {
            relatedTarget = $dom.retarget(originalRelatedTarget, target);
        }
    }

    // 4. If target is relatedTarget and target is not event’s relatedTarget, then return true.
    // SKIP: native

    // 5. Append (target, targetOverride, relatedTarget) to event’s path.
    path[p++] = [target, targetOverride, relatedTarget];

    // 6. Let isActivationEvent be true, if event is a MouseEvent object and 
    // event’s type attribute is "click", and false otherwise.
    // SKIP: native

    // 7. Let activationTarget be target, if isActivationEvent is true and 
    // target has activation behavior, and null otherwise.
    // SKIP: native

    // 8. Let parent be the result of invoking target’s get the parent with event.
    let parent = getTheParent(target, event, path);

    // 9. While parent is non-null:
    while (parent != null) {
        // 1. Let relatedTarget be the result of retargeting event’s relatedTarget
        // against parent if event’s relatedTarget is non-null, and null otherwise.
        if (originalRelatedTarget) {
            relatedTarget = $dom.retarget(originalRelatedTarget, parent);
        }
        // 2. If target’s root is a shadow-including inclusive ancestor of parent, then... 
        // append (parent, null, relatedTarget) to event’s path.
        if ($dom.shadowIncludingInclusiveAncestor($dom.root(target), parent)) {
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
            if (event.type === 'load') { // or browsing context?
                return null;
            }
            return node.defaultView;
        }
        else if ($dom.isShadowRoot(node)) {
            if (!event.composed) {
                const item = path[0][0];
                if ($dom.root(item) === node) {
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
    for (let i = 0; i < path.length; i++) {
        const item = path[i][0];
        const relatedTarget = path[i][2];
        if (item === currentTarget) {
            return relatedTarget;
        }
    }
    return null;
}

function calculateTarget(currentTarget, path) {
    for (let i = 0; i < path.length; i++) {
        const item = path[i][0];
        if (item === currentTarget) {
            for (let j = i; j >= 0; j--) {
                const target = path[j][1];
                if (target != null) {
                    return target;
                }
            }
            return null;
        }
    }
    return null;
}

function wrapEventWithBrokenAccessors(event) {
    const eventState = $utils.getShadowState(event) || $utils.setShadowState(event, {});

    if (eventState.wrapper) {
        return eventState.wrapper;
    }
    
    eventState.nativeEvent = event;

    const descriptors = {
        type: {
            get: function () {
                return event.type;
            }
        },
        target: {
            get: function () {
                return eventState.target || event.target;
            }
        },
        currentTarget: {
            get: function () {
                return eventState.currentTarget || event.currentTarget;
            }
        },
        eventPhase: {
            get: function () {
                return event.eventPhase;
            }
        },
        bubbles: {
            get: function () {
                return event.bubbles;
            }
        },
        cancelable: {
            get: function () {
                return event.cancelable;
            }
        },
        preventDefault: {
            value: function () {
                return event.preventDefault();
            }
        },
        defaultPrevented: {
            get: function () {
                return event.defaultPrevented;
            }
        },
        stopPropagation: {
            value: function () {
                return event.stopPropagation();
            }
        }
    };

    if ('relatedTarget' in event) {
        descriptors.relatedTarget = {
            get: function () {
                return eventState.relatedTarget || event.relatedTarget;
            }
        }
    }

    const wrapper = Object.create(event, descriptors);

    $utils.setShadowState(wrapper, eventState);

    eventState.wrapper = wrapper;

    return wrapper;
}
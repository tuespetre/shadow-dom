// https://dom.spec.whatwg.org/#interface-eventtarget

import * as $ from '../utils.js';

export default function (base) {

    const native = {
        addEventListener: base.prototype.addEventListener,
        removeEventListener: base.prototype.removeEventListener,
        dispatchEvent: base.prototype.dispatchEvent
    };

    return class {

        addEventListener(type, callback, options) {
            if (typeof (callback) !== 'function') {
                return;
            }

            const listener = { callback };
            let capture = false;

            if (typeof options === 'boolean') {
                capture = options;
            }
            else if (typeof options === 'object') {
                capture = options.capture === true;
                listener.once = options.once === true;
                // we don't do anything with passive.
                listener.passive = options.passive === true;
            }

            let collection =
                EventListenerCollection.get(this, type, capture) ||
                EventListenerCollection.create(this, type, capture);

            collection.addListener(this, listener);
            collection.attach(native.addEventListener);
        }

        removeEventListener(type, callback, options) {
            if (typeof (callback) !== 'function') {
                return;
            }

            const listener = { callback };
            let capture = false;

            if (typeof options === 'boolean') {
                capture = options;
            }
            else if (typeof options === 'object') {
                capture = options.capture === true;
            }

            let collection = EventListenerCollection.get(this, type, capture);

            if (!collection) {
                return;
            }

            collection.removeListener(this, listener);

            if (collection.empty) {
                collection.detach(native.removeEventListener);
            }
        }

    };

}

class EventListenerCollection {

    static get(target, type, capture) {
        let targetState = $.getShadowState(target);
        let nativeTarget = target;
        let nativeTargetState = targetState;
        if (targetState && targetState.host) {
            nativeTarget = targetState.host;
            nativeTargetState = $.getShadowState(nativeTarget);
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
    }

    static create(target, type, capture) {
        let targetState = $.getShadowState(target);
        let nativeTarget = target;
        let nativeTargetState = targetState;
        if (targetState && targetState.host) {
            nativeTarget = targetState.host;
            nativeTargetState = $.getShadowState(nativeTarget);
        }
        if (!nativeTargetState) {
            nativeTargetState = $.setShadowState(nativeTarget, { listeners: [] });
        }
        else if (!nativeTargetState.listeners) {
            nativeTargetState.listeners = [];
        }
        const collection = new EventListenerCollection(nativeTarget, type, capture);
        nativeTargetState.listeners.push(collection);
        return collection;
    }

    constructor(target, type, capture) {
        this.target = target;
        this.type = type;
        this.capture = capture;

        this.hostListeners = [];
        this.shadowListeners = [];

        this.callback = event => {
            let shadowRoot = null;
            let targetState = $.getShadowState(target);
            if (targetState) {
                shadowRoot = targetState.shadowRoot;
            }
            switch (event.eventPhase) {
                case Event.prototype.CAPTURING_PHASE:
                    this.invokeListeners(event, this.target, this.hostListeners);
                    if (shadowRoot) {
                        this.invokeListeners(event, shadowRoot, this.shadowListeners);
                    }
                    break;
                case Event.prototype.AT_TARGET:
                    const nativeTarget = $.descriptors.Event.target.get.call(event);
                    this.invokeListeners(event, nativeTarget, this.getListeners(nativeTarget));
                    break;
                case Event.prototype.BUBBLING_PHASE:
                    if (shadowRoot) {
                        this.invokeListeners(event, shadowRoot, this.shadowListeners);
                    }
                    this.invokeListeners(event, this.target, this.hostListeners);
                    break;
            }
        };
    }

    get empty() {
        return this.hostListeners.length === 0
            && this.shadowListeners.length === 0;
    }

    getListeners(target) {
        let targetState = $.getShadowState(target);
        if (targetState && targetState.host) {
            return this.shadowListeners;
        }
        return this.hostListeners;
    }

    addListener(target, listener) {
        const listeners = this.getListeners(target);

        for (let i = 0; i < listeners.length; i++) {
            if (listener.callback === listeners[i].callback) {
                return;
            }
        }

        listeners.push(listener);
    }

    removeListener(target, listener) {
        const listeners = this.getListeners(target);

        for (let i = 0; i < listeners.length; i++) {
            const other = listeners[i];
            if (listener.callback === other.callback) {
                listeners.splice(i, 1);
                break;
            }
        }
    }

    invokeListeners(event, currentTarget, listeners) {
        const eventState = $.getShadowState(event) || $.setShadowState(event, {});
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
    }

    attach(descriptor) {
        descriptor.call(this.target, this.type, this.callback, this.capture);
    }

    detach(descriptor) {
        descriptor.call(this.target, this.type, this.callback, this.capture);
    }

}

function calculatePath(event) {
    // https://dom.spec.whatwg.org/#concept-event-dispatch

    const path = [];
    let p = 0;

    let target = $.descriptors.Event.target.get.call(event);

    let relatedTargetDescriptor = null;

    if (event instanceof FocusEvent) {
        relatedTargetDescriptor = $.descriptors.FocusEvent.relatedTarget;
    }
    else if (event instanceof MouseEvent) {
        relatedTargetDescriptor = $.descriptors.MouseEvent.relatedTarget;
    }

    // Skip (native)
    // 1. Set event’s dispatch flag.

    // 2. Let targetOverride be target, if legacy target override flag is 
    // not given, and target’s associated Document otherwise. 
    const targetOverride = target;

    // 3. Let relatedTarget be the result of retargeting event’s relatedTarget 
    // against target if event’s relatedTarget is non-null, and null otherwise.
    let originalRelatedTarget = null;
    let relatedTarget = null;
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
    let parent = getTheParent(target, event);

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
            parent = getTheParent(parent, event);
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
            parent = getTheParent(parent, event);
            continue;
        }
        // 5. If parent is non-null, then set parent to the result of 
        // invoking parent’s get the parent with event.
        // NOTE: This step was duplicated above to save some cycles.
    }

    return path;
}

function getTheParent(node, event) {
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
        else if ($.isShadowRoot(node)) {
            if (!event.composed) {
                const [item] = $.getShadowState(event).path[0];
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
    for (let i = 0; i < path.length; i++) {
        const [item, , relatedTarget] = path[i];
        if (item === currentTarget) {
            return relatedTarget;
        }
    }
    return null;
}

function calculateTarget(currentTarget, path) {
    for (let i = 0; i < path.length; i++) {
        const [item] = path[i];
        if (item === currentTarget) {
            for (let j = i; j >= 0; j--) {
                const [, target] = path[j];
                if (target != null) {
                    return target;
                }
            }
            return null;
        }
    }
    return null;
}
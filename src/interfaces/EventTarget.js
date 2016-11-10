// https://dom.spec.whatwg.org/#interface-eventtarget

import * as $ from '../utils.js';

export default function(base) {

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
        const nativeTarget = $.shadow(target).host || target;
        const collections = $.shadow(nativeTarget).listeners;
        if (!(collections instanceof Array)) {
            return null;
        }
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
        const nativeTarget = $.shadow(target).host || target;
        let collections = $.shadow(nativeTarget).listeners;
        if (!(collections instanceof Array)) {
            collections = [];
            $.shadow(nativeTarget).listeners = collections;
        }
        const collection = new EventListenerCollection(nativeTarget, type, capture);
        collections.push(collection);
        return collection;
    }

    constructor(target, type, capture) {
        this.target = $.shadow(target).host || target;
        this.type = type;
        this.capture = capture;

        this.hostListeners = [];
        this.shadowListeners = [];

        this.callback = event => {
            const shadowRoot = $.shadow(this.target).shadowRoot;
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
        return $.shadow(target).host ? this.shadowListeners : this.hostListeners
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
        let path = $.shadow(event).calculatedPath;

        if (!path) {
            path = $.shadow(event).calculatedPath = calculatePath(event);
        }

        const target = calculateTarget(currentTarget, path);

        // if there is no target, the event is not composed and should be stopped
        if (!target) {
            event.stopImmediatePropagation();
        }
        else {
            const relatedTarget = calculateRelatedTarget(currentTarget, path);
            const remove = [];

            $.shadow(event).path = path;
            $.shadow(event).currentTarget = currentTarget;
            $.shadow(event).target = target;
            $.shadow(event).relatedTarget = relatedTarget;

            for (let i = 0; i < listeners.length; i++) {
                const listener = listeners[i];
                const result = listener.callback.call(currentTarget, event);
                if (listener.once) {
                    remove.push(listener);
                }
                if ($.shadow(event).stopImmediatePropagationFlag) {
                    break;
                }
            }

            $.shadow(event).path = null;
            $.shadow(event).currentTarget = null;

            for (let i = 0; i < remove.length; i++) {
                let index = listeners.indexOf(remove[i]);
                listeners.splice(index, 1);
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
    path.push([target, targetOverride, relatedTarget]);

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
            path.push([parent, null, relatedTarget]);
        }
        // 3. Otherwise, if parent and relatedTarget are identical, then set parent to null.
        else if (parent === relatedTarget) {
            parent = null;
        }
        // 4. Otherwise, set target to parent and then... 
        // append (parent, target, relatedTarget) to event’s path.
        else {
            target = parent;
            path.push([parent, target, relatedTarget]);
        }
        // 5. If parent is non-null, then set parent to the result of 
        // invoking parent’s get the parent with event.
        if (parent != null) {
            parent = getTheParent(parent, event);
        }
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
                const [item] = $.shadow(event).path[0];
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
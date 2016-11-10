/*

https://dom.spec.whatwg.org/#interface-event

[Constructor(DOMString type, optional EventInit eventInitDict), Exposed=(Window,Worker)]
interface Event

dictionary EventInit {
  boolean bubbles = false;
  boolean cancelable = false;
  boolean composed = false;
};

*/

import * as $ from '../utils.js';

export default class {

    constructor(type, init) {
        let bubbles = false;
        let cancelable = false;
        let composed = false;
        if (init) {
            bubbles = init.bubbles === true;
            cancelable = init.cancelable === true;
            composed = init.composed === true;
        }
        const event = document.createEvent('event');
        event.initEvent(type, bubbles, cancelable);
        $.shadow(event).composed = composed;
        return event;
    }

    get currentTarget() {
        return $.shadow(this).currentTarget;
    }

    get target() {
        let target = $.shadow(this).target;
        if (!target) {
            target = getTarget(this);
            $.shadow(this).target = target;
        }
        return target;
    }

    stopImmediatePropagation() {
        this.stopPropagation();
        $.shadow(this).stopImmediatePropagationFlag = true;
    }

    // TODO: tests
    composedPath() {
        // https://dom.spec.whatwg.org/#dom-event-composedpath

        // 1. Let composedPath be a new empty list.
        const composedPath = [];

        // 2. Let currentTarget be context object’s currentTarget attribute value.
        const currentTarget = this.currentTarget;

        // 3. For each tuple in context object’s path:
        const nativeTarget = $.native.Event.target.get.call(this);
        const path = calculatePath(this);

        if (currentTarget instanceof Window) {
            for (const [item] of path) {
                if (item instanceof Node) {
                    if (!$.closedShadowHidden(item, item.getRootNode({ composed: true }))) {
                        composedPath.push(item);
                    }
                }
                else {
                    composedPath.push(item);
                }
            }
        }
        else if (currentTarget instanceof Node) {
            for (const [item] of path) {
                if (!$.closedShadowHidden(item, item.getRootNode({ composed: true }))) {
                    composedPath.push(item);
                }
            }
        }
        else {
            composedPath.push(...path);
        }

        // 4. return composedPath.
        return composedPath.slice();
    }

    get composed() {
        return $.shadow(this).composed
            || builtInComposedEvents.indexOf(this.type) !== -1;
    }

}

// FocusEvent:
// relatedTarget will be the element losing or gaining focus
// MouseEvent:
// relatedTarget will be the element being moved into or out of
export function hasRelatedTarget(base) {

    const native = {
        relatedTarget: $.prop(base, 'relatedTarget')
    };

    return class {

        get target() {
            let target = $.shadow(this).target;
            if (!target) {
                target = getTarget(this, native.relatedTarget);
                $.shadow(this).target = target;
            }
            return target;
        }

        get relatedTarget() {
            let relatedTarget = $.shadow(this).relatedTarget;
            if (!relatedTarget) {
                const nativeTarget = $.native.Event.target.get.call(event);
                const path = calculatePath(this, nativeTarget, native.relatedTarget);
                for (let i = 0; i < path.length; i++) {
                    const [item, , relatedTarget] = path[i];
                    if (item === this.currentTarget) {
                        $.shadow(this).relatedTarget = relatedTarget;
                        return relatedTarget;
                    }
                }
            }
        }

    }

};

function getTarget(event, relatedTargetDescriptor) {
    const nativeTarget = $.native.Event.target.get.call(event);
    const path = calculatePath(event, nativeTarget, relatedTargetDescriptor);
    for (let i = 0; i < path.length; i++) {
        const [item] = path[i];
        if (item === event.currentTarget) {
            for (let j = i; j >= 0; j--) {
                const [, target] = path[j];
                if (target !== null) {
                    return target;
                }
            }
            return undefined;
        }
    }
    return undefined;
}

function calculatePath(event, target, relatedTargetDescriptor) {
    let path = $.shadow(event).path;

    if (path) {
        return path;
    }

    // https://dom.spec.whatwg.org/#concept-event-dispatch

    path = $.shadow(event).path = [];

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
    while (parent !== null) {
        // 1. Let relatedTarget be the result of retargeting event’s relatedTarget
        // against parent if event’s relatedTarget is non-null, and null otherwise.
        if (originalRelatedTarget) {
            relatedTarget = $.retarget(originalRelatedTarget, parent);
        }
        // 2. If target’s root is a shadow-including inclusive ancestor of parent, then... 
        // append (parent, null, relatedTarget) to event’s path.
        const root = target.getRootNode({ composed: false });
        if ($.shadowIncludingInclusiveAncestor(root, parent)) {
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
        if (parent !== null) {
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
            return document.defaultView;
        }
        else if (node.nodeName === '#shadow-root') {
            if (!event.composed) {
                const [item] = $.shadow(event).path[0];
                if (item.getRootNode() === node) {
                    return null;
                }
            }
            return node.host;
        }
        return node.assignedSlot || node.parentNode;
    }

    return null;
}

const builtInComposedEvents = [
    // FocusEvent
    'blur', 'focus', 'focusin', 'focusout',
    // MouseEvent
    'click', 'dblclick', 'mousedown',
    'mouseenter', 'mouseleave', 'mousemove',
    'mouseout', 'mouseover', 'mouseup',
    // WheelEvent
    'wheel',
    // InputEvent
    'beforeinput', 'input',
    // KeyboardEvent
    'keydown', 'keyup',
    // CompositionEvent
    'compositionstart', 'compositionupdate',
    'compositionend',
    // Legacy UIEvent
    'DOMActivate',
    // Legacy FocusEvent
    'DOMFocusIn', 'DOMFocusOut',
    // Legacy KeyboardEvent
    'keypress',
];
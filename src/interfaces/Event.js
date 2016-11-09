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

    // TODO: impl, tests
    constructor(type, init) {
        $.shadow(this).composed = (init && init.composed === true);
    }

    // TODO: impl, tests
    get target() {
        return null;
    }

    // TODO: impl, tests
    get currentTarget() {
        return null;
    }

    // TODO: impl, tests
    composedPath() {
        let composedPath = $.shadow(this).composedPath;

        if (composedPath) {
            return composedPath.slice();
        }

        // https://dom.spec.whatwg.org/#dom-event-composedpath

        // 1. Let composedPath be a new empty list.
        composedPath = $.shadow(this).composedPath = [];

        // 2. Let currentTarget be context object’s currentTarget attribute value.
        const currentTarget = this.currentTarget;

        // 3. For each tuple in context object’s path:
        const path = calculatePath(this);

        if (currentTarget instanceof Window) {
            for (const [ item ] of path) {
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
            for (const [ item ] of path) {
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
        return $.shadow(this).composed;
    }

}

function calculatePath(event) {
    let path = $.shadow(event).path;

    if (path) {
        return path;
    }

    // Starting at step 8:
    // https://dom.spec.whatwg.org/#concept-event-dispatch

    path = $.shadow(event).path = [];

    // 8. Let parent be the result of invoking target’s get the parent with event.
    let target = event.target;
    let parent = getTheParent(target, event);

    // 9. While parent is non-null:
    while (parent !== null) {
        // 1. Let relatedTarget be the result of retargeting event’s relatedTarget
        // against parent if event’s relatedTarget is non-null, and null otherwise.
        let relatedTarget = event.relatedTarget;
        if (relatedTarget !== null) {
            relatedTarget = $.retarget(relatedTarget, parent);
        }
        // 2. If target’s root is a shadow-including inclusive ancestor of parent, then... 
        // append (parent, null, relatedTarget) to event’s path.
        const root = target.getRootNode({ composed: false });
        if ($.shadowIncludingInclusiveAncestor(root, parent)) {
            path.push([ parent, null, relatedTarget ]);
        }
        // 3. Otherwise, if parent and relatedTarget are identical, then set parent to null.
        else if (parent === relatedTarget) {
            parent = null;
        }
        // 4. Otherwise, set target to parent and then... 
        // append (parent, target, relatedTarget) to event’s path.
        else {
            target = parent;
            path.push([ parent, target, relatedTarget ]);
        }
        // 5. If parent is non-null, then set parent to the result of 
        // invoking parent’s get the parent with event.
        if (parent !== null) {
            parent = getTheParent(parent, event);
        }
    }

    return path;
}

function getTheParent(target, event) {
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
        else if (node.localName === '#shadow-root') {
            if (!event.composed) {
                const [ item ] = $.shadow(event).path[0];
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
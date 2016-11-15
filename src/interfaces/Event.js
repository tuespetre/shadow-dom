// https://dom.spec.whatwg.org/#interface-event

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
        $.setShadowState(event, { composed });
        return event;
    }

    get currentTarget() {
        return $.getShadowState(this).currentTarget;
    }

    get target() {
        return $.getShadowState(this).target;
    }

    stopImmediatePropagation() {
        this.stopPropagation();
        $.getShadowState(this).stopImmediatePropagationFlag = true;
    }

    composedPath() {
        // https://dom.spec.whatwg.org/#dom-event-composedpath

        // 1. Let composedPath be a new empty list.
        const composedPath = [];

        // 2. Let currentTarget be context object’s currentTarget attribute value.
        const currentTarget = this.currentTarget;

        // 3. For each tuple in context object’s path:
        const path = $.getShadowState(this).path;

        if (path) {
            let c = 0;
            for (let i = 0; i < path.length; i++) {
                const item = path[i][0];
                if (currentTarget instanceof Window) {
                    if (!(item instanceof Node) || !$.closedShadowHidden(item, $.shadowIncludingRoot(item))) {
                        composedPath[c++] = item;
                    }
                }
                else if (currentTarget instanceof Node) {
                    if (!$.closedShadowHidden(item, currentTarget)) {
                        composedPath[c++] = item;
                    }
                }
                else {
                    composedPath[c++] = item;
                }
            }
        }

        // 4. return composedPath.
        return composedPath;
    }

    get composed() {
        // TODO: Compare against the actual prototype instead of just the type strings
        return $.getShadowState(this).composed || builtInComposedEvents.indexOf(this.type) !== -1;
    }

}

// FocusEvent:
// relatedTarget will be the element losing or gaining focus
// MouseEvent:
// relatedTarget will be the element being moved into or out of
export class hasRelatedTarget {

    get relatedTarget() {
        return $.getShadowState(this).relatedTarget;
    }

};

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
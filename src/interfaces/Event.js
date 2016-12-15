// https://dom.spec.whatwg.org/#interface-event

export default {
    install
};

import $dom from '../dom.js';
import $utils from '../utils.js';

const eventStopImmediatePropagationDescriptor = $utils.descriptor(Event, 'stopImmediatePropagation');
const eventCurrentTargetDescriptor = $utils.descriptor(Event, 'currentTarget');
const eventTargetDescriptor = $utils.descriptor(Event, 'target');
const focusEventRelatedTargetDescriptor = $utils.descriptor(FocusEvent, 'relatedTarget');
const mouseEventRelatedTargetDescriptor = $utils.descriptor(MouseEvent, 'relatedTarget');

function eventConstructor(type, init) {
    let bubbles = false;
    let cancelable = false;
    let composed = false;
    if (init) {
        bubbles = init.bubbles === true;
        cancelable = init.cancelable === true;
        composed = init.composed === true;
    }
    const event = document.createEvent('Event'); // Capitalized to work with older WebKit
    event.initEvent(type, bubbles, cancelable);
    $utils.setShadowState(event, { composed });
    return event;
};

function install() {
    if (!$utils.brokenAccessors) {
        $utils.extend(Event, {
            get currentTarget() {
                const shadowState = $utils.getShadowState(this);
                if (shadowState) {
                    return shadowState.currentTarget;
                }
                return eventCurrentTargetDescriptor.get.call(this);
            },
            get target() {
                const shadowState = $utils.getShadowState(this);
                if (shadowState) {
                    return shadowState.target;
                }
                return eventTargetDescriptor.get.call(this);
            },
        });

        // FocusEvent:
        // relatedTarget will be the element losing or gaining focus
        $utils.extend(FocusEvent, {
            get relatedTarget() {
                const shadowState = $utils.getShadowState(this);
                if (shadowState) {
                    return shadowState.relatedTarget;
                }
                return focusEventRelatedTargetDescriptor.get.call(this);
            }
        });

        // MouseEvent:
        // relatedTarget will be the element being moved into or out of
        $utils.extend(MouseEvent, {
            get relatedTarget() {
                const shadowState = $utils.getShadowState(this);
                if (shadowState) {
                    return shadowState.relatedTarget;
                }
                return mouseEventRelatedTargetDescriptor.get.call(this);
            }
        });
    }

    $utils.extend(Event, eventMixin);
    eventConstructor.prototype = Event.prototype;
    window.Event = eventConstructor;
}

const eventMixin = {

    stopImmediatePropagation() {
        const shadowState = $utils.getShadowState(this);
        if (shadowState) {
            shadowState.stopImmediatePropagationFlag = true;
            this.stopPropagation();
            return;
        }
        eventStopImmediatePropagationDescriptor.value.call(this);
    },

    composedPath() {
        // https://dom.spec.whatwg.org/#dom-event-composedpath

        // 1. Let composedPath be a new empty list.
        const composedPath = [];

        // 2. Let currentTarget be context object’s currentTarget attribute value.
        const currentTarget = this.currentTarget;

        // 3. For each tuple in context object’s path:
        const path = $utils.getShadowState(this).path;

        if (path) {
            let c = 0;
            for (let i = 0; i < path.length; i++) {
                const item = path[i][0];
                if (currentTarget instanceof Window) {
                    if (!(item instanceof Node) || !$dom.closedShadowHidden(item, $dom.shadowIncludingRoot(item))) {
                        composedPath[c++] = item;
                    }
                }
                else if (currentTarget instanceof Node) {
                    if (!$dom.closedShadowHidden(item, currentTarget)) {
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
    },

    get composed() {
        // TODO: Compare against the actual prototype instead of just the type strings
        return $utils.getShadowState(this).composed || builtInComposedEvents.indexOf(this.type) !== -1;
    },

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

    // Touch Events
    'touchstart', 'touchend', 'touchmove', 'touchcancel'
];
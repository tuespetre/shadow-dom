/*

https://dom.spec.whatwg.org/#interface-eventtarget

[Exposed=(Window,Worker)]
interface EventTarget

callback interface EventListener {
  void handleEvent(Event event);
};

dictionary EventListenerOptions {
  boolean capture = false;
};

dictionary AddEventListenerOptions : EventListenerOptions {
  boolean passive = false;
  boolean once = false;
};

*/

import * as $ from '../utils.js';

const listenerOptionsObjectSupported = testForListenerOptionsObjectSupport();

export default function (base) {

    const native = {
        addEventListener: base.prototype.addEventListener,
        removeEventListener: base.prototype.removeEventListener
    };

    return class {

        addEventListener(type, callback, options) {
            if (typeof (callback) !== 'function') {
                return;
            }

            const listener = { callback, capture: false };

            if (options != null) {
                if (typeof options === 'boolean') {
                    listener.capture = options;
                }
                else {
                    listener.capture = options.capture === true;
                    listener.passive = options.passive === true;
                    listener.once = options.once === true;
                }
            }

            let nativeOptions = listener.capture;
            if (listenerOptionsObjectSupported) {
                nativeOptions = {
                    capture: listener.capture,
                    passive: listener.passive
                };
            }

            const target = $.shadow(this).host || this;
            const collections = getListenerCollections(target, listener.capture);
            let collection = collections[type];

            if (!collection) {
                collection = collections[type] = new EventListenerCollection(target);
                native.addEventListener.call(target, type, collection.callback, nativeOptions);
            }

            collection.addListener(this, listener);
        }

        removeEventListener(type, callback, options) {
            if (typeof (callback) !== 'function') {
                return;
            }

            const listener = { callback, capture: false };

            if (options != null) {
                if (typeof options === 'boolean') {
                    listener.capture = options;
                }
                else {
                    listener.capture = options.capture === true;
                }
            }

            let nativeOptions = listener.capture;
            if (listenerOptionsObjectSupported) {
                nativeOptions = {
                    capture: listener.capture
                };
            }

            const target = $.shadow(this).host || this;
            const collections = getListenerCollections(target, listener.capture);
            let collection = collections[type];

            if (!collection) {
                return;
            }

            collection.removeListener(this, listener);
        }

    };

}

class EventListenerCollection {

    constructor(target) {
        this.target = target;
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
                    const nativeTarget = $.native.Event.target.get.call(event);
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
        const remove = [];
        $.shadow(event).currentTarget = currentTarget;
        $.shadow(event).target = null;
        $.shadow(event).relatedTarget = null;
        if (!event.target) {
            // i.e. the event is not composed
            event.stopImmediatePropagation();
        }
        else {
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
            for (let i = 0; i < remove.length; i++) {
                let index = listeners.indexOf(remove[i]);
                listeners.splice(index, 1);
            }
        }
    }

}

function getListenerCollections(target, capture) {
    const shadow = $.shadow(target);

    if (!shadow.listeners) {
        shadow.listeners = {
            capture: {},
            bubble: {}
        };
    }

    return capture ? shadow.listeners.capture : shadow.listeners.bubble;
}

function testForListenerOptionsObjectSupport() {
    let supported = false;
    const document = window.document.implementation.createHTMLDocument('test');
    const handler = function (event) {
        supported = event.eventPhase === Event.prototype.BUBBLING_PHASE;
    };
    document.addEventListener('test', handler, { capture: false });
    const event = document.createEvent('event');
    event.initEvent('test', true, false);
    document.dispatchEvent(event);
    return supported;
}
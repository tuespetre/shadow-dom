// https://dom.spec.whatwg.org/#interface-customevent

import $utils from '../utils.js';

export default function $CustomEvent(type, init) {
    let bubbles = false;
    let cancelable = false;
    let composed = false;
    let detail = null;
    if (init) {
        bubbles = init.bubbles === true;
        cancelable = init.cancelable === true;
        composed = init.composed === true;
        detail = init.detail || null;
    }
    const event = document.createEvent('CustomEvent');
    event.initCustomEvent(type, bubbles, cancelable, detail);
    $utils.setShadowState(event, { composed });
    return event;
}

$CustomEvent.prototype = window.CustomEvent.prototype;
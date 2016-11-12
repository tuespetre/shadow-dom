// https://dom.spec.whatwg.org/#interface-customevent

import * as $ from '../utils.js';

export default class {

    constructor(type, init) {
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
        $.shadow(event).composed = composed;
        return event;
    }

}
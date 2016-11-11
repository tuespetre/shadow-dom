// https://dom.spec.whatwg.org/#interface-mutationobserver

import * as $ from '../utils.js';

export default class {

    constructor(callback) {
        const observer = $.createMutationObserver(callback);
        $.shadow(this).observer = observer;
        observer.interface = this;
    }

    observe(target, options) {
        $.shadow(this).observer.observe(target, options);
    }

    disconnect() {
        $.shadow(this).observer.disconnect();
    }

    takeRecords() {
        const records = $.shadow(this).observer.queue;
        return records.splice(0, records.length);
    }

}
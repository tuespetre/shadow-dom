// https://dom.spec.whatwg.org/#interface-mutationobserver

import * as $ from '../utils.js';

export default function $MutationObserver(callback) {
    const observer = $.createMutationObserver(callback);
    $.setShadowState(this, { observer });
    observer.interface = this;
}

$MutationObserver.prototype = {

    observe(target, options) {
        $.getShadowState(this).observer.observe(target, options);
    },

    disconnect() {
        $.getShadowState(this).observer.disconnect();
    },

    takeRecords() {
        const records = $.getShadowState(this).observer.queue;
        return records.splice(0, records.length);
    },

}
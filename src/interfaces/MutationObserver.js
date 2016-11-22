// https://dom.spec.whatwg.org/#interface-mutationobserver

import $dom from '../dom.js';
import $utils from '../utils.js';

export default function $MutationObserver(callback) {
    const observer = $dom.createMutationObserver(callback);
    $utils.setShadowState(this, { observer });
    observer.interface = this;
}

$MutationObserver.prototype = {

    observe(target, options) {
        $utils.getShadowState(this).observer.observe(target, options);
    },

    disconnect() {
        $utils.getShadowState(this).observer.disconnect();
    },

    takeRecords() {
        const records = $utils.getShadowState(this).observer.queue;
        return records.splice(0, records.length);
    },

}
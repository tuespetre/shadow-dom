// https://www.w3.org/TR/html5/single-page.html#the-table-element

import $dom from '../dom.js';
import $utils from '../utils.js';

export default {

    // TODO: tests
    deleteCaption() {
        const caption = this.caption;
        if (caption) {
            $dom.remove(caption, this);
        }
    },

    // TODO: tests
    deleteTHead() {
        const tHead = this.tHead;
        if (tHead) {
            $dom.remove(tHead, this);
        }
    },

    // TODO: tests
    deleteTFoot() {
        const tFoot = this.tFoot;
        if (tFoot) {
            $dom.remove(tFoot, this);
        }
    },

    // TODO: tests
    deleteRow(index) {
        // https://www.w3.org/TR/html5/single-page.html#dom-table-deleterow
        if (index === -1) {
            index = this.rows.length - 1;
        }
        if (index < 0 || index >= this.rows.length) {
            throw $utils.makeDOMException('IndexSizeError');
        }
        this.rows[index].remove();
    },

}
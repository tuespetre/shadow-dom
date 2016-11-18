// https://www.w3.org/TR/html5/single-page.html#the-table-element

import * as $ from '../utils.js';

export default {

    // TODO: tests
    deleteCaption() {
        const caption = this.caption;
        if (caption) {
            $.remove(caption, this);
        }
    },

    // TODO: tests
    deleteTHead() {
        const tHead = this.tHead;
        if (tHead) {
            $.remove(tHead, this);
        }
    },

    // TODO: tests
    deleteTFoot() {
        const tFoot = this.tFoot;
        if (tFoot) {
            $.remove(tFoot, this);
        }
    },

    // TODO: tests
    deleteRow(index) {
        // https://www.w3.org/TR/html5/single-page.html#dom-table-deleterow
        if (index === -1) {
            index = this.rows.length - 1;
        }
        if (index < 0 || index >= this.rows.length) {
            throw $.makeError('IndexSizeError');
        }
        this.rows[index].remove();
    },

}
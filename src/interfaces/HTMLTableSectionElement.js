// https://www.w3.org/TR/html5/single-page.html#the-tbody-element

import $utils from '../utils.js';

export default {

    // TODO: tests
    deleteRow(index) {
        // https://www.w3.org/TR/html5/single-page.html#dom-tbody-deleterow
        if (index < 0 || index >= this.rows.length) {
            throw $utils.makeDOMException('IndexSizeError');
        }
        this.rows[index].remove();
    },

}
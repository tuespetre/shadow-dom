// https://www.w3.org/TR/html5/single-page.html#the-tbody-element

import * as $ from '../utils.js';

export default class {

    // TODO: tests
    deleteRow(index) {
        // https://www.w3.org/TR/html5/single-page.html#dom-tbody-deleterow
        if (index < 0 || index >= this.rows.length) {
            throw $.makeError('IndexSizeError');
        }
        this.rows[index].remove();
    }

}
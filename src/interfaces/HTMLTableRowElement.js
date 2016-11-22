// https://www.w3.org/TR/html5/single-page.html#the-tr-element

import $utils from '../utils.js';

export default {

    // TODO: tests
    deleteCell(index) {
        // https://www.w3.org/TR/html5/single-page.html#dom-tr-deletecell
        if (index === -1) {
            index = this.cells.length - 1;
        }
        if (index < 0 || index >= this.cells.length) {
            throw $utils.makeDOMException('IndexSizeError');
        }
        this.cells[index].remove();
    },

}
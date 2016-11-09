/*

https://www.w3.org/TR/html5/single-page.html#the-tr-element

*/

import * as $ from '../utils.js';

export default class {

    deleteCell(index) {
        // https://www.w3.org/TR/html5/single-page.html#dom-tr-deletecell
        if (index === -1) {
            index = this.cells.length - 1;
        }
        if (index < 0 || index >= this.cells.length) {
            throw $.makeError('IndexSizeError');
        }
        this.cells[index].remove();
    }

}
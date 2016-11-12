// https://dom.spec.whatwg.org/#interface-text

import * as $ from '../utils.js';

export default class {

    // TODO: tests
    splitText(offset) {
        const length = this.length;
        if (offset > length) {
            throw $.makeError('IndexSizeError');
        }
        const count = length - offset;
        const newData = this.data.slice(offset, count);
        const newNode = this.ownerDocument.createTextNode(newData);
        const parent = this.parentNode;
        if (parent) {
            $.insert(newNode, parent, this.nextSibling);
            // TODO: (Range)
        }
        $.replaceData(this, offset, count, '');
        if (!parent) {
            // TODO: (Range)
        }
        return newNode;
    }

}
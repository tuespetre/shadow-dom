// https://dom.spec.whatwg.org/#interface-text

import $dom from '../dom.js';
import $utils from '../utils.js';

export default {

    // TODO: tests
    splitText(offset) {
        const length = this.length;
        if (offset > length) {
            throw $utils.makeDOMException('IndexSizeError');
        }
        const count = length - offset;
        const newData = this.data.slice(offset, count);
        const newNode = this.ownerDocument.createTextNode(newData);
        const parent = this.parentNode;
        if (parent) {
            $dom.insert(newNode, parent, this.nextSibling);
            // TODO: (Range)
        }
        this.replaceData(offset, count, '');
        // TODO: (Range)
        // if (!parent) { }
        return newNode;
    },

}
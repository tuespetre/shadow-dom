// https://dom.spec.whatwg.org/#interface-characterdata

import $dom from '../dom.js';
import $utils from '../utils.js';

const characterDataDataDescriptor = $utils.descriptor(CharacterData, 'data');

export default {

    get data() {
        return characterDataDataDescriptor.get.call(this);
    },

    set data(value) {
        const length = characterDataDataDescriptor.get.call(this).length;
        $dom.replaceData(this, 0, length, value);
    },

    appendData(data) {
        const length = characterDataDataDescriptor.get.call(this).length;
        $dom.replaceData(this, length, 0, data);
    },

    insertData(offset, data) {
        $dom.replaceData(this, offset, 0, data);
    },

    deleteData(offset, count) {
        $dom.replaceData(this, offset, count, '');
    },

    replaceData(offset, count, data) {
        $dom.replaceData(this, offset, count, data);
    },

}
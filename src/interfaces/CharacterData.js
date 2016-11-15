// https://dom.spec.whatwg.org/#interface-characterdata

import * as $ from '../utils.js';

const getData = $.descriptors.CharacterData.data.get;

export default class {

    get data() {
        return getData.call(this);
    }

    set data(value) {
        const length = getData.call(this).length;
        $.replaceData(this, 0, length, value);
    }

    appendData(data) {
        const length = getData.call(this).length;
        $.replaceData(this, length, 0, data);
    }

    insertData(offset, data) {
        $.replaceData(this, offset, 0, data);
    }

    deleteData(offset, count) {
        $.replaceData(this, offset, count, '');
    }

    replaceData(offset, count, data) {
        $.replaceData(this, offset, count, data);
    }

}
// https://dom.spec.whatwg.org/#interface-nonelementparentnode

import * as $ from '../utils.js';

export default function (base) {

    const native = {
        querySelectorAll: $.descriptor(base, 'querySelectorAll')
    };

    return class {

        getElementById(id) {
            // https://dom.spec.whatwg.org/#dom-nonelementparentnode-getelementbyid

            if (id === '' || /\s/.test(id)) {
                return null;
            }

            const selector = '#' + serializeIdentifier(id);
            let results;

            if ($.isShadowRoot(this)) {
                const host = $.getShadowState(this).host;
                results = $.descriptors.Element.querySelectorAll.value.call(host, selector);
            }
            else {
                results = native.querySelectorAll.value.call(this, selector);
            }

            if (results.length) {
                for (let i = 0; i < results.length; i++) {
                    const item = results[i];
                    if ($.root(item) === this) {
                        return item;
                    }
                }
            }

            return null;
        }

    };

}

const serializeIdentifier = 'CSS' in window && 'escape' in window.CSS ? window.CSS.escape : function(string) {
    // https://drafts.csswg.org/cssom/#serialize-an-identifier
    let result = '';
    for (let i = 0; i < string.length; i++) {
        const charCode = string.charCodeAt(i);
        if (charCode === 0x0000) {
            result += '\uFFFD';
            continue;
        }
        if (((charCode >= 0x0001 && charCode <= 0x001F) || charCode === 0x007F) ||
            (i === 0 && charCode >= 0x0030 && charCode <= 0x00039) ||
            (i === 1 && string[0] === '\u002D' && charCode >= 0x0030 && charCode <= 0x00039)) {
            result += '\u005C' + charCode.toString(16) + '\u0020';
            continue;
        }
        if (i === 0 && charCode === 0x002D && string.length === 1) {
            result += '\u005C' + string.charAt(i);
            continue;
        }
        if (charCode >= 0x0080 || 
            charCode === 0x002D || 
            charCode === 0x005F ||
            (charCode >= 0x0030 && charCode <= 0x0039) ||
            (charCode >= 0x0041 && charCode <= 0x005A) ||
            (charCode >= 0x0061 && charCode <= 0x007A)) {
            result += string.charAt(i);
            continue;
        }
        result += '\u005C' + string.charAt(i);
        continue;
    }
    return result;
};
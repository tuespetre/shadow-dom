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

            const firstChild = this.firstChild;

            if (!firstChild) {
                return null;
            }

            return $.treeOrderRecursiveSelectFirst(firstChild, function (node) {
                return node.id === id;
            });
        }

    };

}
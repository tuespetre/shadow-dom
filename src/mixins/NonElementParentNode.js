// https://dom.spec.whatwg.org/#interface-nonelementparentnode

import $dom from '../dom.js';

export default {

    getElementById(id) {
        // https://dom.spec.whatwg.org/#dom-nonelementparentnode-getelementbyid

        if (id === '' || /\s/.test(id)) {
            return null;
        }

        const firstChild = this.firstChild;

        if (!firstChild) {
            return null;
        }

        return $dom.treeOrderRecursiveSelectFirst(firstChild, function (node) {
            return node.id === id;
        });
    },

};
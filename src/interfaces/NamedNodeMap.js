// https://dom.spec.whatwg.org/#interface-namednodemap

import * as $ from '../utils.js';

export default class {

    // todo: tests
    setNamedItem(attr) {
        return $.setAttribute(attr, $.shadow(this).element);
    }
    
    // todo: tests
    setNamedItemNS(attr) {
        return $.setAttribute(attr, $.shadow(this).element);
    }

    // todo: tests
    removeNamedItem(qualifiedName) {
        const attr = $.removeAttributeByName(qualifiedName, $.shadow(this).element);
        if (!attr) {
            throw $.makeError('NotFoundError');
        }
        return attr;
    }

    // todo: tests
    removeNamedItemNS(namespace, localName) {
        const attr = $.removeAttributeByNamespace(namespace, localName, $.shadow(this).element);
        if (!attr) {
            throw $.makeError('NotFoundError');
        }
        return attr;
    }

}
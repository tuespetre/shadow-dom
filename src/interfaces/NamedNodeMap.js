// https://dom.spec.whatwg.org/#interface-namednodemap

import * as $ from '../utils.js';

export default class {

    // TODO: tests
    setNamedItem(attr) {
        const shadowState = $.getShadowState(this);
        return $.setAttribute(attr, shadowState.element);
    }
    
    // TODO: tests
    setNamedItemNS(attr) {
        const shadowState = $.getShadowState(this);
        return $.setAttribute(attr, shadowState.element);
    }

    // TODO: tests
    removeNamedItem(qualifiedName) {
        const shadowState = $.getShadowState(this);
        const attr = $.removeAttributeByName(qualifiedName, shadowState.element);
        if (!attr) {
            throw $.makeError('NotFoundError');
        }
        return attr;
    }

    // TODO: tests
    removeNamedItemNS(namespace, localName) {
        const shadowState = $.getShadowState(this);
        const attr = $.removeAttributeByNamespace(namespace, localName, shadowState.element);
        if (!attr) {
            throw $.makeError('NotFoundError');
        }
        return attr;
    }

}
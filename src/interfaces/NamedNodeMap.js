// https://dom.spec.whatwg.org/#interface-namednodemap

import * as $ from '../utils.js';

import CustomElements from '../custom-elements.js';

export default {

    // TODO: tests
    setNamedItem(attr) {
        return CustomElements.executeCEReactions(() => {
            const shadowState = $.getShadowState(this);
            return $.setAttribute(attr, shadowState.element, $.descriptors.Element.setAttributeNode);
        });
    },

    // TODO: tests
    setNamedItemNS(attr) {
        return CustomElements.executeCEReactions(() => {
            const shadowState = $.getShadowState(this);
            return $.setAttribute(attr, shadowState.element, $.descriptors.Element.setAttributeNodeNS);
        });
    },

    // TODO: tests
    removeNamedItem(qualifiedName) {
        return CustomElements.executeCEReactions(() => {
            const shadowState = $.getShadowState(this);
            const attr = $.removeAttributeByName(qualifiedName, shadowState.element);
            if (!attr) {
                throw $.makeError('NotFoundError');
            }
            return attr;
        });
    },

    // TODO: tests
    removeNamedItemNS(namespace, localName) {
        return CustomElements.executeCEReactions(() => {
            const shadowState = $.getShadowState(this);
            const attr = $.removeAttributeByNamespace(namespace, localName, shadowState.element);
            if (!attr) {
                throw $.makeError('NotFoundError');
            }
            return attr;
        });
    },

}
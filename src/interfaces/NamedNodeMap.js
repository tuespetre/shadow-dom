// https://dom.spec.whatwg.org/#interface-namednodemap

import $dom from '../dom.js';
import $ce from '../custom-elements.js';
import $utils from '../utils.js';
import $Attr from '../interfaces/Attr.js';

export default {

    // TODO: tests
    setNamedItem(attr) {
        $Attr.patchAttributeNodeIfNeeded(attr);
        return $ce.executeCEReactions(() => {
            const shadowState = $utils.getShadowState(this);
            return $dom.setAttribute(attr, shadowState.element);
        });
    },

    // TODO: tests
    setNamedItemNS(attr) {
        $Attr.patchAttributeNodeIfNeeded(attr);
        return $ce.executeCEReactions(() => {
            const shadowState = $utils.getShadowState(this);
            return $dom.setAttribute(attr, shadowState.element);
        });
    },

    // TODO: tests
    removeNamedItem(qualifiedName) {
        return $ce.executeCEReactions(() => {
            const shadowState = $utils.getShadowState(this);
            const attr = $dom.removeAttributeByName(qualifiedName, shadowState.element);
            if (!attr) {
                throw $utils.makeDOMException('NotFoundError');
            }
            return attr;
        });
    },

    // TODO: tests
    removeNamedItemNS(nameSpace, localName) {
        return $ce.executeCEReactions(() => {
            const shadowState = $utils.getShadowState(this);
            const attr = $dom.removeAttributeByNamespace(nameSpace, localName, shadowState.element);
            if (!attr) {
                throw $utils.makeDOMException('NotFoundError');
            }
            return attr;
        });
    },

};
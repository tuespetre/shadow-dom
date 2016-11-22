// https://dom.spec.whatwg.org/#interface-domtokenlist

import $dom from '../dom.js';
import $ce from '../custom-elements.js';
import $utils from '../utils.js';

export default {

    get length() {
        const state = $utils.getShadowState(this);
        return state.tokens.length;
    },

    // TODO: Caveat about indexer expressions?
    item(index) {
        const state = $utils.getShadowState(this);
        return index >= state.tokens.length ? null : state.tokens[index];
    },

    contains(token) {
        const state = $utils.getShadowState(this);
        return state.tokens.indexOf(token) !== -1;
    },

    add(...tokens) {
        return $ce.executeCEReactions(() => {
            validateTokens(tokens);
            const state = $utils.getShadowState(this);
            for (let i = 0; i < tokens.length; i++) {
                const token = tokens[i];
                const index = state.tokens.indexOf(token);
                if (index === -1) {
                    state.tokens.push(token);
                }
            }
            state.tokens.sort();
            $dom.setAttributeValue(state.element, state.localName, state.tokens.join(' '));
        });
    },

    remove(...tokens) {
        return $ce.executeCEReactions(() => {
            validateTokens(tokens);
            const state = $utils.getShadowState(this);
            for (let i = 0; i < tokens.length; i++) {
                const token = tokens[i];
                const index = state.tokens.indexOf(token);
                if (index !== -1) {
                    state.tokens.splice(index, 1);
                }
            }
            $dom.setAttributeValue(state.element, state.localName, state.tokens.join(' '));
        });
    },

    toggle(token, force) {
        return $ce.executeCEReactions(() => {
            validateToken(token);
            const state = $utils.getShadowState(this);
            const index = state.tokens.indexOf(token);
            if (index !== -1) {
                if (arguments.length === 1 || force === false) {
                    state.tokens.splice(index, 1);
                    $dom.setAttributeValue(state.element, state.localName, state.tokens.join(' '));
                    return false;
                }
                else {
                    return true;
                }
            }
            else {
                if (force === false) {
                    return false;
                }
                else {
                    state.tokens.push(token);
                    state.tokens.sort();
                    $dom.setAttributeValue(state.element, state.localName, state.tokens.join(' '));
                    return true;
                }
            }
        });
    },

    replace(token, newToken) {
        return $ce.executeCEReactions(() => {
            validateToken(token);
            validateToken(newToken);
            const state = $utils.getShadowState(this);
            const index = state.tokens.indexOf(token);
            if (index === -1) {
                return;
            }
            state.tokens[index] = newToken;
            state.tokens.sort();
            $dom.setAttributeValue(state.element, state.localName, state.tokens.join(' '));
        });
    },

    get value() {
        const state = $utils.getShadowState(this);
        return state.element.getAttribute(state.localName) || '';
    },

    set value(value) {
        return $ce.executeCEReactions(() => {
            const state = $utils.getShadowState(this);
            $dom.setAttributeValue(state.element, state.localName, value);
            // TODO: Remove usage of slice in favor of direct parse
            state.tokens = Array.prototype.slice.call(this);
        });
    },

}

function validateTokens(tokens) {
    for (let i = 0; i < tokens.length; i++) {
        validateToken(tokens[i])
    }
}

function validateToken(token) {
    if (token == '') {
        throw $utils.makeDOMException('SyntaxError');
    }
    if (/\s/.test(token)) {
        throw $utils.makeDOMException('InvalidCharacterError')
    }
}

function createDOMTokenList(element, localName) {
    // TODO: run the steps per the DOM spec for 'when a DOMTokenList is created'
    const originalValue = element.getAttribute(localName);
    const tokens = originalValue ? originalValue.split(/\s/).sort() : [];
    const tokenList = Object.create(DOMTokenList.prototype);
    $utils.setShadowState(tokenList, { element, localName, tokens });
    return tokenList;
}

export function getOrCreateDOMTokenList(element, localName) {
    const elementState = $utils.getShadowState(element) || $utils.setShadowState(element, { tokenLists: {} });
    if (!elementState.tokenLists) {
        elementState.tokenLists = {};
    }
    let tokenList;
    if (tokenList = elementState.tokenLists[localName]) {
        return tokenList;
    }
    return elementState.tokenLists[localName] = createDOMTokenList(element, localName);
}
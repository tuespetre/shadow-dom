// https://dom.spec.whatwg.org/#interface-domtokenlist

import * as $ from '../utils.js';

import CustomElements from '../custom-elements.js';

export default class {

    get length() {
        const state = $.getShadowState(this);
        return state.tokens.length;
    }

    // TODO: Caveat about indexer expressions?
    item(index) {
        const state = $.getShadowState(this);
        return index >= state.tokens.length ? null : state.tokens[index];
    }

    contains(token) {
        const state = $.getShadowState(this);
        return state.tokens.indexOf(token) !== -1;
    }

    add(...tokens) {
        return CustomElements.executeCEReactions(() => {
            validateTokens(tokens);
            const state = $.getShadowState(this);
            for (let i = 0; i < tokens.length; i++) {
                const token = tokens[i];
                const index = state.tokens.indexOf(token);
                if (index === -1) {
                    state.tokens.push(token);
                }
            }
            state.tokens.sort();
            $.setAttributeValue(state.element, state.localName, state.tokens.join(' '));
        });
    }

    remove(...tokens) {
        return CustomElements.executeCEReactions(() => {
            validateTokens(tokens);
            const state = $.getShadowState(this);
            for (let i = 0; i < tokens.length; i++) {
                const token = tokens[i];
                const index = state.tokens.indexOf(token);
                if (index !== -1) {
                    state.tokens.splice(index, 1);
                }
            }
            $.setAttributeValue(state.element, state.localName, state.tokens.join(' '));
        });
    }

    toggle(token, force) {
        return CustomElements.executeCEReactions(() => {
            validateToken(token);
            const state = $.getShadowState(this);
            const index = state.tokens.indexOf(token);
            if (index !== -1) {
                if (arguments.length === 1 || force === false) {
                    state.tokens.splice(index, 1);
                    $.setAttributeValue(state.element, state.localName, state.tokens.join(' '));
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
                    $.setAttributeValue(state.element, state.localName, state.tokens.join(' '));
                    return true;
                }
            }
        });
    }

    replace(token, newToken) {
        return CustomElements.executeCEReactions(() => {
            validateToken(token);
            validateToken(newToken);
            const state = $.getShadowState(this);
            const index = state.tokens.indexOf(token);
            if (index === -1) {
                return;
            }
            state.tokens[index] = newToken;
            state.tokens.sort();
            $.setAttributeValue(state.element, state.localName, state.tokens.join(' '));
        });
    }

    get value() {
        const state = $.getShadowState(this);
        return state.element.getAttribute(state.localName) || '';
    }

    set value(value) {
        return CustomElements.executeCEReactions(() => {
            const state = $.getShadowState(this);
            $.setAttributeValue(state.element, state.localName, value);
            // TODO: Remove usage of slice in favor of direct parse
            state.tokens = $.slice(this);
        });
    }

}

function validateTokens(tokens) {
    for (let i = 0; i < tokens.length; i++) {
        validateToken(tokens[i])
    }
}

function validateToken(token) {
    if (token == '') {
        throw $.makeError('SyntaxError');
    }
    if (/\s/.test(token)) {
        throw $.makeError('InvalidCharacterError')
    }
}

function createDOMTokenList(element, localName) {
    // TODO: run the steps per the DOM spec for 'when a DOMTokenList is created'
    const originalValue = element.getAttribute(localName);
    const tokens = originalValue ? originalValue.split(/\s/).sort() : [];
    const tokenList = Object.create(DOMTokenList.prototype);
    $.setShadowState(tokenList, { element, localName, tokens });
    return tokenList;
}

export function getOrCreateDOMTokenList(element, localName) {
    const elementState = $.getShadowState(element) || $.setShadowState(element, { tokenLists: {} });
    if (!elementState.tokenLists) {
        elementState.tokenLists = {};
    }
    let tokenList;
    if (tokenList = elementState.tokenLists[localName]) {
        return tokenList;
    }
    return elementState.tokenLists[localName] = createDOMTokenList(element, localName);
}
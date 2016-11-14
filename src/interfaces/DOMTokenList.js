// https://dom.spec.whatwg.org/#interface-domtokenlist

import * as $ from '../utils.js';

export default class {

    get length() {
        const state = $.shadow(this);
        return state.tokens.length;
    }

    // TODO: Caveat about indexer expressions?
    item(index) {
        const state = $.shadow(this);
        return index >= state.tokens.length ? null : state.tokens[index];
    }

    contains(token) {
        const state = $.shadow(this);
        return state.tokens.indexOf(token) !== -1;
    }

    add(...tokens) {
        validateTokens(tokens);
        const state = $.shadow(this);
        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i];
            const index = state.tokens.indexOf(token);
            if (index === -1) {
                state.tokens.push(token);
            }
        }
        state.tokens.sort();
        $.setAttributeValue(state.element, state.localName, state.tokens.join(' '));
    }

    remove(...tokens) {
        validateTokens(tokens);
        const state = $.shadow(this);
        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i];
            const index = state.tokens.indexOf(token);
            if (index !== -1) {
                state.tokens.splice(index, 1);
            }
        }
        $.setAttributeValue(state.element, state.localName, state.tokens.join(' '));
    }

    toggle(token, force) {
        validateToken(token);
        const state = $.shadow(this);
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
    }

    replace(token, newToken) {
        validateToken(token);
        validateToken(newToken);
        const state = $.shadow(this);
        const index = state.tokens.indexOf(token);
        if (index === -1) {
            return;
        }
        state.tokens[index] = newToken;
        state.tokens.sort();
        $.setAttributeValue(state.element, state.localName, state.tokens.join(' '));
    }

    get value() {
        const state = $.shadow(this);
        return state.element.getAttribute(state.localName) || '';
    }

    set value(value) {
        const state = $.shadow(this);
        $.setAttributeValue(state.element, state.localName, value);
        state.tokens = $.slice(this);
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
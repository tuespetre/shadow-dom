'use strict';

suite('Style Scoping', function () {

    var assert = chai.assert;

    var scopingElement = function () {
        var self = HTMLElement.call(this);
        return self;
    };

    scopingElement.prototype = Object.create(HTMLElement.prototype, {
        'constructor': {
            value: scopingElement
        }
    });

    customElements.define('scoping-element', scopingElement);

    test('rewrites simple :host selectors', function () {
        var element = document.createElement('scoping-element');
        var style = document.createElement('style');
        style.textContent = ':host { color: green; }';
        element.attachShadow({ mode: 'open' }).append(style);
        assert.equal(style.textContent, 'scoping-element { color: green; }');
    });

    test('rewrites simple :host() selectors', function () {
        var element = document.createElement('scoping-element');
        var style = document.createElement('style');
        style.textContent = ':host(.sad) { color: blue; }';
        element.attachShadow({ mode: 'open' }).append(style);
        assert.equal(style.textContent, 'scoping-element.sad { color: blue; }');
    });

    test('rewrites simple :host-context() selectors', function () {
        var element = document.createElement('scoping-element');
        var style = document.createElement('style');
        style.textContent = ':host-context(.party-time) { color: fuchsia; }';
        element.attachShadow({ mode: 'open' }).append(style);
        assert.equal(style.textContent, '.party-time scoping-element { color: fuchsia; }');
    });

    test('rewrites simple ::slotted() selectors', function () {
        var element = document.createElement('scoping-element');
        var style = document.createElement('style');
        style.textContent = '::slotted(*) { color: red; }';
        element.attachShadow({ mode: 'open' }).append(style);
        assert.equal(style.textContent, 'scoping-element slot > * { color: red; }');
    });

    test('rewrites simple ::slotted() selectors with "preselectors"', function () {
        var element = document.createElement('scoping-element');
        var style = document.createElement('style');
        style.textContent = '[name=my-slot]::slotted(*) { color: red; }';
        element.attachShadow({ mode: 'open' }).append(style);
        assert.equal(style.textContent, 'scoping-element [name=my-slot] > * { color: red; }');
    });

});
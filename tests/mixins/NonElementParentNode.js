'use strict';

suite('NonElementParentNode', function () {

    var assert = chai.assert;

    suite('getElementById(id)', function () {

        test('does not throw when no native match found', function () {
            var document = window.document.implementation.createHTMLDocument('test');
            var div = document.createElement('div');
            assert.doesNotThrow(function () {
                document.getElementById('non-existent');
            });
        });

        test('returns the correct element for tree order', function () {
            var document = window.document.implementation.createHTMLDocument('test');
            var div1 = document.createElement('div');
            div1.id = 'test';
            var div2 = document.createElement('div');
            div2.id = 'test';
            document.body.append(div1, div2);
            assert.equal(document.getElementById('test'), div1);
        });

        test('does not look down into shadow roots for the element', function () {
            var document = window.document.implementation.createHTMLDocument('test');
            var div1 = document.createElement('div');
            div1.id = 'test';
            var div2 = document.createElement('div');
            div2.id = 'test';
            var div3 = document.createElement('div');
            div3.attachShadow({ mode: 'open' });
            div3.shadowRoot.append(div1);
            document.body.append(div3, div2);
            assert.equal(document.getElementById('test'), div2);
        });

        test('works properly with document fragments and shadow roots', function () {
            var document = window.document.implementation.createHTMLDocument('test');
            var div1 = document.createElement('div');
            div1.attachShadow({ mode: 'open' });
            var div2 = document.createElement('div');
            div2.attachShadow({ mode: 'open' });
            var div3 = document.createElement('div');
            div3.id = 'test';
            var div4 = document.createElement('div');
            div4.id = 'test';
            div2.shadowRoot.append(div4);
            div1.shadowRoot.append(div2, div3);
            assert.equal(div1.shadowRoot.getElementById('test'), div3);
        });

    });

});
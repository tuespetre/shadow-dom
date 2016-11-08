'use strict';

suite('Node', function () {

    var assert = chai.assert;

    suite('getRootNode(options)', function () {

        suite('when composed is false', function () {

            test('returns the document for connected nodes outside of a shadow tree', function () {
                var document = window.document.implementation.createHTMLDocument();
                var div = document.createElement('div');
                document.body.appendChild(div);
                assert.equal(div.getRootNode(), document);
            });

            test('returns the topmost node for disconnected nodes outside of a shadow tree', function () {
                var document = window.document.implementation.createHTMLDocument();
                var div = document.createElement('div');
                assert.equal(div.getRootNode(), div);
                var span = document.createElement('span');
                div.appendChild(span);
                assert.equal(span.getRootNode(), div);
            });

            test('returns the shadow root for nodes inside of a shadow tree', function () {
                var document = window.document.implementation.createHTMLDocument();
                var div = document.createElement('div');
                var shadow = div.attachShadow({ mode: 'open' });
                var span = document.createElement('span');
                shadow.appendChild(span);
                assert.equal(span.getRootNode(), shadow);
            });

        });

        suite('when composed is true', function () {

            test('returns the document for connected nodes outside of a shadow tree', function () {
                var document = window.document.implementation.createHTMLDocument();
                var div = document.createElement('div');
                document.body.appendChild(div);
                assert.equal(div.getRootNode({ composed: true }), document);
            });

            test('returns the topmost node for disconnected nodes outside of a shadow tree', function () {
                var document = window.document.implementation.createHTMLDocument();
                var div = document.createElement('div');
                assert.equal(div.getRootNode(), div);
                var span = document.createElement('span');
                div.appendChild(span);
                assert.equal(span.getRootNode({ composed: true }), div);
            });

            test('returns the document for connected nodes inside of a shadow tree', function () {
                var document = window.document.implementation.createHTMLDocument();
                var div = document.createElement('div');
                var shadow = div.attachShadow({ mode: 'open' });
                var span = document.createElement('span');
                shadow.appendChild(span);
                document.body.appendChild(div);
                assert.equal(span.getRootNode({ composed: true }), document);
            });

            test('returns the topmost element for disconnected nodes inside of a shadow tree', function () {
                var document = window.document.implementation.createHTMLDocument();
                var div = document.createElement('div');
                var shadow = div.attachShadow({ mode: 'open' });
                var span = document.createElement('span');
                shadow.appendChild(span);
                assert.equal(span.getRootNode({ composed: true }), div);
            });

        });

    });

    suite('get parentNode()', function () {

        test('returns null for shadow roots', function () {
            var div = document.createElement('div');
            div.attachShadow({ mode: 'open' });
            assert.isNull(div.shadowRoot.parentNode);
        });

        test('returns shadow root for children of shadow roots', function () {
            var div = document.createElement('div');
            var span = document.createElement('span');
            div.attachShadow({ mode: 'open' });
            div.shadowRoot.appendChild(span);
            assert.equal(span.parentNode, div.shadowRoot);
        });

    });

    suite('get parentElement()', function () {

        test('returns null for shadow roots', function () {
            var div = document.createElement('div');
            div.attachShadow({ mode: 'open' });
            assert.isNull(div.shadowRoot.parentElement);
        });

        test('returns null for children of shadow roots', function () {
            var div = document.createElement('div');
            var span = document.createElement('span');
            div.attachShadow({ mode: 'open' });
            div.shadowRoot.appendChild(span);
            assert.isNull(span.parentElement);
        });

    });

});
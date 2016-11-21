'use strict';

suite('Node', function () {

    var assert = chai.assert;

    suite('getRootNode(options)', function () {

        suite('when composed is false', function () {

            test('returns the document for connected nodes outside of a shadow tree', function () {
                var document = window.document.implementation.createHTMLDocument('test');
                var div = document.createElement('div');
                document.body.appendChild(div);
                assert.equal(div.getRootNode(), document);
            });

            test('returns the topmost node for disconnected nodes outside of a shadow tree', function () {
                var document = window.document.implementation.createHTMLDocument('test');
                var div = document.createElement('div');
                assert.equal(div.getRootNode(), div);
                var span = document.createElement('span');
                div.appendChild(span);
                assert.equal(span.getRootNode(), div);
            });

            test('returns the shadow root for nodes inside of a shadow tree', function () {
                var document = window.document.implementation.createHTMLDocument('test');
                var div = document.createElement('div');
                var shadow = div.attachShadow({ mode: 'open' });
                var span = document.createElement('span');
                shadow.appendChild(span);
                assert.equal(span.getRootNode(), shadow);
            });

        });

        suite('when composed is true', function () {

            test('returns the document for connected nodes outside of a shadow tree', function () {
                var document = window.document.implementation.createHTMLDocument('test');
                var div = document.createElement('div');
                document.body.appendChild(div);
                assert.equal(div.getRootNode({ composed: true }), document);
            });

            test('returns the topmost node for disconnected nodes outside of a shadow tree', function () {
                var document = window.document.implementation.createHTMLDocument('test');
                var div = document.createElement('div');
                assert.equal(div.getRootNode(), div);
                var span = document.createElement('span');
                div.appendChild(span);
                assert.equal(span.getRootNode({ composed: true }), div);
            });

            test('returns the document for connected nodes inside of a shadow tree', function () {
                var document = window.document.implementation.createHTMLDocument('test');
                var div = document.createElement('div');
                var shadow = div.attachShadow({ mode: 'open' });
                var span = document.createElement('span');
                shadow.appendChild(span);
                document.body.appendChild(div);
                assert.equal(span.getRootNode({ composed: true }), document);
            });

            test('returns the topmost element for disconnected nodes inside of a shadow tree', function () {
                var document = window.document.implementation.createHTMLDocument('test');
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

    suite('set nodeValue(value)', function () {

        test('sets Attr.value for Attr nodes', function () {
            var attr = document.createAttribute('test');
            attr.value = '1';
            attr.nodeValue = '2';
            assert.equal(attr.value, '2');
        });

        test('sets CharacterData.data for CharacterData nodes', function () {
            var comment = document.createComment('1');
            comment.nodeValue = '2';
            assert.equal(comment.data, '2');
        });

    });

    suite('get textContent()', function () {

        test('returns tree-order concatenated data of Element\'s Text descendants ', function () {
            var div = document.createElement('div');
            var span1 = document.createElement('span');
            span1.appendChild(document.createTextNode('span1'));
            div.appendChild(span1);
            div.appendChild(document.createTextNode('div1'));
            div.appendChild(document.createComment('comment1'));
            div.attachShadow({ mode: 'open' }).appendChild(document.createTextNode('shadow1'));
            var span2 = document.createElement('span');
            span2.appendChild(document.createTextNode('span2'));
            div.appendChild(span2);
            div.appendChild(document.createComment('comment2'));
            div.appendChild(document.createTextNode('div2'));
            assert.equal(div.textContent, 'span1div1span2div2');
        });

        test('returns Attr.value', function () {
            var attr = document.createAttribute('test');
            attr.value = 'test';
            assert.equal(attr.textContent, 'test');
        });

        test('returns CharacterData.data', function () {
            var comment = document.createComment('test');
            assert.equal(comment.textContent, 'test');
        });

    });

    suite('set textContent(value)', function () {

        test('replaces all children with a new Text node for Elements', function () {
            var element = document.createElement('div');
            element.appendChild(document.createElement('span'));
            element.textContent = 'text';
            assert.equal(element.childNodes.length, 1);
            assert.equal(element.childNodes[0].data, 'text');
        });

        test('sets Attr.value for Attr nodes', function () {
            var attr = document.createAttribute('test');
            attr.value = '1';
            attr.textContent = '2';
            assert.equal(attr.value, '2');
        });

        test('sets CharacterData.data for CharacterData nodes', function () {
            var comment = document.createComment('1');
            comment.textContent = '2';
            assert.equal(comment.data, '2');
        });

    });

    suite('appendChild(node)', function () {

        test('returns the appended child node', function () {
            var parent = document.createElement('div');
            var child = document.createElement('span');
            var result = parent.appendChild(child);
            assert.equal(result, child);
        });

    });

});
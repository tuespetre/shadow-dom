'use strict';

suite('Element', function () {

    var assert = chai.assert;

    suite('get slot()', function () {

        test('gets the value of the \'slot\' attribute', function () {
            var div = document.createElement('div');
            assert.equal(div.slot, null);
            div.setAttribute('slot', 'test');
            assert.equal(div.slot, 'test');
        });

    });

    suite('set slot(value)', function () {

        test('sets the value of the \'slot\' attribute', function () {
            var div = document.createElement('div');
            assert.equal(div.getAttribute('slot'), null);
            div.slot = 'test';
            assert.equal(div.getAttribute('slot'), 'test');
        });

    });

    suite('attachShadow(init)', function () {

        test('must be supplied init', function () {
            var div = document.createElement('div');
            assert.throws(function () {
                div.attachShadow();
            }, 'TypeError');
        });

        test('must be supplied init with mode', function () {
            var div = document.createElement('div');
            assert.throws(function () {
                div.attachShadow({});
            }, 'TypeError');
        });

        test('must be supplied init with valid mode', function () {
            var div = document.createElement('div');
            assert.throws(function () {
                div.attachShadow({ mode: 'test' });
            }, 'TypeError');
        });

        test('can only be called for HTML elements', function () {
            var glyph = document.createElementNS('http://www.w3.org/2000/svg', 'glyph');
            assert.throws(function () {
                glyph.attachShadow({ mode: 'open' });
            }, 'NotSupportedError');
        });

        test('can only be called for whitelisted built-in elements', function () {
            var input = document.createElement('input');
            assert.throws(function () {
                input.attachShadow({ mode: 'open' });
            }, 'NotSupportedError');
        });

        test('can only be called for whitelisted hyphenated elements', function () {
            var fontFace = document.createElement('font-face');
            assert.throws(function () {
                fontFace.attachShadow({ mode: 'open' });
            }, 'NotSupportedError');
        });

        test('can only be called once per element', function () {
            var div = document.createElement('div');
            div.attachShadow({ mode: 'open' });
            assert.throws(function () {
                div.attachShadow({ mode: 'open' });
            }, 'InvalidStateError');
        });

        test('initializes the shadow root\'s host', function () {
            var div = document.createElement('div');
            assert.equal(div.attachShadow({ mode: 'open' }).host, div);
        });

        test('initializes the shadow root\'s mode', function () {
            var div;
            div = document.createElement('div');
            assert.equal(div.attachShadow({ mode: 'open' }).mode, 'open');
            div = document.createElement('div');
            assert.equal(div.attachShadow({ mode: 'closed' }).mode, 'closed');
        });

        test('stores the existing children in shadow state', function () {
            var div = document.createElement('div');
            var span = document.createElement('span');
            var text = document.createTextNode('test');
            div.append(span, text);
            div.attachShadow({ mode: 'open' });
            assert.equal(div._shadow.childNodes[0], span);
            assert.equal(div._shadow.childNodes[1], text);
        });

        test('returns the shadow root', function () {
            var div;
            div = document.createElement('div');
            assert.isNotNull(div.attachShadow({ mode: 'open' }));
            div = document.createElement('div');
            assert.isNotNull(div.attachShadow({ mode: 'closed' }));
        });

    });

    suite('get shadowRoot()', function () {

        test('returns open shadow root', function () {
            var div = document.createElement('div');
            var shadow = div.attachShadow({ mode: 'open' });
            assert.equal(div.shadowRoot, shadow);
        });

        test('does not return closed shadow root', function () {
            var div = document.createElement('div');
            div.attachShadow({ mode: 'closed' });
            assert.isNull(div.shadowRoot);
        });

    });

});
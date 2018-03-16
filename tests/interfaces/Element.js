'use strict';

suite('Element', function () {

    var assert = chai.assert;

    suite('get slot()', function () {

        test('gets the value of the \'slot\' attribute', function () {
            var div = document.createElement('div');
            assert.equal(div.slot, '');
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

    suite('get innerHTML()', function () {

        test('does not include shadow tree', function () {
            var div = document.createElement('div');
            div.attachShadow({ mode: 'open'}).append(document.createTextNode('you always leave me out'));
            div.append('well maybe if you didnt complain all the time');
            assert.equal(div.innerHTML, 'well maybe if you didnt complain all the time');
        });

    });

    suite('set innerHTML()', function () {

        test('results in expected children', function () {
            var div = document.createElement('div');
            div.innerHTML = '<!--comment--><span>element</span>text';
            assert.isTrue(div.firstChild instanceof Comment);
            assert.isTrue(div.childNodes[1] instanceof HTMLSpanElement);
            assert.isTrue(div.lastChild instanceof Text);
        });

        test('preserves shadow root and its contents', function () {
            var div = document.createElement('div');
            div.attachShadow({ mode: 'open'}).append(document.createTextNode('uh, yeah it is'));
            div.innerHTML = 'this div aint big enough for the two of us';
            assert.equal(div.shadowRoot.firstChild.data, 'uh, yeah it is');
        });
        
        test('properly handles table elements', function () {
            var table = document.createElement('table');
            var tbody = table.createTBody();
            tbody.innerHTML = '<tr><td>cell 1</td><td>cell 2</td></tr>';
            assert.equal(tbody.firstChild.tagName, 'TR');
            assert.equal(tbody.firstChild.firstChild.textContent, 'cell 1');
            var div = document.createElement('div');
            div.innerHTML = '<div><tr><td>cell 1</td><td>cell 2</td></tr></div>';
            assert.equal(div.innerHTML, '<div>cell 1cell 2</div>');
        });

    });

    suite('attribute-related methods', function () {

        test('setAttribute', function () {
            // IE would throw a 'member not found' or similar exception
            // if, for instance, setAttributeNodeNS was being used internally.
            var input = document.createElement('input');
            assert.doesNotThrow(function () {
                input.setAttribute('type', 'radio');
            });
            assert.equal(input.getAttribute('type'), 'radio');
        });

        test('setAttributeNS', function () {
            var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            var xmlns = 'http://www.w3.org/2000/xmlns/';
            var qualified = 'xmlns:xlink';
            var xlink = 'http://www.w3.org/1999/xlink';
            svg.setAttributeNS(xmlns, qualified, xlink);
            assert.equal(svg.getAttributeNS(xmlns, 'xlink'), xlink);
        });

        test('removeAttribute', function () {
            var element = document.createElement('div');
            element.setAttribute('hidden', '');
            assert.doesNotThrow(function () {
                element.removeAttribute('hidden');
            });
            assert.isFalse(element.hasAttribute('hidden'));
        });

    });

});
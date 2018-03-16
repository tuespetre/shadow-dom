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
            var err = void 0;
            try {
                div.attachShadow();
            }
            catch (e) {
                err = e;
            }
            assert.equal('TypeError', err.toString());
        });

        test('must be supplied init with mode', function () {
            var div = document.createElement('div');
            var err = void 0;
            try {
                div.attachShadow({});
            }
            catch (e) {
                err = e;
            }
            assert.equal('TypeError', err.toString());
        });

        test('must be supplied init with valid mode', function () {
            var div = document.createElement('div');
            var err = void 0;
            try {
                div.attachShadow({ mode: 'test' });
            }
            catch (e) {
                err = e;
            }
            assert.equal('TypeError', err.toString());
        });

        test('can only be called for HTML elements', function () {
            var glyph = document.createElementNS('http://www.w3.org/2000/svg', 'glyph');
            var err = void 0;
            try {
                glyph.attachShadow({ mode: 'open' });
            }
            catch (e) {
                err = e;
            }
            assert.equal('NotSupportedError', err.toString());
        });

        test('can only be called for whitelisted built-in elements', function () {
            var input = document.createElement('input');
            var err = void 0;
            try {
                input.attachShadow({ mode: 'open' });
            }
            catch (e) {
                err = e;
            }
            assert.equal('NotSupportedError', err.toString());
        });

        test('can only be called for whitelisted hyphenated elements', function () {
            var fontFace = document.createElement('font-face');
            var err = void 0;
            try {
                fontFace.attachShadow({ mode: 'open' });
            }
            catch (e) {
                err = e;
            }
            assert.equal('NotSupportedError', err.toString());
        });

        test('can only be called once per element', function () {
            var div = document.createElement('div');
            div.attachShadow({ mode: 'open' });
            var err = void 0;
            try {
                div.attachShadow({ mode: 'open' });
            }
            catch (e) {
                err = e;
            }
            assert.equal('InvalidStateError', err.toString());
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
            div.attachShadow({ mode: 'open' }).append(document.createTextNode('you always leave me out'));
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
            div.attachShadow({ mode: 'open' }).append(document.createTextNode('uh, yeah it is'));
            div.innerHTML = 'this div aint big enough for the two of us';
            assert.equal(div.shadowRoot.firstChild.data, 'uh, yeah it is');
        });
        
        test('properly handles <option> for <select>', function () {
            var select = document.createElement('select');
            select.innerHTML = '<option>text</option>';
            assert.equal(select.innerHTML, '<option>text</option>');
        });
        
        test('properly handles <optgroup> for <select>', function () {
            var select = document.createElement('select');
            select.innerHTML = '<optgroup><option>text</option></optgroup>';
            assert.equal(select.innerHTML, '<optgroup><option>text</option></optgroup>');
        });
        
        test('properly handles <caption> for <table>', function () {
            var table = document.createElement('table');
            table.innerHTML = '<caption>caption text</caption>';
            assert.equal(table.innerHTML, '<caption>caption text</caption>');
        });
        
        test('properly handles <colgroup> for <table>', function () {
            var table = document.createElement('table');
            table.innerHTML = '<colgroup><col></colgroup>';
            assert.equal(table.innerHTML, '<colgroup><col></colgroup>');
        });
        
        test('properly handles <col> for <table>', function () {
            var table = document.createElement('table');
            table.innerHTML = '<col>';
            assert.equal(table.innerHTML, '<colgroup><col></colgroup>');
        });

        test('properly handles <tr> for <table>', function () {
            var table = document.createElement('table');
            table.innerHTML = '<tr><td>cell 1</td><td>cell 2</td></tr>';
            assert.equal(table.innerHTML, '<tbody><tr><td>cell 1</td><td>cell 2</td></tr></tbody>');
        });

        test('properly handles <th> for <table>', function () {
            var table = document.createElement('table');
            table.innerHTML = '<th>cell 1</th><th>cell 2</th>';
            assert.equal(table.innerHTML, '<tbody><tr><th>cell 1</th><th>cell 2</th></tr></tbody>');
        });

        test('properly handles <td> for <table>', function () {
            var table = document.createElement('table');
            table.innerHTML = '<td>cell 1</td><td>cell 2</td>';
            assert.equal(table.innerHTML, '<tbody><tr><td>cell 1</td><td>cell 2</td></tr></tbody>');
        });
        
        test('properly handles <th> for <tr>', function () {
            var row = document.createElement('tr');
            row.innerHTML = '<th>cell 1</th><th>cell 2</th>';
            assert.equal(row.innerHTML, '<th>cell 1</th><th>cell 2</th>');
        });

        test('properly handles <td> for <tr>', function () {
            var row = document.createElement('tr');
            row.innerHTML = '<td>cell 1</td><td>cell 2</td>';
            assert.equal(row.innerHTML, '<td>cell 1</td><td>cell 2</td>');
        });
        
        test('properly handles <col> for <colgroup>', function () {
            var colgroup = document.createElement('colgroup');
            colgroup.innerHTML = '<col>';
            assert.equal(colgroup.innerHTML, '<col>');
        });

        var sections = ['thead', 'tbody', 'tfoot'];

        for (var i = 0; i < sections.length; i++) {
            
            var tag = sections[i];

            test('properly handles <' + tag + '> for <table>', function () {
                var table = document.createElement('table');
                table.innerHTML = '<' + tag + '><tr><td>cell 1</td><td>cell 2</td></tr></' + tag + '>';
                assert.equal(table.innerHTML, '<' + tag + '><tr><td>cell 1</td><td>cell 2</td></tr></' + tag + '>');
            });

            test('properly handles <tr> for <' + tag + '>', function () {
                var section = document.createElement(tag);
                section.innerHTML = '<tr><td>cell 1</td><td>cell 2</td></tr>';
                assert.equal(section.innerHTML, '<tr><td>cell 1</td><td>cell 2</td></tr>');
            });

            test('properly handles <th> for <' + tag + '>', function () {
                var section = document.createElement(tag);
                section.innerHTML = '<th>cell 1</th><th>cell 2</th>';
                assert.equal(section.innerHTML, '<tr><th>cell 1</th><th>cell 2</th></tr>');
            });

            test('properly handles <td> for <' + tag + '>', function () {
                var section = document.createElement(tag);
                section.innerHTML = '<td>cell 1</td><td>cell 2</td>';
                assert.equal(section.innerHTML, '<tr><td>cell 1</td><td>cell 2</td></tr>');
            });

        }

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
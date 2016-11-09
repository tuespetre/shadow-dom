'use strict';

suite('Slotable', function () {

    var assert = chai.assert;

    suite('get assignedSlot()', function () {

        suite('for Element', function () {

            test('returns the first matching slot in the shadow root', function () {
                var document = window.document.implementation.createHTMLDocument('test');
                var div = document.createElement('div');
                div.attachShadow({ mode: 'open' });
                var slot1 = document.createElement('slot');
                slot1.name = 'test';
                var slot2 = document.createElement('slot');
                slot2.name = 'test';
                div.shadowRoot.append(slot1, slot2);
                var span = document.createElement('span');
                span.slot = 'test';
                div.append(span);
                assert.equal(span.assignedSlot, slot1);
            });

            test('returns null when the shadow root is closed even though the node has an assigned slot', function () {
                var document = window.document.implementation.createHTMLDocument('test');
                var div = document.createElement('div');
                var shadow = div.attachShadow({ mode: 'closed' });
                var slot = document.createElement('slot');
                slot.name = 'test';
                shadow.append(slot);
                var span = document.createElement('span');
                span.slot = 'test';
                div.append(span);
                assert.isNull(span.assignedSlot);
                assert.equal(slot._shadow.assignedNodes.length, 1);
                assert.equal(slot._shadow.assignedNodes[0], span);
                assert.equal(span._shadow.assignedSlot, slot);
            });

        });

        suite('for Text', function () {

            test('returns the first matching slot in the shadow root', function () {
                var document = window.document.implementation.createHTMLDocument('test');
                var div = document.createElement('div');
                div.attachShadow({ mode: 'open' });
                var slot1 = document.createElement('slot');
                var slot2 = document.createElement('slot');
                div.shadowRoot.append(slot1, slot2);
                var text = document.createTextNode('text');
                div.append(text);
                assert.equal(text.assignedSlot, slot1);
            });

            test('returns null when the shadow root is closed even though the node has an assigned slot', function () {
                var document = window.document.implementation.createHTMLDocument('test');
                var div = document.createElement('div');
                var shadow = div.attachShadow({ mode: 'closed' });
                var slot = document.createElement('slot');
                shadow.append(slot);
                var text = document.createTextNode('text');
                div.append(text);
                assert.isNull(text.assignedSlot);
                assert.equal(slot._shadow.assignedNodes.length, 1);
                assert.equal(slot._shadow.assignedNodes[0], text);
                assert.equal(text._shadow.assignedSlot, slot);
            });

        });

    });

});
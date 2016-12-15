'use strict';

suite('Table Elements', function () {

    var assert = chai.assert;

    suite('HTMLTableElement', function () {

        test('deleteCaption when caption contained a slot', function () {
            var div = document.createElement('div');
            var span = document.createElement('span');
            span.slot = 'caption-slot';
            div.appendChild(span);

            var table = document.createElement('table');
            var caption = table.createCaption();
            var slot = document.createElement('slot');
            slot.name = 'caption-slot';
            caption.appendChild(slot);
            div.attachShadow({ mode: 'open' }).appendChild(table);

            assert.equal(span.assignedSlot, slot);
            table.deleteCaption();
            assert.isNull(caption.parentNode);
            assert.isNull(span.assignedSlot);
        });

        test('deleteTHead when thead contained a slot', function () {
            var div = document.createElement('div');
            var span = document.createElement('span');
            span.slot = 'thead-slot';
            div.appendChild(span);

            var table = document.createElement('table');
            var thead = table.createTHead();
            var slot = document.createElement('slot');
            slot.name = 'thead-slot';
            thead.appendChild(slot);
            div.attachShadow({ mode: 'open' }).appendChild(table);

            assert.equal(span.assignedSlot, slot);
            table.deleteTHead();
            assert.isNull(thead.parentNode);
            assert.isNull(span.assignedSlot);
        });

        test('deleteTFoot when tfoot contained a slot', function () {
            var div = document.createElement('div');
            var span = document.createElement('span');
            span.slot = 'tfoot-slot';
            div.appendChild(span);

            var table = document.createElement('table');
            var tfoot = table.createTFoot();
            var slot = document.createElement('slot');
            slot.name = 'tfoot-slot';
            tfoot.appendChild(slot);
            div.attachShadow({ mode: 'open' }).appendChild(table);

            assert.equal(span.assignedSlot, slot);
            table.deleteTFoot();
            assert.isNull(tfoot.parentNode);
            assert.isNull(span.assignedSlot);
        });

        test('deleteRow when row contained a slot', function () {
            var div = document.createElement('div');
            var span = document.createElement('span');
            span.slot = 'trow-slot';
            div.appendChild(span);

            var table = document.createElement('table');
            var trow = table.insertRow();
            var slot = document.createElement('slot');
            slot.name = 'trow-slot';
            trow.insertCell().appendChild(slot);
            div.attachShadow({ mode: 'open' }).appendChild(table);

            assert.equal(span.assignedSlot, slot);
            table.deleteRow(0);
            assert.isNull(trow.parentNode);
            assert.isNull(span.assignedSlot);
        });

    });

    suite('HTMLTableSectionElement', function () {

        test('deleteRow when row contained a slot', function () {
            var div = document.createElement('div');
            var span = document.createElement('span');
            span.slot = 'trow-slot';
            div.appendChild(span);

            var tbody = document.createElement('tbody');
            var trow = tbody.insertRow();
            var slot = document.createElement('slot');
            slot.name = 'trow-slot';
            trow.insertCell().appendChild(slot);
            div.attachShadow({ mode: 'open' }).appendChild(tbody);

            assert.equal(span.assignedSlot, slot);
            tbody.deleteRow(0);
            assert.isNull(trow.parentNode);
            assert.isNull(span.assignedSlot);
        });

    });

    suite('HTMLTableRowElement', function () {

        test('deleteCell when cell contained a slot', function () {
            var div = document.createElement('div');
            var span = document.createElement('span');
            span.slot = 'cell-slot';
            div.appendChild(span);

            var row = document.createElement('tr');
            var cell = row.insertCell();
            var slot = document.createElement('slot');
            slot.name = 'cell-slot';
            cell.appendChild(slot);
            div.attachShadow({ mode: 'open' }).appendChild(row);

            assert.equal(span.assignedSlot, slot);
            row.deleteCell(0);
            assert.isNull(cell.parentNode);
            assert.isNull(span.assignedSlot);
        });

    });

});
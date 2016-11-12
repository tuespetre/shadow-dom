'use strict';

suite('Attr', function () {

    var assert = chai.assert;

    test('get value()', function () {
        var attr = document.createAttribute('test');
        attr.value = 'test';
        assert.equal(attr.value, 'test');
    });

    test('set value(value)', function () {
        var attr = document.createAttribute('test');
        attr.value = 'test';
        assert.equal(attr.value, 'test');
    });

});
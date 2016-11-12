'use strict';

suite('CharacterData', function () {

    var assert = chai.assert;

    test('get data()', function () {
        var node = document.createComment('test');
        assert.equal(node.data, 'test');
    });

    test('set data(value)', function () {
        var node = document.createComment('');
        node.data = 'test';
        assert.equal(node.data, 'test');
    });

    test('appendData(data)', function () {
        var node = document.createComment('te');
        node.appendData('st');
        assert.equal(node.data, 'test');
    });

    test('insertData(offset, data)', function () {
        var node = document.createComment('tt');
        node.insertData(1, 'es');
        assert.equal(node.data, 'test');
    });

    test('deleteData(offset, count)', function () {
        var node = document.createComment('teesst');
        node.deleteData(2, 2);
        assert.equal(node.data, 'test');
    });

    test('replaceData(offset, count, data)', function () {
        var node = document.createComment('txyzt');
        node.replaceData(1, 3, 'es');
        assert.equal(node.data, 'test');
    });

});
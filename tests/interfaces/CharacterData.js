'use strict';

suite('CharacterData', function () {

    var assert = chai.assert;

    suite('get data()', function () {

        test('returns the expected value', function () {
            var node = document.createComment('test');
            assert.equal(node.data, 'test');
        });

    });

    suite('set data(value)', function () {

        test('results in the expected value', function () {
            var node = document.createComment('xxxx');
            node.data = 'test';
            assert.equal(node.data, 'test');
        });

        if (!window.skipAsyncTests) {

            test('notifies mutation observers', function (done) {
                var node = document.createComment('xxxx');
                var observer = new MutationObserver(function (records) {
                    assert.equal(records.length, 1);
                    assert.equal(records[0].type, 'characterData');
                    assert.equal(records[0].oldValue, 'xxxx');
                    observer.disconnect();
                    done();
                });
                observer.observe(node, {
                    characterData: true,
                    characterDataOldValue: true
                });
                node.data = 'test';
            });

        }

    });

    suite('appendData(data)', function () {

        test('results in the expected value', function () {
            var node = document.createComment('te');
            node.appendData('st');
            assert.equal(node.data, 'test');
        });

        if (!window.skipAsyncTests) {

            test('notifies mutation observers', function (done) {
                var node = document.createComment('te');
                var observer = new MutationObserver(function (records) {
                    assert.equal(records.length, 1);
                    assert.equal(records[0].type, 'characterData');
                    assert.equal(records[0].oldValue, 'te');
                    observer.disconnect();
                    done();
                });
                observer.observe(node, {
                    characterData: true,
                    characterDataOldValue: true
                });
                node.appendData('st');
            });

        }

    });

    suite('insertData(offset, data)', function () {

        test('results in the expected value', function () {
            var node = document.createComment('tt');
            node.insertData(1, 'es');
            assert.equal(node.data, 'test');
        });

        if (!window.skipAsyncTests) {

            test('notifies mutation observers', function (done) {
                var node = document.createComment('tt');
                var observer = new MutationObserver(function (records) {
                    assert.equal(records.length, 1);
                    assert.equal(records[0].type, 'characterData');
                    assert.equal(records[0].oldValue, 'tt');
                    observer.disconnect();
                    done();
                });
                observer.observe(node, {
                    characterData: true,
                    characterDataOldValue: true
                });
                node.insertData(1, 'es');
            });

        }

    });

    suite('deleteData(offset, count)', function () {

        test('results in the expected value', function () {
            var node = document.createComment('teesst');
            node.deleteData(2, 2);
            assert.equal(node.data, 'test');
        });

        if (!window.skipAsyncTests) {

            test('notifies mutation observers', function (done) {
                var node = document.createComment('teesst');
                var observer = new MutationObserver(function (records) {
                    assert.equal(records.length, 1);
                    assert.equal(records[0].type, 'characterData');
                    assert.equal(records[0].oldValue, 'teesst');
                    observer.disconnect();
                    done();
                });
                observer.observe(node, {
                    characterData: true,
                    characterDataOldValue: true
                });
                node.deleteData(2, 2);
            });

        }

    });

    suite('replaceData(offset, count, data)', function () {

        test('results in the expected value', function () {
            var node = document.createComment('txyzt');
            node.replaceData(1, 3, 'es');
            assert.equal(node.data, 'test');
        });

        if (!window.skipAsyncTests) {

            test('notifies mutation observers', function (done) {
                var node = document.createComment('txyzt');
                var observer = new MutationObserver(function (records) {
                    assert.equal(records.length, 1);
                    assert.equal(records[0].type, 'characterData');
                    assert.equal(records[0].oldValue, 'txyzt');
                    observer.disconnect();
                    done();
                });
                observer.observe(node, {
                    characterData: true,
                    characterDataOldValue: true
                });
                node.replaceData(1, 3, 'es');
            });

        }

    });

});
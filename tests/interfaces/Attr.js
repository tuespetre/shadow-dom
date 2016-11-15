'use strict';

suite('Attr', function () {

    var assert = chai.assert;

    suite('get value()', function () {

        test('returns the expected value', function () {
            var attr = document.createAttribute('test');
            attr.value = 'test';
            assert.equal(attr.value, 'test');
        });

    });

    suite('set value(value)', function () {

        test('sets the expected value', function () {
            var attr = document.createAttribute('test');
            attr.value = 'test';
            assert.equal(attr.value, 'test');
        });

        if (!window.skipAsyncTests) {

            test('notifies mutation observers', function (done) {
                var attr = document.createAttribute('test');
                var elem = document.createElement('div');
                elem.setAttributeNode(attr);
                attr.value = 'test1';
                var observer = new MutationObserver(function (records) {
                    assert.equal(records.length, 1);
                    assert.equal(records[0].type, 'attributes');
                    assert.equal(records[0].oldValue, 'test1');
                    observer.disconnect();
                    done();
                });
                observer.observe(elem, {
                    attributes: true,
                    attributeOldValue: true
                });
                attr.value = 'test2';
            });
            
        }

    });

});
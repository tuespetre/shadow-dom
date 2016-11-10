'use strict';

suite('CustomEvent', function () {

    var assert = chai.assert;

    suite('constructor()', function () {

        test('respects init.bubbles', function () {
            var event = new CustomEvent('test', {
                bubbles: true
            });

            assert.isTrue(event.bubbles);
        });

        test('respects init.cancelable', function () {
            var event = new CustomEvent('test', {
                cancelable: true
            });

            assert.isTrue(event.cancelable);
        });

        test('respects init.composed', function () {
            var event = new CustomEvent('test', {
                composed: true
            });

            assert.isTrue(event.composed);
        });

        test('respects init.detail', function () {
            var event = new CustomEvent('test', {
                detail: { property: 'test' }
            });

            assert.equal(event.detail.property, 'test');
        });

    });

});
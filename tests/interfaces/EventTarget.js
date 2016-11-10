'use strict';

suite('EventTarget', function () {

    var assert = chai.assert;

    suite('addEventListener(type, callback, options)', function () {

        test('no-op on null callback', function () {
            var target = document.createElement('div');
            assert.doesNotThrow(function () {
                target.addEventListener('test', null);
            });
        });

        test('respects boolean options as capture', function () {
            var parent = document.createElement('div');
            var target = document.createElement('div');
            var phase = null;
            var handler = function (event) {
                phase = event.eventPhase;
            };
            parent.append(target);
            parent.addEventListener('test', handler, true);
            target.dispatchEvent(new Event('test'));
            assert.equal(phase, Event.prototype.CAPTURING_PHASE);
        });

        test('respects options.capture', function () {
            var parent = document.createElement('div');
            var target = document.createElement('div');
            var phase = null;
            var handler = function (event) {
                phase = event.eventPhase;
            };
            parent.append(target);
            parent.addEventListener('test', handler, { capture: true });
            target.dispatchEvent(new Event('test'));
            assert.equal(phase, Event.prototype.CAPTURING_PHASE);
        });

        test('respects options.once', function () {
            var target = document.createElement('div');
            var count = 0;
            var handler = function () {
                count++;
            };
            target.addEventListener('test', handler, { once: true });
            target.dispatchEvent(new Event('test'));
            target.dispatchEvent(new Event('test'));
            assert.equal(count, 1);
        });

        test('adds the listener without duplication', function () {
            var target = document.createElement('div');
            var count = 0;
            var handler = function () {
                count++;
            };
            target.addEventListener('test', handler);
            target.addEventListener('test', handler);
            target.dispatchEvent(new Event('test'));
            assert.equal(count, 1);
        });

        test('adds the same listener with differing capture options', function () {
            var parent = document.createElement('div');
            var target = document.createElement('div');
            var phases = [];
            var handler = function (event) {
                phases.push(event.eventPhase);
            };
            parent.append(target);
            parent.addEventListener('test', handler, true);
            parent.addEventListener('test', handler, false);
            target.dispatchEvent(new Event('test', { bubbles: true }));
            assert.sameMembers(phases, [Event.prototype.CAPTURING_PHASE, Event.prototype.BUBBLING_PHASE]);
        });

    });

    suite('removeEventListener(type, callback, options)', function () {

        test('no-op on null callback', function () {
            var target = document.createElement('div');
            assert.doesNotThrow(function () {
                target.removeEventListener('test', null);
            });
        });

        test('no-op on non-registered callback', function () {
            var target = document.createElement('div');
            assert.doesNotThrow(function () {
                target.removeEventListener('test', function () { });
            });
        });

        test('respects boolean options as capture', function () {
            var target = document.createElement('div');
            var count = 0;
            var handler = function (event) {
                count++;
            };
            target.addEventListener('test', handler, true);
            target.addEventListener('test', handler, false);
            target.dispatchEvent(new Event('test'));
            assert.equal(count, 2);
            target.removeEventListener('test', handler, true);
            target.dispatchEvent(new Event('test'));
            assert.equal(count, 3);
            target.removeEventListener('test', handler, false);
            target.dispatchEvent(new Event('test'));
            assert.equal(count, 3);
        });

        test('respects options.capture', function () {
            var target = document.createElement('div');
            var count = 0;
            var handler = function (event) {
                count++;
            };
            target.addEventListener('test', handler, { capture: true });
            target.addEventListener('test', handler, { capture: false });
            target.dispatchEvent(new Event('test'));
            assert.equal(count, 2);
            target.removeEventListener('test', handler, { capture: true });
            target.dispatchEvent(new Event('test'));
            assert.equal(count, 3);
            target.removeEventListener('test', handler, { capture: false });
            target.dispatchEvent(new Event('test'));
            assert.equal(count, 3);
        });

    });

});
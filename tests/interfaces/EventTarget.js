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
            document.body.append(parent);
            parent.addEventListener('test', handler, true);
            target.dispatchEvent(new Event('test'));
            parent.remove();
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
            document.body.append(parent);
            parent.addEventListener('test', handler, { capture: true });
            target.dispatchEvent(new Event('test'));
            parent.remove();
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
            document.body.append(parent);
            parent.addEventListener('test', handler, true);
            parent.addEventListener('test', handler, false);
            target.dispatchEvent(new Event('test', { bubbles: true }));
            parent.remove();
            assert.sameMembers(phases, [Event.prototype.CAPTURING_PHASE, Event.prototype.BUBBLING_PHASE]);
        });
        
        test('event handler addition during an event will not cause invocation during that event', function () {
            var target = document.createElement('div');
            var count = 0;
            var handler = function (event) {
                count++;
            };
            var adder = function (event) {
                target.addEventListener('test', handler);
            };
            target.addEventListener('test', adder);
            target.dispatchEvent(new Event('test'));
            assert.equal(count, 0);
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
            document.body.appendChild(target);
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
            document.body.removeChild(target);
        });

        test('respects options.capture', function () {
            var target = document.createElement('div');
            var count = 0;
            var handler = function (event) {
                count++;
            };
            document.body.appendChild(target);
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
            document.body.removeChild(target);
        });
        
        test('event handler removal during an event will stop the handler invocation', function () {
            var target = document.createElement('div');
            var count1 = 0;
            var count2 = 0;
            var count3 = 0;
            var handler1 = function (event) {
                count1++;
            };
            var handler2 = function (event) {
                count2++;
            };
            var handler3 = function (event) {
                count3++;
            };
            var remover = function (event) {
                target.removeEventListener('test', handler1);
            };
            target.addEventListener('test', remover);
            target.addEventListener('test', handler1);
            target.addEventListener('test', handler2);
            target.addEventListener('test', handler3);
            target.dispatchEvent(new Event('test'));
            assert.equal(count1, 0);
            assert.equal(count2, 1);
            assert.equal(count3, 1);
        });

    });

});
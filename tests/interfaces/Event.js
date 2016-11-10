'use strict';

suite('Event', function () {

    var assert = chai.assert;

    suite('constructor()', function () {

        test('respects init.bubbles', function () {
            var event = new Event('test', {
                bubbles: true
            });

            assert.isTrue(event.bubbles);
        });

        test('respects init.cancelable', function () {
            var event = new Event('test', {
                cancelable: true
            });

            assert.isTrue(event.cancelable);
        });

        test('respects init.composed', function () {
            var event = new Event('test', {
                composed: true
            });

            assert.isTrue(event.composed);
        });

    });

    suite('get currentTarget()', function () {

        test('returns correctly retargeted values', function () {
            var event = new Event('test', { composed: true, bubbles: true });
            var target = document.createElement('span');
            var div1 = document.createElement('div');
            var div2 = document.createElement('div');
            var div3 = document.createElement('div');
            var shadow1 = div1.attachShadow({ mode: 'open' });
            var shadow2 = div2.attachShadow({ mode: 'closed' });
            var shadow3 = div3.attachShadow({ mode: 'open' });
            shadow1.append(div2);
            shadow2.append(div3);
            shadow3.append(target);
            var targets = [];
            var handler = function (event) {
                targets.push([event.currentTarget, this])
            };
            div1.addEventListener('test', handler);
            shadow1.addEventListener('test', handler);
            div2.addEventListener('test', handler);
            shadow2.addEventListener('test', handler);
            div3.addEventListener('test', handler);
            shadow3.addEventListener('test', handler);
            target.addEventListener('test', handler);
            target.dispatchEvent(event);
            var expected = [target, shadow3, div3, shadow2, div2, shadow1, div1];
            assert.equal(targets.length, expected.length);
            for (var i = 0; i < targets.length; i++) {
                assert.equal(targets[i][0], expected[i]);
                assert.equal(targets[i][1], expected[i]);
            }
        });

    });

    suite('get target()', function () {

        test('returns correctly retargeted values', function () {
            var event = new Event('test', { composed: true, bubbles: true });
            var target = document.createElement('span');
            var div1 = document.createElement('div');
            var div2 = document.createElement('div');
            var div3 = document.createElement('div');
            var shadow1 = div1.attachShadow({ mode: 'open' });
            var shadow2 = div2.attachShadow({ mode: 'closed' });
            var shadow3 = div3.attachShadow({ mode: 'open' });
            shadow1.append(div2);
            shadow2.append(div3);
            shadow3.append(target);
            var targets = [];
            var handler = function (event) {
                targets.push(event.target);
            };
            div1.addEventListener('test', handler);
            shadow1.addEventListener('test', handler);
            div2.addEventListener('test', handler);
            shadow2.addEventListener('test', handler);
            div3.addEventListener('test', handler);
            shadow3.addEventListener('test', handler);
            target.addEventListener('test', handler);
            target.dispatchEvent(event);
            var expected = [target, target, div3, div3, div2, div2, div1];
            assert.equal(targets.length, expected.length);
            for (var i = 0; i < targets.length; i++) {
                assert.equal(targets[i], expected[i]);
            }
        });

    });

    suite('get relatedTarget()', function () {

        test('returns correctly retargeted values', function () {
            var event = document.createEvent('MouseEvent');
            var target = document.createElement('span');
            var related = document.createElement('span');
            var div1 = document.createElement('div');
            var div2 = document.createElement('div');
            var div3 = document.createElement('div');
            var shadow1 = div1.attachShadow({ mode: 'open' });
            var shadow2 = div2.attachShadow({ mode: 'closed' });
            var shadow3 = div3.attachShadow({ mode: 'open' });
            shadow1.append(div2);
            shadow2.append(div3);
            shadow3.append(target, related);
            var targets = [];
            var handler = function (event) {
                targets.push(event.relatedTarget);
            };
            div1.addEventListener('click', handler);
            shadow1.addEventListener('click', handler);
            div2.addEventListener('click', handler);
            shadow2.addEventListener('click', handler);
            div3.addEventListener('click', handler);
            shadow3.addEventListener('click', handler);
            target.addEventListener('click', handler);
            event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, related);
            target.dispatchEvent(event);
            var expected = [related, related];
            assert.equal(targets.length, expected.length);
            for (var i = 0; i < targets.length; i++) {
                assert.equal(targets[i], expected[i]);
            }
        });

    });

});
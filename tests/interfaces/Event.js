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

            document.body.appendChild(div1);
            target.dispatchEvent(event);
            document.body.removeChild(div1);

            var expected = [target, shadow3, div3, shadow2, div2, shadow1, div1];
            assert.equal(targets.length, expected.length);
            for (var i = 0; i < targets.length; i++) {
                assert.equal(targets[i][0], expected[i]);
                assert.equal(targets[i][1], expected[i]);
            }
        });

    });

    suite('get target()', function () {

        test('works in global event handlers', function () {
            var event = document.createEvent('MouseEvent');
            event.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            var target = document.createElement('span');
            var seenTarget = null;
            target.onclick = function (event) {
                seenTarget = event.target;
            };
            target.dispatchEvent(event);
            assert.equal(seenTarget, target);
        });

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

            document.body.appendChild(div1);
            target.dispatchEvent(event);
            document.body.removeChild(div1);
            
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

            document.body.appendChild(div1);
            target.dispatchEvent(event);
            document.body.removeChild(div1);

            var expected = [related, related];
            assert.equal(targets.length, expected.length);
            for (var i = 0; i < targets.length; i++) {
                assert.equal(targets[i], expected[i]);
            }
        });

    });

    suite('composedPath()', function () {

        test('returns correctly retargeted values', function () {
            // Note: events created via constructor can be dispatched
            // all the way up to the document's documentElement,
            // but if the document is not the global window.document,
            // the event will not be dispatched at the document.
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
            var actual = [];
            var expected = [];
            var handler = function (event) {
                actual.push(event.composedPath());
            };
            target.addEventListener('test', handler);
            var rootTargets = [document.body, document.documentElement, document, window];
            expected.push([target, shadow3, div3, shadow2, div2, shadow1, div1].concat(rootTargets));
            shadow3.addEventListener('test', handler);
            expected.push([target, shadow3, div3, shadow2, div2, shadow1, div1].concat(rootTargets));
            div3.addEventListener('test', handler);
            expected.push([target, shadow3, div3, shadow2, div2, shadow1, div1].concat(rootTargets));
            shadow2.addEventListener('test', handler);
            expected.push([target, shadow3, div3, shadow2, div2, shadow1, div1].concat(rootTargets));
            div2.addEventListener('test', handler);
            expected.push([div2, shadow1, div1].concat(rootTargets));
            shadow1.addEventListener('test', handler);
            expected.push([div2, shadow1, div1].concat(rootTargets));
            div1.addEventListener('test', handler);
            expected.push([div2, shadow1, div1].concat(rootTargets));

            document.body.appendChild(div1);
            target.dispatchEvent(event);
            document.body.removeChild(div1);

            assert.equal(actual.length, expected.length);
            for (var i = 0; i < actual.length; i++) {
                var _actual = actual[i];
                var _expected = expected[i];
                assert.equal(_actual.length, _expected.length);
                for (var j = 0; j < _actual.length; j++) {
                    assert.equal(_actual[j], _expected[j]);
                }
            }
        });

    });

});
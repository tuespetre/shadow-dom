'use strict';

suite('MutationObserver', function () {

    if (window.skipAsyncTests) {
        return;
    }

    var assert = chai.assert;

    function continueAsync(done, callback) {
        try {
            callback();
            done();
        }
        catch (error) {
            done(error);
        }
    }

    test('arguments and this value', function (done) {
        var node = document.createElement('div');
        var child = document.createElement('div');
        var observer = new MutationObserver(function (records, observerArg) {
            var thisArg = this;
            continueAsync(done, function () {
                observer.disconnect();
                assert.equal(thisArg, observer);
                assert.isTrue(records instanceof Array);
                assert.equal(observerArg, observer);
            });
        });
        observer.observe(node, {
            childList: true
        });
        node.append(child);
    });

    suite('attributes', function () {

        test('directly setting Attr.value', function (done) {
            var attr = document.createAttribute('test');
            var elem = document.createElement('div');
            elem.setAttributeNode(attr);
            attr.value = 'test1';
            var observer = new MutationObserver(function (records) {
                continueAsync(done, function () {
                    observer.disconnect();
                    assert.equal(records.length, 1);
                    assert.equal(records[0].type, 'attributes');
                    assert.equal(records[0].oldValue, 'test1');
                });
            });
            observer.observe(elem, {
                attributes: true,
                attributeOldValue: true
            });
            attr.value = 'test2';
        });

        suite('subtree', function () {

            test('filters out shadow-hidden records', function (done) {
                var node = document.createElement('div');
                var lightChild = document.createElement('div');
                var shadowChild = document.createElement('div');
                node.appendChild(lightChild);
                node.attachShadow({ mode: 'open' });
                node.shadowRoot.appendChild(shadowChild);
                var observer = new MutationObserver(function (records) {
                    continueAsync(done, function () {
                        observer.disconnect();
                        assert.equal(records.length, 1);
                        assert.equal(records[0].target, lightChild);
                        assert.equal(records[0].type, 'attributes');
                        assert.equal(records[0].attributeName, 'what');
                    });
                });
                observer.observe(node, {
                    attributes: true,
                    subtree: true
                });
                // Remove the nodes to ensure that filtering is working properly
                // even when removal happens before the records are taken.
                lightChild.setAttribute('what', 'ok');
                lightChild.remove();
                shadowChild.setAttribute('what', 'ok');
                shadowChild.remove();
            });

        });

    });

    suite('characterData', function () {

        test('directly setting CharacterData.data', function (done) {
            var node = document.createComment('xxxx');
            var observer = new MutationObserver(function (records) {
                continueAsync(done, function () {
                    observer.disconnect();
                    assert.equal(records.length, 1);
                    assert.equal(records[0].type, 'characterData');
                    assert.equal(records[0].oldValue, 'xxxx');
                });
            });
            observer.observe(node, {
                characterData: true,
                characterDataOldValue: true
            });
            node.data = 'test';
        });

        suite('subtree', function () {

            test('filters out shadow-hidden records', function (done) {
                var node = document.createElement('div');
                var lightChild = document.createTextNode('what');
                var shadowChild = document.createTextNode('what');
                node.appendChild(lightChild);
                node.attachShadow({ mode: 'open' });
                node.shadowRoot.appendChild(shadowChild);
                var observer = new MutationObserver(function (records) {
                    continueAsync(done, function () {
                        observer.disconnect();
                        assert.equal(records.length, 1);
                        assert.equal(records[0].target, lightChild);
                        assert.equal(records[0].type, 'characterData');
                    });
                });
                observer.observe(node, {
                    characterData: true,
                    subtree: true
                });
                // Remove the nodes to ensure that filtering is working properly
                // even when removal happens before the records are taken.
                lightChild.data = 'ok';
                lightChild.remove();
                shadowChild.data = 'ok';
                shadowChild.remove();
            });

        });

    });

    suite('childList', function () {

        test('adding a node', function (done) {
            var node = document.createElement('div');
            var child = document.createElement('div');
            var observer = new MutationObserver(function (records) {
                continueAsync(done, function () {
                    observer.disconnect();
                    assert.equal(records.length, 1);
                    assert.equal(records[0].type, 'childList');
                    assert.equal(records[0].removedNodes.length, 0);
                    assert.equal(records[0].addedNodes.length, 1);
                    assert.equal(records[0].addedNodes[0], child);
                });
            });
            observer.observe(node, {
                childList: true
            });
            node.append(child);
        });

        test('removing a node', function (done) {
            var node = document.createElement('div');
            var child = document.createElement('div');
            var observer = new MutationObserver(function (records) {
                continueAsync(done, function () {
                    observer.disconnect();
                    assert.equal(records.length, 1);
                    assert.equal(records[0].type, 'childList');
                    assert.equal(records[0].addedNodes.length, 0);
                    assert.equal(records[0].removedNodes.length, 1);
                    assert.equal(records[0].removedNodes[0], child);
                });
            });
            node.append(child);
            observer.observe(node, {
                childList: true
            });
            child.remove();
        });

        test('replacing a node', function (done) {
            var node = document.createElement('div');
            var child1 = document.createElement('div');
            var child2 = document.createElement('div');
            var observer = new MutationObserver(function (records) {
                continueAsync(done, function () {
                    observer.disconnect();
                    assert.equal(records.length, 1);
                    assert.equal(records[0].type, 'childList');
                    assert.equal(records[0].removedNodes.length, 1);
                    assert.equal(records[0].removedNodes[0], child1);
                    assert.equal(records[0].addedNodes.length, 1);
                    assert.equal(records[0].addedNodes[0], child2);
                });
            });
            node.append(child1);
            observer.observe(node, {
                childList: true
            });
            child1.replaceWith(child2);
        });

        suite('subtree', function () {

            test('filters out shadow-hidden records', function (done) {
                var node = document.createElement('div');
                var lightAddedChild = document.createElement('div');
                var lightRemovedChild = document.createElement('div');
                var shadowAddedChild = document.createElement('div');
                var shadowRemovedChild = document.createElement('div');
                node.attachShadow({ mode: 'open' });
                node.appendChild(lightRemovedChild);
                node.shadowRoot.appendChild(shadowRemovedChild);
                var observer = new MutationObserver(function (records) {
                    continueAsync(done, function () {
                        observer.disconnect();
                        assert.equal(records.length, 2);
                        assert.equal(records[0].type, 'childList');
                        assert.equal(records[0].removedNodes.length, 0);
                        assert.equal(records[0].addedNodes.length, 1);
                        assert.equal(records[0].addedNodes[0], lightAddedChild);
                        assert.equal(records[1].type, 'childList');
                        assert.equal(records[1].addedNodes.length, 0);
                        assert.equal(records[1].removedNodes.length, 1);
                        assert.equal(records[1].removedNodes[0], lightRemovedChild);
                    });
                });
                observer.observe(node, {
                    childList: true,
                    subtree: true
                });
                node.appendChild(lightAddedChild);
                node.removeChild(lightRemovedChild);
                node.shadowRoot.appendChild(shadowAddedChild);
                node.shadowRoot.removeChild(shadowRemovedChild);
            });

        });

    });

});
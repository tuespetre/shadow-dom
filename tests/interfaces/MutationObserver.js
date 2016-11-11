'use strict';

suite('MutationObserver', function () {

    var assert = chai.assert;

    test('arguments and this value', function (done) {
        var node = document.createElement('div');
        var child = document.createElement('div');
        var observer = new MutationObserver(function(records, observerArg) {
            assert.equal(this, observer);
            assert.equal(observerArg, observer);
            assert.isTrue(records instanceof Array);
            done();
        });
        observer.observe(node, {
            childList: true
        });
        node.append(child);
    });

    suite('childList', function () {

        test('adding a node', function (done) {
            var node = document.createElement('div');
            var child = document.createElement('div');
            var observer = new MutationObserver(function(records, observerArg) {
                assert.equal(records.length, 1);
                assert.equal(records[0].type, 'childList');
                assert.equal(records[0].removedNodes.length, 0);
                assert.equal(records[0].addedNodes.length, 1);
                assert.equal(records[0].addedNodes[0], child);
                done();
            });
            observer.observe(node, {
                childList: true
            });
            node.append(child);
        });

        test('removing a node', function (done) {
            var node = document.createElement('div');
            var child = document.createElement('div');
            var observer = new MutationObserver(function(records, observerArg) {
                assert.equal(records.length, 1);
                assert.equal(records[0].type, 'childList');
                assert.equal(records[0].addedNodes.length, 0);
                assert.equal(records[0].removedNodes.length, 1);
                assert.equal(records[0].removedNodes[0], child);
                done();
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
            var observer = new MutationObserver(function(records, observerArg) {
                assert.equal(records.length, 1);
                assert.equal(records[0].type, 'childList');
                assert.equal(records[0].removedNodes.length, 1);
                assert.equal(records[0].removedNodes[0], child1);
                assert.equal(records[0].addedNodes.length, 1);
                assert.equal(records[0].addedNodes[0], child2);
                done();
            });
            node.append(child1);
            observer.observe(node, {
                childList: true
            });
            child1.replaceWith(child2);
        });

    });

});
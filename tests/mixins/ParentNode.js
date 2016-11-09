'use strict';

suite('ParentNode', function () {

    var assert = chai.assert;
    var slice = function (list) {
        return Array.prototype.slice.call(list);
    };

    suite('Getters for Element (without shadow root)', function () {
        getterSuite(function () {
            var document = window.document.implementation.createHTMLDocument('test');
            var div = document.createElement('div');
            var text = document.createTextNode('test');
            var span1 = document.createElement('span');
            var span2 = document.createElement('span');
            div.append(span1, text, span2);
            this.expected = {
                children: [ span1, span2 ],
                firstElementChild: span1,
                lastElementChild: span2,
                childElementCount: 2
            };
            this.object = div;
        });
    });

    suite('Getters for Element (with shadow root)', function () {
        getterSuite(function () {
            var document = window.document.implementation.createHTMLDocument('test');
            var div = document.createElement('div');
            var text = document.createTextNode('test');
            var span1 = document.createElement('span');
            var span2 = document.createElement('span');
            div.append(span1, text, span2);
            div.attachShadow({ mode: 'open' });
            div.shadowRoot.append(document.createElement('p'));
            this.expected = {
                children: [ span1, span2 ],
                firstElementChild: span1,
                lastElementChild: span2,
                childElementCount: 2
            };
            this.object = div;
        });
    });

    suite('Getters for Document', function () {
        getterSuite(function () {
            var document = window.document.implementation.createHTMLDocument('test');
            this.expected = {
                children: [ document.documentElement ],
                firstElementChild: document.documentElement,
                lastElementChild: document.documentElement,
                childElementCount: 1
            };
            this.object = document;
        });
    });

    suite('Getters for DocumentFragment', function () {
        getterSuite(function () {
            var document = window.document.implementation.createHTMLDocument('test');
            var fragment = document.createDocumentFragment();
            var text = document.createTextNode('test');
            var span1 = document.createElement('span');
            var span2 = document.createElement('span');
            fragment.append(span1, text, span2);
            this.expected = {
                children: [ span1, span2 ],
                firstElementChild: span1,
                lastElementChild: span2,
                childElementCount: 2
            };
            this.object = fragment;
        });
    });
    
    function getterSuite(Scenario) {

        suite('get children()', function () {

            test('returns expected elements', function () {
                var scenario = new Scenario();
                assert.sameMembers(slice(scenario.object.children), scenario.expected.children);
            });

        });

        suite('get firstElementChild()', function () {

            test('returns expected element', function () {
                var scenario = new Scenario();
                assert.equal(scenario.object.firstElementChild, scenario.expected.firstElementChild);
            });

        });

        suite('get lastElementChild()', function () {

            test('returns expected element', function () {
                var scenario = new Scenario();
                assert.equal(scenario.object.lastElementChild, scenario.expected.lastElementChild);
            });

        });

        suite('get childElementCount()', function () {

            test('returns expected value', function () {
                var scenario = new Scenario();
                assert.equal(scenario.object.childElementCount, scenario.expected.childElementCount);
            });

        });

    };

});
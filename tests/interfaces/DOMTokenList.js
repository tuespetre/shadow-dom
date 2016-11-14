'use strict';

suite('DOMTokenList', function () {

    var assert = chai.assert;

    suite('add(...tokens)', function () {

        test('adds tokens in expected order', function () {
            var div = document.createElement('div');
            div.className = 'class3 class2';
            div.classList.add('class2', 'class1');
            assert.equal(div.className, 'class1 class2 class3');
        });

        test('triggers MutationObserver', function (done) {
            var div = document.createElement('div');
            div.className = 'class1 class2';
            var observer = new MutationObserver(function (records) {
                assert.equal(records.length, 1);
                assert.equal(records[0].oldValue, 'class1 class2');
                done();
            });
            observer.observe(div, { 
                attributes: true,
                attributeOldValue: true
            });
            div.classList.add('class3');
        });

    });

    suite('remove(...tokens)', function () {

        test('removes tokens', function () {
            var div = document.createElement('div');
            div.className = 'class3 class2';
            var classList = div.classList;
            div.classList.remove('class2', 'class1');
            assert.equal(div.className, 'class3');
        });

        test('triggers MutationObserver', function (done) {
            var div = document.createElement('div');
            div.className = 'class1 class2';
            var observer = new MutationObserver(function (records) {
                assert.equal(records.length, 1);
                assert.equal(records[0].oldValue, 'class1 class2');
                done();
            });
            observer.observe(div, { 
                attributes: true,
                attributeOldValue: true
            });
            div.classList.remove('class2');
        });

    });

    suite('toggle(token, force)', function () {

        test('removes token if present', function () {
            var div = document.createElement('div');
            div.className = 'class2 class1';
            div.classList.toggle('class2');
            assert.equal(div.className, 'class1');
        });

        test('keeps token if present and force is passed', function () {
            var div = document.createElement('div');
            div.className = 'class1 class2';
            div.classList.toggle('class2', true);
            assert.equal(div.className, 'class1 class2');
        });

        test('adds token if not present', function () {
            var div = document.createElement('div');
            div.className = 'class1';
            div.classList.toggle('class2');
            assert.equal(div.className, 'class1 class2');
        });

        test('triggers MutationObserver', function (done) {
            var div = document.createElement('div');
            div.className = 'class1 class2';
            var observer = new MutationObserver(function (records) {
                assert.equal(records.length, 1);
                assert.equal(records[0].oldValue, 'class1 class2');
                done();
            });
            observer.observe(div, { 
                attributes: true,
                attributeOldValue: true
            });
            div.classList.toggle('class3');
        });

    });

});
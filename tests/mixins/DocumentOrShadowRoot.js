'use strict';

suite('DocumentOrShadowRoot', function () {

    var assert = chai.assert;

    test('Document.activeElement', function () {
        var button = document.createElement('button');
        // prepend instead of append so we don't jump down the page
        // when trying to look at our pretty test results
        document.body.prepend(button);
        button.focus();
        assert.equal(document.activeElement, button);
        document.body.removeChild(button);
    });

});
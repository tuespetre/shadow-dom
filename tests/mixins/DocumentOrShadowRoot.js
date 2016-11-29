'use strict';

suite('DocumentOrShadowRoot', function () {

    var assert = chai.assert;

    test('Document.activeElement', function () {
        var button = document.createElement('button');
        document.body.append(button);
        button.focus();
        assert.equal(document.activeElement, button);
    });

});
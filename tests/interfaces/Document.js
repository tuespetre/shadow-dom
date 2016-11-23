'use strict';

suite('Document', function () {

    var assert = chai.assert;

    test('getElementsByClassName', function () {
        var element = document.createElement('div');
        element.className = 'zyxabc';
        document.body.append(element);
        var caught = null;
        var found = null;
        try {
            found = document.getElementsByClassName('zyxabc')[0];
        }
        catch (error) {
            caught = error;
        }
        element.remove();
        assert.isNull(caught);
        assert.equal(found, element);
    });

    test('getElementsByTagName', function () {
        var element = document.createElement('xyz-tag');
        document.body.append(element);
        var caught = null;
        var found = null;
        try {
            found = document.getElementsByTagName('xyz-tag')[0];
        }
        catch (error) {
            caught = error;
        }
        element.remove();
        assert.isNull(caught);
        assert.equal(found, element);
    });

});
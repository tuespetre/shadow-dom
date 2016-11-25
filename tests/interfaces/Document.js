'use strict';

suite('Document', function () {

    var assert = chai.assert;

    test('getElementsByClassName', function () {
        var document = window.document.implementation.createHTMLDocument('test');
        var host = document.createElement('div');
        var div1 = document.createElement('div');
        var div2 = document.createElement('div');
        var className1 = 'zyxabc';
        var className2 = 'abcxyz';
        var classNames = className1 + ' ' + className2;
        document.body.className = className1;
        host.className = className2;
        div1.className = classNames
        div2.className = classNames
        document.body.append(host);
        host.append(div1);
        host.attachShadow({ mode: 'open' }).append(div2);
        document.body.append(host);
        var results = document.getElementsByClassName(classNames);
        assert.equal(results.length, 1);
        assert.equal(results[0], div1);
    });

    test('getElementsByTagName', function () {
        var document = window.document.implementation.createHTMLDocument('test');
        var host = document.createElement('div');
        var span1 = document.createElement('span');
        var span2 = document.createElement('span');
        document.body.append(host);
        host.append(span1);
        host.attachShadow({ mode: 'open' }).append(span2);
        document.body.append(host);
        var results = document.getElementsByTagName('span');
        assert.equal(results.length, 1);
        assert.equal(results[0], span1);
    });

    test('getElementsByTagNameNS', function () {
        var ns = 'http://some.ns.com/somens'
        var document = window.document.implementation.createHTMLDocument('test');
        var host = document.createElement('div');
        var span1 = document.createElementNS(ns, 'span');
        var span2 = document.createElementNS(ns, 'span');
        document.body.append(host);
        host.append(span1);
        host.attachShadow({ mode: 'open' }).append(span2);
        document.body.append(host);
        var results = document.getElementsByTagNameNS(ns, 'span');
        assert.equal(results.length, 1);
        assert.equal(results[0], span1);
    });

});
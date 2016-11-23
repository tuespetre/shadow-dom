'use strict';

suite('Custom Elements', function () {

    var assert = chai.assert;

    function makeSuite(name, tagName, elementClass) {

        suite(name, function () {

            test('can be defined on window.customElements', function () {
                // Ensure that, upon definition, enqueuing the upgrade callback works
                var element = document.createElement(tagName);
                document.body.append(element);
                var caught = null;
                try {
                    window.customElements.define(tagName, elementClass);
                    var defined = window.customElements.get(tagName);
                    assert.equal(defined, elementClass);
                }
                catch (error) {
                    caught = error;
                }
                element.remove();
                assert.isNull(caught);
            });

            test('can be constructed with document.createElement', function () {
                var element = document.createElement(tagName);
                assert.isTrue('connectedCallback' in element);
                assert.isTrue('disconnectedCallback' in element);
                assert.isTrue('adoptedCallback' in element);
                assert.isTrue('attributeChangedCallback' in element);
            });

            test('can be constructed directly with new()', function () {
                var element = new elementClass();
                assert.isTrue('connectedCallback' in element);
                assert.isTrue('disconnectedCallback' in element);
                assert.isTrue('adoptedCallback' in element);
                assert.isTrue('attributeChangedCallback' in element);
            });

            test('connectedCallback is invoked', function () {
                var element = document.createElement(tagName);
                document.body.appendChild(element);
                document.body.removeChild(element);
                assert.equal(element.connectedCallbackCount, 1);
                assert.equal(element.connectedCallbackArgs.length, 0);
            });

            test('disconnectedCallback is invoked', function () {
                var element = document.createElement(tagName);
                document.body.appendChild(element);
                document.body.removeChild(element);
                assert.equal(element.disconnectedCallbackCount, 1);
                assert.equal(element.disconnectedCallbackArgs.length, 0);
            });

            test('adoptedCallback is invoked', function () {
                var element = document.createElement(tagName);
                var newDocument = document.implementation.createHTMLDocument('test');
                newDocument.adoptNode(element);
                assert.equal(element.adoptedCallbackCount, 1);
                assert.equal(element.adoptedCallbackArgs.length, 2);
            });

            test('attributeChangedCallback is invoked', function () {
                var element = document.createElement(tagName);
                element.setAttribute('attr1', 'some value');
                assert.equal(element.attributeChangedCallbackCount, 1);
                assert.equal(element.attributeChangedCallbackArgs.length, 4);
                element.setAttribute('attr3', 'some value');
                assert.equal(element.attributeChangedCallbackCount, 1);
            });

        });

    }

    // Hand-written ES5-style class    

    function myElement () {
        var self = HTMLElement.call(this);
        self.connectedCallbackCount = 0;
        self.disconnectedCallbackCount = 0;
        self.adoptedCallbackCount = 0;
        self.attributeChangedCallbackCount = 0;
        return self;
    };

    myElement.prototype = Object.create(HTMLElement.prototype, {
        'constructor': {
            value: myElement,
            writable: true,
            configurable: true
        }
    });

    myElement.observedAttributes = ['attr1', 'attr2'];

    myElement.prototype.connectedCallback = function () {
        this.connectedCallbackArgs = arguments;
        this.connectedCallbackCount++;
    };

    myElement.prototype.disconnectedCallback = function () {
        this.disconnectedCallbackArgs = arguments;
        this.disconnectedCallbackCount++;
    };

    myElement.prototype.adoptedCallback = function () {
        this.adoptedCallbackArgs = arguments;
        this.adoptedCallbackCount++;
    };

    myElement.prototype.attributeChangedCallback = function () {
        this.attributeChangedCallbackArgs = arguments;
        this.attributeChangedCallbackCount++;
    };

    makeSuite('Hand-rolled ES5-style class', 'my-element-1', myElement);

    // Babel-generated class (see comment at end of file for source)

    var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

    function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
    
    var TranspiledCustomElementClass = function (_HTMLElement) {
        _inherits(TranspiledCustomElementClass, _HTMLElement);

        _createClass(TranspiledCustomElementClass, null, [{
            key: 'observedAttributes',
            get: function get() {
                return ['attr1', 'attr2'];
            }
        }]);

        function TranspiledCustomElementClass() {
            _classCallCheck(this, TranspiledCustomElementClass);

            var _this = _possibleConstructorReturn(this, (TranspiledCustomElementClass.__proto__ || Object.getPrototypeOf(TranspiledCustomElementClass)).call(this));

            _this.connectedCallbackCount = 0;
            _this.disconnectedCallbackCount = 0;
            _this.adoptedCallbackCount = 0;
            _this.attributeChangedCallbackCount = 0;
            return _this;
        }

        _createClass(TranspiledCustomElementClass, [{
            key: 'connectedCallback',
            value: function connectedCallback() {
                this.connectedCallbackArgs = arguments;
                this.connectedCallbackCount++;
            }
        }, {
            key: 'disconnectedCallback',
            value: function disconnectedCallback() {
                this.disconnectedCallbackArgs = arguments;
                this.disconnectedCallbackCount++;
            }
        }, {
            key: 'adoptedCallback',
            value: function adoptedCallback() {
                this.adoptedCallbackArgs = arguments;
                this.adoptedCallbackCount++;
            }
        }, {
            key: 'attributeChangedCallback',
            value: function attributeChangedCallback() {
                this.attributeChangedCallbackArgs = arguments;
                this.attributeChangedCallbackCount++;
            }
        }]);

        return TranspiledCustomElementClass;
    }(HTMLElement);

    makeSuite('Babel-transpiled ES2015 class', 'my-element-2', TranspiledCustomElementClass);

    // Native class (if available) 

    try {
        var nativeClass = new Function('return class TranspiledCustomElementClass extends HTMLElement{static get observedAttributes(){return["attr1","attr2"]}constructor(){super();this.connectedCallbackCount=0;this.disconnectedCallbackCount=0;this.adoptedCallbackCount=0;this.attributeChangedCallbackCount=0}connectedCallback(){this.connectedCallbackArgs=arguments;this.connectedCallbackCount++}disconnectedCallback(){this.disconnectedCallbackArgs=arguments;this.disconnectedCallbackCount++}adoptedCallback(){this.adoptedCallbackArgs=arguments;this.adoptedCallbackCount++}attributeChangedCallback(){this.attributeChangedCallbackArgs=arguments;this.attributeChangedCallbackCount++}}')();

        makeSuite('Native ES2015 class', 'my-element-3', nativeClass);
    }
    catch (error) {
        // no-op
    }

});

/*

class TranspiledCustomElementClass extends HTMLElement {

    static get observedAttributes() {
        return ['attr1', 'attr2'];
    }

    constructor() {
        super();
        this.connectedCallbackCount = 0;
        this.disconnectedCallbackCount = 0;
        this.adoptedCallbackCount = 0;
        this.attributeChangedCallbackCount = 0;
    }

    connectedCallback() {
        this.connectedCallbackArgs = arguments;
        this.connectedCallbackCount++;
    }

    disconnectedCallback() {
        this.disconnectedCallbackArgs = arguments;
        this.disconnectedCallbackCount++;
    }

    adoptedCallback() {
        this.adoptedCallbackArgs = arguments;
        this.adoptedCallbackCount++;
    }

    attributeChangedCallback() {
        this.attributeChangedCallbackArgs = arguments;
        this.attributeChangedCallbackCount++;
    }

}

*/
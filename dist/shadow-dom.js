(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*

https://dom.spec.whatwg.org/#interface-customevent

[Constructor(DOMString type, optional CustomEventInit eventInitDict), Exposed=(Window,Worker)]
interface CustomEvent : Event

dictionary CustomEventInit : EventInit {
  any detail = null;
};

*/

var _class = function (_CustomEvent) {
    _inherits(_class, _CustomEvent);

    function _class(type, eventInitDict) {
        _classCallCheck(this, _class);

        return _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this, type, eventInitDict));
    }

    // readonly attribute any detail;

    // void initCustomEvent(DOMString type, boolean bubbles, boolean cancelable, any detail);

    return _class;
}(CustomEvent);

exports.default = _class;

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = require('../utils.js');

var $ = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               https://dom.spec.whatwg.org/#interface-document
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               [Constructor, Exposed=Window]
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               interface Document : Node
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               [Exposed=Window]
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               interface XMLDocument : Document {};
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               dictionary ElementCreationOptions {
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 DOMString is;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               };
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               */

var native = {
    getElementsByTagName: Document.prototype.getElementsByTagName,
    getElementsByTagNameNS: Document.prototype.getElementsByTagNameNS,
    getElementsByClassName: Document.prototype.getElementsByClassName
};

var _class = function (_Document) {
    _inherits(_class, _Document);

    function _class() {
        _classCallCheck(this, _class);

        return _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).apply(this, arguments));
    }

    _createClass(_class, [{
        key: 'getElementsByTagName',


        // TODO: tests
        value: function getElementsByTagName(qualifiedName) {
            var collection = native.getElementsByTagName.call(this, qualifiedName);
            var filtered = [];

            for (var i = 0; i < collection.length; i++) {
                var item = collection[i];
                if (this === item.getRootNode({ composed: false })) {
                    filtered.push(item);
                }
            }

            return filtered;
        }

        // TODO: tests

    }, {
        key: 'getElementsByTagNameNS',
        value: function getElementsByTagNameNS(ns, localName) {
            var collection = native.getElementsByTagNameNS.call(this, ns, localName);
            var filtered = [];

            for (var i = 0; i < collection.length; i++) {
                var item = collection[i];
                if (this === item.getRootNode({ composed: false })) {
                    filtered.push(item);
                }
            }

            return filtered;
        }

        // TODO: tests

    }, {
        key: 'getElementsByClassName',
        value: function getElementsByClassName(names) {
            var collection = native.getElementsByClassName.call(this, name);
            var filtered = [];

            for (var i = 0; i < collection.length; i++) {
                var item = collection[i];
                if (this === item.getRootNode({ composed: false })) {
                    filtered.push(item);
                }
            }

            return filtered;
        }

        // [NewObject] Element createElement(DOMString localName, optional ElementCreationOptions options);
        // [NewObject] Element createElementNS(DOMString? namespace, DOMString qualifiedName, optional ElementCreationOptions options);
        // [NewObject] DocumentFragment createDocumentFragment();
        // [NewObject] Text createTextNode(DOMString data);
        // [NewObject] CDATASection createCDATASection(DOMString data);
        // [NewObject] Comment createComment(DOMString data);
        // [NewObject] ProcessingInstruction createProcessingInstruction(DOMString target, DOMString data);

        // TODO: tests

    }, {
        key: 'importNode',
        value: function importNode(node, deep) {
            if (node.nodeType === Node.DOCUMENT_NODE || node.nodeName === '#shadow-root') {
                throw $.makeError('NotSupportedError');
            }

            return $.clone(node, this, deep);
        }

        // [CEReactions, NewObject] Node importNode(Node node, optional boolean deep = false);
        // [CEReactions] Node adoptNode(Node node);

        // [NewObject] Attr createAttribute(DOMString localName);
        // [NewObject] Attr createAttributeNS(DOMString? namespace, DOMString qualifiedName);

        // [NewObject] Event createEvent(DOMString interface);

        // [NewObject] Range createRange();

        // // NodeFilter.SHOW_ALL = 0xFFFFFFFF
        // [NewObject] NodeIterator createNodeIterator(Node root, optional unsigned long whatToShow = 0xFFFFFFFF, optional NodeFilter? filter = null);
        // [NewObject] TreeWalker createTreeWalker(Node root, optional unsigned long whatToShow = 0xFFFFFFFF, optional NodeFilter? filter = null);

    }]);

    return _class;
}(Document);

exports.default = _class;

},{"../utils.js":20}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = require('../utils.js');

var $ = _interopRequireWildcard(_utils);

var _ShadowRoot = require('../interfaces/ShadowRoot.js');

var _ShadowRoot2 = _interopRequireDefault(_ShadowRoot);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               https://dom.spec.whatwg.org/#interface-element
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               https://www.w3.org/TR/DOM-Parsing/#extensions-to-the-element-interface
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               [Exposed=Window]
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               interface Element : Node
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               dictionary ShadowRootInit {
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 required ShadowRootMode mode;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               };
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               */

var native = {
    getElementsByTagName: Element.prototype.getElementsByTagName,
    getElementsByTagNameNS: Element.prototype.getElementsByTagNameNS,
    getElementsByClassName: Element.prototype.getElementsByClassName,
    innerHTML: Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML'),
    outerHTML: Object.getOwnPropertyDescriptor(Element.prototype, 'outerHTML'),
    insertAdjacentElement: Element.prototype.insertAdjacentElement,
    insertAdjacentHTML: Element.prototype.insertAdjacentHTML,
    insertAdjacentText: Element.prototype.insertAdjacentText
};

var _class = function (_Element) {
    _inherits(_class, _Element);

    function _class() {
        _classCallCheck(this, _class);

        return _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).apply(this, arguments));
    }

    _createClass(_class, [{
        key: 'attachShadow',
        value: function attachShadow(init) {
            // https://dom.spec.whatwg.org/#dom-element-attachshadow
            if (!init || init.mode !== 'open' && init.mode !== 'closed') {
                throw $.makeError('TypeError');
            }

            if (this.namespaceURI !== 'http://www.w3.org/1999/xhtml') {
                throw $.makeError('NotSupportedError');
            }

            switch (this.localName) {
                case "article":case "aside":case "blockquote":case "body":
                case "div":case "footer":case "h1":case "h2":case "h3":
                case "h4":case "h5":case "h6":case "header":case "main":
                case "nav":case "p":case "section":case "span":
                    break;
                default:
                    if ($.isValidCustomElementName(this.localName)) {
                        break;
                    }
                    throw $.makeError('NotSupportedError');
            }

            if (this.shadowRoot) {
                throw $.makeError('InvalidStateError');
            }

            var shadow = this.ownerDocument.createDocumentFragment();

            $.extend(shadow, _ShadowRoot2.default);

            $.shadow(shadow, {
                host: this,
                mode: init.mode,
                childNodes: []
            });

            $.shadow(this, {
                shadowRoot: shadow,
                childNodes: Array.prototype.slice.call(this.childNodes)
            });

            var childNodes = $.shadow(this).childNodes;
            for (var i = 0; i < childNodes.length; i++) {
                $.shadow(childNodes[i], {
                    parentNode: this
                });
            }

            native.innerHTML.set.call(this, null);

            return shadow;
        }
    }, {
        key: 'closest',


        // TODO: tests
        value: function closest(selectors) {
            var element = this;

            do {
                if (element.matches(selectors)) {
                    return element;
                }
            } while (element = element.parentElement);
        }

        // TODO: tests

    }, {
        key: 'getElementsByTagName',
        value: function getElementsByTagName(qualifiedName) {
            var contextRoot = this.getRootNode({ composed: false });
            var collection = native.getElementsByTagName.call(this, qualifiedName);
            var filtered = [];

            for (var i = 0; i < collection.length; i++) {
                var item = collection[i];
                if (contextRoot === item.getRootNode({ composed: false })) {
                    filtered.push(item);
                }
            }

            return filtered;
        }

        // TODO: tests

    }, {
        key: 'getElementsByTagNameNS',
        value: function getElementsByTagNameNS(ns, localName) {
            var contextRoot = this.getRootNode({ composed: false });
            var collection = native.getElementsByTagNameNS.call(this, ns, localName);
            var filtered = [];

            for (var i = 0; i < collection.length; i++) {
                var item = collection[i];
                if (contextRoot === item.getRootNode({ composed: false })) {
                    filtered.push(item);
                }
            }

            return filtered;
        }

        // TODO: tests

    }, {
        key: 'getElementsByClassName',
        value: function getElementsByClassName(names) {
            var contextRoot = this.getRootNode({ composed: false });
            var collection = native.getElementsByClassName.call(this, name);
            var filtered = [];

            for (var i = 0; i < collection.length; i++) {
                var item = collection[i];
                if (contextRoot === item.getRootNode({ composed: false })) {
                    filtered.push(item);
                }
            }

            return filtered;
        }

        // TODO: impl, tests

    }, {
        key: 'insertAdjacentElement',
        value: function insertAdjacentElement(where, element) {
            return native.insertAdjacentElement.call(this, where, text);
        }

        // TODO: impl, tests

    }, {
        key: 'insertAdjacentText',
        value: function insertAdjacentText(where, data) {
            return native.insertAdjacentText.call(this, where, data);
        }

        // https://w3c.github.io/DOM-Parsing/#extensions-to-the-element-interface

        // TODO: impl, tests

    }, {
        key: 'insertAdjacentHTML',


        // TODO: impl, tests
        value: function insertAdjacentHTML(position, text) {
            return native.insertAdjacentHTML.call(this, position, text);
        }
    }, {
        key: 'slot',
        get: function get() {
            // The slot attribute must reflect the "slot" content attribute.
            return this.getAttribute('slot');
        }

        // TODO: impl, tests
        // Track slot name changes
        // Possibly need to intercept setAttribute?
        ,
        set: function set(value) {
            // The slot attribute must reflect the "slot" content attribute.
            this.setAttribute('slot', value);
        }
    }, {
        key: 'shadowRoot',
        get: function get() {
            // https://dom.spec.whatwg.org/#dom-element-shadowroot

            var shadowRoot = $.shadow(this).shadowRoot;

            if (!shadowRoot || shadowRoot.mode === 'closed') {
                return null;
            }

            return shadowRoot;
        }
    }, {
        key: 'innerHTML',
        get: function get() {
            return native.innerHTML.get.call(this);
        }

        // TODO: impl, tests
        ,
        set: function set(value) {
            return native.innerHTML.set.call(this, value);
        }

        // TODO: impl, tests

    }, {
        key: 'outerHTML',
        get: function get() {
            return native.outerHTML.get.call(this);
        }

        // TODO: impl, tests
        ,
        set: function set(value) {
            return native.outerHTML.set.call(this, value);
        }
    }]);

    return _class;
}(Element);

exports.default = _class;

},{"../interfaces/ShadowRoot.js":11,"../utils.js":20}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*

https://dom.spec.whatwg.org/#interface-event

[Constructor(DOMString type, optional EventInit eventInitDict), Exposed=(Window,Worker)]
interface Event

*/

var $composed = new WeakMap();

var _class = function (_Event) {
    _inherits(_class, _Event);

    function _class(type, eventInitDict) {
        _classCallCheck(this, _class);

        var _this = _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this, type, eventInitDict));

        $composed.set(_this, eventInitDict && eventInitDict.composed === true);
        return _this;
    }

    // readonly attribute DOMString type;
    // readonly attribute EventTarget? target;
    // readonly attribute EventTarget? currentTarget;
    // sequence<EventTarget> composedPath();

    // TODO: impl, tests


    _createClass(_class, [{
        key: "composedPath",
        value: function composedPath() {
            // https://dom.spec.whatwg.org/#dom-event-composedpath

            var composedPath = [];
            var currentTarget = this.currentTarget;

            // TODO: implement event path and retargeting
            var path = calculatePath(this);

            if (currentTarget instanceof Window) {
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = path[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var tuple = _step.value;

                        var item = tuple.item;
                        if (item instanceof Node) {
                            if (!item.closedShadowHidden) {
                                composedPath.push(item);
                            }
                        } else {
                            composedPath.push(item);
                        }
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
            } else if (currentTarget instanceof Node) {
                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                    for (var _iterator2 = path[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        var _tuple = _step2.value;

                        var _item = _tuple.item;
                        if (!_item.closedShadowHidden) {
                            composedPath.push(_item);
                        }
                    }
                } catch (err) {
                    _didIteratorError2 = true;
                    _iteratorError2 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion2 && _iterator2.return) {
                            _iterator2.return();
                        }
                    } finally {
                        if (_didIteratorError2) {
                            throw _iteratorError2;
                        }
                    }
                }
            } else {
                composedPath.push.apply(composedPath, _toConsumableArray(path));
            }

            return composedPath;
        }

        // const unsigned short NONE = 0;
        // const unsigned short CAPTURING_PHASE = 1;
        // const unsigned short AT_TARGET = 2;
        // const unsigned short BUBBLING_PHASE = 3;
        // readonly attribute unsigned short eventPhase;

        // void stopPropagation();
        // void stopImmediatePropagation();

        // readonly attribute boolean bubbles;
        // readonly attribute boolean cancelable;
        // void preventDefault();
        // readonly attribute boolean defaultPrevented;
        // readonly attribute boolean composed;

    }, {
        key: "composed",
        get: function get() {
            return $composed.get(this);
        }

        // [Unforgeable] readonly attribute boolean isTrusted;
        // readonly attribute DOMTimeStamp timeStamp;

        // void initEvent(DOMString type, boolean bubbles, boolean cancelable); // historical

    }]);

    return _class;
}(Event);

/*

dictionary EventInit {
  boolean bubbles = false;
  boolean cancelable = false;
  boolean composed = false;
};

*/


exports.default = _class;

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*

https://dom.spec.whatwg.org/#interface-eventtarget

[Exposed=(Window,Worker)]
interface EventTarget

*/

var _class = function (_EventTarget) {
  _inherits(_class, _EventTarget);

  function _class() {
    _classCallCheck(this, _class);

    return _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).apply(this, arguments));
  }

  return _class;
}(EventTarget);

exports.default = _class;

},{}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = require('../utils.js');

var $ = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               https://html.spec.whatwg.org/multipage/scripting.html#the-slot-element
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               interface HTMLSlotElement : HTMLElement
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               dictionary AssignedNodesOptions {
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   boolean flatten = false;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               };
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               */

var _class = function (_HTMLUnknownElement) {
    _inherits(_class, _HTMLUnknownElement);

    function _class() {
        _classCallCheck(this, _class);

        return _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).apply(this, arguments));
    }

    _createClass(_class, [{
        key: 'assignedNodes',


        // TODO: tests
        value: function assignedNodes(options) {
            if (this.localName !== 'slot') {
                return;
            }

            // https://html.spec.whatwg.org/multipage/scripting.html#dom-slot-assignednodes
            // The assignedNodes(options) method, when invoked, must run these steps:

            // 1. If the value of options's flatten member is false, then return this element's assigned nodes.
            if (!options || options.flatten !== true) {
                return $.shadow(this).assignedNodes;
            }

            // 2. Return the result of finding flattened slotables with this element.
            return $.findFlattenedSlotables(this);
        }
    }, {
        key: 'name',


        // TODO: tests
        get: function get() {
            return this.getAttribute('name');
        }

        // TODO: tests
        ,
        set: function set(value) {
            this.setAttribute('name', value);
        }
    }]);

    return _class;
}(HTMLUnknownElement);

exports.default = _class;

},{"../utils.js":20}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = require('../utils.js');

var $ = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               https://www.w3.org/TR/html5/single-page.html#the-table-element
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               */

var _class = function (_HTMLTableElement) {
    _inherits(_class, _HTMLTableElement);

    function _class() {
        _classCallCheck(this, _class);

        return _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).apply(this, arguments));
    }

    _createClass(_class, [{
        key: 'deleteCaption',
        value: function deleteCaption() {
            var caption = this.caption;
            if (caption) {
                $.remove(caption, this);
            }
        }
    }, {
        key: 'deleteTHead',
        value: function deleteTHead() {
            var tHead = this.tHead;
            if (tHead) {
                $.remove(tHead, this);
            }
        }
    }, {
        key: 'deleteTFoot',
        value: function deleteTFoot() {
            var tFoot = this.tFoot;
            if (tFoot) {
                $.remove(tFoot, this);
            }
        }
    }, {
        key: 'deleteRow',
        value: function deleteRow(index) {
            // https://www.w3.org/TR/html5/single-page.html#dom-table-deleterow
            if (index === -1) {
                index = this.rows.length - 1;
            }
            if (index < 0 || index >= this.rows.length) {
                throw $.makeError('IndexSizeError');
            }
            this.rows[index].remove();
        }
    }]);

    return _class;
}(HTMLTableElement);

exports.default = _class;

},{"../utils.js":20}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = require('../utils.js');

var $ = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               https://www.w3.org/TR/html5/single-page.html#the-tr-element
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               */

var _class = function (_HTMLTableRowElement) {
    _inherits(_class, _HTMLTableRowElement);

    function _class() {
        _classCallCheck(this, _class);

        return _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).apply(this, arguments));
    }

    _createClass(_class, [{
        key: 'deleteCell',
        value: function deleteCell(index) {
            // https://www.w3.org/TR/html5/single-page.html#dom-tr-deletecell
            if (index === -1) {
                index = this.cells.length - 1;
            }
            if (index < 0 || index >= this.cells.length) {
                throw $.makeError('IndexSizeError');
            }
            this.cells[index].remove();
        }
    }]);

    return _class;
}(HTMLTableRowElement);

exports.default = _class;

},{"../utils.js":20}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = require('../utils.js');

var $ = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               https://www.w3.org/TR/html5/single-page.html#the-tbody-element
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               */

var _class = function (_HTMLTableSectionElem) {
    _inherits(_class, _HTMLTableSectionElem);

    function _class() {
        _classCallCheck(this, _class);

        return _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).apply(this, arguments));
    }

    _createClass(_class, [{
        key: 'deleteRow',
        value: function deleteRow(index) {
            // https://www.w3.org/TR/html5/single-page.html#dom-tbody-deleterow
            if (index < 0 || index >= this.rows.length) {
                throw $.makeError('IndexSizeError');
            }
            this.rows[index].remove();
        }
    }]);

    return _class;
}(HTMLTableSectionElement);

exports.default = _class;

},{"../utils.js":20}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = require('../utils.js');

var $ = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               https://dom.spec.whatwg.org/#interface-node
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               [Exposed=Window]
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               interface Node : EventTarget
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               */

var native = {
    parentNode: Object.getOwnPropertyDescriptor(Node.prototype, 'parentNode'),
    parentElement: Object.getOwnPropertyDescriptor(Node.prototype, 'parentElement'),
    hasChildNodes: Node.prototype.hasChildNodes,
    childNodes: Object.getOwnPropertyDescriptor(Node.prototype, 'childNodes'),
    firstChild: Object.getOwnPropertyDescriptor(Node.prototype, 'firstChild'),
    lastChild: Object.getOwnPropertyDescriptor(Node.prototype, 'lastChild'),
    previousSibling: Object.getOwnPropertyDescriptor(Node.prototype, 'previousSibling'),
    nextSibling: Object.getOwnPropertyDescriptor(Node.prototype, 'nextSibling'),
    textContent: Object.getOwnPropertyDescriptor(Node.prototype, 'textContent'),
    normalize: Node.prototype.normalize
};

var _class = function (_Node) {
    _inherits(_class, _Node);

    function _class() {
        _classCallCheck(this, _class);

        return _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).apply(this, arguments));
    }

    _createClass(_class, [{
        key: 'getRootNode',
        value: function getRootNode(options) {
            // https://dom.spec.whatwg.org/#dom-node-getrootnode

            var composed = options && options.composed === true;

            var root = void 0,
                ancestor = void 0;

            root = ancestor = this;

            if (!composed) {
                while (ancestor = ancestor.parentNode) {
                    root = ancestor;
                }

                return root;
            }

            while (ancestor = ancestor.parentNode) {
                root = ancestor;

                if (root.nodeName === '#shadow-root') {
                    root = ancestor = root.host;
                }
            }

            return root;
        }
    }, {
        key: 'hasChildNodes',


        // TODO: tests
        value: function hasChildNodes() {
            var childNodes = $.shadow(this).childNodes;
            if (childNodes) {
                return childNodes.length > 0;
            }

            return native.hasChildNodes.call(this);
        }

        // TODO: tests

    }, {
        key: 'normalize',


        // TODO: impl, tests
        value: function normalize() {
            // https://dom.spec.whatwg.org/#dom-node-normalize
            // The normalize() method, when invoked, must run these steps 
            // for each descendant exclusive Text node node of context object:
            return native.normalize.call(this);
        }

        // TODO: tests

    }, {
        key: 'cloneNode',
        value: function cloneNode(deep) {
            // https://dom.spec.whatwg.org/#dom-node-clonenode
            // The cloneNode(deep) method, when invoked, must run these steps:

            // 1. If context object is a shadow root, then throw a NotSupportedError.
            if (this.nodeName === '#shadow-root') {
                throw $.makeError('NotSupportedError');
            }

            // 2. Return a clone of the context object, with the clone children flag set if deep is true.
            return $.clone(this, undefined, deep);
        }

        // TODO: tests

    }, {
        key: 'isEqualNode',
        value: function isEqualNode(other) {
            // https://dom.spec.whatwg.org/#dom-node-isequalnode
            // https://dom.spec.whatwg.org/#concept-node-equals
            if (!other) {
                return false;
            }

            if (this.nodeType !== other.nodeType) {
                return false;
            }

            switch (this.nodeType) {
                case Node.DOCUMENT_TYPE_NODE:
                    if (this.name !== other.name || this.publicId !== other.publicId || this.systemId !== other.systemId) {
                        return false;
                    }
                case Node.ELEMENT_NODE:
                    if (this.namespaceURI !== other.namespaceURI || this.prefix !== other.prefix || this.localName !== other.localName || this.attributes.length !== other.attributes.length) {
                        return false;
                    }
                case Node.ATTRIBUTE_NODE:
                    if (this.namespaceURI !== other.namespaceURI || this.localName !== other.localName || this.value !== other.value) {
                        return false;
                    }
                case Node.PROCESSING_INSTRUCTION_NODE:
                    if (this.target !== other.target || this.data !== other.data) {
                        return false;
                    }
                case Node.TEXT_NODE:
                case Node.COMMENT_NODE:
                    if (this.data !== other.data) {
                        return false;
                    }
            }

            if (this.nodeType == Node.ELEMENT_NODE) {
                for (var i = 0; i < this.attributes.length; i++) {
                    var attr1 = this.attributes[i];
                    var attr2 = other.attributes[attr1.name];
                    if (attr1.value !== attr2.value) {
                        return false;
                    }
                }
            }

            var childNodes1 = this.childNodes;
            var childNodes2 = other.childNodes;
            if (childNodes1.length !== other.childNodes.length) {
                return false;
            }

            for (var _i = 0; _i < childNodes1.length; _i++) {
                if (!childNodes1[_i].isEqualNode(childNodes2[_i])) {
                    return false;
                }
            }

            return true;
        }

        // TODO: tests

    }, {
        key: 'compareDocumentPosition',
        value: function compareDocumentPosition(other) {
            // https://dom.spec.whatwg.org/#dom-node-comparedocumentposition

            if (this === other) {
                return 0;
            }

            var node1 = other;
            var node2 = this;
            var attr1 = null;
            var attr2 = null;

            if (node1.nodeType == Document.prototype.ATTRIBUTE_NODE) {
                attr1 = node1;
                node1 = attr1.ownerElement;
            }

            if (node2.nodeType == Document.prototype.ATTRIBUTE_NODE) {
                attr2 = node2;
                node2 = attr2.ownerElement;

                if (attr1 && node1 && node2 === node1) {
                    var attrs = node2.atttributes;
                    for (var i = 0; i < attrs.length; i++) {
                        var attr = attrs[i];
                        if (attr.isEqualNode(attr1)) {
                            return Document.prototype.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC + Document.prototype.DOCUMENT_POSITION_PRECEDING;
                        } else if (attr.isEqualNode(attr2)) {
                            return Document.prototype.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC + Document.prototype.DOCUMENT_POSITION_FOLLOWING;
                        }
                    }
                }
            }

            if (!node1 || !node2 || node1.getRootNode() !== node2.getRootNode()) {
                return Document.prototype.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC + Document.prototype.DOCUMENT_POSITION_FOLLOWING + Document.prototype.DOCUMENT_POSITION_DISCONNECTED;
            }

            if (ancestorOf(node2, node1) || node1 === node2 && attr2) {
                return Document.prototype.DOCUMENT_POSITION_CONTAINS + Document.prototype.DOCUMENT_POSITION_PRECEDING;
            }

            if (ancestorOf(node1, node2) || node1 === node2 && attr1) {
                return Document.prototype.DOCUMENT_POSITION_CONTAINS + Document.prototype.DOCUMENT_POSITION_FOLLOWING;
            }

            if (preceding(node1, node2)) {
                return Document.prototype.DOCUMENT_POSITION_PRECEDING;
            }

            return Document.prototype.DOCUMENT_POSITION_FOLLOWING;
        }

        // TODO: tests

    }, {
        key: 'contains',
        value: function contains(node) {
            // https://dom.spec.whatwg.org/#dom-node-contains

            var parent = node.parentNode;

            if (!parent) {
                return false;
            }

            do {
                if (parent === this) {
                    return true;
                }
            } while (parent = parent.parentNode);

            return false;
        }

        // TODO: tests

    }, {
        key: 'insertBefore',
        value: function insertBefore(node, child) {
            // https://dom.spec.whatwg.org/#dom-node-insertbefore
            // The insertBefore(node, child) method, when invoked, must return the result 
            // of pre-inserting node into context object before child.
            return $.preInsert(node, this, child);
        }

        // TODO: tests

    }, {
        key: 'appendChild',
        value: function appendChild(node) {
            // https://dom.spec.whatwg.org/#dom-node-appendchild
            // The appendChild(node) method, when invoked, must return the result of 
            // appending node to context object.
            return $.append(node, this);
        }

        // TODO: tests

    }, {
        key: 'replaceChild',
        value: function replaceChild(node, child) {
            // https://dom.spec.whatwg.org/#dom-node-replacechild
            // The replaceChild(node, child) method, when invoked, must return the 
            // result of replacing child with node within context object.
            return $.replace(child, node, this);
        }

        // TODO: tests

    }, {
        key: 'removeChild',
        value: function removeChild(child) {
            // https://dom.spec.whatwg.org/#dom-node-removechild
            // The removeChild(child) method, when invoked, must return the result of 
            // pre-removing child from context object.
            return $.preRemove(child, this);
        }
    }, {
        key: 'parentNode',
        get: function get() {
            var parentNode = $.shadow(this).parentNode;
            if (parentNode) {
                return parentNode;
            }

            return native.parentNode.get.call(this);
        }
    }, {
        key: 'parentElement',
        get: function get() {
            var parentNode = $.shadow(this).parentNode;
            if (parentNode) {
                if (parentNode.nodeType === Node.ELEMENT_NODE) {
                    return parentNode;
                }
                return null;
            }

            return native.parentElement.get.call(this);
        }
    }, {
        key: 'childNodes',
        get: function get() {
            var childNodes = $.shadow(this).childNodes;
            if (childNodes) {
                return childNodes.slice();
            }

            return native.childNodes.get.call(this);
        }

        // TODO: tests

    }, {
        key: 'firstChild',
        get: function get() {
            var childNodes = $.shadow(this).childNodes;
            if (childNodes) {
                if (childNodes.length) {
                    return childNodes[0];
                }
                return null;
            }

            return native.firstChild.get.call(this);
        }

        // TODO: tests

    }, {
        key: 'lastChild',
        get: function get() {
            var childNodes = $.shadow(this).childNodes;
            if (childNodes) {
                if (childNodes.length) {
                    return childNodes[childNodes.length - 1];
                }
                return null;
            }

            return native.lastChild.get.call(this);
        }

        // TODO: tests

    }, {
        key: 'previousSibling',
        get: function get() {
            var parentNode = $.shadow(this).parentNode;
            if (parentNode) {
                var childNodes = $.shadow(parentNode).childNodes;
                var siblingIndex = childNodes.indexOf(this) - 1;
                return siblingIndex < 0 ? null : childNodes[siblingIndex];
            }

            return native.previousSibling.get.call(this);
        }

        // TODO: tests

    }, {
        key: 'nextSibling',
        get: function get() {
            var parentNode = $.shadow(this).parentNode;
            if (parentNode) {
                var childNodes = $.shadow(parentNode).childNodes;
                var siblingIndex = childNodes.indexOf(this) + 1;
                return siblingIndex === childNodes.length ? null : childNodes[siblingIndex];
            }

            return native.nextSibling.get.call(this);
        }

        // TODO: impl, tests

    }, {
        key: 'textContent',
        get: function get() {
            return native.textContent.get.call(this);
        }

        // TODO: impl, tests
        ,
        set: function set(value) {
            return native.textContent.set.call(this, value);
        }
    }]);

    return _class;
}(Node);

exports.default = _class;


function ancestorOf(node, ancestor) {
    var parent = node.parentNode;

    do {
        if (parent === ancestor) {
            return true;
        }
    } while (parent = parent.parentNode);

    return false;
}

function preceding(element1, element2) {
    function precedingSiblings(parent, sibling1, sibling2) {
        var siblings = parent.childNodes;
        for (var _i2 = 0; _i2 < siblings.length; _i2++) {
            var sibling = siblings[_i2];
            if (sibling === sibling1) {
                return true;
            } else if (sibling === sibling2) {
                return false;
            }
        }
    }

    // Check if they're already siblings.
    var ancestor1 = element1.parentNode;
    var ancestor2 = element2.parentNode;

    if (ancestor1 === ancestor2) {
        return precedingSiblings(element1, element2);
    }

    // Find the closest common ancestor.
    var ancestors1 = [ancestor1];
    var ancestors2 = [ancestor2];

    while (ancestor1 = ancestor1.parentNode) {
        ancestors1.push(ancestor1);
    }

    while (ancestor2 = ancestor2.parentNode) {
        ancestors2.push(ancestor2);
    }

    ancestors1.reverse();
    ancestors2.reverse();

    var diff = Math.abs(ancestors1.length - ancestors2.length);
    var min = Math.min(ancestors1.length, ancestors2.length);

    var i = 0;
    while (ancestors1[i] === ancestors2[i]) {
        i++;
    }

    return precedingSiblings(ancestors1[i - 1], ancestors1[i], ancestors2[i]);
}

},{"../utils.js":20}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = require('../utils.js');

var $ = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               https://dom.spec.whatwg.org/#interface-shadowroot
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               https://www.w3.org/TR/shadow-dom/#the-shadowroot-interface
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               [Exposed=Window]
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               interface ShadowRoot : DocumentFragment
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               */

var _class = function (_DocumentFragment) {
    _inherits(_class, _DocumentFragment);

    function _class() {
        _classCallCheck(this, _class);

        return _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).apply(this, arguments));
    }

    _createClass(_class, [{
        key: 'nodeName',


        // TODO: tests
        get: function get() {
            return '#shadow-root';
        }

        // TODO: tests

    }, {
        key: 'mode',
        get: function get() {
            return $.shadow(this).mode;
        }

        // TODO: tests

    }, {
        key: 'host',
        get: function get() {
            return $.shadow(this).host;
        }

        // TODO: impl, tests

    }, {
        key: 'innerHTML',
        get: function get() {}

        // TODO: impl, tests
        ,
        set: function set(value) {}
    }]);

    return _class;
}(DocumentFragment);

exports.default = _class;

},{"../utils.js":20}],12:[function(require,module,exports){
'use strict';

var _patch = require('./patch.js');

var _patch2 = _interopRequireDefault(_patch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var nativeShadowDom = 'attachShadow' in Element.prototype;

if (!nativeShadowDom || window.forceShadowDomPolyfill) {
    (0, _patch2.default)();
}

},{"./patch.js":19}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = require('../utils.js');

var $ = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               https://dom.spec.whatwg.org/#interface-childnode
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               [NoInterfaceObject, Exposed=Window]
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               interface ChildNode
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               DocumentType implements ChildNode;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               Element implements ChildNode;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               CharacterData implements ChildNode;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               */

exports.default = function (base) {
    return function (_base) {
        _inherits(_class, _base);

        function _class() {
            _classCallCheck(this, _class);

            return _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).apply(this, arguments));
        }

        _createClass(_class, [{
            key: 'before',


            // TODO: tests
            value: function before() {
                // https://dom.spec.whatwg.org/#dom-childnode-before
                // The before(nodes) method, when invoked, must run these steps:

                // 1. Let parent be context object’s parent.
                var parent = this.parentNode;

                // 2. If parent is null, terminate these steps.
                if (!parent) {
                    return;
                }

                // 3. Let viablePreviousSibling be context object’s first preceding 
                // sibling not in nodes, and null otherwise.
                var viablePreviousSibling = this.previousSibling;

                for (var _len = arguments.length, nodes = Array(_len), _key = 0; _key < _len; _key++) {
                    nodes[_key] = arguments[_key];
                }

                while (viablePreviousSibling && nodes.indexOf(viablePreviousSibling) !== -1) {
                    viablePreviousSibling = viablePreviousSibling.previousSibling;
                }

                // 4. Let node be the result of converting nodes into a node, given 
                // nodes and context object’s node document. Rethrow any exceptions.
                var node = $.convertNodesIntoANode(nodes, this.ownerDocument);

                // 5. If viablePreviousSibling is null, set it to parent’s first child, 
                // and to viablePreviousSibling’s next sibling otherwise.
                if (viablePreviousSibling === null) {
                    viablePreviousSibling = parent.firstChild;
                } else {
                    viablePreviousSibling = viablePreviousSibling.nextSibling;
                }

                // 6. Pre-insert node into parent before viablePreviousSibling. 
                // Rethrow any exceptions.
                $.preInsert(node, parent, viablePreviousSibling);
            }

            // TODO: tests

        }, {
            key: 'after',
            value: function after() {
                // https://dom.spec.whatwg.org/#dom-childnode-after
                // The after(nodes) method, when invoked, must run these steps:

                // 1. Let parent be context object’s parent.
                var parent = this.parentNode;

                // 2. If parent is null, terminate these steps.
                if (!parent) {
                    return;
                }

                // 3. Let viableNextSibling be context object’s first following 
                // sibling not in nodes, and null otherwise.
                var viableNextSibling = this.nextSibling;

                for (var _len2 = arguments.length, nodes = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                    nodes[_key2] = arguments[_key2];
                }

                while (viableNextSibling && nodes.indexOf(viableNextSibling) !== -1) {
                    viableNextSibling = viableNextSibling.nextSibling;
                }

                // 4. Let node be the result of converting nodes into a node, given 
                // nodes and context object’s node document. Rethrow any exceptions.
                var node = $.convertNodesIntoANode(nodes, this.ownerDocument);

                // 5. Pre-insert node into parent before viableNextSibling. Rethrow 
                // any exceptions.
                $.preInsert(node, parent, viableNextSibling);
            }

            // TODO: tests

        }, {
            key: 'replaceWith',
            value: function replaceWith() {
                // https://dom.spec.whatwg.org/#dom-childnode-replacewith
                // The replaceWith(nodes) method, when invoked, must run these steps:

                // 1. Let parent be context object’s parent.
                var parent = this.parentNode;

                // 2. If parent is null, terminate these steps.
                if (!parent) {
                    return;
                }

                // 3. Let viableNextSibling be context object’s first following 
                // sibling not in nodes, and null otherwise.
                var viableNextSibling = this.nextSibling;

                for (var _len3 = arguments.length, nodes = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                    nodes[_key3] = arguments[_key3];
                }

                while (viableNextSibling && nodes.indexOf(viableNextSibling) !== -1) {
                    viableNextSibling = viableNextSibling.nextSibling;
                }

                // 4. Let node be the result of converting nodes into a node, given 
                // nodes and context object’s node document. Rethrow any exceptions.
                var node = $.convertNodesIntoANode(nodes, this.ownerDocument);

                // 5. If context object’s parent is parent, replace the context object 
                // with node within parent. Rethrow any exceptions.
                if (this.parentNode == parent) {
                    parent.replaceChild(this, node);
                }
                // 6. Otherwise, pre-insert node into parent before viableNextSibling. 
                // Rethrow any exceptions.
                else {
                        parent.insertBefore(node, viableNextSibling);
                    }
            }

            // TODO: tests

        }, {
            key: 'remove',
            value: function remove() {
                // https://dom.spec.whatwg.org/#dom-childnode-remove
                // The remove() method, when invoked, must run these steps:

                // 1. If context object’s parent is null, terminate these steps.
                var parent = this.parentNode;

                if (!parent) {
                    return;
                }

                // 2. Remove the context object from context object’s parent.
                $.remove(this, parent);
            }
        }]);

        return _class;
    }(base);
};

},{"../utils.js":20}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = function (base) {

    var native = {
        activeElement: Object.getOwnPropertyDescriptor(base.prototype, 'activeElement')
    };

    return function (_base) {
        _inherits(_class, _base);

        function _class() {
            _classCallCheck(this, _class);

            return _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).apply(this, arguments));
        }

        _createClass(_class, [{
            key: 'activeElement',


            /*
                  https://www.w3.org/TR/shadow-dom/#extensions-to-the-documentorshadowroot-mixin
                  */

            // Selection?        getSelection();
            // Element?          elementFromPoint(double x, double y);
            // sequence<Element> elementsFromPoint(double x, double y);
            // CaretPosition?    caretPositionFromPoint(double x, double y);
            // readonly attribute Element?       activeElement;
            // readonly attribute StyleSheetList styleSheets;

            // TODO: tests
            get: function get() {
                return native.activeElement.get.call(this);
            }
        }]);

        return _class;
    }(base);
};

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               https://dom.spec.whatwg.org/#mixin-documentorshadowroot
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               https://www.w3.org/TR/shadow-dom/#extensions-to-the-documentorshadowroot-mixin
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               [NoInterfaceObject, Exposed=Window]
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               interface DocumentOrShadowRoot
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               Document implements DocumentOrShadowRoot;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               ShadowRoot implements DocumentOrShadowRoot;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               */

},{}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = function (base) {

    var native = {
        previousElementSibling: Object.getOwnPropertyDescriptor(base.prototype, 'previousElementSibling'),
        nextElementSibling: Object.getOwnPropertyDescriptor(base.prototype, 'nextElementSibling')
    };

    return function (_base) {
        _inherits(_class, _base);

        function _class() {
            _classCallCheck(this, _class);

            return _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).apply(this, arguments));
        }

        _createClass(_class, [{
            key: 'previousElementSibling',


            // TODO: tests
            get: function get() {
                var parentNode = $.shadow(this).parentNode;
                if (parentNode) {
                    var childNodes = $.shadow(parentNode).childNodes;
                    var index = childNodes.indexOf(this);

                    if (index === 0) {
                        return null;
                    }

                    do {
                        var previous = childNodes[--index];

                        if (previous.nodeType === Node.ELEMENT_NODE) {
                            return previous;
                        }
                    } while (index > 0);

                    return null;
                }

                return native.previousElementSibling.get.call(this);
            }

            // TODO: tests

        }, {
            key: 'nextElementSibling',
            get: function get() {
                var parentNode = $.shadow(this).parentNode;
                if (parentNode) {
                    var childNodes = $.shadow(parentNode).childNodes;
                    var index = childNodes.indexOf(this);

                    if (index === childNodes.length - 1) {
                        return null;
                    }

                    do {
                        var previous = childNodes[++index];

                        if (previous.nodeType === Node.ELEMENT_NODE) {
                            return previous;
                        }
                    } while (index < childNodes.length);

                    return null;
                }

                return native.nextElementSibling.get.call(this);
            }
        }]);

        return _class;
    }(base);
};

var _utils = require('../utils.js');

var $ = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               https://dom.spec.whatwg.org/#interface-nondocumenttypechildnode
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               [NoInterfaceObject, Exposed=Window]
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               interface NonDocumentTypeChildNode
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               Element implements NonDocumentTypeChildNode;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               CharacterData implements NonDocumentTypeChildNode;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               */

},{"../utils.js":20}],16:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = function (base) {

    var native = {
        getElementById: base.prototype.getElementById
    };

    return function (_base) {
        _inherits(_class, _base);

        function _class() {
            _classCallCheck(this, _class);

            return _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).apply(this, arguments));
        }

        _createClass(_class, [{
            key: "getElementById",


            // TODO: tests
            value: function getElementById(id) {
                // https://dom.spec.whatwg.org/#dom-nonelementparentnode-getelementbyid

                // If the native implementation returns a correct element, go with that.

                var candidateResult = native.getElementById.call(this, id);
                var candidateRoot = candidateResult.getRootNode({ composed: false });

                if (this === candidateRoot) {
                    return candidateResult;
                }

                // Otherwise, go through our polyfilled algorithm.

                var firstChild = this.firstChild;

                if (!firstChild) {
                    return null;
                }

                var stack = [{ node: firstChild, recursed: false }];

                while (stack.length) {
                    var frame = stack.pop();

                    if (frame.recursed) {
                        if (frame.node.nextSibling) {
                            stack.push({ node: frame.node.nextSibling, recursed: false });
                        }
                    } else {
                        if (frame.node.id === id) {
                            return frame.node;
                        }

                        stack.push({ node: frame.node, recursed: true });

                        if (firstChild = frame.node.firstChild) {
                            stack.push({ node: firstChild, recursed: false });
                        }
                    }
                }

                return null;
            }
        }]);

        return _class;
    }(base);
};

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               https://dom.spec.whatwg.org/#interface-nonelementparentnode
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               [NoInterfaceObject, Exposed=Window]
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               interface NonElementParentNode
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               Document implements NonElementParentNode;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               DocumentFragment implements NonElementParentNode;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               */

},{}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = function (base) {

    var native = {
        children: Object.getOwnPropertyDescriptor(base.prototype, 'children'),
        firstElementChild: Object.getOwnPropertyDescriptor(base.prototype, 'firstElementChild'),
        lastElementChild: Object.getOwnPropertyDescriptor(base.prototype, 'lastElementChild'),
        childElementCount: Object.getOwnPropertyDescriptor(base.prototype, 'childElementCount')
    };

    return function (_base) {
        _inherits(_class, _base);

        function _class() {
            _classCallCheck(this, _class);

            return _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).apply(this, arguments));
        }

        _createClass(_class, [{
            key: 'prepend',


            // TODO: tests
            value: function prepend() {
                for (var _len = arguments.length, nodes = Array(_len), _key = 0; _key < _len; _key++) {
                    nodes[_key] = arguments[_key];
                }

                // https://dom.spec.whatwg.org/#dom-parentnode-prepend
                // The prepend(nodes) method, when invoked, must run these steps:

                // 1. Let node be the result of converting nodes into a node given 
                // nodes and context object’s node document. Rethrow any exceptions.
                var node = $.convertNodesIntoANode(nodes, this.ownerDocument);

                // 2. Pre-insert node into context object before the context object’s 
                // first child. Rethrow any exceptions.
                $.preInsert(node, this, this.firstChild);
            }

            // TODO: tests

        }, {
            key: 'append',
            value: function append() {
                for (var _len2 = arguments.length, nodes = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                    nodes[_key2] = arguments[_key2];
                }

                // https://dom.spec.whatwg.org/#dom-parentnode-append
                // The append(nodes) method, when invoked, must run these steps:

                // 1. Let node be the result of converting nodes into a node given 
                // nodes and context object’s node document. Rethrow any exceptions.
                var node = $.convertNodesIntoANode(nodes, this.ownerDocument);

                // 2. Append node to context object. Rethrow any exceptions.
                $.append(node, this);
            }

            // TODO: tests

        }, {
            key: 'querySelector',
            value: function querySelector(selectors) {
                var results = this.querySelectorAll(selectors);

                if (results.length) {
                    return results[0];
                }

                return null;
            }

            // TODO: tests

        }, {
            key: 'querySelectorAll',
            value: function querySelectorAll(selectors) {
                // https://dom.spec.whatwg.org/#scope-match-a-selectors-string
                // this is horrible, performance-wise.
                // it's about 100x slower than native querySelectorAll.
                // that might not amount to much in practice, though.
                // after all, this is a polyfill.

                var firstChild = this.firstChild;

                if (!firstChild) {
                    return null;
                }

                var stack = [{ node: firstChild, recursed: false }];
                var results = [];

                while (stack.length) {
                    var frame = stack.pop();

                    if (frame.recursed) {
                        if (frame.node.nextSibling) {
                            stack.push({ node: frame.node.nextSibling, recursed: false });
                        }
                    } else {
                        if (frame.node.nodeType == Node.ELEMENT_NODE && frame.node.matches(selectors)) {
                            results.push(frame.node);
                        }

                        stack.push({ node: frame.node, recursed: true });

                        if (firstChild = frame.node.firstChild) {
                            stack.push({ node: firstChild, recursed: false });
                        }
                    }
                }

                return results;
            }
        }, {
            key: 'children',


            // TODO: tests
            get: function get() {
                var childNodes = $.shadow(this).childNodes;
                if (childNodes) {
                    var elements = [];
                    for (var i = 0; i < childNodes.length; i++) {
                        var node = childNodes[i];
                        if (node.nodeType == Node.ELEMENT_NODE) {
                            elements.push(node);
                        }
                    }

                    return elements;
                }

                return native.children.get.call(this);
            }

            // TODO: tests

        }, {
            key: 'firstElementChild',
            get: function get() {
                var childNodes = $.shadow(this).childNodes;
                if (childNodes) {
                    for (var i = 0; i < childNodes.length; i++) {
                        var node = childNodes[i];
                        if (node.nodeType == Node.ELEMENT_NODE) {
                            return node;
                        }
                    }
                    return null;
                }

                return native.firstElementChild.get.call(this);
            }

            // TODO: tests

        }, {
            key: 'lastElementChild',
            get: function get() {
                var childNodes = $.shadow(this).childNodes;
                if (childNodes) {
                    for (var i = childNodes.length - 1; i >= 0; i--) {
                        var node = childNodes[i];
                        if (node.nodeType == Node.ELEMENT_NODE) {
                            return node;
                        }
                    }
                    return null;
                }

                return native.lastElementChild.get.call(this);
            }

            // TODO: tests

        }, {
            key: 'childElementCount',
            get: function get() {
                var childNodes = $.shadow(this).childNodes;
                if (childNodes) {
                    var count = 0;
                    for (var i = 0; i < childNodes.length; i++) {
                        var node = childNodes[i];
                        if (node.nodeType == Node.ELEMENT_NODE) {
                            count++;
                        }
                    }
                    return count;
                }

                return native.childElementCount.get.call(this);
            }
        }]);

        return _class;
    }(base);
};

var _utils = require('../utils.js');

var $ = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               https://dom.spec.whatwg.org/#interface-parentnode
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               [NoInterfaceObject, Exposed=Window]
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               interface ParentNode
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               Document implements ParentNode;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               DocumentFragment implements ParentNode;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               Element implements ParentNode;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               */

},{"../utils.js":20}],18:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = require('../utils.js');

var $ = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               https://dom.spec.whatwg.org/#mixin-slotable
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               [NoInterfaceObject, Exposed=Window]
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               interface Slotable
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               Element implements Slotable;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               Text implements Slotable;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               */

exports.default = function (base) {
    return function (_base) {
        _inherits(_class, _base);

        function _class() {
            _classCallCheck(this, _class);

            return _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).apply(this, arguments));
        }

        _createClass(_class, [{
            key: 'assignedSlot',


            // TODO: tests
            get: function get() {
                // TODO: efficiency
                return $.findASlot(this, true);
            }
        }]);

        return _class;
    }(base);
};

},{"../utils.js":20}],19:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {
    // Globally applied interfaces

    //$.extend(CustomEvent, $CustomEvent);
    $.extend(Document, _Document2.default);
    $.extend(Element, _Element2.default);
    //$.extend(Event, $Event);
    //$.extend(EventTarget, $EventTarget);
    $.extend(HTMLUnknownElement, _HTMLSlotElement2.default);
    if ('HTMLSlotElement' in window) {
        // In case we are forcing a polyfill
        $.extend(HTMLSlotElement, _HTMLSlotElement2.default);
    }
    $.extend(HTMLTableElement, _HTMLTableElement2.default);
    $.extend(HTMLTableSectionElement, _HTMLTableSectionElement2.default);
    $.extend(HTMLTableRowElement, _HTMLTableRowElement2.default);
    $.extend(Node, _Node2.default);

    // Globally applied mixins

    $.extend(DocumentType, (0, _ChildNode2.default)(DocumentType));
    $.extend(Element, (0, _ChildNode2.default)(Element));
    $.extend(CharacterData, (0, _ChildNode2.default)(CharacterData));

    $.extend(Document, (0, _DocumentOrShadowRoot2.default)(Document));
    $.extend(_ShadowRoot2.default, (0, _DocumentOrShadowRoot2.default)(_ShadowRoot2.default));

    $.extend(Element, (0, _NonDocumentTypeChildNode2.default)(Element));
    $.extend(CharacterData, (0, _NonDocumentTypeChildNode2.default)(CharacterData));

    $.extend(Document, (0, _NonElementParentNode2.default)(Document));
    $.extend(DocumentFragment, (0, _NonElementParentNode2.default)(DocumentFragment));

    $.extend(Document, (0, _ParentNode2.default)(Document));
    $.extend(DocumentFragment, (0, _ParentNode2.default)(DocumentFragment));
    $.extend(Element, (0, _ParentNode2.default)(Element));

    $.extend(Element, (0, _Slotable2.default)(Element));
    $.extend(Text, (0, _Slotable2.default)(Text));
};

var _utils = require('./utils.js');

var $ = _interopRequireWildcard(_utils);

var _CustomEvent = require('./interfaces/CustomEvent.js');

var _CustomEvent2 = _interopRequireDefault(_CustomEvent);

var _Document = require('./interfaces/Document.js');

var _Document2 = _interopRequireDefault(_Document);

var _Element = require('./interfaces/Element.js');

var _Element2 = _interopRequireDefault(_Element);

var _Event = require('./interfaces/Event.js');

var _Event2 = _interopRequireDefault(_Event);

var _EventTarget = require('./interfaces/EventTarget.js');

var _EventTarget2 = _interopRequireDefault(_EventTarget);

var _HTMLSlotElement = require('./interfaces/HTMLSlotElement.js');

var _HTMLSlotElement2 = _interopRequireDefault(_HTMLSlotElement);

var _HTMLTableElement = require('./interfaces/HTMLTableElement.js');

var _HTMLTableElement2 = _interopRequireDefault(_HTMLTableElement);

var _HTMLTableSectionElement = require('./interfaces/HTMLTableSectionElement.js');

var _HTMLTableSectionElement2 = _interopRequireDefault(_HTMLTableSectionElement);

var _HTMLTableRowElement = require('./interfaces/HTMLTableRowElement.js');

var _HTMLTableRowElement2 = _interopRequireDefault(_HTMLTableRowElement);

var _Node = require('./interfaces/Node.js');

var _Node2 = _interopRequireDefault(_Node);

var _ShadowRoot = require('./interfaces/ShadowRoot.js');

var _ShadowRoot2 = _interopRequireDefault(_ShadowRoot);

var _ChildNode = require('./mixins/ChildNode.js');

var _ChildNode2 = _interopRequireDefault(_ChildNode);

var _DocumentOrShadowRoot = require('./mixins/DocumentOrShadowRoot.js');

var _DocumentOrShadowRoot2 = _interopRequireDefault(_DocumentOrShadowRoot);

var _NonDocumentTypeChildNode = require('./mixins/NonDocumentTypeChildNode.js');

var _NonDocumentTypeChildNode2 = _interopRequireDefault(_NonDocumentTypeChildNode);

var _NonElementParentNode = require('./mixins/NonElementParentNode.js');

var _NonElementParentNode2 = _interopRequireDefault(_NonElementParentNode);

var _ParentNode = require('./mixins/ParentNode.js');

var _ParentNode2 = _interopRequireDefault(_ParentNode);

var _Slotable = require('./mixins/Slotable.js');

var _Slotable2 = _interopRequireDefault(_Slotable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

},{"./interfaces/CustomEvent.js":1,"./interfaces/Document.js":2,"./interfaces/Element.js":3,"./interfaces/Event.js":4,"./interfaces/EventTarget.js":5,"./interfaces/HTMLSlotElement.js":6,"./interfaces/HTMLTableElement.js":7,"./interfaces/HTMLTableRowElement.js":8,"./interfaces/HTMLTableSectionElement.js":9,"./interfaces/Node.js":10,"./interfaces/ShadowRoot.js":11,"./mixins/ChildNode.js":13,"./mixins/DocumentOrShadowRoot.js":14,"./mixins/NonDocumentTypeChildNode.js":15,"./mixins/NonElementParentNode.js":16,"./mixins/ParentNode.js":17,"./mixins/Slotable.js":18,"./utils.js":20}],20:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.makeError = makeError;
exports.extend = extend;
exports.shadow = shadow;
exports.convertNodesIntoANode = convertNodesIntoANode;
exports.isValidCustomElementName = isValidCustomElementName;
exports.findASlot = findASlot;
exports.findSlotables = findSlotables;
exports.findFlattenedSlotables = findFlattenedSlotables;
exports.assignSlotables = assignSlotables;
exports.assignSlotablesForATree = assignSlotablesForATree;
exports.assignASlot = assignASlot;
exports.signalASlotChange = signalASlotChange;
exports.ensurePreInsertionValidity = ensurePreInsertionValidity;
exports.preInsert = preInsert;
exports.insert = insert;
exports.append = append;
exports.replace = replace;
exports.replaceAll = replaceAll;
exports.preRemove = preRemove;
exports.remove = remove;
exports.clone = clone;
exports.adopt = adopt;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var native = {
    insertBefore: Node.prototype.insertBefore,
    removeChild: Node.prototype.removeChild,
    cloneNode: Node.prototype.cloneNode,
    appendChild: Node.prototype.appendChild,
    parentNode: Object.getOwnPropertyDescriptor(Node.prototype, 'parentNode'),
    firstChild: Object.getOwnPropertyDescriptor(Node.prototype, 'firstChild'),
    childNodes: Object.getOwnPropertyDescriptor(Node.prototype, 'childNodes')
};

var slice = function slice(array) {
    return Array.prototype.slice.call(array);
};

function makeError(name, message) {
    var error = new Error(message || name);
    error.name = name;
    return error;
}

function extend(object) {
    for (var _len = arguments.length, mixins = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        mixins[_key - 1] = arguments[_key];
    }

    for (var i = 0; i < mixins.length; i++) {
        var mixin = mixins[i].prototype;
        var names = Object.getOwnPropertyNames(mixin);
        for (var j = 0; j < names.length; j++) {
            var name = names[j];
            if (name === 'constructor') {
                continue;
            }
            var descriptor = Object.getOwnPropertyDescriptor(mixin, name);
            Object.defineProperty(object.prototype || object, name, descriptor);
        }
    }
}

function shadow(object, info) {
    var shadow = object._shadow || {};
    if (info) {
        var names = Object.getOwnPropertyNames(info);
        for (var i = 0; i < names.length; i++) {
            var name = names[i];
            shadow[name] = info[name];
        }
    }
    return object._shadow = shadow;
}

function convertNodesIntoANode(nodes, document) {
    // https://dom.spec.whatwg.org/#converting-nodes-into-a-node
    var node = null;

    for (var i = 0; i < nodes.length; i++) {
        var item = nodes[i];

        if (typeof item === "string") {
            nodes[i] = document.createTextNode(item);
        }
    }

    if (nodes.length === 1) {
        node = nodes[0];
    } else {
        node = document.createDocumentFragment();

        for (var _i = 0; _i < nodes.length; _i++) {
            node.appendChild(nodes[_i]);
        }
    }

    return node;
}

function isValidCustomElementName(localName) {
    // https://html.spec.whatwg.org/multipage/scripting.html#valid-custom-element-name
    switch (localName) {
        case "annotation-xml":
        case "color-profile":
        case "font-face":
        case "font-face-src":
        case "font-face-uri":
        case "font-face-format":
        case "font-face-name":
        case "missing-glyph":
            return false;
    }

    // For now, to reduce complexity, we are leaving the unicode sets out...
    var regex = /[a-z](-|\.|[0-9]|_|[a-z])+-(-|\.|[0-9]|_|[a-z])+/g;

    return regex.test(localName);
}

// https://dom.spec.whatwg.org/#finding-slots-and-slotables

function findASlot(slotable, open) {
    // https://dom.spec.whatwg.org/#find-a-slot
    // To find a slot for a given slotable slotable and an optional 
    // open flag (unset unless stated otherwise), run these steps:

    // 1. If slotable’s parent is null, then return null.
    var parent = slotable.parentNode;
    if (!parent) {
        return null;
    }

    // 2. Let shadow be slotable’s parent’s shadow root.
    var shadow = parent.shadowRoot;

    // 3. If shadow is null, then return null.
    if (!shadow) {
        return null;
    }

    // 4. If the open flag is set and shadow’s mode is not "open", then return null.
    if (open && shadow.mode !== 'open') {
        return null;
    }

    // 5. Return the first slot in shadow’s tree whose name is slotable’s name, if any, and null otherwise.
    if (!shadow.firstChild) {
        return null;
    }

    var name = slotable instanceof Element ? slotable.getAttribute('slot') : null;
    var stack = [{ node: shadow.firstChild, recursed: false }];

    while (stack.length) {
        var frame = stack.pop();
        var node = frame.node;

        if (frame.recursed) {
            if (node.nextSibling) {
                stack.push({ node: node.nextSibling, recursed: false });
            }
        } else {
            if (node.localName === 'slot' && node.getAttribute('name') === name) {
                return node;
            }

            stack.push({ node: frame.node, recursed: true });

            if (node.firstChild) {
                stack.push({ node: node.firstChild, recursed: false });
            }
        }
    }

    return null;
}

function findSlotables(slot) {
    // https://dom.spec.whatwg.org/#find-slotables
    // To find slotables for a given slot slot, run these steps:

    // 1. Let result be an empty list.
    var result = [];

    // 2. If slot’s root is not a shadow root, then return result.
    var root = slot.getRootNode({ composed: false });
    if (root.nodeName != '#shadow-root') {
        return result;
    }

    // 3. Let host be slot’s root’s host.
    var host = root.host;

    // 4. For each slotable child of host, slotable, in tree order, run these substeps:
    var slotableChildren = slice(host.childNodes);
    for (var i = 0; i < slotableChildren.length; i++) {
        var slotable = slotableChildren[i];
        if (slotable.nodeType === Node.ELEMENT_NODE || slotable.nodeType === Node.TEXT_NODE) {
            // 1. Let foundSlot be the result of finding a slot given slotable.
            var foundSlot = findASlot(slotable);
            // 2. If foundSlot is slot, then append slotable to result.
            if (foundSlot === slot) {
                result.push(slotable);
            }
        }
    }

    // 5. Return result.
    return result;
}

function findFlattenedSlotables(slot) {
    // https://dom.spec.whatwg.org/#find-flattened-slotables
    // To find flattened slotables for a given slot slot, run these steps:

    // 1. Let result be an empty list.
    var result = [];

    // 2. Let slotables be the result of finding slotables given slot.
    var slotables = findSlotables(slot);

    // 3. If slotables is the empty list, then append each slotable child of slot, in tree order, to slotables.
    if (slotables.length === 0) {
        var slotableChildren = slice(slot.childNodes);
        for (var i = 0; i < slotableChildren.length; i++) {
            var slotableChild = slotableChildren[i];
            if (slotableChild.nodeType === Node.ELEMENT_NODE || slotableChild.nodeType === Node.TEXT_NODE) {
                slotables.push(slotableChild);
            }
        }
    }

    // 4. For each node in slotables, run these substeps:
    for (var _i2 = 0; _i2 < slotables.length; _i2++) {
        var node = slotables[_i2];
        // 1. If node is a slot, run these subsubsteps:
        if (node.localName === 'slot') {
            var temporaryResult = findFlattenedSlotables(node);
            result.splice.apply(result, [result.length, 0].concat(_toConsumableArray(temporaryResult)));
        } else {
            result.push(node);
        }
    }

    // 5. Return result.
    return result;
}

// https://dom.spec.whatwg.org/#assigning-slotables-and-slots

function assignSlotables(slot, suppressSignaling) {
    // https://dom.spec.whatwg.org/#assign-slotables
    // To assign slotables, for a slot slot with an optional suppress 
    // signaling flag (unset unless stated otherwise), run these steps:

    // 1. Let slotables be the result of finding slotables for slot.
    var slotables = findSlotables(slot);

    // 2. If suppress signaling flag is unset, and slotables and slot’s assigned 
    // nodes are not identical, then run signal a slot change for slot.
    if (!suppressSignaling) {
        var assignedNodes = slot.assignedNodes();
        if (slotables.length !== assignedNodes.length) {
            signalASlotChange(slot);
        } else {
            for (var i = 0; i < slotables.length; i++) {
                if (slotables[i] !== assignedNodes[i]) {
                    signalASlotChange(slot);
                    break;
                }
            }
        }
    }

    // 3. Set slot’s assigned nodes to slotables.
    shadow(slot, { assignedNodes: slotables });

    // 4. For each slotable in slotables, set slotable’s assigned slot to slot.

    // 4a. If we haven't tracked them yet, track the slot's logical children
    if (!shadow(slot).childNodes) {
        shadow(slot, {
            childNodes: slice(native.childNodes.get.call(slot))
        });
    }

    // 4b. We need to clean out the slot
    var firstChild = void 0;
    while (firstChild = native.firstChild.get.call(slot)) {
        native.removeChild.call(slot, firstChild);
    }

    // 4c. do what the spec said
    for (var _i3 = 0; _i3 < slotables.length; _i3++) {
        var slotable = slotables[_i3];
        shadow(slotable, { assignedSlot: slot });
        native.appendChild.call(slot, slotable);
    }

    // 4d. if there were no slotables we need to insert its fallback content
    if (!slotables.length) {
        var childNodes = shadow(slot).childNodes;
        for (var _i4 = 0; _i4 < childNodes.length; _i4++) {
            native.appendChild.call(slot, childNodes[_i4]);
        }
    }
}

function assignSlotablesForATree(tree, noSignalSlots) {
    // https://dom.spec.whatwg.org/#assign-slotables-for-a-tree
    // To assign slotables for a tree, given a tree tree and an optional set of slots noSignalSlots
    // (empty unless stated otherwise), run these steps for each slot slot in tree, in tree order:
    var slots = [];

    if (tree.localName === 'slot') {
        slots.push(tree);
    }

    if (tree.hasChildNodes()) {
        slots.push.apply(slots, _toConsumableArray(tree.querySelectorAll('slot')));
    }

    for (var i = 0; i < slots.length; i++) {
        var slot = slots[i];

        // 1. Let suppress signaling flag be set, if slot is in noSignalSlots, and unset otherwise.
        var suppressSignaling = noSignalSlots.indexOf(slot) !== -1;

        // 2. Run assign slotables for slot with suppress signaling flag.
        assignSlotables(slot, suppressSignaling);
    }
}

function assignASlot(slotable) {
    var slot = findASlot(slotable);

    if (slot !== null) {
        assignSlotables(slot);
    }
}

// https://dom.spec.whatwg.org/#signaling-slot-change

function signalASlotChange(slot) {}
// https://dom.spec.whatwg.org/#signal-a-slot-change
// To signal a slot change, for a slot slot, run these steps:

// Skip (MutationObserver)
// 1. If slot is not in unit of related similar-origin browsing contexts' 
// signal slot list, append slot to unit of related similar-origin browsing 
// contexts' signal slot list.
// 2. Queue a mutation observer compound microtask.


// https://dom.spec.whatwg.org/#mutation-algorithms

function ensurePreInsertionValidity(node, parent, child) {
    // https://dom.spec.whatwg.org/#concept-node-ensure-pre-insertion-validity
    // To ensure pre-insertion validity of a node into a parent before a child, run these steps:

    // Skip (native)
    // 1. If parent is not a Document, DocumentFragment, or Element node, throw a HierarchyRequestError.

    // 2. If node is a host-including inclusive ancestor of parent, throw a HierarchyRequestError.
    var ancestor = parent;
    do {
        if (ancestor === node) {
            throw makeError('HierarchyRequestError');
        }
    } while (ancestor = ancestor.parentNode || ancestor.host);

    // 3. If child is not null and its parent is not parent, then throw a NotFoundError.
    if (child !== null && child.parentNode !== parent) {
        throw makeError('NotFoundError');
    }

    // Skip (native)
    // 4. If node is not a DocumentFragment, DocumentType, Element, Text, ProcessingInstruction, 
    // or Comment node, throw a HierarchyRequestError.
    // 5. If either node is a Text node and parent is a document, or node is a doctype 
    // and parent is not a document, throw a HierarchyRequestError.
    // 6. If parent is a document, and any of the statements below, switched on node, 
    // are true, throw a HierarchyRequestError.
}

function preInsert(node, parent, child) {
    // https://dom.spec.whatwg.org/#concept-node-pre-insert
    // To pre-insert a node into a parent before a child, run these steps:

    // 1. Ensure pre-insertion validity of node into parent before child.
    ensurePreInsertionValidity(node, parent, child);

    // 2. Let reference child be child.
    var referenceChild = child;

    // 3. If reference child is node, set it to node’s next sibling.
    referenceChild === node && (referenceChild = node.nextSibling);

    // 4. Adopt node into parent’s node document.
    // https://dom.spec.whatwg.org/#concept-node-adopt
    adopt(node, parent.ownerDocument);

    // 5. Insert node into parent before reference child.
    // https://dom.spec.whatwg.org/#concept-node-insert
    insert(node, parent, referenceChild);

    // 6. Return node.
    return node;
}

function insert(node, parent, child, suppressObservers) {
    // https://dom.spec.whatwg.org/#concept-node-insert
    // To insert a node into a parent before a child, with an optional suppress observers flag, run these steps:

    // Skip (Range)
    // 1. Let count be the number of children of node if it is a DocumentFragment node, and one otherwise.
    // 2. If child is non-null, run these substeps:

    // 3. Let nodes be node’s children if node is a DocumentFragment node, 
    // and a list containing solely node otherwise.
    var nodes = node.nodeType === Node.DOCUMENT_FRAGMENT_NODE ? slice(node.childNodes) : [node];

    // 4. If node is a DocumentFragment node, remove its children with the suppress observers flag set.
    if (node.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
        for (var i = 0; i < nodes.length; i++) {
            remove(nodes[i], node, true);
        }
    }

    // Skip (MutationObserver)
    // 5. If node is a DocumentFragment node, queue a mutation record of "childList" for node with removedNodes nodes.

    // 6. For each node in nodes, in tree order, run these substeps:
    for (var _i5 = 0; _i5 < nodes.length; _i5++) {
        var _node = nodes[_i5];
        // 1. Insert node into parent before child or at the end of parent if child is null.
        var childNodes = shadow(parent).childNodes;
        if (childNodes) {
            if (child) {
                var childIndex = childNodes.indexOf(child);
                childNodes.splice(childIndex, 0, _node);
            } else {
                childNodes.push(_node);
            }
            shadow(_node, { parentNode: parent });
            // If it's a shadow root, perform physical insert on the host.
            var shadowHost = shadow(parent).host;
            if (shadowHost) {
                native.insertBefore.call(shadowHost, _node, child);
            }
        } else {
            native.insertBefore.call(parent, _node, child);
        }

        // 2. If parent is a shadow host and node is a slotable, then assign a slot for node.
        if (shadow(parent).shadowRoot && 'assignedSlot' in _node) {
            assignASlot(_node);
        }

        // 3. If parent is a slot whose assigned nodes is the empty list, then run signal a slot change for parent.
        if (parent.localName === 'slot' && parent.assignedNodes().length === 0) {
            // 3a. Physically append the child into the slot.
            native.appendChild.call(parent, _node);
            // 3b. Do what the spec said
            signalASlotChange(parent);
        }

        // 4. Run assign slotables for a tree with node’s tree and a set containing each inclusive descendant of node that is a slot.
        var inclusiveSlotDescendants = [];
        if (_node.localName === 'slot') {
            inclusiveSlotDescendants.push(_node);
        }
        if (_node.hasChildNodes()) {
            inclusiveSlotDescendants.push.apply(inclusiveSlotDescendants, _toConsumableArray(_node.querySelectorAll('slot')));
        }
        assignSlotablesForATree(_node, inclusiveSlotDescendants);

        // Skip (CustomElements)
        // 5. For each shadow-including inclusive descendant inclusiveDescendant of node, 
        // in shadow-including tree order, run these subsubsteps:
    }

    // Skip (MutationObserver)
    // 7. If suppress observers flag is unset, queue a mutation record of "childList" for parent 
    // with addedNodes nodes, nextSibling child, and previousSibling child’s previous sibling or 
    // parent’s last child if child is null.
}

function append(node, parent) {
    // https://dom.spec.whatwg.org/#concept-node-append
    // To append a node to a parent, pre-insert node into parent before null.
    preInsert(node, parent, null);
}

function replace(child, node, parent) {
    // https://dom.spec.whatwg.org/#concept-node-replace
    // To replace a child with node within a parent, run these steps:

    // Skip (native)
    // 1. If parent is not a Document, DocumentFragment, or Element node, throw a HierarchyRequestError.

    // 2. If node is a host-including inclusive ancestor of parent, throw a HierarchyRequestError.
    var ancestor = parent;
    do {
        if (ancestor === node) {
            throw makeError('HierarchyRequestError');
        }
    } while (ancestor = ancestor.parentNode || ancestor.host);

    // 3. If child’s parent is not parent, then throw a NotFoundError.
    if (child !== null && child.parentNode !== parent) {
        throw makeError('NotFoundError');
    }

    // Skip (native)
    // 4. If node is not a DocumentFragment, DocumentType, Element, Text, ProcessingInstruction, or Comment node, throw a HierarchyRequestError.
    // 5. If either node is a Text node and parent is a document, or node is a doctype and parent is not a document, throw a HierarchyRequestError.
    // 6. If parent is a document, and any of the statements below, switched on node, are true, throw a HierarchyRequestError.

    // 7. Let reference child be child’s next sibling.
    var referenceChild = child.nextSibling;

    // 8. If reference child is node, set it to node’s next sibling.
    if (referenceChild === node) {
        referenceChild = node.nextSibling;
    }

    // Skip (MutationObserver)
    // 9. Let previousSibling be child’s previous sibling.
    // const previousSibling = child.previousSibling;

    // 10. Adopt node into parent’s node document.
    adopt(node, parent.ownerDocument);

    // Skip (MutationObserver)
    // 11. Let removedNodes be the empty list.
    // const removedNodes = [];

    // 12. If child’s parent is not null, run these substeps:
    var childParent = child.parentNode;
    if (childParent !== null) {
        // Skip (MutationObserver)
        // 1. Set removedNodes to a list solely containing child.
        // removedNodes.push(child);
        // 2. Remove child from its parent with the suppress observers flag set.
        remove(child, parent, true);
    }

    // Skip (MutationObserver)
    // 13. Let nodes be node’s children if node is a DocumentFragment node, and a list containing solely node otherwise.

    // 14. Insert node into parent before reference child with the suppress observers flag set.
    insert(node, parent, referenceChild, true);

    // Skip (MutationObserver)
    // 15. Queue a mutation record of "childList" for target parent with addedNodes nodes, 
    // removedNodes removedNodes, nextSibling reference child, and previousSibling previousSibling.
}

function replaceAll(node, parent) {
    // https://dom.spec.whatwg.org/#concept-node-replace-all
    // To replace all with a node within a parent, run these steps:

    // 1. If node is not null, adopt node into parent’s node document.
    if (node !== null) {
        adopt(node, parent.ownerDocument);
    }

    // 2. Let removedNodes be parent’s children.
    var removedNodes = slice(parent.childNodes);

    // 3. Let addedNodes be the empty list if node is null, node’s children if node is a DocumentFragment node, and a list containing node otherwise.
    var addedNodes = node === null ? [] : node.nodeType === Node.DOCUMENT_FRAGMENT_NODE ? slice(node.childNodes) : [node];

    // 4. Remove all parent’s children, in tree order, with the suppress observers flag set.
    for (var i = 0; i < removedNodes.length; i++) {
        remove(removedNodes[i], parent, true);
    }

    // 5. If node is not null, insert node into parent before null with the suppress observers flag set.
    if (node !== null) {
        insert(node, parent, null, true);
    }

    // Skip (MutationObserver)
    // 6. Queue a mutation record of "childList" for parent with addedNodes addedNodes and removedNodes removedNodes.
}

function preRemove(child, parent) {
    // https://dom.spec.whatwg.org/#concept-node-pre-remove
    // To pre-remove a child from a parent, run these steps:

    // 1. If child’s parent is not parent, then throw a NotFoundError.
    if (child.parentNode !== parent) {
        throw makeError('NotFoundError');
    }

    // 2. Remove child from parent.
    remove(child, parent);

    // 3. Return child.
    return child;
}

function remove(node, parent, suppessObservers) {
    // https://dom.spec.whatwg.org/#concept-node-remove
    // To remove a node from a parent, with an optional suppress observers flag, run these steps:

    // Skip (Range)
    // 1. Let index be node’s index.
    // 2. For each range whose start node is an inclusive descendant of node, set its start to (parent, index).
    // 3. For each range whose end node is an inclusive descendant of node, set its end to (parent, index).
    // 4. For each range whose start node is parent and start offset is greater than index, decrease its start offset by one.
    // 5. For each range whose end node is parent and end offset is greater than index, decrease its end offset by one.

    // Skip (NodeIterator)
    // 6. For each NodeIterator object iterator whose root’s node document is node’s node document, 
    // run the NodeIterator pre-removing steps given node and iterator.

    // Skip (MutationObserver)
    // 7. Let oldPreviousSibling be node’s previous sibling.
    // 8. Let oldNextSibling be node’s next sibling.

    // 9. Remove node from its parent.
    var childNodes = shadow(parent).childNodes;
    if (childNodes) {
        var nodeIndex = childNodes.indexOf(node);
        childNodes.splice(nodeIndex, 1);
    }
    delete shadow(node).parentNode;
    native.removeChild.call(native.parentNode.get.call(node), node);

    // 10. If node is assigned, then run assign slotables for node’s assigned slot.
    var assignedSlot = shadow(node).assignedSlot;
    if (assignedSlot) {
        assignSlotables(assignedSlot);
        shadow(node).assignedSlot = null;
    }

    // 11. If parent is a slot whose assigned nodes is the empty list, then run signal a slot change for parent.
    if (parent.localName === 'slot' && parent.assignedNodes().length === 0) {
        signalASlotChange(parent);
    }

    // 12. If node has an inclusive descendant that is a slot, then:
    var inclusiveSlotDescendants = [];
    if (node.localName === 'slot') {
        inclusiveSlotDescendants.push(node);
    }
    if (node.hasChildNodes()) {
        inclusiveSlotDescendants.push.apply(inclusiveSlotDescendants, _toConsumableArray(node.querySelectorAll('slot')));
    }
    if (inclusiveSlotDescendants.length) {
        // 1. Run assign slotables for a tree with parent’s tree.
        assignSlotablesForATree(parent);
        // 2. Run assign slotables for a tree with node’s tree and a 
        // set containing each inclusive descendant of node that is a slot.
        assignSlotablesForATree(node, inclusiveSlotDescendants);
    }

    // Skip (other)
    // 13. Run the removing steps with node and parent.

    // Skip (CustomElements)
    // 14. If node is custom, then enqueue a custom element callback reaction 
    // with node, callback name "disconnectedCallback", and an empty argument list.
    // 15. For each shadow-including descendant descendant of node, in 
    // shadow-including tree order, run these substeps:

    // Skip (MutationObserver)
    // 16. For each inclusive ancestor inclusiveAncestor of parent, if inclusiveAncestor 
    // has any registered observers whose options' subtree is true, then for each such registered 
    // observer registered, append a transient registered observer whose observer and options are 
    // identical to those of registered and source which is registered to node’s list of registered observers.
    // 17. If suppress observers flag is unset, queue a mutation record of "childList" for parent 
    // with removedNodes a list solely containing node, nextSibling oldNextSibling, and previousSibling 
    // oldPreviousSibling.
}

function clone(node, document, cloneChildren) {
    // https://dom.spec.whatwg.org/#concept-node-clone
    // To clone a node, with an optional document and clone children flag, run these steps:

    // 1. If document is not given, let document be node’s node document.
    document = document || node.ownerDocument;

    // Use a shortcut here
    // 2. If node is an element, then:
    // 3. Otherwise, let copy be a node that implements the same interfaces 
    // as node, and fulfills these additional requirements, switching on node:
    // 4. Set copy’s node document and document to copy, if copy is a document, 
    // and set copy’s node document to document otherwise.
    // 5. Run any cloning steps defined for node in other applicable 
    // specifications and pass copy, node, document and the clone children 
    // flag if set, as parameters.
    var copy = native.cloneNode.call(node, false);

    // 6. If the clone children flag is set, clone all the children of node 
    // and append them to copy, with document as specified and the clone 
    // children flag being set.
    if (cloneChildren === true) {
        var childNodes = slice(node.childNodes);
        for (var i = 0; i < childNodes.length; i++) {
            append(childNodes[i].cloneNode(true), copy);
        }
    }

    return copy;
}

function adopt(node, document) {
    // https://dom.spec.whatwg.org/#concept-node-adopt

    // 1. Let oldDocument be node’s node document.
    var oldDocument = node.ownerDocument;

    // 2. If node’s parent is not null, remove node from its parent.
    var parent = node.parentNode;
    if (parent !== null) {
        remove(node, parent);
    }

    // Skip (CustomElements, native)
    // 3. If document is not the same as oldDocument, run these substeps:
}

},{}]},{},[12]);

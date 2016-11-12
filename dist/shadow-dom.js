(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // https://dom.spec.whatwg.org/#interface-attr

var _utils = require('../utils.js');

var $ = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _class = function () {
    function _class() {
        _classCallCheck(this, _class);
    }

    _createClass(_class, [{
        key: 'value',
        get: function get() {
            return $.descriptors.Attr.value.get.call(this);
        }

        // TODO: MutationObserver tests
        ,
        set: function set(value) {
            $.setExistingAttributeValue(this, value);
        }
    }]);

    return _class;
}();

exports.default = _class;

},{"../utils.js":25}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // https://dom.spec.whatwg.org/#interface-characterdata

var _utils = require('../utils.js');

var $ = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var getData = $.descriptors.CharacterData.data.get;

var _class = function () {
    function _class() {
        _classCallCheck(this, _class);
    }

    _createClass(_class, [{
        key: 'appendData',


        // TODO: MutationObserver tests
        value: function appendData(data) {
            var length = getData.call(this).length;
            $.replaceData(this, length, 0, data);
        }

        // TODO: MutationObserver tests

    }, {
        key: 'insertData',
        value: function insertData(offset, data) {
            $.replaceData(this, offset, 0, data);
        }

        // TODO: MutationObserver tests

    }, {
        key: 'deleteData',
        value: function deleteData(offset, count) {
            $.replaceData(this, offset, count, '');
        }

        // TODO: MutationObserver tests

    }, {
        key: 'replaceData',
        value: function replaceData(offset, count, data) {
            $.replaceData(this, offset, count, data);
        }
    }, {
        key: 'data',
        get: function get() {
            return getData.call(this);
        },
        set: function set(value) {
            var length = getData.call(this).length;
            $.replaceData(this, 0, length, value);
        }
    }]);

    return _class;
}();

exports.default = _class;

},{"../utils.js":25}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _utils = require('../utils.js');

var $ = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } } // https://dom.spec.whatwg.org/#interface-customevent

var _class = function _class(type, init) {
    _classCallCheck(this, _class);

    var bubbles = false;
    var cancelable = false;
    var composed = false;
    var detail = null;
    if (init) {
        bubbles = init.bubbles === true;
        cancelable = init.cancelable === true;
        composed = init.composed === true;
        detail = init.detail || null;
    }
    var event = document.createEvent('CustomEvent');
    event.initCustomEvent(type, bubbles, cancelable, detail);
    $.shadow(event).composed = composed;
    return event;
};

exports.default = _class;

},{"../utils.js":25}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // https://dom.spec.whatwg.org/#interface-document

var _utils = require('../utils.js');

var $ = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _class = function () {
    function _class() {
        _classCallCheck(this, _class);
    }

    _createClass(_class, [{
        key: 'getElementsByTagName',


        // TODO: tests
        value: function getElementsByTagName(qualifiedName) {
            var results = $.descriptors.Document.getElementsByTagName.value.call(this, qualifiedName);
            return $.filterByRoot(this, results);
        }

        // TODO: tests

    }, {
        key: 'getElementsByTagNameNS',
        value: function getElementsByTagNameNS(ns, localName) {
            var results = $.descriptors.Document.getElementsByTagNameNS.value.call(this, ns, localName);
            return $.filterByRoot(this, results);
        }

        // TODO: tests

    }, {
        key: 'getElementsByClassName',
        value: function getElementsByClassName(names) {
            var results = $.descriptors.Document.getElementsByClassName.value.call(this, name);
            return $.filterByRoot(this, results);
        }

        // TODO: tests

    }, {
        key: 'importNode',
        value: function importNode(node, deep) {
            if (node.nodeType === Node.DOCUMENT_NODE || $.isShadowRoot(node)) {
                throw $.makeError('NotSupportedError');
            }

            return $.clone(node, this, deep);
        }
    }]);

    return _class;
}();

exports.default = _class;

},{"../utils.js":25}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // https://dom.spec.whatwg.org/#interface-element

var _utils = require('../utils.js');

var $ = _interopRequireWildcard(_utils);

var _ShadowRoot = require('../interfaces/ShadowRoot.js');

var _ShadowRoot2 = _interopRequireDefault(_ShadowRoot);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _class = function () {
    function _class() {
        _classCallCheck(this, _class);
    }

    _createClass(_class, [{
        key: 'setAttribute',


        // TODO: tests
        value: function setAttribute(qualifiedName, value) {
            var attribute = $.descriptors.Element.attributes.get.call(this).getNamedItem(qualifiedName);
            if (!attribute) {
                attribute = this.ownerDocument.createAttribute(qualifiedName);
                $.descriptors.Attr.value.set.call(attribute, value);
                $.appendAttribute(attribute, this);
                return;
            }
            $.changeAttribute(attribute, this, value);
        }

        // TODO: tests

    }, {
        key: 'setAttributeNS',
        value: function setAttributeNS(namespace, qualifiedName, value) {
            var dummy = document.createAttributeNS(namespace, qualifiedName);
            $.setAttributeValue(this, dummy.localName, value, dummy.prefix, dummy.namespaceURI);
        }

        // TODO: tests

    }, {
        key: 'removeAttribute',
        value: function removeAttribute(qualifiedName) {
            $.removeAttributeByName(qualifiedName, this);
        }

        // TODO: tests

    }, {
        key: 'removeAttributeNS',
        value: function removeAttributeNS(namespace, localName) {
            $.removeAttributeByNamespace(namespace, localName, this);
        }

        // TODO: tests

    }, {
        key: 'setAttributeNode',
        value: function setAttributeNode(attr) {
            return $.setAttribute(attr, this);
        }

        // TODO: tests

    }, {
        key: 'setAttributeNodeNS',
        value: function setAttributeNodeNS(attr) {
            return $.setAttribute(attr, this);
        }

        // TODO: tests

    }, {
        key: 'removeAttributeNode',
        value: function removeAttributeNode(attr) {
            if (attr.ownerElement !== this) {
                throw $.makeError('NotFoundError');
            }
            $.removeAttribute(attr, this);
            return attr;
        }
    }, {
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

            var shadowState = $.shadow(shadow);

            shadowState.host = this;
            shadowState.mode = init.mode;
            shadowState.childNodes = [];

            var childNodes = $.descriptors.Node.childNodes.get.call(this);
            var hostState = $.shadow(this);

            hostState.shadowRoot = shadow;
            hostState.childNodes = $.slice(this.childNodes);

            var removeChild = $.descriptors.Node.removeChild.value;
            for (var i = 0; i < childNodes.length; i++) {
                var childNode = childNodes[i];
                $.shadow(childNode).parentNode = this;
                removeChild.call(this, childNode);
            }

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
            var results = $.descriptors.Element.getElementsByTagName.value.call(this, qualifiedName);
            return $.filterByRoot(this, results);
        }

        // TODO: tests

    }, {
        key: 'getElementsByTagNameNS',
        value: function getElementsByTagNameNS(ns, localName) {
            var results = $.descriptors.Element.getElementsByTagNameNS.value.call(this, ns, localName);
            return $.filterByRoot(this, results);
        }

        // TODO: tests

    }, {
        key: 'getElementsByClassName',
        value: function getElementsByClassName(names) {
            var results = $.descriptors.Element.getElementsByClassName.value.call(this, name);
            return $.filterByRoot(this, results);
        }

        // TODO: tests

    }, {
        key: 'insertAdjacentElement',
        value: function insertAdjacentElement(where, element) {
            // https://dom.spec.whatwg.org/#dom-element-insertadjacentelement
            return $.insertAdjacent(this, where, element);
        }

        // TODO: tests

    }, {
        key: 'insertAdjacentText',
        value: function insertAdjacentText(where, data) {
            // https://dom.spec.whatwg.org/#dom-element-insertadjacenttext
            var text = this.ownerDocument.createTextNode(data);
            $.insertAdjacent(this, where, text);
            return;
        }

        // https://w3c.github.io/DOM-Parsing/#extensions-to-the-element-interface

        // TODO: more thorough tests of the serialization

    }, {
        key: 'insertAdjacentHTML',


        // TODO: tests
        value: function insertAdjacentHTML(position, text) {
            // https://w3c.github.io/DOM-Parsing/#dom-element-insertadjacenthtml
            // We aren't going to go exactly by the books for this one.
            var fragment = $.parseHTMLFragment(text, this);
            $.insertAdjacent(this, position, fragment);
        }
    }, {
        key: 'slot',
        get: function get() {
            // The slot attribute must reflect the "slot" content attribute.
            return this.getAttribute('slot');
        }

        // TODO: tests
        ,
        set: function set(value) {
            $.setAttributeValue(this, 'slot', value);
        }

        // TODO: tests

    }, {
        key: 'attributes',
        get: function get() {
            var attributes = $.descriptors.Element.attributes.get.call(this);
            $.shadow(attributes).element = this;
            return attributes;
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
            // https://w3c.github.io/DOM-Parsing/#dom-element-innerhtml
            return $.serializeHTMLFragment(this);
        }

        // TODO: MutationObserver tests
        ,
        set: function set(value) {
            // https://w3c.github.io/DOM-Parsing/#dom-element-innerhtml
            var fragment = $.parseHTMLFragment(value, this);
            $.replaceAll(fragment, this);
        }

        // TODO: tests

    }, {
        key: 'outerHTML',
        get: function get() {
            // https://w3c.github.io/DOM-Parsing/#dom-element-outerhtml
            return $.serializeHTMLFragment({ childNodes: [this] });
        }

        // TODO: tests
        ,
        set: function set(value) {
            // https://w3c.github.io/DOM-Parsing/#dom-element-outerhtml
            var parent = this.parentNode;
            if (parent === null) {
                return;
            }
            if (parent.nodeType === Node.DOCUMENT_NODE) {
                throw $.makeError('NoModificationAllowedError');
            }
            if (parent.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
                parent = this.ownerDocument.createElement('body');
            }
            var fragment = $.parseHTMLFragment(value, parent);
            $.replace(this, fragment, this.parentNode);
        }
    }]);

    return _class;
}();

exports.default = _class;

},{"../interfaces/ShadowRoot.js":15,"../utils.js":25}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.hasRelatedTarget = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // https://dom.spec.whatwg.org/#interface-event

var _utils = require('../utils.js');

var $ = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _class = function () {
    function _class(type, init) {
        _classCallCheck(this, _class);

        var bubbles = false;
        var cancelable = false;
        var composed = false;
        if (init) {
            bubbles = init.bubbles === true;
            cancelable = init.cancelable === true;
            composed = init.composed === true;
        }
        var event = document.createEvent('event');
        event.initEvent(type, bubbles, cancelable);
        $.shadow(event).composed = composed;
        return event;
    }

    _createClass(_class, [{
        key: 'stopImmediatePropagation',
        value: function stopImmediatePropagation() {
            this.stopPropagation();
            $.shadow(this).stopImmediatePropagationFlag = true;
        }
    }, {
        key: 'composedPath',
        value: function composedPath() {
            // https://dom.spec.whatwg.org/#dom-event-composedpath

            // 1. Let composedPath be a new empty list.
            var composedPath = [];

            // 2. Let currentTarget be context object’s currentTarget attribute value.
            var currentTarget = this.currentTarget;

            // 3. For each tuple in context object’s path:
            var path = $.shadow(this).path || [];

            for (var i = 0; i < path.length; i++) {
                var item = path[i][0];
                if (currentTarget instanceof Window) {
                    if (!(item instanceof Node) || !$.closedShadowHidden(item, $.shadowIncludingRoot(item))) {
                        composedPath.push(item);
                    }
                } else if (currentTarget instanceof Node) {
                    if (!$.closedShadowHidden(item, currentTarget)) {
                        composedPath.push(item);
                    }
                } else {
                    composedPath.push(item);
                }
            }

            // 4. return composedPath.
            return composedPath.slice();
        }
    }, {
        key: 'currentTarget',
        get: function get() {
            return $.shadow(this).currentTarget;
        }
    }, {
        key: 'target',
        get: function get() {
            return $.shadow(this).target;
        }
    }, {
        key: 'composed',
        get: function get() {
            // TODO: Compare against the actual prototype instead of just the type strings
            return $.shadow(this).composed || builtInComposedEvents.indexOf(this.type) !== -1;
        }
    }]);

    return _class;
}();

// FocusEvent:
// relatedTarget will be the element losing or gaining focus
// MouseEvent:
// relatedTarget will be the element being moved into or out of


exports.default = _class;

var hasRelatedTarget = exports.hasRelatedTarget = function () {
    function hasRelatedTarget() {
        _classCallCheck(this, hasRelatedTarget);
    }

    _createClass(hasRelatedTarget, [{
        key: 'relatedTarget',
        get: function get() {
            return $.shadow(this).relatedTarget;
        }
    }]);

    return hasRelatedTarget;
}();

;

var builtInComposedEvents = [
// FocusEvent
'blur', 'focus', 'focusin', 'focusout',
// MouseEvent
'click', 'dblclick', 'mousedown', 'mouseenter', 'mouseleave', 'mousemove', 'mouseout', 'mouseover', 'mouseup',
// WheelEvent
'wheel',
// InputEvent
'beforeinput', 'input',
// KeyboardEvent
'keydown', 'keyup',
// CompositionEvent
'compositionstart', 'compositionupdate', 'compositionend',
// Legacy UIEvent
'DOMActivate',
// Legacy FocusEvent
'DOMFocusIn', 'DOMFocusOut',
// Legacy KeyboardEvent
'keypress'];

},{"../utils.js":25}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // https://dom.spec.whatwg.org/#interface-eventtarget

exports.default = function (base) {

    var native = {
        addEventListener: base.prototype.addEventListener,
        removeEventListener: base.prototype.removeEventListener,
        dispatchEvent: base.prototype.dispatchEvent
    };

    return function () {
        function _class() {
            _classCallCheck(this, _class);
        }

        _createClass(_class, [{
            key: 'addEventListener',
            value: function addEventListener(type, callback, options) {
                if (typeof callback !== 'function') {
                    return;
                }

                var listener = { callback: callback };
                var capture = false;

                if (typeof options === 'boolean') {
                    capture = options;
                } else if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object') {
                    capture = options.capture === true;
                    listener.once = options.once === true;
                    // we don't do anything with passive.
                    listener.passive = options.passive === true;
                }

                var collection = EventListenerCollection.get(this, type, capture) || EventListenerCollection.create(this, type, capture);

                collection.addListener(this, listener);
                collection.attach(native.addEventListener);
            }
        }, {
            key: 'removeEventListener',
            value: function removeEventListener(type, callback, options) {
                if (typeof callback !== 'function') {
                    return;
                }

                var listener = { callback: callback };
                var capture = false;

                if (typeof options === 'boolean') {
                    capture = options;
                } else if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object') {
                    capture = options.capture === true;
                }

                var collection = EventListenerCollection.get(this, type, capture);

                if (!collection) {
                    return;
                }

                collection.removeListener(this, listener);

                if (collection.empty) {
                    collection.detach(native.removeEventListener);
                }
            }
        }]);

        return _class;
    }();
};

var _utils = require('../utils.js');

var $ = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EventListenerCollection = function () {
    _createClass(EventListenerCollection, null, [{
        key: 'get',
        value: function get(target, type, capture) {
            var nativeTarget = $.shadow(target).host || target;
            var collections = $.shadow(nativeTarget).listeners;
            if (!(collections instanceof Array)) {
                return null;
            }
            for (var i = 0; i < collections.length; i++) {
                var collection = collections[i];
                if (collection.target === nativeTarget && collection.type === type && collection.capture === capture) {
                    return collection;
                }
            }
            return null;
        }
    }, {
        key: 'create',
        value: function create(target, type, capture) {
            var nativeTarget = $.shadow(target).host || target;
            var nativeTargetState = $.shadow(nativeTarget);
            var collections = nativeTargetState.listeners;
            if (!(collections instanceof Array)) {
                collections = nativeTargetState.listeners = [];
            }
            var collection = new EventListenerCollection(nativeTarget, type, capture);
            collections.push(collection);
            return collection;
        }
    }]);

    function EventListenerCollection(target, type, capture) {
        var _this = this;

        _classCallCheck(this, EventListenerCollection);

        this.target = $.shadow(target).host || target;
        this.type = type;
        this.capture = capture;

        this.hostListeners = [];
        this.shadowListeners = [];

        this.callback = function (event) {
            var shadowRoot = $.shadow(_this.target).shadowRoot;
            switch (event.eventPhase) {
                case Event.prototype.CAPTURING_PHASE:
                    _this.invokeListeners(event, _this.target, _this.hostListeners);
                    if (shadowRoot) {
                        _this.invokeListeners(event, shadowRoot, _this.shadowListeners);
                    }
                    break;
                case Event.prototype.AT_TARGET:
                    var nativeTarget = $.descriptors.Event.target.get.call(event);
                    _this.invokeListeners(event, nativeTarget, _this.getListeners(nativeTarget));
                    break;
                case Event.prototype.BUBBLING_PHASE:
                    if (shadowRoot) {
                        _this.invokeListeners(event, shadowRoot, _this.shadowListeners);
                    }
                    _this.invokeListeners(event, _this.target, _this.hostListeners);
                    break;
            }
        };
    }

    _createClass(EventListenerCollection, [{
        key: 'getListeners',
        value: function getListeners(target) {
            return $.shadow(target).host ? this.shadowListeners : this.hostListeners;
        }
    }, {
        key: 'addListener',
        value: function addListener(target, listener) {
            var listeners = this.getListeners(target);

            for (var i = 0; i < listeners.length; i++) {
                if (listener.callback === listeners[i].callback) {
                    return;
                }
            }

            listeners.push(listener);
        }
    }, {
        key: 'removeListener',
        value: function removeListener(target, listener) {
            var listeners = this.getListeners(target);

            for (var i = 0; i < listeners.length; i++) {
                var other = listeners[i];
                if (listener.callback === other.callback) {
                    listeners.splice(i, 1);
                    break;
                }
            }
        }
    }, {
        key: 'invokeListeners',
        value: function invokeListeners(event, currentTarget, listeners) {
            var eventState = $.shadow(event);
            var path = eventState.calculatedPath;

            if (!path) {
                path = eventState.calculatedPath = calculatePath(event);
            }

            var target = calculateTarget(currentTarget, path);

            // if there is no target, the event is not composed and should be stopped
            if (!target) {
                event.stopImmediatePropagation();
            } else {
                var relatedTarget = calculateRelatedTarget(currentTarget, path);
                var remove = [];

                eventState.path = path;
                eventState.currentTarget = currentTarget;
                eventState.target = target;
                eventState.relatedTarget = relatedTarget;

                for (var i = 0; i < listeners.length; i++) {
                    var listener = listeners[i];
                    var result = listener.callback.call(currentTarget, event);
                    if (listener.once) {
                        remove.push(listener);
                    }
                    if (eventState.stopImmediatePropagationFlag) {
                        break;
                    }
                }

                eventState.path = null;
                eventState.currentTarget = null;

                for (var _i = 0; _i < remove.length; _i++) {
                    var index = listeners.indexOf(remove[_i]);
                    listeners.splice(index, 1);
                }
            }
        }
    }, {
        key: 'attach',
        value: function attach(descriptor) {
            descriptor.call(this.target, this.type, this.callback, this.capture);
        }
    }, {
        key: 'detach',
        value: function detach(descriptor) {
            descriptor.call(this.target, this.type, this.callback, this.capture);
        }
    }, {
        key: 'empty',
        get: function get() {
            return this.hostListeners.length === 0 && this.shadowListeners.length === 0;
        }
    }]);

    return EventListenerCollection;
}();

function calculatePath(event) {
    // https://dom.spec.whatwg.org/#concept-event-dispatch

    var path = [];

    var target = $.descriptors.Event.target.get.call(event);

    var relatedTargetDescriptor = null;

    if (event instanceof FocusEvent) {
        relatedTargetDescriptor = $.descriptors.FocusEvent.relatedTarget;
    } else if (event instanceof MouseEvent) {
        relatedTargetDescriptor = $.descriptors.MouseEvent.relatedTarget;
    }

    // Skip (native)
    // 1. Set event’s dispatch flag.

    // 2. Let targetOverride be target, if legacy target override flag is 
    // not given, and target’s associated Document otherwise. 
    var targetOverride = target;

    // 3. Let relatedTarget be the result of retargeting event’s relatedTarget 
    // against target if event’s relatedTarget is non-null, and null otherwise.
    var originalRelatedTarget = null;
    var relatedTarget = null;
    if (relatedTargetDescriptor) {
        originalRelatedTarget = relatedTargetDescriptor.get.call(event);
        if (originalRelatedTarget) {
            relatedTarget = $.retarget(originalRelatedTarget, target);
        }
    }

    // Skip (native)
    // 4. If target is relatedTarget and target is not event’s relatedTarget, then return true.

    // 5. Append (target, targetOverride, relatedTarget) to event’s path.
    path.push([target, targetOverride, relatedTarget]);

    // Skip (native)
    // 6. Let isActivationEvent be true, if event is a MouseEvent object and 
    // event’s type attribute is "click", and false otherwise.
    // 7. Let activationTarget be target, if isActivationEvent is true and 
    //target has activation behavior, and null otherwise.

    // 8. Let parent be the result of invoking target’s get the parent with event.
    var parent = getTheParent(target, event);

    // 9. While parent is non-null:
    while (parent != null) {
        // 1. Let relatedTarget be the result of retargeting event’s relatedTarget
        // against parent if event’s relatedTarget is non-null, and null otherwise.
        if (originalRelatedTarget) {
            relatedTarget = $.retarget(originalRelatedTarget, parent);
        }
        // 2. If target’s root is a shadow-including inclusive ancestor of parent, then... 
        // append (parent, null, relatedTarget) to event’s path.
        if ($.shadowIncludingInclusiveAncestor($.root(target), parent)) {
            path.push([parent, null, relatedTarget]);
        }
        // 3. Otherwise, if parent and relatedTarget are identical, then set parent to null.
        else if (parent === relatedTarget) {
                parent = null;
            }
            // 4. Otherwise, set target to parent and then... 
            // append (parent, target, relatedTarget) to event’s path.
            else {
                    target = parent;
                    path.push([parent, target, relatedTarget]);
                }
        // 5. If parent is non-null, then set parent to the result of 
        // invoking parent’s get the parent with event.
        if (parent != null) {
            parent = getTheParent(parent, event);
        }
    }

    return path;
}

function getTheParent(node, event) {
    // https://dom.spec.whatwg.org/#get-the-parent
    // Each EventTarget object also has an associated get the parent 
    // algorithm, which takes an event event, and returns an EventTarget 
    // object. Unless specified otherwise it returns null.

    // A node’s get the parent algorithm, given an event, 
    // returns the node’s assigned slot, if node is assigned, 
    // and node’s parent otherwise.

    // A document’s get the parent algorithm, given an event, returns null if event’s 
    // type attribute value is "load" or document does not have a browsing context, 
    // and the document’s associated Window object otherwise.

    // A shadow root’s get the parent algorithm, given an event, returns null if 
    // event’s composed flag is unset and shadow root is the root of event’s 
    // path’s first tuple’s item, and shadow root’s host otherwise.

    if (node instanceof Node) {
        if (node.nodeType === Node.DOCUMENT_NODE) {
            if (event.type === 'load') {
                // or browsing context?
                return null;
            }
            return node.defaultView;
        } else if ($.isShadowRoot(node)) {
            if (!event.composed) {
                var _$$shadow$path$ = _slicedToArray($.shadow(event).path[0], 1),
                    item = _$$shadow$path$[0];

                if ($.root(item) === node) {
                    return null;
                }
            }
            return node.host;
        }
        return node.assignedSlot || node.parentNode;
    }

    return null;
}

function calculateRelatedTarget(currentTarget, path) {
    for (var i = 0; i < path.length; i++) {
        var _path$i = _slicedToArray(path[i], 3),
            item = _path$i[0],
            relatedTarget = _path$i[2];

        if (item === currentTarget) {
            return relatedTarget;
        }
    }
    return null;
}

function calculateTarget(currentTarget, path) {
    for (var i = 0; i < path.length; i++) {
        var _path$i2 = _slicedToArray(path[i], 1),
            item = _path$i2[0];

        if (item === currentTarget) {
            for (var j = i; j >= 0; j--) {
                var _path$j = _slicedToArray(path[j], 2),
                    target = _path$j[1];

                if (target != null) {
                    return target;
                }
            }
            return null;
        }
    }
    return null;
}

},{"../utils.js":25}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // https://html.spec.whatwg.org/multipage/scripting.html#the-slot-element

var _utils = require('../utils.js');

var $ = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _class = function () {
    function _class() {
        _classCallCheck(this, _class);
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
                return $.shadow(this).assignedNodes || [];
            }

            // 2. Return the result of finding flattened slotables with this element.
            return $.findFlattenedSlotables(this);
        }
    }, {
        key: 'name',


        // TODO: tests
        get: function get() {
            if (this.localName !== 'slot') {
                return;
            }

            return this.getAttribute('name');
        }

        // TODO: tests
        ,
        set: function set(value) {
            if (this.localName !== 'slot') {
                return;
            }

            $.setAttributeValue(this, 'name', value);
        }
    }]);

    return _class;
}();

exports.default = _class;

},{"../utils.js":25}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // https://www.w3.org/TR/html5/single-page.html#the-table-element

var _utils = require('../utils.js');

var $ = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _class = function () {
    function _class() {
        _classCallCheck(this, _class);
    }

    _createClass(_class, [{
        key: 'deleteCaption',


        // TODO: tests
        value: function deleteCaption() {
            var caption = this.caption;
            if (caption) {
                $.remove(caption, this);
            }
        }

        // TODO: tests

    }, {
        key: 'deleteTHead',
        value: function deleteTHead() {
            var tHead = this.tHead;
            if (tHead) {
                $.remove(tHead, this);
            }
        }

        // TODO: tests

    }, {
        key: 'deleteTFoot',
        value: function deleteTFoot() {
            var tFoot = this.tFoot;
            if (tFoot) {
                $.remove(tFoot, this);
            }
        }

        // TODO: tests

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
}();

exports.default = _class;

},{"../utils.js":25}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // https://www.w3.org/TR/html5/single-page.html#the-tr-element

var _utils = require('../utils.js');

var $ = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _class = function () {
    function _class() {
        _classCallCheck(this, _class);
    }

    _createClass(_class, [{
        key: 'deleteCell',


        // TODO: tests
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
}();

exports.default = _class;

},{"../utils.js":25}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // https://www.w3.org/TR/html5/single-page.html#the-tbody-element

var _utils = require('../utils.js');

var $ = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _class = function () {
    function _class() {
        _classCallCheck(this, _class);
    }

    _createClass(_class, [{
        key: 'deleteRow',


        // TODO: tests
        value: function deleteRow(index) {
            // https://www.w3.org/TR/html5/single-page.html#dom-tbody-deleterow
            if (index < 0 || index >= this.rows.length) {
                throw $.makeError('IndexSizeError');
            }
            this.rows[index].remove();
        }
    }]);

    return _class;
}();

exports.default = _class;

},{"../utils.js":25}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // https://dom.spec.whatwg.org/#interface-mutationobserver

var _utils = require('../utils.js');

var $ = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _class = function () {
    function _class(callback) {
        _classCallCheck(this, _class);

        var observer = $.createMutationObserver(callback);
        $.shadow(this).observer = observer;
        observer.interface = this;
    }

    _createClass(_class, [{
        key: 'observe',
        value: function observe(target, options) {
            $.shadow(this).observer.observe(target, options);
        }
    }, {
        key: 'disconnect',
        value: function disconnect() {
            $.shadow(this).observer.disconnect();
        }
    }, {
        key: 'takeRecords',
        value: function takeRecords() {
            var records = $.shadow(this).observer.queue;
            return records.splice(0, records.length);
        }
    }]);

    return _class;
}();

exports.default = _class;

},{"../utils.js":25}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // https://dom.spec.whatwg.org/#interface-namednodemap

var _utils = require('../utils.js');

var $ = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _class = function () {
    function _class() {
        _classCallCheck(this, _class);
    }

    _createClass(_class, [{
        key: 'setNamedItem',


        // todo: tests
        value: function setNamedItem(attr) {
            return $.setAttribute(attr, $.shadow(this).element);
        }

        // todo: tests

    }, {
        key: 'setNamedItemNS',
        value: function setNamedItemNS(attr) {
            return $.setAttribute(attr, $.shadow(this).element);
        }

        // todo: tests

    }, {
        key: 'removeNamedItem',
        value: function removeNamedItem(qualifiedName) {
            var attr = $.removeAttributeByName(qualifiedName, $.shadow(this).element);
            if (!attr) {
                throw $.makeError('NotFoundError');
            }
            return attr;
        }

        // todo: tests

    }, {
        key: 'removeNamedItemNS',
        value: function removeNamedItemNS(namespace, localName) {
            var attr = $.removeAttributeByNamespace(namespace, localName, $.shadow(this).element);
            if (!attr) {
                throw $.makeError('NotFoundError');
            }
            return attr;
        }
    }]);

    return _class;
}();

exports.default = _class;

},{"../utils.js":25}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // https://dom.spec.whatwg.org/#interface-node

var _utils = require('../utils.js');

var $ = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _class = function () {
    function _class() {
        _classCallCheck(this, _class);
    }

    _createClass(_class, [{
        key: 'getRootNode',
        value: function getRootNode(options) {
            var composed = options && options.composed === true;
            return composed ? $.shadowIncludingRoot(this) : $.root(this);
        }
    }, {
        key: 'hasChildNodes',


        // TODO: tests
        value: function hasChildNodes() {
            var childNodes = $.shadow(this).childNodes;
            if (childNodes) {
                return childNodes.length > 0;
            }

            return $.descriptors.Node.hasChildNodes.value.call(this);
        }

        // TODO: tests

    }, {
        key: 'normalize',


        // TODO: tests
        value: function normalize() {
            // https://dom.spec.whatwg.org/#dom-node-normalize
            // The normalize() method, when invoked, must run these steps 
            // for each descendant exclusive Text node node of context object:
            var childNodes = this.childNodes;
            var dataDescriptor = $.descriptors.CharacterData.data;
            for (var i = 0; i < childNodes.length; i++) {
                var childNode = childNodes[i];
                if (childNode.nodeType === Node.TEXT_NODE) {
                    var length = dataDescriptor.get.call(childNode).length;
                    if (length === 0) {
                        $.remove(childNode, this);
                        continue;
                    }
                    var data = '';
                    var contiguousTextNodes = [];
                    var next = childNode;
                    while (next = next.nextSibling && next.nodeType === Node.TEXT_NODE) {
                        data += dataDescriptor.get.call(next);
                        contiguousTextNodes.push(next);
                    }
                    $.replaceData(childNode, length, 0, data);
                    // TODO: (Range)
                    for (var j = 0; j < contiguousTextNodes.length; j++) {
                        $.remove(contiguousTextNodes[j], this);
                    }
                } else {
                    childNode.normalize();
                }
            }
        }

        // TODO: tests

    }, {
        key: 'cloneNode',
        value: function cloneNode(deep) {
            // https://dom.spec.whatwg.org/#dom-node-clonenode
            // The cloneNode(deep) method, when invoked, must run these steps:

            // 1. If context object is a shadow root, then throw a NotSupportedError.
            if ($.isShadowRoot(this)) {
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

            var thisAttributes = void 0;
            var otherAttributes = void 0;

            switch (this.nodeType) {
                case Node.DOCUMENT_TYPE_NODE:
                    if (this.name !== other.name || this.publicId !== other.publicId || this.systemId !== other.systemId) {
                        return false;
                    }
                    break;
                case Node.ELEMENT_NODE:
                    if (this.namespaceURI !== other.namespaceURI || this.prefix !== other.prefix || this.localName !== other.localName) {
                        return false;
                    }
                    thisAttributes = $.descriptors.Element.attributes.get.call(this);
                    otherAttributes = $.descriptors.Element.attributes.get.call(other);
                    if (thisAttributes.length != otherAttributes.length) {
                        return false;
                    }
                    break;
                case Node.ATTRIBUTE_NODE:
                    if (this.namespaceURI !== other.namespaceURI || this.localName !== other.localName || this.value !== other.value) {
                        return false;
                    }
                    break;
                case Node.PROCESSING_INSTRUCTION_NODE:
                    if (this.target !== other.target || this.data !== other.data) {
                        return false;
                    }
                    break;
                case Node.TEXT_NODE:
                case Node.COMMENT_NODE:
                    if (this.data !== other.data) {
                        return false;
                    }
                    break;
            }

            if (this.nodeType == Node.ELEMENT_NODE) {
                for (var i = 0; i < thisAttributes.length; i++) {
                    var attr1 = thisAttributes[i];
                    var attr2 = otherAttributes[attr1.name];
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

            if (!node1 || !node2 || $.root(node1) !== $.root(node2)) {
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

            return $.descriptors.Node.parentNode.get.call(this);
        }
    }, {
        key: 'parentElement',
        get: function get() {
            var parentNode = this.parentNode;
            if (parentNode && parentNode.nodeType === Node.ELEMENT_NODE) {
                return parentNode;
            }

            return null;
        }
    }, {
        key: 'childNodes',
        get: function get() {
            var childNodes = $.shadow(this).childNodes;
            if (childNodes) {
                return childNodes.slice();
            }

            return $.descriptors.Node.childNodes.get.call(this);
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

            return $.descriptors.Node.firstChild.get.call(this);
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

            return $.descriptors.Node.lastChild.get.call(this);
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

            return $.descriptors.Node.previousSibling.get.call(this);
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

            return $.descriptors.Node.nextSibling.get.call(this);
        }

        // TODO: consider creating a raw property descriptor
        // that uses the native get instead of a pass-through function

    }, {
        key: 'nodeValue',
        get: function get() {
            return $.descriptors.Node.nodeValue.get.call(this);
        }

        // TODO: MutationObserver tests
        ,
        set: function set(value) {
            switch (this.nodeType) {
                case Node.ATTRIBUTE_NODE:
                    $.setExistingAttributeValue(this, value);
                    break;
                case Node.TEXT_NODE:
                case Node.PROCESSING_INSTRUCTION_NODE:
                case Node.COMMENT_NODE:
                    var length = $.descriptors.CharacterData.data.get.call(this).length;
                    $.replaceData(this, 0, length, value);
                    break;
            }
        }
    }, {
        key: 'textContent',
        get: function get() {
            switch (this.nodeType) {
                case Node.DOCUMENT_FRAGMENT_NODE:
                case Node.ELEMENT_NODE:
                    return elementTextContent(this);
                case Node.ATTRIBUTE_NODE:
                    return $.descriptors.Attr.value.get.call(this);
                case Node.TEXT_NODE:
                case Node.PROCESSING_INSTRUCTION_NODE:
                case Node.COMMENT_NODE:
                    return $.descriptors.CharacterData.data.get.call(this);
                default:
                    return null;
            }
        }

        // TODO: MutationObserver tests
        ,
        set: function set(value) {
            switch (this.nodeType) {
                case Node.DOCUMENT_FRAGMENT_NODE:
                case Node.ELEMENT_NODE:
                    var node = null;
                    if (value !== '') {
                        node = this.ownerDocument.createTextNode(value);
                    }
                    $.replaceAll(node, this);
                    break;
                case Node.ATTRIBUTE_NODE:
                    $.setExistingAttributeValue(this, value);
                    break;
                case Node.TEXT_NODE:
                case Node.PROCESSING_INSTRUCTION_NODE:
                case Node.COMMENT_NODE:
                    $.replaceData(this, 0, this.data.length, value);
                    break;
            }
        }
    }]);

    return _class;
}();

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

function elementTextContent(element) {
    var result = '';
    var childNodes = element.childNodes;
    for (var i = 0; i < childNodes.length; i++) {
        var childNode = childNodes[i];
        switch (childNode.nodeType) {
            case Node.ELEMENT_NODE:
                result += elementTextContent(childNode);
                break;
            case Node.TEXT_NODE:
                result += $.descriptors.CharacterData.data.get.call(childNode);
                break;
        }
    }
    return result;
}

},{"../utils.js":25}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // https://dom.spec.whatwg.org/#interface-shadowroot
// https://www.w3.org/TR/shadow-dom/#the-shadowroot-interface

var _utils = require('../utils.js');

var $ = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _class = function () {
    function _class() {
        _classCallCheck(this, _class);
    }

    _createClass(_class, [{
        key: 'nodeName',
        get: function get() {
            return '#shadow-root';
        }
    }, {
        key: 'mode',
        get: function get() {
            return $.shadow(this).mode;
        }
    }, {
        key: 'host',
        get: function get() {
            return $.shadow(this).host;
        }

        // TODO: tests

    }, {
        key: 'innerHTML',
        get: function get() {
            return $.serializeHTMLFragment(this);
        }

        // TODO: tests
        ,
        set: function set(value) {
            var fragment = $.parseHTMLFragment(value, this);
            $.replaceAll(fragment, this);
        }
    }]);

    return _class;
}();

exports.default = _class;

},{"../utils.js":25}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // https://dom.spec.whatwg.org/#interface-text

var _utils = require('../utils.js');

var $ = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _class = function () {
    function _class() {
        _classCallCheck(this, _class);
    }

    _createClass(_class, [{
        key: 'splitText',


        // TODO: tests
        value: function splitText(offset) {
            var length = this.length;
            if (offset > length) {
                throw $.makeError('IndexSizeError');
            }
            var count = length - offset;
            var newData = this.data.slice(offset, count);
            var newNode = this.ownerDocument.createTextNode(newData);
            var parent = this.parentNode;
            if (parent) {
                $.insert(newNode, parent, this.nextSibling);
                // TODO: (Range)
            }
            $.replaceData(this, offset, count, '');
            if (!parent) {
                // TODO: (Range)
            }
            return newNode;
        }
    }]);

    return _class;
}();

exports.default = _class;

},{"../utils.js":25}],17:[function(require,module,exports){
'use strict';

var _patch = require('./patch.js');

var _patch2 = _interopRequireDefault(_patch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var nativeShadowDom = 'attachShadow' in Element.prototype;

if (!nativeShadowDom || window.forceShadowDomPolyfill) {
    (0, _patch2.default)();
}

},{"./patch.js":24}],18:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
            value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // https://dom.spec.whatwg.org/#interface-childnode

exports.default = function (base) {

            return function () {
                        function _class() {
                                    _classCallCheck(this, _class);
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
                                                            $.replace(this, node, parent);
                                                }
                                                // 6. Otherwise, pre-insert node into parent before viableNextSibling. 
                                                // Rethrow any exceptions.
                                                else {
                                                                        $.preInsert(node, parent, viableNextSibling);
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
            }();
};

var _utils = require('../utils.js');

var $ = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

},{"../utils.js":25}],19:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // https://dom.spec.whatwg.org/#mixin-documentorshadowroot
// https://www.w3.org/TR/shadow-dom/#extensions-to-the-documentorshadowroot-mixin

var _utils = require('../utils.js');

var $ = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _class = function () {
    function _class() {
        _classCallCheck(this, _class);
    }

    _createClass(_class, [{
        key: 'activeElement',


        // TODO: consider getSelection()
        // TODO: consider elementFromPoint(double x, double y)
        // TODO: consider elementsFromPoint(double x, double y)
        // TODO: consider get styleSheets()

        // TODO: tests
        get: function get() {
            var document = this.ownerDocument || this;
            var nativeActiveElement = native.activeElement.get.call(document);

            if (!nativeActiveElement || document != $.shadowIncludingRoot(this)) {
                return null;
            }

            return $.retarget(nativeActiveElement, this);
        }
    }]);

    return _class;
}();

exports.default = _class;

},{"../utils.js":25}],20:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // https://dom.spec.whatwg.org/#interface-nondocumenttypechildnode

exports.default = function (base) {

    var native = {
        previousElementSibling: $.descriptor(base, 'previousElementSibling'),
        nextElementSibling: $.descriptor(base, 'nextElementSibling')
    };

    return function () {
        function _class() {
            _classCallCheck(this, _class);
        }

        _createClass(_class, [{
            key: 'previousElementSibling',


            // TODO: tests
            get: function get() {
                var parentNode = $.shadow(this).parentNode;

                if (!parentNode) {
                    if (native.previousElementSibling) {
                        return native.previousElementSibling.get(this);
                    }
                    parentNode = this.parentNode;
                }

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

            // TODO: tests

        }, {
            key: 'nextElementSibling',
            get: function get() {
                var parentNode = $.shadow(this).parentNode;

                if (!parentNode) {
                    if (native.nextElementSibling) {
                        return native.nextElementSibling.get(this);
                    }
                    parentNode = this.parentNode;
                }

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
        }]);

        return _class;
    }();
};

var _utils = require('../utils.js');

var $ = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

},{"../utils.js":25}],21:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // https://dom.spec.whatwg.org/#interface-nonelementparentnode

exports.default = function (base) {

    var native = {
        querySelectorAll: $.descriptor(base, 'querySelectorAll')
    };

    return function () {
        function _class() {
            _classCallCheck(this, _class);
        }

        _createClass(_class, [{
            key: 'getElementById',
            value: function getElementById(id) {
                // https://dom.spec.whatwg.org/#dom-nonelementparentnode-getelementbyid

                if (id === '' || /\s/.test(id)) {
                    return null;
                }

                var selector = '#' + serializeIdentifier(id);
                var results = void 0;

                if ($.isShadowRoot(this)) {
                    results = $.descriptors.Element.querySelectorAll.value.call($.shadow(this).host, selector);
                } else {
                    results = native.querySelectorAll.value.call(this, selector);
                }

                if (results.length) {
                    for (var i = 0; i < results.length; i++) {
                        var item = results[i];
                        if ($.root(item) === this) {
                            return item;
                        }
                    }
                }

                return null;
            }
        }]);

        return _class;
    }();
};

var _utils = require('../utils.js');

var $ = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var serializeIdentifier = 'CSS' in window && 'escape' in window.CSS ? window.CSS.escape : function (string) {
    // https://drafts.csswg.org/cssom/#serialize-an-identifier
    var result = '';
    for (var i = 0; i < string.length; i++) {
        var charCode = string.charCodeAt(i);
        if (charCode === 0x0000) {
            result += '\uFFFD';
            continue;
        }
        if (charCode >= 0x0001 && charCode <= 0x001F || charCode === 0x007F || i === 0 && charCode >= 0x0030 && charCode <= 0x00039 || i === 1 && string[0] === '-' && charCode >= 0x0030 && charCode <= 0x00039) {
            result += '\\' + charCode.toString(16) + ' ';
            continue;
        }
        if (i === 0 && charCode === 0x002D && string.length === 1) {
            result += '\\' + string.charAt(i);
            continue;
        }
        if (charCode >= 0x0080 || charCode === 0x002D || charCode === 0x005F || charCode >= 0x0030 && charCode <= 0x0039 || charCode >= 0x0041 && charCode <= 0x005A || charCode >= 0x0061 && charCode <= 0x007A) {
            result += string.charAt(i);
            continue;
        }
        result += '\\' + string.charAt(i);
        continue;
    }
    return result;
};

},{"../utils.js":25}],22:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // https://dom.spec.whatwg.org/#interface-parentnode

exports.default = function (base) {

    var native = {
        children: $.descriptor(base, 'children'),
        firstElementChild: $.descriptor(base, 'firstElementChild'),
        lastElementChild: $.descriptor(base, 'lastElementChild'),
        childElementCount: $.descriptor(base, 'childElementCount')
    };

    return function () {
        function _class() {
            _classCallCheck(this, _class);
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
                var node = $.convertNodesIntoANode(nodes, this.ownerDocument || this);

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
                var node = $.convertNodesIntoANode(nodes, this.ownerDocument || this);

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
            get: function get() {
                var childNodes = $.shadow(this).childNodes;

                if (!childNodes) {
                    if (native.children) {
                        return native.children.get.call(this);
                    }
                    childNodes = this.childNodes;
                }

                var elements = [];

                for (var i = 0; i < childNodes.length; i++) {
                    var node = childNodes[i];
                    if (node.nodeType == Node.ELEMENT_NODE) {
                        elements.push(node);
                    }
                }

                return elements;
            }
        }, {
            key: 'firstElementChild',
            get: function get() {
                var childNodes = $.shadow(this).childNodes;

                if (!childNodes) {
                    if (native.firstElementChild) {
                        return native.firstElementChild.get.call(this);
                    }
                    childNodes = this.childNodes;
                }

                for (var i = 0; i < childNodes.length; i++) {
                    var node = childNodes[i];
                    if (node.nodeType == Node.ELEMENT_NODE) {
                        return node;
                    }
                }

                return null;
            }
        }, {
            key: 'lastElementChild',
            get: function get() {
                var childNodes = $.shadow(this).childNodes;

                if (!childNodes) {
                    if (native.lastElementChild) {
                        return native.lastElementChild.get.call(this);
                    }
                    childNodes = this.childNodes;
                }

                for (var i = childNodes.length - 1; i >= 0; i--) {
                    var node = childNodes[i];
                    if (node.nodeType == Node.ELEMENT_NODE) {
                        return node;
                    }
                }

                return null;
            }
        }, {
            key: 'childElementCount',
            get: function get() {
                var childNodes = $.shadow(this).childNodes;

                if (!childNodes) {
                    if (native.childElementCount) {
                        return native.childElementCount.get.call(this);
                    }
                    childNodes = this.childNodes;
                }

                var count = 0;

                for (var i = 0; i < childNodes.length; i++) {
                    var node = childNodes[i];
                    if (node.nodeType == Node.ELEMENT_NODE) {
                        count++;
                    }
                }

                return count;
            }
        }]);

        return _class;
    }();
};

var _utils = require('../utils.js');

var $ = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

},{"../utils.js":25}],23:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // https://dom.spec.whatwg.org/#mixin-slotable

exports.default = function (base) {

    return function () {
        function _class() {
            _classCallCheck(this, _class);
        }

        _createClass(_class, [{
            key: 'assignedSlot',
            get: function get() {
                // spec implementation is:
                // return $.findASlot(this, true);
                // this uses an alternative (see https://github.com/whatwg/dom/issues/369)
                var slot = $.shadow(this).assignedSlot;
                if (slot && $.closedShadowHidden(slot, this)) {
                    slot = null;
                }
                return slot;
            }
        }]);

        return _class;
    }();
};

var _utils = require('../utils.js');

var $ = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

},{"../utils.js":25}],24:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {

    // Element.matches(selectors) polyfill from MDN
    // https://developer.mozilla.org/en-US/docs/Web/API/Element/matches#Polyfill
    // Purposefully chop out the polyfill function that uses querySelectorAll.
    if (!Element.prototype.matches) {
        Element.prototype.matches = Element.prototype.matchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.msMatchesSelector || Element.prototype.oMatchesSelector || Element.prototype.webkitMatchesSelector;
    }

    // Attr interface
    $.extend(Attr, _Attr2.default);

    // CharacterData interface
    $.extend(CharacterData, _CharacterData2.default);

    // CustomEvent interface
    $.extend(CustomEvent, _CustomEvent2.default);
    _CustomEvent2.default.prototype = CustomEvent.prototype;
    window.CustomEvent = _CustomEvent2.default;

    // Document interface
    $.extend(Document, _Document2.default);

    // TODO: implement DOMTokenList

    // Element interface
    $.extend(Element, _Element2.default);

    // Event interface
    $.extend(Event, _Event2.default);
    $.extend(FocusEvent, _Event.hasRelatedTarget);
    $.extend(MouseEvent, _Event.hasRelatedTarget);
    _Event2.default.prototype = Event.prototype;
    window.Event = _Event2.default;

    // EventTarget
    if ('EventTarget' in Window) {
        $.extend(EventTarget, (0, _EventTarget2.default)(EventTarget));
    } else {
        // In IE, EventTarget is not exposed and Window's
        // EventTarget methods are not the same as Node's.
        $.extend(Window, (0, _EventTarget2.default)(Window));
        $.extend(Node, (0, _EventTarget2.default)(Node));
    }

    // HTMLSlotElement interface
    $.extend('HTMLSlotElement' in window ? HTMLSlotElement : HTMLUnknownElement, _HTMLSlotElement2.default);

    // HTMLTableElement interface
    $.extend(HTMLTableElement, _HTMLTableElement2.default);

    // HTMLTableRowElement interface
    $.extend(HTMLTableRowElement, _HTMLTableRowElement2.default);

    // HTMLTableSectionElement interface
    $.extend(HTMLTableSectionElement, _HTMLTableSectionElement2.default);

    // MutationObserver interface
    window.MutationObserver = _MutationObserver2.default;

    // NamedNodeMap interface
    $.extend(NamedNodeMap, _NamedNodeMap2.default);

    // Node interface
    $.extend(Node, _Node2.default);

    // TODO: implement Range interface

    // Text interface
    $.extend(Text, _Text2.default);

    // ChildNode mixin
    $.extend(DocumentType, (0, _ChildNode2.default)(DocumentType));
    $.extend(Element, (0, _ChildNode2.default)(Element));
    $.extend(CharacterData, (0, _ChildNode2.default)(CharacterData));

    // DocumentOrShadowRoot mixin
    $.extend(Document, _DocumentOrShadowRoot2.default);
    $.extend(_ShadowRoot2.default, _DocumentOrShadowRoot2.default);

    // NonDocumentTypeChildNode mixin
    $.extend(Element, (0, _NonDocumentTypeChildNode2.default)(Element));
    $.extend(CharacterData, (0, _NonDocumentTypeChildNode2.default)(CharacterData));

    // NonElementParentNode mixin
    $.extend(Document, (0, _NonElementParentNode2.default)(Document));
    $.extend(DocumentFragment, (0, _NonElementParentNode2.default)(DocumentFragment));

    // ParentNode mixin
    $.extend(Document, (0, _ParentNode2.default)(Document));
    $.extend(DocumentFragment, (0, _ParentNode2.default)(DocumentFragment));
    $.extend(Element, (0, _ParentNode2.default)(Element));

    // Slotable mixin
    $.extend(Element, (0, _Slotable2.default)(Element));
    $.extend(Text, (0, _Slotable2.default)(Text));

    // Cleanup for IE, Edge
    delete Node.prototype.attributes;
    delete HTMLElement.prototype.children;
    delete HTMLElement.prototype.parentElement;
    delete HTMLElement.prototype.innerHTML;
    delete HTMLElement.prototype.outerHTML;
    delete HTMLElement.prototype.insertAdjacentText;
    delete HTMLElement.prototype.insertAdjacentElement;
    delete HTMLElement.prototype.insertAdjacentHTML;
};

var _utils = require('./utils.js');

var $ = _interopRequireWildcard(_utils);

var _Attr = require('./interfaces/Attr.js');

var _Attr2 = _interopRequireDefault(_Attr);

var _CharacterData = require('./interfaces/CharacterData.js');

var _CharacterData2 = _interopRequireDefault(_CharacterData);

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

var _HTMLTableRowElement = require('./interfaces/HTMLTableRowElement.js');

var _HTMLTableRowElement2 = _interopRequireDefault(_HTMLTableRowElement);

var _HTMLTableSectionElement = require('./interfaces/HTMLTableSectionElement.js');

var _HTMLTableSectionElement2 = _interopRequireDefault(_HTMLTableSectionElement);

var _MutationObserver = require('./interfaces/MutationObserver.js');

var _MutationObserver2 = _interopRequireDefault(_MutationObserver);

var _NamedNodeMap = require('./interfaces/NamedNodeMap.js');

var _NamedNodeMap2 = _interopRequireDefault(_NamedNodeMap);

var _Node = require('./interfaces/Node.js');

var _Node2 = _interopRequireDefault(_Node);

var _ShadowRoot = require('./interfaces/ShadowRoot.js');

var _ShadowRoot2 = _interopRequireDefault(_ShadowRoot);

var _Text = require('./interfaces/Text.js');

var _Text2 = _interopRequireDefault(_Text);

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

},{"./interfaces/Attr.js":1,"./interfaces/CharacterData.js":2,"./interfaces/CustomEvent.js":3,"./interfaces/Document.js":4,"./interfaces/Element.js":5,"./interfaces/Event.js":6,"./interfaces/EventTarget.js":7,"./interfaces/HTMLSlotElement.js":8,"./interfaces/HTMLTableElement.js":9,"./interfaces/HTMLTableRowElement.js":10,"./interfaces/HTMLTableSectionElement.js":11,"./interfaces/MutationObserver.js":12,"./interfaces/NamedNodeMap.js":13,"./interfaces/Node.js":14,"./interfaces/ShadowRoot.js":15,"./interfaces/Text.js":16,"./mixins/ChildNode.js":18,"./mixins/DocumentOrShadowRoot.js":19,"./mixins/NonDocumentTypeChildNode.js":20,"./mixins/NonElementParentNode.js":21,"./mixins/ParentNode.js":22,"./mixins/Slotable.js":23,"./utils.js":25}],25:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.makeError = makeError;
exports.reportError = reportError;
exports.extend = extend;
exports.shadow = shadow;
exports.filterByRoot = filterByRoot;
exports.isShadowRoot = isShadowRoot;
exports.isValidCustomElementName = isValidCustomElementName;
exports.parseHTMLFragment = parseHTMLFragment;
exports.serializeHTMLFragment = serializeHTMLFragment;
exports.root = root;
exports.descendant = descendant;
exports.inclusiveDescendant = inclusiveDescendant;
exports.ancestor = ancestor;
exports.inclusiveAncestor = inclusiveAncestor;
exports.convertNodesIntoANode = convertNodesIntoANode;
exports.clone = clone;
exports.adopt = adopt;
exports.hostIncludingInclusiveAncestor = hostIncludingInclusiveAncestor;
exports.shadowIncludingRoot = shadowIncludingRoot;
exports.shadowIncludingDescendant = shadowIncludingDescendant;
exports.shadowIncludingInclusiveDescendant = shadowIncludingInclusiveDescendant;
exports.shadowIncludingAncestor = shadowIncludingAncestor;
exports.shadowIncludingInclusiveAncestor = shadowIncludingInclusiveAncestor;
exports.closedShadowHidden = closedShadowHidden;
exports.retarget = retarget;
exports.changeAttribute = changeAttribute;
exports.appendAttribute = appendAttribute;
exports.removeAttribute = removeAttribute;
exports.replaceAttribute = replaceAttribute;
exports.setAttribute = setAttribute;
exports.setAttributeValue = setAttributeValue;
exports.removeAttributeByName = removeAttributeByName;
exports.removeAttributeByNamespace = removeAttributeByNamespace;
exports.insertAdjacent = insertAdjacent;
exports.setExistingAttributeValue = setExistingAttributeValue;
exports.replaceData = replaceData;
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
exports.createMutationObserver = createMutationObserver;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var slice = exports.slice = function slice(array) {
    return Array.prototype.slice.call(array);
};

var descriptor = exports.descriptor = function descriptor(type, name) {
    return Object.getOwnPropertyDescriptor(type.prototype, name);
};

var descriptors = exports.descriptors = {
    Attr: {
        value: descriptor(Attr, 'value')
    },
    CharacterData: {
        data: descriptor(CharacterData, 'data')
    },
    Document: {
        activeElement: descriptor(Document, 'activeElement'),
        getElementsByTagName: descriptor(Document, 'getElementsByTagName'),
        getElementsByTagNameNS: descriptor(Document, 'getElementsByTagNameNS'),
        getElementsByClassName: descriptor(Document, 'getElementsByClassName')
    },
    Element: {
        attributes: descriptor(Element, 'attributes') || descriptor(Node, 'attributes'),
        getElementsByTagName: descriptor(Element, 'getElementsByTagName'),
        getElementsByTagNameNS: descriptor(Element, 'getElementsByTagNameNS'),
        getElementsByClassName: descriptor(Element, 'getElementsByClassName'),
        innerHTML: descriptor(Element, 'innerHTML') || descriptor(HTMLElement, 'innerHTML'),
        querySelectorAll: descriptor(Element, 'querySelectorAll'),
        setAttribute: descriptor(Element, 'setAttribute'),
        setAttributeNodeNS: descriptor(Element, 'setAttributeNodeNS'),
        removeAttributeNode: descriptor(Element, 'removeAttributeNode')
    },
    Event: {
        currentTarget: descriptor(Event, 'currentTarget'),
        target: descriptor(Event, 'target')
    },
    FocusEvent: {
        relatedTarget: descriptor(FocusEvent, 'relatedTarget')
    },
    MouseEvent: {
        relatedTarget: descriptor(MouseEvent, 'relatedTarget')
    },
    Node: {
        parentNode: descriptor(Node, 'parentNode'),
        hasChildNodes: descriptor(Node, 'hasChildNodes'),
        childNodes: descriptor(Node, 'childNodes'),
        firstChild: descriptor(Node, 'firstChild'),
        lastChild: descriptor(Node, 'lastChild'),
        previousSibling: descriptor(Node, 'previousSibling'),
        nextSibling: descriptor(Node, 'nextSibling'),
        nodeValue: descriptor(Node, 'nodeValue'),
        textContent: descriptor(Node, 'textContent'),
        cloneNode: descriptor(Node, 'cloneNode'),
        insertBefore: descriptor(Node, 'insertBefore'),
        removeChild: descriptor(Node, 'removeChild'),
        appendChild: descriptor(Node, 'appendChild')
    }
};

// TODO: add a note about importing YuzuJS/setImmediate before 
// this polyfill if better performance is desired.
var setImmediate = exports.setImmediate = 'setImmediate' in window ? window.setImmediate : function (callback) {
    return setTimeout(callback, 0);
};

// TODO: analyze usages and provide brief but descriptive messages
function makeError(name, message) {
    var error = new Error(message || name);
    error.name = name;
    return error;
}

function reportError(error) {
    if ('console' in window && 'error' in window.console) {
        window.console.error(error);
    }
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
            var _descriptor = Object.getOwnPropertyDescriptor(mixin, name);
            Object.defineProperty(object.prototype || object, name, _descriptor);
        }
    }
}

function shadow(object) {
    var shadow = object._shadow || {};
    return object._shadow = shadow;
}

function filterByRoot(node, descendants) {
    var contextRoot = root(node);
    var filtered = [];

    for (var i = 0; i < descendants.length; i++) {
        var item = descendants[i];
        if (root(item) === contextRoot) {
            filtered.push(item);
        }
    }

    return filtered;
}

function isShadowRoot(node) {
    return node.nodeName === '#shadow-root';
}

// https://html.spec.whatwg.org/multipage/scripting.html#valid-custom-element-name

function isValidCustomElementName(localName) {
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
    // TODO: Consider adding 'full' support (for Unicode)
    var regex = /[a-z](-|\.|[0-9]|_|[a-z])+-(-|\.|[0-9]|_|[a-z])+/g;

    return regex.test(localName);
}

// https://www.w3.org/TR/DOM-Parsing/

function parseHTMLFragment(markup, context) {
    var temp = context.ownerDocument.createElement('div');
    descriptors.Element.innerHTML.set.call(temp, markup);
    var childNodes = descriptors.Node.childNodes.get.call(temp);
    var fragment = context.ownerDocument.createDocumentFragment();
    var getFirstChild = descriptors.Node.firstChild.get;
    var appendChild = descriptors.Node.appendChild.value;
    var firstChild = void 0;
    while (firstChild = getFirstChild.call(temp)) {
        appendChild.call(fragment, firstChild);
    }
    return fragment;
}

function serializeHTMLFragment(node) {
    // https://www.w3.org/TR/html5/single-page.html#html-fragment-serialization-algorithm

    // 1. Let s be a string, and initialize it to the empty string.
    var s = '';

    // 2. If the node is a template element, then let the node instead be the 
    // template element's template contents (a DocumentFragment node).
    if (node.localName === 'template') {
        var content = node.content;
        if (content) {
            node = content;
        }
    }

    // 3. For each child node of the node, in tree order, run the following steps:
    var childNodes = node.childNodes;
    for (var i = 0; i < childNodes.length; i++) {
        // 1. Let current node be the child node being processed.
        var currentNode = childNodes[i];
        // 2. Append the appropriate string from the following list to s:
        switch (currentNode.nodeType) {
            case Node.ELEMENT_NODE:
                var tagName = void 0;
                switch (currentNode.namespaceURI) {
                    case 'http://www.w3.org/1999/xhtml':
                    case 'http://www.w3.org/1998/Math/MathML':
                    case 'http://www.w3.org/2000/svg':
                        tagName = currentNode.localName;
                        break;
                    default:
                        tagName = currentNode.qualifiedName;
                        break;
                }
                s += '<' + tagName;
                var attributes = descriptors.Element.attributes.get.call(currentNode);
                for (var j = 0; j < attributes.length; j++) {
                    var _attribute = attributes[j];
                    s += ' ' + serializeAttributeName(_attribute);
                    s += '="' + escapeString(_attribute.value) + '"';
                }
                s += '>';
                switch (currentNode.localName) {
                    case 'area':case 'base':case 'basefont':case 'bgsound':
                    case 'br':case 'col':case 'embed':case 'frame':case 'hr':
                    case 'img':case 'input':case 'keygen':case 'link':case 'meta':
                    case 'param':case 'source':case 'track':case 'wbr':
                        continue;
                    case 'pre':case 'textarea':case 'listing':
                        var firstChild = currentNode.firstChild;
                        if (firstChild && firstChild.nodeType === Node.TEXT_NODE && firstChild.data[0] === '\n') {
                            s += '\n';
                        }
                        break;
                }
                s += serializeHTMLFragment(currentNode);
                s += '</' + tagName + '>';
                break;
            case Node.TEXT_NODE:
                switch (currentNode.parentNode.localName) {
                    case 'style':case 'script':case 'xmp':case 'iframe':
                    case 'noembed':case 'noframes':case 'plaintext':case 'noscript':
                        s += currentNode.data;
                        break;
                    default:
                        s += escapeString(currentNode.data);
                        break;
                }
                break;
            case Node.COMMENT_NODE:
                s += '<!--' + currentNode.data + '-->';
                break;
            case Node.PROCESSING_INSTRUCTION_NODE:
                s += '<?' + currentNode.target + ' ' + currentNode.data + '>';
                break;
            case Node.DOCUMENT_TYPE_NODE:
                s += '<!DOCTYPE ' + currentNode.name + '>';
                break;
        }
    }

    // 4. The result of the algorithm is the string s.
    return s;

    function escapeString(string, attributeMode) {
        if (!string || !string.length) {
            return '';
        }

        string = string.replace('&', '&amp;');
        string = string.replace('\xA0', '&nbsp;');

        if (attributeMode) {
            string = string.replace('"', '&quot;');
        } else {
            string = string.replace('<', '&lt;');
            string = string.replace('>', '&gt;');
        }

        return string;
    }

    function serializeAttributeName(attribute) {
        var namespaceURI = attribute.namespaceURI;
        var localName = attribute.localName;
        if (!namespaceURI) {
            return localName;
        }
        switch (namespaceURI) {
            case 'http://www.w3.org/XML/1998/namespace':
                return 'xml:' + localName;
            case 'http://www.w3.org/2000/xmlns/':
                if (localName === 'xmlns') {
                    return localName;
                }
                return 'xmlns:' + localName;
            case 'http://www.w3.org/1999/xlink':
                return 'xlink:' + localName;
            default:
                return attribute.name;
        }
    }
}

// https://dom.spec.whatwg.org/#trees

function root(node) {
    var root = node;
    var parent = root.parentNode;

    while (parent != null) {
        root = parent;
        parent = root.parentNode;
    }

    return root;
}

function descendant(nodeA, nodeB) {
    var parent = nodeA.parentNode;

    while (parent != null) {
        if (nodeB === parent) {
            return true;
        }
        parent = parent.parentNode;
    }

    return false;
}

function inclusiveDescendant(nodeA, nodeB) {
    return nodeA === nodeB || descendant(nodeA, nodeB);
}

function ancestor(nodeA, nodeB) {
    var parent = nodeB.parentNode;

    while (parent != null) {
        if (nodeA === parent) {
            return true;
        }
        parent = parent.parentNode;
    }

    return false;
}

function inclusiveAncestor(nodeA, nodeB) {
    return nodeA === nodeB || ancestor(nodeA, nodeB);
}

// https://dom.spec.whatwg.org/#interface-parentnode

function convertNodesIntoANode(nodes, document) {
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

// https://dom.spec.whatwg.org/#interface-node

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
    var copy = descriptors.Node.cloneNode.value.call(node, false);

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
    if (parent != null) {
        remove(node, parent);
    }

    // Skip (CustomElements, native)
    // 3. If document is not the same as oldDocument, run these substeps:
}

// https://dom.spec.whatwg.org/#interface-documentfragment

function hostIncludingInclusiveAncestor(nodeA, nodeB) {
    if (inclusiveAncestor(nodeA, nodeB)) {
        return true;
    }

    var host = root(nodeB).host;

    if (host && hostIncludingInclusiveAncestor(nodeA, host)) {
        return true;
    }

    return false;
}

// https://dom.spec.whatwg.org/#interface-shadowroot

function shadowIncludingRoot(node) {
    var rootNode = root(node);
    if (isShadowRoot(rootNode)) {
        rootNode = shadowIncludingRoot(rootNode.host);
    }
    return rootNode;
}

function shadowIncludingDescendant(nodeA, nodeB) {
    do {
        if (isShadowRoot(nodeA)) {
            nodeA = nodeA.host;
        } else {
            nodeA = nodeA.parentNode;
        }
        if (nodeA === nodeB) {
            return true;
        }
    } while (nodeA != null);

    return false;
}

function shadowIncludingInclusiveDescendant(nodeA, nodeB) {
    return nodeA === nodeB || shadowIncludingDescendant(nodeA, nodeB);
}

function shadowIncludingAncestor(nodeA, nodeB) {
    return shadowIncludingDescendant(nodeB, nodeA);
}

function shadowIncludingInclusiveAncestor(nodeA, nodeB) {
    return nodeA === nodeB || shadowIncludingAncestor(nodeA, nodeB);
}

function closedShadowHidden(nodeA, nodeB) {
    // https://dom.spec.whatwg.org/#concept-closed-shadow-hidden
    var rootNode = root(nodeA);

    if (!isShadowRoot(rootNode)) {
        return false;
    }

    if (shadowIncludingInclusiveAncestor(rootNode, nodeB)) {
        return false;
    }

    if (rootNode.mode === 'closed' || closedShadowHidden(rootNode.host, nodeB)) {
        return true;
    }

    return false;
}

function retarget(nodeA, nodeB) {
    // https://dom.spec.whatwg.org/#retarget
    // To retarget an object A against an object B, repeat these steps 
    // until they return an object:

    var rootNode = void 0;
    while (rootNode = root(nodeA)) {
        // 1. If A’s root is not a shadow root, or A’s root is a shadow-including 
        // inclusive ancestor of B, then return A.
        if (!isShadowRoot(rootNode) || shadowIncludingInclusiveAncestor(rootNode, nodeB)) {
            return nodeA;
        }
        // 2. Set A to A’s root’s host.
        nodeA = rootNode.host;
    }
}

// https://dom.spec.whatwg.org/#interface-element

function updateSlotName(element, localName, oldValue, value, namespace) {
    // https://dom.spec.whatwg.org/#slot-name
    if (element.localName === 'slot') {
        if (localName === 'name' && namespace == null) {
            if (value === oldValue) {
                return;
            }
            if (value == null && oldValue === '') {
                return;
            }
            if (value === '' && oldValue == null) {
                return;
            }
            if (value == null || value === '') {
                descriptors.Element.setAttribute.value.call(element, 'name', '');
            } else {
                descriptors.Element.setAttribute.value.call(element, 'name', value);
            }
            assignSlotablesForATree(element);
        }
    }
}

function updateSlotableName(element, localName, oldValue, value, namespace) {
    // https://dom.spec.whatwg.org/#slotable-name
    if (localName === 'slot' && namespace == null) {
        if (value === oldValue) {
            return;
        }
        if (value == null && oldValue === '') {
            return;
        }
        if (value === '' && oldValue == null) {
            return;
        }
        if (value == null || value === '') {
            descriptors.Element.setAttribute.value.call(element, 'slot', '');
        } else {
            descriptors.Element.setAttribute.value.call(element, 'slot', value);
        }
        var assignedSlot = shadow(element).assignedSlot;
        if (assignedSlot) {
            assignSlotables(assignedSlot);
        }
        assignASlot(element);
    }
}

function attributeChangeSteps(element, localName, oldValue, value, namespace) {
    updateSlotName(element, localName, oldValue, value, namespace);
    updateSlotableName(element, localName, oldValue, value, namespace);
}

function changeAttribute(attribute, element, value) {
    // https://dom.spec.whatwg.org/#concept-element-attributes-change

    var name = attribute.localName;
    var namespace = attribute.namespaceURI;
    var oldValue = descriptors.Attr.value.get.call(attribute);

    // 1. Queue a mutation record...
    queueMutationRecord('attributes', element, { name: name, namespace: namespace, oldValue: oldValue });

    // Skip (CustomElements)
    // 2. If element is custom...

    // 3. Run the attribute change steps...
    attributeChangeSteps(element, name, oldValue, value, namespace);

    // 4. Set attribute's value...
    descriptors.Attr.value.set.call(attribute, value);
}

function appendAttribute(attribute, element) {
    // https://dom.spec.whatwg.org/#concept-element-attributes-append

    var name = attribute.localName;
    var namespace = attribute.namespaceURI;
    var oldValue = null;

    // 1. Queue a mutation record...
    queueMutationRecord('attributes', element, { name: name, namespace: namespace, oldValue: oldValue });

    // Skip (CustomElements)
    // 2. If element is custom...

    // 3. Run the attribute change steps...
    attributeChangeSteps(element, name, oldValue, attribute.value, namespace);

    // 4. Append the attribute to the element’s attribute list.
    descriptors.Element.setAttributeNodeNS.value.call(element, attribute);

    // Skip (native)
    // 5. Set attribute’s element to element.
}

function removeAttribute(attribute, element) {
    // https://dom.spec.whatwg.org/#concept-element-attributes-remove

    var name = attribute.localName;
    var namespace = attribute.namespaceURI;
    var oldValue = descriptors.Attr.value.get.call(attribute);

    // 1. Queue a mutation record...
    queueMutationRecord('attributes', element, { name: name, namespace: namespace, oldValue: oldValue });

    // Skip (CustomElements)
    // 2. If element is custom...

    // 3. Run the attribute change steps...
    attributeChangeSteps(element, name, oldValue, value, namespace);

    // 4. Remove attribute from the element’s attribute list.
    descriptors.Element.removeAttributeNode.value.call(element, attribute);

    // Skip (native)
    // 5. Set attribute’s element to null.
}

function replaceAttribute(oldAttr, newAttr, element) {
    // Used by 'set an attribute'
    // https://dom.spec.whatwg.org/#concept-element-attributes-replace

    var name = attribute.localName;
    var namespace = attribute.namespaceURI;
    var oldValue = descriptors.Attr.value.get.call(attribute);

    // 1. Queue a mutation record...
    queueMutationRecord('attributes', element, { name: name, namespace: namespace, oldValue: oldValue });

    // Skip (CustomElements)
    // 2. If element is custom...

    // 3. Run the attribute change steps...
    attributeChangeSteps(element, name, oldValue, value, namespace);

    // 4. Replace oldAttr by newAttr in the element’s attribute list.
    descriptors.Element.setAttributeNodeNS.value.call(element, newAttr);

    // Skip (native)
    // 5. Set oldAttr’s element to null.
    // 6. Set newAttr’s element to element.
}

function setAttribute(attr, element) {
    if (attr.ownerElement != null || attr.ownerElement !== element) {
        throw makeError('InUseAttributeError');
    }
    var attributes = descriptors.Element.attributes.get.call(element);
    var oldAttr = attributes.getNamedItemNS(attr.namespaceURI, attr.localName);
    if (oldAttr === attr) {
        return attr;
    }
    if (oldAttr) {
        replaceAttribute(oldAttr, attr, element);
    } else {
        appendAttribute(attr, element);
    }
    return oldAttr;
}

function setAttributeValue(element, localName, value, prefix, ns) {
    prefix = prefix || null;
    ns = ns || null;
    var attributes = descriptors.Element.attributes.get.call(element);
    var attribute = attributes.getNamedItemNS(ns, localName);
    if (!attribute) {
        attribute = element.ownerDocument.createAttributeNS(ns, localName);
        descriptors.Attr.value.set.call(attribute, value);
        appendAttribute(attribute, element);
        return;
    }
    changeAttribute(attribute, element, value);
}

function removeAttributeByName(qualifiedName, element) {
    var attributes = descriptors.Element.attributes.get.call(element);
    var attr = attributes.getNamedItem(qualifiedName);
    if (attr) {
        removeAttribute(attr, element);
    }
    return attr;
}

function removeAttributeByNamespace(namespace, localName, element) {
    var attributes = descriptors.Element.attributes.get.call(element);
    var attr = attributes.getNamedItemNS(namespace, localName);
    if (attr) {
        removeAttribute(attr, element);
    }
    return attr;
}

function insertAdjacent(element, where, node) {
    if (!(node instanceof Node)) {
        throw makeError('TypeError');
    }
    var parent = void 0;
    // https://dom.spec.whatwg.org/#insert-adjacent
    switch ((where || '').toLowerCase()) {
        case "beforebegin":
            if (parent = element.parentNode) {
                return preInsert(node, parent, element);
            }
            return null;
        case "afterbegin":
            return preInsert(node, element, element.firstChild);
        case "beforeend":
            return preInsert(node, element, null);
        case "afterend":
            if (parent = element.parentNode) {
                return preInsert(node, parent, element.nextSibling);
            }
            return null;
        default:
            throw makeError('SyntaxError');
    }
}

// https://dom.spec.whatwg.org/#attr

function setExistingAttributeValue(attribute, value) {
    if (attribute.ownerElement == null) {
        descriptors.Attr.value.set.call(attribute, value);
    } else {
        changeAttribute(attribute, attribute.ownerElement, value);
    }
}

// https://dom.spec.whatwg.org/#interface-characterdata

function replaceData(node, offset, count, data) {
    // https://dom.spec.whatwg.org/#concept-cd-replace
    if (data == null) {
        data = '';
    }
    var dataDescriptor = descriptors.CharacterData.data;
    var oldValue = dataDescriptor.get.call(node);
    var length = oldValue.length;
    if (offset > length) {
        throw makeError('IndexSizeError');
    }
    if (offset + count > length) {
        count = length - offset;
    }
    queueMutationRecord('characterData', node, { oldValue: oldValue });
    dataDescriptor.set.call(node, oldValue.slice(0, offset) + data + oldValue.slice(offset + count));
    // TODO: (Range)
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
    var shadowRoot = shadow(parent).shadowRoot;

    // 3. If shadow is null, then return null.
    if (!shadowRoot) {
        return null;
    }

    // 4. If the open flag is set and shadow’s mode is not "open", then return null.
    if (open === true && shadowRoot.mode !== 'open') {
        return null;
    }

    // 5. Return the first slot in shadow’s tree whose name is slotable’s name, if any, and null otherwise.
    if (!shadowRoot.firstChild) {
        return null;
    }

    var name = slotable instanceof Element ? slotable.slot : null;
    var stack = [{ node: shadowRoot.firstChild, recursed: false }];

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
    var slotRoot = root(slot);
    if (!isShadowRoot(slotRoot)) {
        return result;
    }

    // 3. Let host be slot’s root’s host.
    var host = slotRoot.host;

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
    var identical = true;
    var slotState = shadow(slot);
    var assignedNodes = slotState.assignedNodes || [];
    for (var i = 0; i < slotables.length; i++) {
        if (slotables[i] !== assignedNodes[i]) {
            identical = false;
            break;
        }
    }
    if (!suppressSignaling && !identical) {
        signalASlotChange(slot);
    }

    // 3. Set slot’s assigned nodes to slotables.
    slotState.assignedNodes = slotables;

    // 4. For each slotable in slotables, set slotable’s assigned slot to slot.
    for (var _i3 = 0; _i3 < slotables.length; _i3++) {
        var slotable = slotables[_i3];
        shadow(slotable).assignedSlot = slot;
    }

    !identical && setImmediate(function () {
        // 4a. If we haven't tracked them yet, track the slot's logical children
        if (!slotState.childNodes) {
            var childNodes = descriptors.Node.childNodes.get.call(slot);
            slotState.childNodes = slice(childNodes);
        }

        // 4b. Clean out the slot
        var firstChild = void 0;
        while (firstChild = descriptors.Node.firstChild.get.call(slot)) {
            descriptors.Node.removeChild.value.call(slot, firstChild);
        }

        // 4c. Append the slotables, if any
        for (var _i4 = 0; _i4 < slotables.length; _i4++) {
            var _slotable = slotables[_i4];
            slotState.assignedSlot = slot;
            // if we break out the physical portion to go async, we still
            // need to set the assignedSlot property sync
            descriptors.Node.appendChild.value.call(slot, _slotable);
        }

        // 4d. Append the fallback content, if no slots
        if (!slotables.length) {
            var _childNodes = slotState.childNodes;
            for (var _i5 = 0; _i5 < _childNodes.length; _i5++) {
                descriptors.Node.appendChild.value.call(slot, _childNodes[_i5]);
            }
        }
    });
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
        var suppressSignaling = noSignalSlots && noSignalSlots.indexOf(slot) !== -1;

        // 2. Run assign slotables for slot with suppress signaling flag.
        assignSlotables(slot, suppressSignaling);
    }
}

function assignASlot(slotable) {
    var slot = findASlot(slotable);

    if (slot != null) {
        assignSlotables(slot);
    }
}

// https://dom.spec.whatwg.org/#signaling-slot-change

function signalASlotChange(slot) {
    // https://dom.spec.whatwg.org/#signal-a-slot-change
    // To signal a slot change, for a slot slot, run these steps:

    // 1. If slot is not in unit of related similar-origin browsing contexts' 
    // signal slot list, append slot to unit of related similar-origin browsing 
    // contexts' signal slot list.
    if (signalSlotList.indexOf(slot) === -1) {
        signalSlotList.push(slot);
    }

    // 2. Queue a mutation observer compound microtask.
    queueMutationObserverCompoundMicrotask();
}

// https://dom.spec.whatwg.org/#mutation-algorithms

function ensurePreInsertionValidity(node, parent, child) {
    // https://dom.spec.whatwg.org/#concept-node-ensure-pre-insertion-validity
    // To ensure pre-insertion validity of a node into a parent before a child, run these steps:

    // Skip (native)
    // 1. If parent is not a Document, DocumentFragment, or Element node, throw a HierarchyRequestError.

    // 2. If node is a host-including inclusive ancestor of parent, throw a HierarchyRequestError.
    if (hostIncludingInclusiveAncestor(node, parent)) {
        throw makeError('HierarchyRequestError');
    }

    // 3. If child is not null and its parent is not parent, then throw a NotFoundError.
    if (child != null && child.parentNode !== parent) {
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
    var nodes = void 0;

    // 4. If node is a DocumentFragment node, remove its children with the suppress observers flag set.
    if (node.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
        nodes = slice(node.childNodes);
        for (var i = 0; i < nodes.length; i++) {
            remove(nodes[i], node, true);
        }
        // 5. If node is a DocumentFragment node, queue a mutation record of "childList" for node with removedNodes nodes.
        queueMutationRecord('childList', node, { removedNodes: nodes });
    } else {
        nodes = [node];
    }

    // 6. For each node in nodes, in tree order, run these substeps:
    var parentState = shadow(parent);
    var parentIsShadow = isShadowRoot(parent);
    for (var _i6 = 0; _i6 < nodes.length; _i6++) {
        var _node = nodes[_i6];
        // 1. Insert node into parent before child or at the end of parent if child is null.
        var childNodes = parentState.childNodes;
        if (childNodes) {
            if (child) {
                var childIndex = childNodes.indexOf(child);
                childNodes.splice(childIndex, 0, _node);
            } else {
                childNodes.push(_node);
            }
            shadow(_node).parentNode = parent;
            // If it's a shadow root, perform physical insert on the host.
            if (parentIsShadow) {
                descriptors.Node.insertBefore.value.call(parentState.host, _node, child);
            }
        } else {
            descriptors.Node.insertBefore.value.call(parent, _node, child);
        }

        // 2. If parent is a shadow host and node is a slotable, then assign a slot for node.
        if (parentState.shadowRoot && 'assignedSlot' in _node) {
            assignASlot(_node);
        }

        // 3. If parent is a slot whose assigned nodes is the empty list, 
        // then run signal a slot change for parent.
        if (parent.localName === 'slot' && parent.assignedNodes().length === 0) {
            // 3a. Physically append the child into the slot.
            descriptors.Node.appendChild.value.call(parent, _node);
            // 3b. Do what the spec said
            signalASlotChange(parent);
        }

        // 4. Run assign slotables for a tree with node’s tree and a set containing 
        // each inclusive descendant of node that is a slot.
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

    // 7. If suppress observers flag is unset, queue a mutation record of "childList" for parent 
    // with addedNodes nodes, nextSibling child, and previousSibling child’s previous sibling or 
    // parent’s last child if child is null.
    if (!suppressObservers) {
        queueMutationRecord('childList', parent, {
            addedNodes: nodes,
            nextSibling: child,
            previousSibling: child ? child.previousSibling : parent.lastChild
        });
    }
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
    if (hostIncludingInclusiveAncestor(node, parent)) {
        throw makeError('HierarchyRequestError');
    }

    // 3. If child’s parent is not parent, then throw a NotFoundError.
    if (child.parentNode !== parent) {
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

    // 9. Let previousSibling be child’s previous sibling.
    var previousSibling = child.previousSibling;

    // 10. Adopt node into parent’s node document.
    adopt(node, parent.ownerDocument);

    // 11. Let removedNodes be the empty list.
    var removedNodes = [];

    // 12. If child’s parent is not null, run these substeps:
    var childParent = child.parentNode;
    if (childParent != null) {
        // 1. Set removedNodes to a list solely containing child.
        removedNodes.push(child);
        // 2. Remove child from its parent with the suppress observers flag set.
        remove(child, parent, true);
    }

    // 13. Let nodes be node’s children if node is a DocumentFragment node, and a list containing solely node otherwise.
    var nodes = node instanceof DocumentFragment ? node.childNodes : [node];

    // 14. Insert node into parent before reference child with the suppress observers flag set.
    insert(node, parent, referenceChild, true);

    // 15. Queue a mutation record of "childList" for target parent with addedNodes nodes, 
    // removedNodes removedNodes, nextSibling reference child, and previousSibling previousSibling.
    queueMutationRecord('childList', parent, {
        addedNodes: nodes,
        removedNodes: removedNodes,
        nextSibling: referenceChild,
        previousSibling: previousSibling
    });
}

function replaceAll(node, parent) {
    // https://dom.spec.whatwg.org/#concept-node-replace-all
    // To replace all with a node within a parent, run these steps:

    // 1. If node is not null, adopt node into parent’s node document.
    if (node != null) {
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
    if (node != null) {
        insert(node, parent, null, true);
    }

    // 6. Queue a mutation record of "childList" for parent with addedNodes addedNodes and removedNodes removedNodes.
    queueMutationRecord('childList', parent, { addedNodes: addedNodes, removedNodes: removedNodes });
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

function remove(node, parent, suppressObservers) {
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

    // 7. Let oldPreviousSibling be node’s previous sibling.
    var oldPreviousSibling = node.previousSibling;

    // 8. Let oldNextSibling be node’s next sibling.
    var oldNextSibling = node.nextSibling;

    // 9. Remove node from its parent.
    var nodeState = shadow(node);
    var childNodes = shadow(parent).childNodes;
    if (childNodes) {
        var nodeIndex = childNodes.indexOf(node);
        childNodes.splice(nodeIndex, 1);
        delete nodeState.parentNode;
        var parentNode = descriptors.Node.parentNode.get.call(node);
        descriptors.Node.removeChild.value.call(parentNode, node);
    } else {
        descriptors.Node.removeChild.value.call(parent, node);
    }

    // 10. If node is assigned, then run assign slotables for node’s assigned slot.
    if (nodeState.assignedSlot) {
        assignSlotables(nodeState.assignedSlot);
        nodeState.assignedSlot = null;
    }

    // 11. If parent is a slot whose assigned nodes is the empty list,
    // then run signal a slot change for parent.
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

    // Skip (CustomElements)
    // 15. For each shadow-including descendant descendant of node, in 
    // shadow-including tree order, run these substeps:

    // 16. For each inclusive ancestor inclusiveAncestor of parent...
    var inclusiveAncestor = parent;
    while (inclusiveAncestor) {
        // ...if inclusiveAncestor has any registered observers whose options' 
        // subtree is true, then for each such registered observer registered... 
        var ancestorObservers = shadow(inclusiveAncestor).observers;
        if (ancestorObservers) {
            for (var i = 0; i < ancestorObservers.length; i++) {
                var ancestorObserver = ancestorObservers[i];
                if (ancestorObserver.options.subtree) {
                    // ..append a transient registered observer whose observer and options are 
                    // identical to those of registered and source which is registered to node’s 
                    // list of registered observers.
                    var transientObserver = createTransientObserver(ancestorObserver, node);
                    mutationObservers.push(transientObserver);
                }
            }
        }
        inclusiveAncestor = inclusiveAncestor.parentNode;
    }

    // 17. If suppress observers flag is unset, queue a mutation record of "childList" 
    // for parent with removedNodes a list solely containing node, nextSibling 
    // oldNextSibling, and previousSibling oldPreviousSibling.
    if (!suppressObservers) {
        queueMutationRecord('childList', parent, {
            removedNodes: [node],
            nextSibling: oldNextSibling,
            previousSibling: oldPreviousSibling
        });
    }
}

// https://dom.spec.whatwg.org/#mutation-observers

// TOOD: attribute 'change/append/remove/replace' observers
// TODO: CharacterData 'replace data' observer (Node.normalize, etc.)
// TODO: tests

function getOrCreateNodeObservers(node) {
    var nodeState = shadow(node);
    var observers = nodeState.observers;
    return observers ? observers : nodeState.observers = [];
}

function createMutationObserver(callback) {
    return {
        callback: callback,
        queue: [],
        nodes: [],
        observe: function observe(node, options) {
            if (this.nodes.length === 0) {
                mutationObservers.push(this);
            }
            var nodeObservers = getOrCreateNodeObservers(node);
            nodeObservers.push({ instance: this, options: options });
            this.nodes.push(node);
        },
        disconnect: function disconnect() {
            var index = mutationObservers.indexOf(this);
            mutationObservers.splice(index, 1);
            for (var i = 0; i < this.nodes.length; i++) {
                var nodeObservers = getOrCreateNodeObservers(this.nodes[i]);
                for (var j = 0; j < nodeObservers.length; j++) {
                    if (nodeObservers[j].instance === this) {
                        nodeObservers.splice(j, 1);
                        break;
                    }
                }
            }
            this.nodes = [];
        }
    };
}

function createTransientObserver(observer, options, node) {
    var transientObserver = {
        observer: observer,
        callback: observer.callback,
        options: observer.options,
        queue: [],
        node: node,
        disconnect: function disconnect() {
            var nodeObservers = getOrCreateNodeObservers(this.node);
            for (var j = 0; j < nodeObservers.length; j++) {
                if (nodeObservers[j].instance === this) {
                    nodeObservers.splice(j, 1);
                    break;
                }
            }
        }
    };

    var nodeObservers = getOrCreateNodeObservers(node);
    nodeObservers.append({ instance: transientObserver, options: options });

    return transientObserver;
}

var mutationObserverCompoundMicrotaskQueuedFlag = false;

var mutationObservers = [];
var signalSlotList = [];
var theEmptyList = Object.freeze([]);

function queueMutationRecord(type, target, details) {
    // https://dom.spec.whatwg.org/#queueing-a-mutation-record
    // 1. Let interested observers be an initially empty set of 
    // MutationObserver objects optionally paired with a string.
    var interestedObservers = [];
    var pairedStrings = [];
    // 2. Let nodes be the inclusive ancestors of target.
    var nodes = [target];
    var ancestor = target;
    while (ancestor = ancestor.parentNode) {
        nodes.push(ancestor);
    }
    // 3. Then, for each node in nodes... 
    for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        var observers = shadow(node).observers;
        if (!observers) {
            continue;
        }
        // ...and then for each registered observer (with registered 
        // observer’s options as options) in node’s list of registered 
        // observers...
        for (var j = 0; j < observers.length; j++) {
            var registeredObserver = observers[i];
            var options = registeredObserver.options;
            // ...run these substeps:
            // 1. If none of the following are true:
            if (node != target && !options.subtree) {
                continue;
            }
            if (type === 'attributes') {
                if (!options.attributes) {
                    continue;
                }
                // if options' attributeFilter is present, and options' attributeFilter
                // does not contain name or namespace is non-null
                if (options.attributeFilter && (options.attributeFilter.indexOf(details.name) === -1 || details.namespace != null)) {
                    continue;
                }
            }
            if (type === 'characterData' && !options.characterData) {
                continue;
            }
            if (type === 'childList' && !options.childList) {
                continue;
            }
            // ...then run the subsubsteps:
            // 1. If registered observer’s observer is not in interested observers, 
            // append registered observer’s observer to interested observers.
            var observer = registeredObserver.instance;
            var index = interestedObservers.indexOf(observer);
            if (index === -1) {
                index = interestedObservers.length;
                interestedObservers[index] = observer;
            }
            // 2. If either type is "attributes" and options’ attributeOldValue is true, 
            // or type is "characterData" and options’ characterDataOldValue is true, 
            // set the paired string of registered observer’s observer in interested observers to oldValue.
            if (type === 'attributes' && options.attributeOldValue || type === 'characterData' && options.characterDataOldValue) {
                pairedStrings[index] = details.oldValue;
            }
        }
    }

    // 4. Then, for each observer in interested observers, run these substeps:
    for (var _i7 = 0; _i7 < interestedObservers.length; _i7++) {
        var _observer = interestedObservers[_i7];
        // 1. Let record be a new MutationRecord object with its type set to type and target set to target.
        var record = {
            type: type,
            target: target,
            attributeName: null,
            attributeNamespace: null,
            addedNodes: theEmptyList,
            removedNodes: theEmptyList,
            previousSibling: null,
            nextSibling: null,
            oldValue: null
        };
        // 2. If name and namespace are given, set record’s attributeName to name, and record’s attributeNamespace to namespace.
        if ('name' in details) {
            record.attributeName = details.name;
            record.attributeNamespace = details.namespace;
        }
        // 3. If addedNodes is given, set record’s addedNodes to addedNodes.
        if ('addedNodes' in details) {
            record.addedNodes = Object.freeze(details.addedNodes);
        }
        // 4. If removedNodes is given, set record’s removedNodes to removedNodes.
        if ('removedNodes' in details) {
            record.removedNodes = Object.freeze(details.removedNodes);
        }
        // 5. If previousSibling is given, set record’s previousSibling to previousSibling.
        if ('previousSibling' in details) {
            record.previousSibling = details.previousSibling;
        }
        // 6. If nextSibling is given, set record’s nextSibling to nextSibling.
        if ('nextSibling' in details) {
            record.nextSibling = details.nextSibling;
        }
        // 7. If observer has a paired string, set record’s oldValue to observer’s paired string.
        var pairedString = pairedStrings[_i7];
        if (pairedString != null) {
            record.oldValue = pairedString;
        }
        // 8. Append record to observer’s record queue.
        Object.freeze(record);
        _observer.queue.push(record);

        // TODO: consider setting prototype to MutationRecord.prototype
    }

    // 5. Queue a mutation observer compound microtask.
    queueMutationObserverCompoundMicrotask();
}

function queueMutationObserverCompoundMicrotask() {
    if (mutationObserverCompoundMicrotaskQueuedFlag) {
        return;
    }
    mutationObserverCompoundMicrotaskQueuedFlag = true;
    setImmediate(notifyMutationObservers);
}

function notifyMutationObservers() {
    mutationObserverCompoundMicrotaskQueuedFlag = false;
    var notifyList = mutationObservers.slice();
    var signalList = signalSlotList.splice(0, signalSlotList.length);
    for (var i = 0; i < notifyList.length; i++) {
        var observer = notifyList[i];
        var queue = observer.queue.splice(0, observer.queue.length);
        for (var j = mutationObservers.length - 1; j >= 0; j--) {
            var transientObserver = mutationObservers[j];
            if (transientObserver.observer === observer) {
                mutationObservers.splice(j, 1);
                transientObserver.disconnect();
            }
        }
        if (queue.length) {
            try {
                observer.callback.call(observer.interface, queue, observer.interface);
            } catch (error) {
                reportError(error);
            }
        }
    }
    for (var _i8 = 0; _i8 < signalList.length; _i8++) {
        var slot = signalList[_i8];
        var event = slot.ownerDocument.createEvent('event');
        event.initEvent('slotchange', true, false);
        try {
            slot.dispatchEvent(event);
        } catch (error) {
            reportError(error);
        }
    }
}

},{}]},{},[17]);

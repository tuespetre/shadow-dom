// An index of IDL attributes that should reflect a corresponding content attribute.

import * as $ from './utils.js';

// Fear not the single page
// https://www.w3.org/TR/html/single-page.html

// TODO: implement on demand
// These might be a bit much considering we can't do anything about inline script handlers
// GlobalEventHandlers
// DocumentAndElementEventHandlers

// TODO: implement on demand
// This would be useful to polyfill considering most current browsers don't implement it yet
// HTMLHyperlinkElementUtils (Anchor, Area)

const interfaces = {
    Element: {
        'id': reflectString(),
        'className': reflectString('class'),
        'classList': reflectDOMTokenList('class'),
        'slot': reflectString()
    },
    HTMLElement: {
        'title': reflectString(),
        'lang': reflectString(),
        'translate': reflectString(),
        'dir': reflectString(),
        // TODO: implement on demand
        //'dataset': reflect.DOMStringMap('data'),
        'hidden': reflectBoolean(),
        'tabIndex': reflectInteger(null, 0),
        'accessKey': reflectString(),
        'draggable': reflectString(),
        'contextMenu': reflectHTMLElement(window.HTMLMenuElement),
        'spellcheck': reflectString(),
        // ElementContentEditable
        'contentEditable': reflectString()
    },
    HTMLAnchorElement: {
        'target': reflectString(),
        'download': reflectString(),
        'rel': reflectString(),
        'rev': reflectString(),
        'relList': reflectDOMTokenList('rel'),
        'hreflang': reflectString(),
        'type': reflectString(),
        'text': reflectTextContent()
    },
    HTMLAreaElement: {
        'alt': reflectString(),
        'coords': reflectString(),
        'shape': reflectString(),
        'target': reflectString(),
        'download': reflectString(),
        'rel': reflectString(),
        'relList': reflectDOMTokenList('rel'),
        'hreflang': reflectString(),
        'type': reflectString()
    },
    HTMLBaseElement: {
        'href': reflectString(),
        'target': reflectString()
    },
    HTMLButtonElement: {
        'autofocus': reflectBoolean(),
        'disabled': reflectBoolean(),
        'form': reflectHTMLElement(HTMLFormElement, true),
        'formAction': reflectString(),
        'formEnctype': reflectString(),
        'formMethod': reflectString(),
        'formNoValidate': reflectBoolean(),
        'formTarget': reflectString(),
        'name': reflectString(),
        'type': reflectString(),
        'value': reflectString(),
        'menu': reflectHTMLElement(window.HTMLMenuElement),
        // TODO: implement on demand
        // 'labels': reflectLabels()
    },
    HTMLCanvasElement: {
        'width': reflectInteger(null, 0),
        'height': reflectInteger(null, 0)
    },
    HTMLDataElement: {
        'value': reflectString()
    },
    HTMLDetailsElement: {
        'open': reflectBoolean()
    },
    HTMLEmbedElement: {
        'src': reflectString(),
        'type': reflectString(),
        'width': reflectInteger(null, 0),
        'height': reflectInteger(null, 0)
    },
    HTMLFieldSetElement: {
        'disabled': reflectBoolean(),
        'form': reflectHTMLElement(HTMLFormElement, true),
        'name': reflectString(),
        // TODO: implement on demand
        // 'elements': reflectHTMLFormControlsCollection()
    },
    HTMLFormElement: {
        'acceptCharset': reflectString('accept-charset'),
        'action': reflectString(),
        'autocomplete': reflectString(),
        'enctype': reflectString(),
        'encoding': reflectString('enctype'),
        'method': reflectString(),
        'name': reflectString(),
        'noValidate': reflectBoolean(),
        'target': reflectString(),
        // TODO: implement on demand
        // 'elements': reflectHTMLFormControlsCollection(),
        // 'length': reflectHTMLFormControlsCollection_length()
        // getter Element (unsigned long index);
        // getter (RadioNodeList or Element) (DOMString name);
    },
    HTMLIFrameElement: {
        'src': reflectString(),
        'srcdoc': reflectString(),
        'name': reflectString(),
        'sandbox': reflectDOMTokenList('sandbox'),
        'allowFullscreen': reflectBoolean(),
        'width': reflectInteger(null, 0),
        'height': reflectInteger(null, 0)
    },
    HTMLImageElement: {
        'alt': reflectString(),
        'src': reflectString(),
        'srcset': reflectString(),
        'crossOrigin': reflectString(),
        'useMap': reflectString(),
        'isMap': reflectBoolean(),
        'width': reflectInteger(null, 0),
        'height': reflectInteger(null, 0)
    },
    // TODO: caveat about feature testing input elements using anything besides 'type'
    HTMLInputElement: {
        'accept': reflectString(),
        'alt': reflectString(),
        'autocomplete': reflectString(),
        'autofocus': reflectBoolean(),
        'defaultChecked': reflectBoolean('checked'),
        'dirName': reflectString(),
        'disabled': reflectBoolean(),
        'form': reflectHTMLElement(HTMLFormElement, true),
        'formAction': reflectString(),
        'formEnctype': reflectString(),
        'formMethod': reflectString(),
        'formNoValidate': reflectBoolean(),
        'formTarget': reflectString(),
        'height': reflectInteger(null, 0),
        'inputMode': reflectString(),
        // TODO: investigate whether we should bother with 'list'.
        // Browsers without native Shadow DOM could end up not
        // pulling suggestions from the correct list anyways.
        // Possibly needs to be a caveat about this.
        //'list': reflectSuggestionSourceElement(),
        'max': reflectString(),
        'maxLength': reflectInteger(0, 0),
        'min': reflectString(),
        'minLength': reflectInteger(0, 0),
        'multiple': reflectBoolean(),
        'name': reflectString(),
        'pattern': reflectString(),
        'placeholder': reflectString(),
        'readOnly': reflectBoolean(),
        'required': reflectBoolean(),
        'size': reflectInteger(1, 1),
        'src': reflectString(),
        'step': reflectString(),
        'type': reflectString(),
        'defaultValue': reflectString('value'),
        'width': reflectInteger(null, 0),
        // TODO: implement on demand
        // 'labels': reflectLabels()
    },
    HTMLKeygenElement: {
        'autofocus': reflectBoolean(),
        'challenge': reflectString(),
        'disabled': reflectBoolean(),
        'form': reflectHTMLElement(HTMLFormElement, true),
        'keytype': reflectString(),
        'name': reflectString(),
        // TODO: implement on demand
        // 'labels': reflectLabels()
    },
    HTMLLabelElement: {
        'form': reflectHTMLElement(HTMLFormElement, true),
        'htmlFor': reflectString('for'),
        // TODO: implement on demand
        // 'control': reflectLabelControl()
    },
    HTMLLegendElement: {
        'form': reflectHTMLElement(HTMLFormElement, true)
    },
    HTMLLIElement: {
        'value': reflectString()
    },
    HTMLLinkElement: {
        'href': reflectString(),
        'crossOrigin': reflectString(),
        'rel': reflectString(),
        'rev': reflectString(),
        'relList': reflectDOMTokenList('rel'),
        'media': reflectString(),
        'hreflang': reflectString(),
        'type': reflectString(),
        'sizes': reflectDOMTokenList('sizes')
    },
    HTMLMapElement: {
        'name': reflectString(),
        // TODO: implement on demand
        // 'areas': reflectMapAreas(),
        // 'images': reflectMapImages()
    },
    HTMLMediaElement: {
        'src': reflectString(),
        'crossOrigin': reflectString(),
        'preload': reflectString(),
        'loop': reflectBoolean(),
        'autoplay': reflectBoolean(),
        'mediaGroup': reflectString(),
        'controls': reflectBoolean(),
        'defaultMuted': reflectBoolean('muted')
    },
    HTMLMenuElement: {
        'type': reflectString(),
        'label': reflectString()
    },
    HTMLMenuItemElement: {
        'type': reflectString(),
        'label': reflectString(),
        'icon': reflectString(),
        'disabled': reflectBoolean(),
        'checked': reflectBoolean('checked'),
        'radiogroup': reflectString(),
        'default': reflectBoolean()
    },
    HTMLMetaElement: {
        'name': reflectString(),
        'httpEquiv': reflectString('http-equiv'),
        'content': reflectString()
    },
    HTMLMeterElement: {
        'value': reflectFloat(null, 0),
        'min': reflectFloat(null, 0),
        'max': reflectFloat(null, 0),
        'low': reflectFloat(null, 0),
        'high': reflectFloat(null, 0),
        'optimum': reflectFloat(null, 0),
        // TODO: implement on demand
        // 'labels': reflectLabels()
    },
    HTMLModElement: {
        'cite': reflectString(),
        'dateTime': reflectString()
    },
    HTMLObjectElement: {
        'data': reflectString(),
        'type': reflectString(),
        'typeMustMatch': reflectBoolean(),
        'name': reflectString(),
        'form': reflectHTMLElement(HTMLFormElement, true),
        'width': reflectInteger(null, 0),
        'height': reflectInteger(null, 0)
    },
    HTMLOListElement: {
        'reversed': reflectBoolean(),
        'start': reflectInteger(null, 0),
        'type': reflectString()
    },
    HTMLOptGroupElement: {
        'disabled': reflectBoolean(),
        'label': reflectString()
    },
    HTMLOptionElement: {
        'disabled': reflectBoolean(),
        'form': reflectHTMLElement(HTMLFormElement, true),
        'label': reflectString(),
        'defaultSelected': reflectBoolean('selected'),
        'value': reflectString()
    },
    HTMLOutputElement: {
        'htmlFor': reflectDOMTokenList('for'),
        'form': reflectHTMLElement(HTMLFormElement, true),
        'name': reflectString(),
        'defaultValue': reflectString('value'),
        // TODO: implement on demand
        // 'labels': reflectLabels()
    },
    HTMLParamElement: {
        'name': reflectString(),
        'value': reflectString()
    },
    HTMLProgressElement: {
        'value': reflectFloat(null, 0),
        'max': reflectFloat(null, 0),
        // TODO: implement on demand
        // 'labels': reflectLabels()
    },
    HTMLQuoteElement: {
        'cite': reflectString()
    },
    HTMLScriptElement: {
        'src': reflectString(),
        'type': reflectString(),
        'charset': reflectString(),
        'async': reflectBoolean(),
        'defer': reflectBoolean(),
        'crossOrigin': reflectString(),
        // TODO: implement on demand
        // 'text': reflectScriptText(),
        'nonce': reflectString()
    },
    HTMLSelectElement: {
        'autocomplete': reflectString(),
        'autofocus': reflectBoolean(),
        'disabled': reflectBoolean(),
        'form': reflectHTMLElement(HTMLFormElement, true),
        'multiple': reflectBoolean(),
        'name': reflectString(),
        'required': reflectBoolean(),
        'size': reflectInteger(1, 1)
    },
    HTMLSourceElement: {
        'src': reflectString(),
        'type': reflectString(),
        'media': reflectString()
    },
    HTMLStyleElement: {
        'media': reflectString(),
        'nonce': reflectString(),
        'type': reflectString()
    },
    HTMLTableCellElement: {
        'colSpan': reflectInteger(0, -1),
        'rowSpan': reflectInteger(0, -1),
        'headers': reflectDOMTokenList('headers')
    },
    HTMLTableColElement: {
        'span': reflectInteger(1, 1)
    },
    HTMLTableHeaderCellElement: {
        'scope': reflectString(),
        'abbr': reflectString()
    },
    HTMLTextAreaElement: {
        'autocomplete': reflectString(),
        'autofocus': reflectBoolean(),
        'cols': reflectString(),
        'dirName': reflectString(),
        'disabled': reflectBoolean(),
        'form': reflectHTMLElement(HTMLFormElement, true),
        'inputMode': reflectString(),
        'maxLength': reflectInteger(0, 0),
        'minLength': reflectInteger(0, 0),
        'name': reflectString(),
        'placeholder': reflectString(),
        'readOnly': reflectBoolean(),
        'required': reflectBoolean(),
        'rows': reflectInteger(1, 1),
        'wrap': reflectString(),
        'defaultValue': reflectTextContent(),
        // TODO: implement on demand
        // 'labels': reflectLabels()
    },
    HTMLTimeElement: {
        'dateTime': reflectString()
    },
    HTMLTrackElement: {
        'kind': reflectString(),
        'src': reflectString(),
        'srclang': reflectString(),
        'label': reflectString(),
        'default': reflectBoolean()
    },
    HTMLVideoElement: {
        'width': reflectInteger(null, 0),
        'height': reflectInteger(null, 0),
        'poster': reflectString()
    }
};

// https://www.w3.org/TR/html/single-page.html#reflection

function reflectString(attributeName) {
    return function (type, name) {
        attributeName = attributeName || name.toLowerCase();
        const descriptor = $.descriptor(type, name);
        Object.defineProperty(type.prototype, name, {
            configurable: true,
            enumerable: true,
            get: descriptor ? descriptor.get : function () {
                return this.getAttribute(attributeName) || '';
            },
            set: function (value) {
                $.setAttributeValue(this, attributeName, value);
            }
        });
    }
}

function reflectBoolean(attributeName) {
    return function (type, name) {
        attributeName = attributeName || name.toLowerCase();
        Object.defineProperty(type.prototype, name, {
            configurable: true,
            enumerable: true,
            get: function () {
                return this.hasAttribute(attributeName);
            },
            set: function (value) {
                if (value == null) {
                    $.removeAttributeByName(attributeName, this);
                }
                else {
                    $.setAttributeValue(this, attributeName, value);
                }
            }
        });
    }
}

// TODO: minValue, errors
function reflectInteger(minValue, defaultValue) {
    return function (type, name) {
        const attributeName = name.toLowerCase();
        defaultValue = defaultValue || 0;
        Object.defineProperty(type.prototype, name, {
            configurable: true,
            enumerable: true,
            get: function () {
                let value = this.getAttribute(attributeName);
                return parseInt(value) || defaultValue;
            },
            set: function (value) {
                if (typeof value !== 'number') {
                    throw $.makeError('TypeError');
                }
                $.setAttributeValue(this, attributeName, value.toString());
            }
        });
    };
}

// TODO: minValue, errors
function reflectFloat(minValue, defaultValue) {
    return function (type, name) {
        const attributeName = name.toLowerCase();
        defaultValue = defaultValue || 0;
        Object.defineProperty(type.prototype, name, {
            configurable: true,
            enumerable: true,
            get: function () {
                let value = this.getAttribute(attributeName);
                return parseFloat(value) || defaultValue;
            },
            set: function (value) {
                if (typeof value !== 'number') {
                    throw $.makeError('TypeError');
                }
                $.setAttributeValue(this, attributeName, value.toString());
            }
        });
    };
}

function reflectDOMTokenList(localName) {
    return function (type, name) {
        const descriptor = $.descriptor(type, name);
        if (!descriptor) {
            return;
        }
        Object.defineProperty(type.prototype, name, {
            configurable: true,
            enumerable: true,
            get: function () {
                const state = $.shadow(this);
                if (!state.tokenList) {
                    const element = this;
                    const original = this.getAttribute(localName);
                    const tokens = original ? original.split(/\s/).sort() : [];
                    const tokenList = Object.create(DOMTokenList.prototype);
                    $.setShadowState(tokenList, { element, localName, tokens });
                    state.tokenList = tokenList;
                }
                return state.tokenList;
            },
            set: function (value) {
                const state = $.shadow(this);
                if (!state.tokenList) {
                    const element = this;
                    const original = this.getAttribute(localName);
                    const tokens = original ? original.split(/\s/).sort() : [];
                    const tokenList = Object.create(DOMTokenList.prototype);
                    $.setShadowState(tokenList, { element, localName, tokens });
                    state.tokenList = tokenList;
                }
                state.tokenList.value = value;
            }
        });
    };
}

function reflectHTMLElement(candidateType, readOnly) {
    return function (type, name) {
        const attributeName = name.toLowerCase();
        Object.defineProperty(type.prototype, name, {
            configurable: true,
            enumerable: true,
            get: function () {
                if (!this.hasAttribute(attributeName)) {
                    return null;
                }
                const id = this.getAttribute(attributeName);
                const candidate = this.ownerDocument.getElementById(id);
                if (candidate == null || !(candidate instanceof candidateType)) {
                    return null;
                }
                return candidate;
            },
            set: readOnly ? undefined : function (value) {
                if (!(value instanceof candidateType)) {
                    throw $.makeError('TypeError');
                }
                if (value.hasAttribute('id')) {
                    const found = this.ownerDocument.getElementById(value.id);
                    if (value === found) {
                        this.setAttribute(attributeName, value.id);
                        return;
                    }
                }
                this.setAttribute(attributeName, '');
            }
        });
    };
}

function reflectTextContent() {
    return function (type, name) {
        Object.defineProperty(type.prototype, name, {
            configurable: true,
            enumerable: true,
            get: function () {
                return this.textContent;
            },
            set: function (value) {
                this.textContent = value;
            }
        });
    };
}

export function patchAll() {
    const identifiers = Object.getOwnPropertyNames(interfaces);
    for (let i = 0; i < identifiers.length; i++) {
        const identifier = identifiers[i];
        if (identifier in window) {
            const type = window[identifier];
            const attributes = Object.getOwnPropertyNames(interfaces[identifier]);
            for (let j = 0; j < attributes.length; j++) {
                const attribute = attributes[j];
                interfaces[identifier][attribute](type, attribute);
            }
        }
    }
}
import * as $ from './utils.js';

import $Document from './interfaces/Document.js';
import $Element from './interfaces/Element.js';
import $Event from './interfaces/Event.js';
import $EventTarget from './interfaces/EventTarget.js';
import $HTMLSlotElement from './interfaces/HTMLSlotElement.js';
import $HTMLTableElement from './interfaces/HTMLTableElement.js';
import $HTMLTableRowElement from './interfaces/HTMLTableRowElement.js';
import $HTMLTableSectionElement from './interfaces/HTMLTableSectionElement.js';
import $Node from './interfaces/Node.js';
import $ShadowRoot from './interfaces/ShadowRoot.js';

import $ChildNode from './mixins/ChildNode.js';
import $DocumentOrShadowRoot from './mixins/DocumentOrShadowRoot.js';
import $NonDocumentTypeChildNode from './mixins/NonDocumentTypeChildNode.js';
import $NonElementParentNode from './mixins/NonElementParentNode.js';
import $ParentNode from './mixins/ParentNode.js';
import $Slotable from './mixins/Slotable.js';

// In case we would force the polyfill
const HTMLSlotElement = window.HTMLSlotElement || window.HTMLUnknownElement;

export default function() {

    // Element.matches(selectors) polyfill from MDN
    // https://developer.mozilla.org/en-US/docs/Web/API/Element/matches#Polyfill

    if (!Element.prototype.matches) {
        Element.prototype.matches = 
            Element.prototype.matchesSelector || 
            Element.prototype.mozMatchesSelector ||
            Element.prototype.msMatchesSelector || 
            Element.prototype.oMatchesSelector || 
            Element.prototype.webkitMatchesSelector ||
            function(s) {
                const matches = (this.document || this.ownerDocument).querySelectorAll(s);
                let i = matches.length;
                while (--i >= 0 && matches.item(i) !== this) {}
                return i > -1;            
            };
    }

    // Globally applied interfaces

    $.extend(Document, $Document);
    $.extend(Element, $Element);
    $.extend(Event, $Event);

    if ('EventTarget' in Window) {
        $.extend(EventTarget, $EventTarget(EventTarget));
    }
    else {
        // In IE, EventTarget is not exposed and Window's
        // EventTarget methods are not the same as Node's.
        $.extend(Window, $EventTarget(Window));
        $.extend(Node, $EventTarget(Node));
    }

    $.extend(HTMLSlotElement, $HTMLSlotElement);
    $.extend(HTMLTableElement, $HTMLTableElement);
    $.extend(HTMLTableRowElement, $HTMLTableRowElement);
    $.extend(HTMLTableSectionElement, $HTMLTableSectionElement);
    $.extend(Node, $Node);

    // Globally applied mixins

    $.extend(DocumentType, $ChildNode(DocumentType));
    $.extend(Element, $ChildNode(Element));
    $.extend(CharacterData, $ChildNode(CharacterData));

    $.extend(Document, $DocumentOrShadowRoot(Document));
    $.extend($ShadowRoot, $DocumentOrShadowRoot($ShadowRoot));

    $.extend(Element, $NonDocumentTypeChildNode(Element));
    $.extend(CharacterData, $NonDocumentTypeChildNode(CharacterData));

    $.extend(Document, $NonElementParentNode(Document));
    $.extend(DocumentFragment, $NonElementParentNode(DocumentFragment));

    $.extend(Document, $ParentNode(Document));
    $.extend(DocumentFragment, $ParentNode(DocumentFragment));
    $.extend(Element, $ParentNode(Element));

    $.extend(Element, $Slotable(Element));
    $.extend(Text, $Slotable(Text));

    // For IE, Edge

    delete HTMLElement.prototype.children;
    delete HTMLElement.prototype.parentElement;
    delete HTMLElement.prototype.innerHTML;
    delete HTMLElement.prototype.outerHTML;
    delete HTMLElement.prototype.insertAdjacentText;
    delete HTMLElement.prototype.insertAdjacentElement;
    delete HTMLElement.prototype.insertAdjacentHTML;

}
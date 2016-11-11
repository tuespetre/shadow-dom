import * as $ from './utils.js';

import $CustomEvent from './interfaces/CustomEvent.js';
import $Document from './interfaces/Document.js';
import $Element from './interfaces/Element.js';
import { default as $Event, hasRelatedTarget } from './interfaces/Event.js';
import $EventTarget from './interfaces/EventTarget.js';
import $HTMLSlotElement from './interfaces/HTMLSlotElement.js';
import $HTMLTableElement from './interfaces/HTMLTableElement.js';
import $HTMLTableRowElement from './interfaces/HTMLTableRowElement.js';
import $HTMLTableSectionElement from './interfaces/HTMLTableSectionElement.js';
import $MutationObserver from './interfaces/MutationObserver.js';
import $Node from './interfaces/Node.js';
import $ShadowRoot from './interfaces/ShadowRoot.js';

import $ChildNode from './mixins/ChildNode.js';
import $DocumentOrShadowRoot from './mixins/DocumentOrShadowRoot.js';
import $NonDocumentTypeChildNode from './mixins/NonDocumentTypeChildNode.js';
import $NonElementParentNode from './mixins/NonElementParentNode.js';
import $ParentNode from './mixins/ParentNode.js';
import $Slotable from './mixins/Slotable.js';

export default function () {

    // Element.matches(selectors) polyfill from MDN
    // https://developer.mozilla.org/en-US/docs/Web/API/Element/matches#Polyfill
    // Purposefully chop out the polyfill function that uses querySelectorAll.
    if (!Element.prototype.matches) {
        Element.prototype.matches =
            Element.prototype.matchesSelector ||
            Element.prototype.mozMatchesSelector ||
            Element.prototype.msMatchesSelector ||
            Element.prototype.oMatchesSelector ||
            Element.prototype.webkitMatchesSelector;
    }

    // CustomEvent interface
    $.extend(CustomEvent, $CustomEvent);
    $CustomEvent.prototype = CustomEvent.prototype;
    window.CustomEvent = $CustomEvent;

    // Document interface
    $.extend(Document, $Document);

    // Element interface
    $.extend(Element, $Element);
    {
        // For IE, Edge
        delete HTMLElement.prototype.children;
        delete HTMLElement.prototype.parentElement;
        delete HTMLElement.prototype.innerHTML;
        delete HTMLElement.prototype.outerHTML;
        delete HTMLElement.prototype.insertAdjacentText;
        delete HTMLElement.prototype.insertAdjacentElement;
        delete HTMLElement.prototype.insertAdjacentHTML;
    }

    // Event interface
    $.extend(Event, $Event);
    $.extend(FocusEvent, hasRelatedTarget);
    $.extend(MouseEvent, hasRelatedTarget);
    $Event.prototype = Event.prototype;
    window.Event = $Event;

    // EventTarget
    if ('EventTarget' in Window) {
        $.extend(EventTarget, $EventTarget(EventTarget));
    }
    else {
        // In IE, EventTarget is not exposed and Window's
        // EventTarget methods are not the same as Node's.
        $.extend(Window, $EventTarget(Window));
        $.extend(Node, $EventTarget(Node));
    }

    // HTMLSlotElement interface
    $.extend('HTMLSlotElement' in window ? HTMLSlotElement : HTMLUnknownElement, $HTMLSlotElement);

    // HTMLTableElement interface
    $.extend(HTMLTableElement, $HTMLTableElement);

    // HTMLTableRowElement interface
    $.extend(HTMLTableRowElement, $HTMLTableRowElement);

    // HTMLTableSectionElement interface
    $.extend(HTMLTableSectionElement, $HTMLTableSectionElement);

    // MutationObserver interface
    window.MutationObserver = $MutationObserver;

    // Node interface
    $.extend(Node, $Node);

    // ChildNode mixin
    $.extend(DocumentType, $ChildNode(DocumentType));
    $.extend(Element, $ChildNode(Element));
    $.extend(CharacterData, $ChildNode(CharacterData));

    // DocumentOrShadowRoot mixin
    $.extend(Document, $DocumentOrShadowRoot);
    $.extend($ShadowRoot, $DocumentOrShadowRoot);

    // NonDocumentTypeChildNode mixin
    $.extend(Element, $NonDocumentTypeChildNode(Element));
    $.extend(CharacterData, $NonDocumentTypeChildNode(CharacterData));

    // NonElementParentNode mixin
    $.extend(Document, $NonElementParentNode(Document));
    $.extend(DocumentFragment, $NonElementParentNode(DocumentFragment));

    // ParentNode mixin
    $.extend(Document, $ParentNode(Document));
    $.extend(DocumentFragment, $ParentNode(DocumentFragment));
    $.extend(Element, $ParentNode(Element));

    // Slotable mixin
    $.extend(Element, $Slotable(Element));
    $.extend(Text, $Slotable(Text));

}
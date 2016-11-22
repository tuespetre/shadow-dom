import $utils from './utils.js';
import * as reflect from './reflect.js';

import $Attr from './interfaces/Attr.js';
import $CharacterData from './interfaces/CharacterData.js';
import $CustomEvent from './interfaces/CustomEvent.js';
import $Document from './interfaces/Document.js';
import $DOMTokenList from './interfaces/DOMTokenList.js';
import $Element from './interfaces/Element.js';
import { default as $Event, hasRelatedTarget } from './interfaces/Event.js';
import $EventTarget from './interfaces/EventTarget.js';
import $HTMLSlotElement from './interfaces/HTMLSlotElement.js';
import $HTMLTableElement from './interfaces/HTMLTableElement.js';
import $HTMLTableRowElement from './interfaces/HTMLTableRowElement.js';
import $HTMLTableSectionElement from './interfaces/HTMLTableSectionElement.js';
import $MutationObserver from './interfaces/MutationObserver.js';
import $NamedNodeMap from './interfaces/NamedNodeMap.js';
import $Node from './interfaces/Node.js';
import $ShadowRoot from './interfaces/ShadowRoot.js';
import $Text from './interfaces/Text.js';

import $ChildNode from './mixins/ChildNode.js';
import $DocumentOrShadowRoot from './mixins/DocumentOrShadowRoot.js';
import $NonDocumentTypeChildNode from './mixins/NonDocumentTypeChildNode.js';
import $NonElementParentNode from './mixins/NonElementParentNode.js';
import $ParentNode from './mixins/ParentNode.js';
import $Slotable from './mixins/Slotable.js';

const nativeSupport = 'attachShadow' in Element.prototype;

export default {
    nativeSupport,
    install
};

function install() {

    // Hacky setting in case you want to use ShadyCSS.
    window['ShadyDOM'] = { 'inUse': true };

    // Reflected attributes
    reflect.patchAll();

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

    // Attr interface
    $utils.extend(Attr, $Attr);

    // CharacterData interface
    $utils.extend(CharacterData, $CharacterData);

    // CustomEvent interface
    window.CustomEvent = $CustomEvent;

    // Document interface
    $utils.extend(Document, $Document);

    // DOMTokenList interface
    if ('DOMTokenList' in window) {
        // TODO: what about IE9?
        $utils.extend(DOMTokenList, $DOMTokenList);
    }

    // Element interface
    $utils.extend(Element, $Element);

    // Event interface
    $utils.extend(Event, $Event);
    $utils.extend(FocusEvent, hasRelatedTarget);
    $utils.extend(MouseEvent, hasRelatedTarget);
    $Event.prototype = Event.prototype;
    window.Event = $Event;

    // EventTarget
    if ('EventTarget' in Window) {
        $utils.extend(EventTarget, $EventTarget(EventTarget));
    }
    else {
        // In IE, EventTarget is not exposed and Window's
        // EventTarget methods are not the same as Node's.
        $utils.extend(Window, $EventTarget(Window));
        $utils.extend(Node, $EventTarget(Node));
    }

    // HTMLSlotElement interface
    $utils.extend('HTMLSlotElement' in window ? HTMLSlotElement : HTMLUnknownElement, $HTMLSlotElement);

    // HTMLTableElement interface
    $utils.extend(HTMLTableElement, $HTMLTableElement);

    // HTMLTableRowElement interface
    $utils.extend(HTMLTableRowElement, $HTMLTableRowElement);

    // HTMLTableSectionElement interface
    $utils.extend(HTMLTableSectionElement, $HTMLTableSectionElement);

    // MutationObserver interface
    window.MutationObserver = $MutationObserver;

    // NamedNodeMap interface
    $utils.extend(NamedNodeMap, $NamedNodeMap);

    // Node interface
    $utils.extend(Node, $Node);

    // TODO: implement Range interface

    // Text interface
    $utils.extend(Text, $Text);

    // ChildNode mixin
    $utils.extend(DocumentType, $ChildNode(DocumentType));
    $utils.extend(Element, $ChildNode(Element));
    $utils.extend(CharacterData, $ChildNode(CharacterData));

    // DocumentOrShadowRoot mixin
    $utils.extend(Document, $DocumentOrShadowRoot);
    $utils.extend($ShadowRoot, $DocumentOrShadowRoot);

    // NonDocumentTypeChildNode mixin
    $utils.extend(Element, $NonDocumentTypeChildNode(Element));
    $utils.extend(CharacterData, $NonDocumentTypeChildNode(CharacterData));

    // NonElementParentNode mixin
    $utils.extend(Document, $NonElementParentNode(Document));
    $utils.extend(DocumentFragment, $NonElementParentNode(DocumentFragment));

    // ParentNode mixin
    $utils.extend(Document, $ParentNode(Document));
    $utils.extend(DocumentFragment, $ParentNode(DocumentFragment));
    $utils.extend(Element, $ParentNode(Element));

    // Slotable mixin
    $utils.extend(Element, $Slotable(Element));
    $utils.extend(Text, $Slotable(Text));

    // Cleanup for IE, Edge
    delete Node.prototype.attributes;
    delete HTMLElement.prototype.classList;
    delete HTMLElement.prototype.children;
    delete HTMLElement.prototype.parentElement;
    delete HTMLElement.prototype.innerHTML;
    delete HTMLElement.prototype.outerHTML;
    delete HTMLElement.prototype.insertAdjacentText;
    delete HTMLElement.prototype.insertAdjacentElement;
    delete HTMLElement.prototype.insertAdjacentHTML;

}
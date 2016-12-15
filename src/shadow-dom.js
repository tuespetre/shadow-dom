import $dom from './dom.js';
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
    $Attr.install();

    // CharacterData interface
    $CharacterData.install();

    // CustomEvent interface
    window.CustomEvent = $CustomEvent;

    // Document interface
    if (!$utils.brokenAccessors) {
        $utils.extend(Document, $Document);
    }
    else {
        $utils.extend(HTMLDocument, $Document);
    }

    // DOMTokenList interface
    $utils.extend(DOMTokenList, $DOMTokenList);

    // Element interface
    $Element.install();

    // Event interface
    $Event.install();

    // EventTarget
    $EventTarget.install();

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
    $Node.install();

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
    // There doesn't seem to be a need to implement this directly 
    // on Document or DocumentFragment.
    $utils.extend(Document, $ParentNode(Document));
    $utils.extend(DocumentFragment, $ParentNode(DocumentFragment));
    $utils.extend($ShadowRoot, $ParentNode($ShadowRoot));
    if ($utils.brokenAccessors) {
        $utils.extend(HTMLElement, $ParentNode(HTMLElement));
    }
    else {
        $utils.extend(Element, $ParentNode(Element));
    }

    // Slotable mixin
    $utils.extend(Element, $Slotable(Element));
    $utils.extend(Text, $Slotable(Text));
}
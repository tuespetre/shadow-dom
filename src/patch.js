import * as $ from './utils.js';

import $CustomEvent from './interfaces/CustomEvent.js';
import $Document from './interfaces/Document.js';
import $Element from './interfaces/Element.js';
import $Event from './interfaces/Event.js';
import $EventTarget from './interfaces/EventTarget.js';
import $HTMLSlotElement from './interfaces/HTMLSlotElement.js';
import $HTMLTableElement from './interfaces/HTMLTableElement.js';
import $HTMLTableSectionElement from './interfaces/HTMLTableSectionElement.js';
import $HTMLTableRowElement from './interfaces/HTMLTableRowElement.js';
import $Node from './interfaces/Node.js';
import $ShadowRoot from './interfaces/ShadowRoot.js';

import $ChildNode from './mixins/ChildNode.js';
import $DocumentOrShadowRoot from './mixins/DocumentOrShadowRoot.js';
import $NonDocumentTypeChildNode from './mixins/NonDocumentTypeChildNode.js';
import $NonElementParentNode from './mixins/NonElementParentNode.js';
import $ParentNode from './mixins/ParentNode.js';
import $Slotable from './mixins/Slotable.js';

export default function() {
    // Globally applied interfaces

    //$.extend(CustomEvent, $CustomEvent);
    $.extend(Document, $Document);
    $.extend(Element, $Element);
    //$.extend(Event, $Event);
    //$.extend(EventTarget, $EventTarget);
    $.extend(HTMLUnknownElement, $HTMLSlotElement);
    if ('HTMLSlotElement' in window) {
        // In case we are forcing a polyfill
        $.extend(HTMLSlotElement, $HTMLSlotElement);
    }
    $.extend(HTMLTableElement, $HTMLTableElement);
    $.extend(HTMLTableSectionElement, $HTMLTableSectionElement);
    $.extend(HTMLTableRowElement, $HTMLTableRowElement);
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
}
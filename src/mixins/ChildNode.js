// https://dom.spec.whatwg.org/#interface-childnode

import $dom from '../dom.js';
import $ce from '../custom-elements.js';

export default function (base) {

    return {

        // TODO: tests
        before(...nodes) {
            return $ce.executeCEReactions(() => {
                // https://dom.spec.whatwg.org/#dom-childnode-before
                // The before(nodes) method, when invoked, must run these steps:

                // 1. Let parent be context object’s parent.
                const parent = this.parentNode;

                // 2. If parent is null, terminate these steps.
                if (!parent) {
                    return;
                }

                // 3. Let viablePreviousSibling be context object’s first preceding 
                // sibling not in nodes, and null otherwise.
                let viablePreviousSibling = this.previousSibling;
                while (viablePreviousSibling && nodes.indexOf(viablePreviousSibling) !== -1) {
                    viablePreviousSibling = viablePreviousSibling.previousSibling;
                }

                // 4. Let node be the result of converting nodes into a node, given 
                // nodes and context object’s node document. Rethrow any exceptions.
                const node = $dom.convertNodesIntoANode(nodes, this.ownerDocument);

                // 5. If viablePreviousSibling is null, set it to parent’s first child, 
                // and to viablePreviousSibling’s next sibling otherwise.
                if (viablePreviousSibling === null) {
                    viablePreviousSibling = parent.firstChild;
                }
                else {
                    viablePreviousSibling = viablePreviousSibling.nextSibling;
                }

                // 6. Pre-insert node into parent before viablePreviousSibling. 
                // Rethrow any exceptions.
                $dom.preInsert(node, parent, viablePreviousSibling);
            });
        },

        // TODO: tests
        after(...nodes) {
            return $ce.executeCEReactions(() => {
                // https://dom.spec.whatwg.org/#dom-childnode-after
                // The after(nodes) method, when invoked, must run these steps:

                // 1. Let parent be context object’s parent.
                const parent = this.parentNode;

                // 2. If parent is null, terminate these steps.
                if (!parent) {
                    return;
                }

                // 3. Let viableNextSibling be context object’s first following 
                // sibling not in nodes, and null otherwise.
                let viableNextSibling = this.nextSibling;
                while (viableNextSibling && nodes.indexOf(viableNextSibling) !== -1) {
                    viableNextSibling = viableNextSibling.nextSibling;
                }

                // 4. Let node be the result of converting nodes into a node, given 
                // nodes and context object’s node document. Rethrow any exceptions.
                const node = $dom.convertNodesIntoANode(nodes, this.ownerDocument);

                // 5. Pre-insert node into parent before viableNextSibling. Rethrow 
                // any exceptions.
                $dom.preInsert(node, parent, viableNextSibling);
            });
        },

        // TODO: tests
        replaceWith(...nodes) {
            return $ce.executeCEReactions(() => {
                // https://dom.spec.whatwg.org/#dom-childnode-replacewith
                // The replaceWith(nodes) method, when invoked, must run these steps:

                // 1. Let parent be context object’s parent.
                const parent = this.parentNode;

                // 2. If parent is null, terminate these steps.
                if (!parent) {
                    return;
                }

                // 3. Let viableNextSibling be context object’s first following 
                // sibling not in nodes, and null otherwise.
                let viableNextSibling = this.nextSibling;
                while (viableNextSibling && nodes.indexOf(viableNextSibling) !== -1) {
                    viableNextSibling = viableNextSibling.nextSibling;
                }

                // 4. Let node be the result of converting nodes into a node, given 
                // nodes and context object’s node document. Rethrow any exceptions.
                const node = $dom.convertNodesIntoANode(nodes, this.ownerDocument);

                // 5. If context object’s parent is parent, replace the context object 
                // with node within parent. Rethrow any exceptions.
                if (this.parentNode == parent) {
                    $dom.replace(this, node, parent);
                }
                // 6. Otherwise, pre-insert node into parent before viableNextSibling. 
                // Rethrow any exceptions.
                else {
                    $dom.preInsert(node, parent, viableNextSibling);
                }
            });
        },

        // TODO: tests
        remove() {
            return $ce.executeCEReactions(() => {
                // https://dom.spec.whatwg.org/#dom-childnode-remove
                // The remove() method, when invoked, must run these steps:

                // 1. If context object’s parent is null, terminate these steps.
                const parent = this.parentNode;

                if (!parent) {
                    return;
                }

                // 2. Remove the context object from context object’s parent.
                $dom.remove(this, parent);
            });
        },

    };

}
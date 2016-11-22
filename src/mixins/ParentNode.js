// https://dom.spec.whatwg.org/#interface-parentnode

import $dom from '../dom.js';
import $ce from '../custom-elements.js';
import $utils from '../utils.js';

export default function (base) {

    const native = {
        children: $utils.descriptor(base, 'children'),
        firstElementChild: $utils.descriptor(base, 'firstElementChild'),
        lastElementChild: $utils.descriptor(base, 'lastElementChild'),
        childElementCount: $utils.descriptor(base, 'childElementCount'),
    };

    return {

        get children() {
            let childNodes;

            const shadowState = $utils.getShadowState(this);
            if (shadowState) {
                childNodes = shadowState.childNodes
            }

            if (!childNodes) {
                if (native.children) {
                    return native.children.get.call(this);
                }
                childNodes = this.childNodes;
            }

            const childNodesLength = childNodes.length;
            const elements = new Array(childNodesLength);
            let pushed = 0;
            for (let i = 0; i < childNodesLength; i++) {
                const node = childNodes[i];
                if (node.nodeType == Node.ELEMENT_NODE) {
                    elements[pushed++] = node;
                }
            }
            elements.length = pushed;

            return elements;
        },

        get firstElementChild() {
            let childNodes;

            const shadowState = $utils.getShadowState(this);
            if (shadowState) {
                childNodes = shadowState.childNodes
            }

            if (!childNodes) {
                if (native.firstElementChild) {
                    return native.firstElementChild.get.call(this);
                }
                childNodes = this.childNodes;
            }

            for (let i = 0; i < childNodes.length; i++) {
                const node = childNodes[i];
                if (node.nodeType == Node.ELEMENT_NODE) {
                    return node;
                }
            }

            return null;
        },

        get lastElementChild() {
            let childNodes;

            const shadowState = $utils.getShadowState(this);
            if (shadowState) {
                childNodes = shadowState.childNodes
            }

            if (!childNodes) {
                if (native.lastElementChild) {
                    return native.lastElementChild.get.call(this);
                }
                childNodes = this.childNodes;
            }

            for (let i = childNodes.length - 1; i >= 0; i--) {
                const node = childNodes[i];
                if (node.nodeType == Node.ELEMENT_NODE) {
                    return node;
                }
            }

            return null;
        },

        get childElementCount() {
            let childNodes;

            const shadowState = $utils.getShadowState(this);
            if (shadowState) {
                childNodes = shadowState.childNodes
            }

            if (!childNodes) {
                if (native.childElementCount) {
                    return native.childElementCount.get.call(this);
                }
                childNodes = this.childNodes;
            }

            let count = 0;

            for (let i = 0; i < childNodes.length; i++) {
                const node = childNodes[i];
                if (node.nodeType == Node.ELEMENT_NODE) {
                    count++;
                }
            }

            return count;
        },

        // TODO: tests
        prepend(...nodes) {
            return $ce.executeCEReactions(() => {
                // https://dom.spec.whatwg.org/#dom-parentnode-prepend
                // The prepend(nodes) method, when invoked, must run these steps:

                // 1. Let node be the result of converting nodes into a node given 
                // nodes and context object’s node document. Rethrow any exceptions.
                const node = $dom.convertNodesIntoANode(nodes, this.ownerDocument || this);

                // 2. Pre-insert node into context object before the context object’s 
                // first child. Rethrow any exceptions.
                $dom.preInsert(node, this, this.firstChild);
            });
        },

        // TODO: tests
        append(...nodes) {
            return $ce.executeCEReactions(() => {
                // https://dom.spec.whatwg.org/#dom-parentnode-append
                // The append(nodes) method, when invoked, must run these steps:

                // 1. Let node be the result of converting nodes into a node given 
                // nodes and context object’s node document. Rethrow any exceptions.
                const node = $dom.convertNodesIntoANode(nodes, this.ownerDocument || this);

                // 2. Append node to context object. Rethrow any exceptions.
                $dom.append(node, this);
            });
        },

        // TODO: tests
        querySelector(selectors) {
            let firstChild = this.firstChild;
            
            if (!firstChild) {
                return null;
            }
            
            return $dom.treeOrderRecursiveSelectFirst(firstChild, function (node) {
                return node.nodeType === Node.ELEMENT_NODE && node.matches(selectors);
            });
        },

        // TODO: tests
        querySelectorAll(selectors) {
            // https://dom.spec.whatwg.org/#scope-match-a-selectors-string
            const results = [];

            let firstChild = this.firstChild;

            if (!firstChild) {
                return results;
            }

            $dom.treeOrderRecursiveSelectAll(firstChild, results, function (node) {
                return node.nodeType === Node.ELEMENT_NODE && node.matches(selectors);
            });

            return results;
        },

    };

}
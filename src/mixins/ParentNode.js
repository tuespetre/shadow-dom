// https://dom.spec.whatwg.org/#interface-parentnode

import * as $ from '../utils.js';

export default function (base) {

    const native = {
        children: $.descriptor(base, 'children'),
        firstElementChild: $.descriptor(base, 'firstElementChild'),
        lastElementChild: $.descriptor(base, 'lastElementChild'),
        childElementCount: $.descriptor(base, 'childElementCount'),
    };

    return class {

        get children() {
            let childNodes;

            const shadowState = $.getShadowState(this);
            if (shadowState) {
                childNodes = shadowState.childNodes
            }

            if (!childNodes) {
                if (native.children) {
                    return native.children.get.call(this);
                }
                childNodes = this.childNodes;
            }

            const elements = [];

            for (let i = 0; i < childNodes.length; i++) {
                const node = childNodes[i];
                if (node.nodeType == Node.ELEMENT_NODE) {
                    elements.push(node);
                }
            }

            return elements;
        }

        get firstElementChild() {
            let childNodes;

            const shadowState = $.getShadowState(this);
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
        }

        get lastElementChild() {
            let childNodes;

            const shadowState = $.getShadowState(this);
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
        }

        get childElementCount() {
            let childNodes;

            const shadowState = $.getShadowState(this);
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
        }

        // TODO: tests
        prepend(...nodes) {
            // https://dom.spec.whatwg.org/#dom-parentnode-prepend
            // The prepend(nodes) method, when invoked, must run these steps:

            // 1. Let node be the result of converting nodes into a node given 
            // nodes and context object’s node document. Rethrow any exceptions.
            const node = $.convertNodesIntoANode(nodes, this.ownerDocument || this);

            // 2. Pre-insert node into context object before the context object’s 
            // first child. Rethrow any exceptions.
            $.preInsert(node, this, this.firstChild);
        }

        // TODO: tests
        append(...nodes) {
            // https://dom.spec.whatwg.org/#dom-parentnode-append
            // The append(nodes) method, when invoked, must run these steps:

            // 1. Let node be the result of converting nodes into a node given 
            // nodes and context object’s node document. Rethrow any exceptions.
            const node = $.convertNodesIntoANode(nodes, this.ownerDocument || this);

            // 2. Append node to context object. Rethrow any exceptions.
            $.append(node, this);
        }

        // TODO: tests
        querySelector(selectors) {
            const results = this.querySelectorAll(selectors);

            if (results.length) {
                return results[0];
            }

            return null;
        }

        // TODO: tests
        querySelectorAll(selectors) {
            // https://dom.spec.whatwg.org/#scope-match-a-selectors-string
            // this is horrible, performance-wise.
            // it's about 100x slower than native querySelectorAll.
            // that might not amount to much in practice, though.
            // after all, this is a polyfill.

            const results = [];

            let firstChild = this.firstChild;

            if (!firstChild) {
                return results;
            }

            $.treeOrderRecursiveSelectAll(firstChild, results, function (node) {
                return node.nodeType === Node.ELEMENT_NODE && node.matches(selectors);
            });

            return results;
        }

    };

}
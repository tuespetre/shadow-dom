/*

https://dom.spec.whatwg.org/#interface-parentnode

[NoInterfaceObject, Exposed=Window]
interface ParentNode

Document implements ParentNode;
DocumentFragment implements ParentNode;
Element implements ParentNode;

*/

import * as $ from '../utils.js';

export default function (base) {

    const native = {
        children: Object.getOwnPropertyDescriptor(base.prototype, 'children'),
        firstElementChild: Object.getOwnPropertyDescriptor(base.prototype, 'firstElementChild'),
        lastElementChild: Object.getOwnPropertyDescriptor(base.prototype, 'lastElementChild'),
        childElementCount: Object.getOwnPropertyDescriptor(base.prototype, 'childElementCount'),
    };

    return class extends base {

        // TODO: tests
        get children() {
            const childNodes = $.shadow(this).childNodes;
            if (childNodes) {
                let elements = [];
                for (let i = 0; i < childNodes.length; i++) {
                    const node = childNodes[i];
                    if (node.nodeType == Node.ELEMENT_NODE) {
                        elements.push(node);
                    }
                }

                return elements;
            }

            return native.children.get.call(this);
        }

        // TODO: tests
        get firstElementChild() {
            const childNodes = $.shadow(this).childNodes;
            if (childNodes) {
                for (let i = 0; i < childNodes.length; i++) {
                    const node = childNodes[i];
                    if (node.nodeType == Node.ELEMENT_NODE) {
                        return node;
                    }
                }
                return null;
            }

            return native.firstElementChild.get.call(this);
        }

        // TODO: tests
        get lastElementChild() {
            const childNodes = $.shadow(this).childNodes;
            if (childNodes) {
                for (let i = childNodes.length - 1; i >= 0; i--) {
                    const node = childNodes[i];
                    if (node.nodeType == Node.ELEMENT_NODE) {
                        return node;
                    }
                }
                return null;
            }

            return native.lastElementChild.get.call(this);
        }

        // TODO: tests
        get childElementCount() {
            const childNodes = $.shadow(this).childNodes;
            if (childNodes) {
                let count = 0;
                for (let i = 0; i < childNodes.length; i++) {
                    const node = childNodes[i];
                    if (node.nodeType == Node.ELEMENT_NODE) {
                        count++;
                    }
                }
                return count;
            }

            return native.childElementCount.get.call(this);
        }

        // TODO: tests
        prepend(...nodes) {
            // https://dom.spec.whatwg.org/#dom-parentnode-prepend
            // The prepend(nodes) method, when invoked, must run these steps:

            // 1. Let node be the result of converting nodes into a node given 
            // nodes and context object’s node document. Rethrow any exceptions.
            const node = $.convertNodesIntoANode(nodes, this.ownerDocument);

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
            const node = $.convertNodesIntoANode(nodes, this.ownerDocument);

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

            let firstChild = this.firstChild;

            if (!firstChild) {
                return null;
            }

            const stack = [{ node: firstChild, recursed: false }];
            const results = [];

            while (stack.length) {
                const frame = stack.pop();

                if (frame.recursed) {
                    if (frame.node.nextSibling) {
                        stack.push({ node: frame.node.nextSibling, recursed: false });
                    }
                }
                else {
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

    };

}
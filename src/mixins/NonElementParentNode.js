/*

https://dom.spec.whatwg.org/#interface-nonelementparentnode

[NoInterfaceObject, Exposed=Window]
interface NonElementParentNode

Document implements NonElementParentNode;
DocumentFragment implements NonElementParentNode;

*/

export default function (base) {

    const native = {
        getElementById: base.prototype.getElementById
    };

    return class extends base {

        // TODO: tests
        getElementById(id) {
            // https://dom.spec.whatwg.org/#dom-nonelementparentnode-getelementbyid

            // If the native implementation returns a correct element, go with that.

            const candidateResult = native.getElementById.call(this, id);
            const candidateRoot = candidateResult.getRootNode({ composed: false });

            if (this === candidateRoot) {
                return candidateResult;
            }

            // Otherwise, go through our polyfilled algorithm.

            let firstChild = this.firstChild;

            if (!firstChild) {
                return null;
            }

            const stack = [{ node: firstChild, recursed: false }];

            while (stack.length) {
                const frame = stack.pop();

                if (frame.recursed) {
                    if (frame.node.nextSibling) {
                        stack.push({ node: frame.node.nextSibling, recursed: false });
                    }
                }
                else {
                    if (frame.node.id === id) {
                        return frame.node;
                    }

                    stack.push({ node: frame.node, recursed: true });

                    if (firstChild = frame.node.firstChild) {
                        stack.push({ node: firstChild, recursed: false });
                    }
                }
            }

            return null;
        }

    };

}
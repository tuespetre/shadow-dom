// https://dom.spec.whatwg.org/#interface-nonelementparentnode

export default function(base) {

    return class {

        getElementById(id) {
            // https://dom.spec.whatwg.org/#dom-nonelementparentnode-getelementbyid

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
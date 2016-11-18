// https://dom.spec.whatwg.org/#mixin-documentorshadowroot
// https://www.w3.org/TR/shadow-dom/#extensions-to-the-documentorshadowroot-mixin

import * as $ from '../utils.js';

export default {

    // TODO: consider getSelection()
    // TODO: consider elementFromPoint(double x, double y)
    // TODO: consider elementsFromPoint(double x, double y)
    // TODO: consider get styleSheets()

    // TODO: tests
    get activeElement() {
        const document = this.ownerDocument || this;
        const nativeActiveElement = native.activeElement.get.call(document);

        if (!nativeActiveElement || document != $.shadowIncludingRoot(this)) {
            return null;
        }

        return $.retarget(nativeActiveElement, this);
    },

}
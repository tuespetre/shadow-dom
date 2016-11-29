// https://dom.spec.whatwg.org/#mixin-documentorshadowroot
// https://www.w3.org/TR/shadow-dom/#extensions-to-the-documentorshadowroot-mixin

import $dom from '../dom.js';
import $utils from '../utils.js';

const nativeDocumentActiveElement = $utils.descriptor(Document, 'activeElement');

export default {

    // TODO: consider getSelection()
    // TODO: consider elementFromPoint(double x, double y)
    // TODO: consider elementsFromPoint(double x, double y)
    // TODO: consider get styleSheets()

    // TODO: tests
    get activeElement() {
        const document = this.ownerDocument || this;
        const nativeActiveElement = nativeDocumentActiveElement.get.call(document);

        if (!nativeActiveElement || document != $dom.shadowIncludingRoot(this)) {
            return null;
        }

        return $dom.retarget(nativeActiveElement, this);
    },

}
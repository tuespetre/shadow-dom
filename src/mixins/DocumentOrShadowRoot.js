/*

https://dom.spec.whatwg.org/#mixin-documentorshadowroot
https://www.w3.org/TR/shadow-dom/#extensions-to-the-documentorshadowroot-mixin

[NoInterfaceObject, Exposed=Window]
interface DocumentOrShadowRoot

Document implements DocumentOrShadowRoot;
ShadowRoot implements DocumentOrShadowRoot;

*/

import * as $ from '../utils.js';

export default function (base) {

    const native = {
        activeElement: $.prop(base, 'activeElement')
    };

    return class {

        /*
    
        https://www.w3.org/TR/shadow-dom/#extensions-to-the-documentorshadowroot-mixin
    
        */

        // TODO: impl, tests
        get activeElement() {
            return native.activeElement.get.call(this);
        }

    };

}
/*

https://dom.spec.whatwg.org/#mixin-documentorshadowroot
https://www.w3.org/TR/shadow-dom/#extensions-to-the-documentorshadowroot-mixin

[NoInterfaceObject, Exposed=Window]
interface DocumentOrShadowRoot

Document implements DocumentOrShadowRoot;
ShadowRoot implements DocumentOrShadowRoot;

*/

export default function (base) {

    const native = {
        activeElement: Object.getOwnPropertyDescriptor(base.prototype, 'activeElement')
    };

    return class extends base {

        /*
    
        https://www.w3.org/TR/shadow-dom/#extensions-to-the-documentorshadowroot-mixin
    
        */

        // Selection?        getSelection();
        // Element?          elementFromPoint(double x, double y);
        // sequence<Element> elementsFromPoint(double x, double y);
        // CaretPosition?    caretPositionFromPoint(double x, double y);
        // readonly attribute Element?       activeElement;
        // readonly attribute StyleSheetList styleSheets;

        // TODO: tests
        get activeElement() {
            return native.activeElement.get.call(this);
        }

    };

}
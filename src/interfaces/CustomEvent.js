/*

https://dom.spec.whatwg.org/#interface-customevent

[Constructor(DOMString type, optional CustomEventInit eventInitDict), Exposed=(Window,Worker)]
interface CustomEvent : Event

dictionary CustomEventInit : EventInit {
  any detail = null;
};

*/

export default class extends CustomEvent {

    constructor(type, eventInitDict) {
        super(type, eventInitDict);
    }

    // readonly attribute any detail;

    // void initCustomEvent(DOMString type, boolean bubbles, boolean cancelable, any detail);

}
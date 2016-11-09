/*

https://dom.spec.whatwg.org/#interface-eventtarget

[Exposed=(Window,Worker)]
interface EventTarget

callback interface EventListener {
  void handleEvent(Event event);
};

dictionary EventListenerOptions {
  boolean capture = false;
};

dictionary AddEventListenerOptions : EventListenerOptions {
  boolean passive = false;
  boolean once = false;
};

*/

import * as $ from '../utils.js';

export default function (base) {

  const native = {
    addEventListener: base.prototype.addEventListener,
    removeEventListener: base.prototype.removeEventListener
  };

  return class {

    // TODO: impl, tests
    // void addEventListener(DOMString type, EventListener? callback, optional (AddEventListenerOptions or boolean) options);

    // TODO: impl, tests
    // void removeEventListener(DOMString type, EventListener? callback, optional (EventListenerOptions or boolean) options);

  };

}
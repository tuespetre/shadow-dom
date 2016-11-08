/*

https://dom.spec.whatwg.org/#interface-event

[Constructor(DOMString type, optional EventInit eventInitDict), Exposed=(Window,Worker)]
interface Event

*/

const $composed = new WeakMap();

export default class extends Event {

    constructor(type, eventInitDict) {
        super(type, eventInitDict);

        $composed.set(this, (eventInitDict && eventInitDict.composed === true));
    }

    // readonly attribute DOMString type;
    // readonly attribute EventTarget? target;
    // readonly attribute EventTarget? currentTarget;
    // sequence<EventTarget> composedPath();

    // TODO: impl, tests
    composedPath() {
        // https://dom.spec.whatwg.org/#dom-event-composedpath

        const composedPath = [];
        const currentTarget = this.currentTarget;

        // TODO: implement event path and retargeting
        const path = calculatePath(this);

        if (currentTarget instanceof Window) {
            for (const tuple of path) {
                const item = tuple.item;
                if (item instanceof Node) {
                    if (!item.closedShadowHidden) {
                        composedPath.push(item);
                    }
                }
                else {
                    composedPath.push(item);
                }
            }
        }
        else if (currentTarget instanceof Node) {
            for (const tuple of path) {
                const item = tuple.item;
                if (!item.closedShadowHidden) {
                    composedPath.push(item);
                }
            }
        }
        else {
            composedPath.push(...path);
        }

        return composedPath;
    }

    // const unsigned short NONE = 0;
    // const unsigned short CAPTURING_PHASE = 1;
    // const unsigned short AT_TARGET = 2;
    // const unsigned short BUBBLING_PHASE = 3;
    // readonly attribute unsigned short eventPhase;

    // void stopPropagation();
    // void stopImmediatePropagation();

    // readonly attribute boolean bubbles;
    // readonly attribute boolean cancelable;
    // void preventDefault();
    // readonly attribute boolean defaultPrevented;
    // readonly attribute boolean composed;

    get composed() {
        return $composed.get(this);
    }

    // [Unforgeable] readonly attribute boolean isTrusted;
    // readonly attribute DOMTimeStamp timeStamp;

    // void initEvent(DOMString type, boolean bubbles, boolean cancelable); // historical

}

/*

dictionary EventInit {
  boolean bubbles = false;
  boolean cancelable = false;
  boolean composed = false;
};

*/
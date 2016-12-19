export default {
    queueMutationRecord,
    requeueNativeRecords: function () {
        requeueNativeRecords(documentObserver.takeRecords());
    },
    createMutationObserver,
    createTransientObserver,
    registerForMutationObservers,
    signalASlotChange
}

import $microtask from './microtask.js';
import $utils from './utils.js';

const MO_TYPE_ATTRIBUTES = 'attributes';
const MO_TYPE_CHILD_LIST = 'childList';
const MO_TYPE_CHARACTER_DATA = 'characterData';

const mutationObservers = [];
const signalSlotList = [];
const theEmptyList = Object.freeze([]);

let mutationObserverCompoundMicrotaskQueuedFlag = false;

const documentObserver = new MutationObserver(records => {
    requeueNativeRecords(records);
    notifyMutationObservers();
});

registerForMutationObservers(document);

function queueMutationObserverCompoundMicrotask() {
    if (mutationObserverCompoundMicrotaskQueuedFlag) {
        return;
    }
    mutationObserverCompoundMicrotaskQueuedFlag = true;
    $microtask.enqueue(notifyMutationObservers);
}

function getOrCreateNodeObservers(node) {
    const nodeState = $utils.getShadowState(node) || $utils.setShadowState(node, {});
    const observers = nodeState.observers;
    return observers ? observers : nodeState.observers = [];
}

function createMutationObserver(callback) {
    return {
        callback: callback,
        queue: [],
        nodes: [],
        observe: function (node, options) {
            requeueNativeRecords(documentObserver.takeRecords());
            if (this.nodes.length === 0) {
                mutationObservers.push(this);
            }
            const nodeObservers = getOrCreateNodeObservers(node);
            nodeObservers.push({ instance: this, options });
            this.nodes.push(node);
        },
        disconnect: function () {
            let index = mutationObservers.indexOf(this);
            mutationObservers.splice(index, 1);
            for (let i = 0; i < this.nodes.length; i++) {
                const nodeObservers = getOrCreateNodeObservers(this.nodes[i]);
                for (let j = 0; j < nodeObservers.length; j++) {
                    if (nodeObservers[j].instance === this) {
                        nodeObservers.splice(j, 1);
                        break;
                    }
                }
            }
            this.nodes = [];
        }
    };
}

function createTransientObserver(observer, node, options) {
    const transientObserver = {
        observer: observer,
        callback: observer.callback,
        options: options,
        queue: [],
        node: node,
        disconnect: function () {
            const nodeObservers = getOrCreateNodeObservers(this.node);
            for (let j = 0; j < nodeObservers.length; j++) {
                if (nodeObservers[j].instance === this) {
                    nodeObservers.splice(j, 1);
                    break;
                }
            }
        }
    };

    const nodeObservers = getOrCreateNodeObservers(node);
    nodeObservers.push({ instance: transientObserver, options });

    return transientObserver;
}

function queueMutationRecord(type, target, name, nameSpace, oldValue, addedNodes, removedNodes, previousSibling, nextSibling) {
    // PERF: This is an out-of-spec optimization
    if (mutationObservers.length === 0) {
        return;
    }

    // https://dom.spec.whatwg.org/#queueing-a-mutation-record
    // 1. Let interested observers be an initially empty set of 
    // MutationObserver objects optionally paired with a string.
    const interestedObservers = [];
    const pairedStrings = [];
    // 2. Let nodes be the inclusive ancestors of target.
    const nodes = [target];
    let ancestor = target;
    while (ancestor = ancestor.parentNode) {
        nodes.push(ancestor)
    }
    // 3. Then, for each node in nodes... 
    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const nodeState = $utils.getShadowState(node);
        if (!nodeState || !nodeState.observers) {
            continue;
        }
        // ...and then for each registered observer (with registered 
        // observer’s options as options) in node’s list of registered 
        // observers...
        for (let j = 0; j < nodeState.observers.length; j++) {
            const registeredObserver = nodeState.observers[j];
            const options = registeredObserver.options;
            // ...run these substeps:
            // 1. If none of the following are true:
            if (node != target && !options.subtree) {
                continue;
            }
            if (type === MO_TYPE_ATTRIBUTES) {
                if (!options.attributes) {
                    continue;
                }
                // if options' attributeFilter is present, and options' attributeFilter
                // does not contain name or namespace is non-null
                if (options.attributeFilter &&
                    (options.attributeFilter.indexOf(name) === -1 ||
                        nameSpace != null)) {
                    continue;
                }
            }
            if (type === MO_TYPE_CHARACTER_DATA && !options.characterData) {
                continue;
            }
            if (type === MO_TYPE_CHILD_LIST && !options.childList) {
                continue;
            }
            // ...then run the subsubsteps:
            // 1. If registered observer’s observer is not in interested observers, 
            // append registered observer’s observer to interested observers.
            const observer = registeredObserver.instance;
            let index = interestedObservers.indexOf(observer);
            if (index === -1) {
                index = interestedObservers.length;
                interestedObservers[index] = observer;
            }
            // 2. If either type is "attributes" and options’ attributeOldValue is true, 
            // or type is "characterData" and options’ characterDataOldValue is true, 
            // set the paired string of registered observer’s observer in interested observers to oldValue.
            if ((type === MO_TYPE_ATTRIBUTES && options.attributeOldValue) ||
                (type === MO_TYPE_CHARACTER_DATA && options.characterDataOldValue)) {
                pairedStrings[index] = oldValue;
            }
        }
    }

    // PERF: This is an out-of-spec optimization
    if (interestedObservers.length === 0) {
        return;
    }

    // 4. Then, for each observer in interested observers, run these substeps:
    for (let i = 0; i < interestedObservers.length; i++) {
        const observer = interestedObservers[i];
        // 1. Let record be a new MutationRecord object with its type set to type and target set to target.
        const record = {
            type,
            target,
            attributeName: null,
            attributeNamespace: null,
            addedNodes: theEmptyList,
            removedNodes: theEmptyList,
            previousSibling: null,
            nextSibling: null,
            oldValue: null
        };
        // 2. If name and namespace are given, set record’s attributeName to name, and record’s attributeNamespace to namespace.
        if (name) {
            record.attributeName = name;
            record.attributeNamespace = nameSpace;
        }
        // 3. If addedNodes is given, set record’s addedNodes to addedNodes.
        if (addedNodes) {
            record.addedNodes = addedNodes;
            if (addedNodes instanceof Array) {
                record.addedNodes = addedNodes.slice();
            }
        }
        // 4. If removedNodes is given, set record’s removedNodes to removedNodes.
        if (removedNodes) {
            record.removedNodes = removedNodes;
            if (removedNodes instanceof Array) {
                record.removedNodes = removedNodes.slice();
            }
        }
        // 5. If previousSibling is given, set record’s previousSibling to previousSibling.
        if (previousSibling) {
            record.previousSibling = previousSibling;
        }
        // 6. If nextSibling is given, set record’s nextSibling to nextSibling.
        if (nextSibling) {
            record.nextSibling = nextSibling;
        }
        // 7. If observer has a paired string, set record’s oldValue to observer’s paired string.
        record.oldValue = pairedStrings[i];
        // 8. Append record to observer’s record queue.
        observer.queue.push(record);
    }

    // 5. Queue a mutation observer compound microtask.
    queueMutationObserverCompoundMicrotask();
}

function requeueNativeRecords(records) {
    const recordsCount = records.length;
    for (let i = 0; i < recordsCount; i++) {
        const record = records[i];
        queueMutationRecord(
            record.type,
            record.target,
            record.attributeName,
            record.attributeNamespace,
            record.oldValue,
            record.addedNodes,
            record.removedNodes,
            record.previousSibling,
            record.nextSibling);
    }
}

function registerForMutationObservers(node) {
    documentObserver.observe(node, { 
        attributes: true, 
        characterData: true,
        attributeOldValue: true,
        characterDataOldValue: true,
        subtree: true
    });
}

function notifyMutationObservers() {
    mutationObserverCompoundMicrotaskQueuedFlag = false;
    const notifyList = mutationObservers.slice();
    const signalList = signalSlotList.splice(0, signalSlotList.length);
    for (let i = 0; i < notifyList.length; i++) {
        const observer = notifyList[i];
        const queue = observer.queue.splice(0, observer.queue.length);
        for (let j = mutationObservers.length - 1; j >= 0; j--) {
            const transientObserver = mutationObservers[j];
            if (transientObserver.observer === observer) {
                mutationObservers.splice(j, 1);
                transientObserver.disconnect();
            }
        }
        if (queue.length) {
            try {
                observer.callback.call(observer.interface, queue, observer.interface);
            }
            catch (error) {
                $utils.reportError(error);
            }
        }
    }
    // TODO: verify that observers fire after slot change
    for (let i = 0; i < signalList.length; i++) {
        const slot = signalList[i];
        // 'Event' is capitalized for Webkit.
        const event = slot.ownerDocument.createEvent('Event');
        event.initEvent('slotchange', true, false);
        try {
            slot.dispatchEvent(event);
        }
        catch (error) {
            $utils.reportError(error);
        }
    }
}

// https://dom.spec.whatwg.org/#signaling-slot-change

function signalASlotChange(slot) {
    // https://dom.spec.whatwg.org/#signal-a-slot-change
    // To signal a slot change, for a slot slot, run these steps:

    // 1. If slot is not in unit of related similar-origin browsing contexts' 
    // signal slot list, append slot to unit of related similar-origin browsing 
    // contexts' signal slot list.
    if (signalSlotList.indexOf(slot) === -1) {
        signalSlotList.push(slot);
    }

    // 2. Queue a mutation observer compound microtask.
    queueMutationObserverCompoundMicrotask();
}
export default {
    enqueue
};

let triggered = false;
const queue = new Array();
const trigger = document.createElement('span');
const observer = new MutationObserver(process);
observer.observe(trigger, { attributes: true });

function enqueue(microtask) {
    queue.push(microtask);
    if (!triggered) {
        trigger.hidden = !trigger.hidden;
        triggered = true;
    }
}

function process() {
    triggered = false;
    queue.splice(0, queue.length).forEach(microtask => microtask());
}
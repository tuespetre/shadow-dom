import $ce from './custom-elements.js';
import $dom from './dom.js';

const nativeRemoveChild = Node.prototype.removeChild;
const nativeAppendChild = Node.prototype.appendChild;
const nativeCreateTextNode = Document.prototype.createTextNode;

$dom.registerInsertingSteps(function (node) {
    // Is it even a stylesheet?
    if (!(node instanceof HTMLStyleElement)) {
        return;
    }

    // Is it even in a shadow root?
    const root = $dom.root(node);
    if (!$dom.isShadowRoot(root)) {
        return;
    }

    // Is it even a valid custom element name or ANYTHING?
    const host = root.host;
    if (!$ce.isValidCustomElementName(host.localName)) {
        return;
    }

    let text = node.textContent;

    text = text.replace(/:host-context\((.*)\)/, (match, selector) => `${selector} ${host.localName}`);

    text = text.replace(/:host\((.*)\)/, (match, selector) => `${host.localName}${selector}`);

    text = text.replace(/([A-Za-z0-9\.\-\_\[\]\(\)\'\"\=\:]+)?::slotted\((.*)\)/, (match, preselector, selector) => {
        const slotSelector = preselector || 'slot';
        console.log({ match, preselector, selector });
        return `${host.localName} ${slotSelector} > ${selector}`;
    });

    text = text.replace(/:host/, () => host.localName);
    
    let firstChild;
    while (firstChild = node.firstChild) {
        nativeRemoveChild.call(node, node.firstChild);
    }
    nativeAppendChild.call(node, nativeCreateTextNode.call(node.ownerDocument, text));
});
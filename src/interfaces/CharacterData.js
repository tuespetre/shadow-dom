// https://dom.spec.whatwg.org/#interface-characterdata

import $dom from '../dom.js';
import $utils from '../utils.js';

export default {
    install
};

function install() {
    if ($utils.brokenAccessors) {
        [Text, ProcessingInstruction, Comment].forEach(type => {
            const passthroughSetter = function (value) {
                this.data = value;
            };
            const newDataDescriptor = {
                get: function () {
                    delete type.prototype['data'];
                    const value = this.data;
                    $utils.defineProperty(type.prototype, 'data', newDataDescriptor);
                    return value;
                },
                set: function (value) {
                    delete type.prototype['data'];
                    $dom.replaceData(this, 0, this.data.length, value, passthroughSetter);
                    $utils.defineProperty(type.prototype, 'data', newDataDescriptor);
                    return void(0);
                }
            };
            $utils.defineProperty(type.prototype, 'data', newDataDescriptor);
            $utils.extend(type, makeMethodDescriptors(function (value) {
                delete type.prototype['data'];
                this.data = value;
                $utils.defineProperty(type.prototype, 'data', newDataDescriptor);
            }));
        });
    }
    else {
        const originalDataDescriptor = $utils.descriptor(CharacterData, 'data');
        const newDataDescriptor = {
            get: originalDataDescriptor.get,
            set: function (value) {
                $dom.replaceData(this, 0, this.data.length, value, originalDataDescriptor.set);
            }
        };
        $utils.defineProperty(CharacterData.prototype, 'data', newDataDescriptor);
        $utils.extend(CharacterData, makeMethodDescriptors(originalDataDescriptor.set));
    }
}

function makeMethodDescriptors(dataSetter) {
    return {
        appendData(data) {
            $dom.replaceData(this, this.data.length, 0, data, dataSetter);
        },

        insertData(offset, data) {
            $dom.replaceData(this, offset, 0, data, dataSetter);
        },

        deleteData(offset, count) {
            $dom.replaceData(this, offset, count, '', dataSetter);
        },

        replaceData(offset, count, data) {
            $dom.replaceData(this, offset, count, data, dataSetter);
        },
    };
}
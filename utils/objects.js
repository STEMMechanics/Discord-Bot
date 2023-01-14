module.exports = {
    get: function(object, key, def = undefined) {
        const keyParts = key.split(".");
        let returnValue = object;
        for (let i = 0; i < keyParts.length; i++) {
            const part = keyParts[i];
            if (returnValue) {
                returnValue = returnValue[part];
            }
            else {
                break;
            }
        }

        if (returnValue) {
            return returnValue;
        }

        return def;
    },

    set: function(object, key, value) {
        const keyParts = key.split(".");
        let objectRef = object;
        keyParts.forEach((part, index) => {
            if (keyParts.length - 1 === index) {
                return;
            }
            if (!objectRef[part]) {
                objectRef[part] = {};
            }
            objectRef = objectRef[part];
        });
        const finalKey = keyParts[keyParts.length - 1];
        if (finalKey !== "__proto__" && finalKey !== "constructor") {
            objectRef[finalKey] = value;
        }
        return object;
    },

    increment: function(object, key) {
        var val = module.exports.get(object, key, 0);
        val++;
        module.exports.set(object, key, val);
    },

    decrement: function(object, key) {
        var val = module.exports.get(object, key, 0);
        val--;
        module.exports.set(object, key, val);
    },

    delete: function(object, keys) {
        (Array.isArray(keys) ? keys : [keys]).forEach((key) => {
            const keyParts = (typeof key === "number" ? `${key}` : key).split(".");
            if (keyParts.length === 1) {
                if (Array.isArray(object)) {
                    object.splice(parseInt(keyParts[0]), 1);
                }
                else {
                    delete object[keyParts[0]];
                }
            }
            else {
                const lastKey = keyParts.pop();
                const nextLastKey = keyParts.pop();
                const nextLastObj = keyParts.reduce((a, key) => a[key], object);
                if (Array.isArray(nextLastObj[nextLastKey])) {
                    nextLastObj[nextLastKey].splice(parseInt(lastKey), 1);
                }
                else if (typeof nextLastObj[nextLastKey] !== "undefined" && nextLastObj[nextLastKey] !== null) {
                    delete nextLastObj[nextLastKey][lastKey];
                }
            }
        });
        return object;
    }
}

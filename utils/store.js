const { ModalBuilder } = require('@discordjs/builders');
const fs = require('fs');
const objects = require('objects.js');

module.exports = {
    filePath: './store.json',
    data: null,
    load: function() {
        if(module.exports.data == null) {
            if (fs.existsSync(module.exports.filePath)) {
                var fileData = fs.readFileSync(module.exports.filePath);
                try {
                    module.exports.data = JSON.parse(fileData);
                } catch (error) {
                    console.log('There has been an error parsing the store JSON.')
                    console.log(error);
                }
            } else {
                module.exports.data = {};
            }
        }
    },
    save: function() {
        fs.writeFile(module.exports.filePath, JSON.stringify(module.exports.data), function (error) {
            if (error) {
                console.log('There has been an error saving the store data.');
                console.log(error.message);
            }
        });
    },
    get: function (key, def = undefined) {
        module.exports.load();
        return objects.get(module.exports.data, key, def);
    },
    set: function (key, val, save = true) {
        module.exports.load();
        objects.set(module.exports.data, key, val);
        if (save) {
            module.exports.save();
        }
    },
    increment: function (key, save = true) {
        module.exports.load();
        objects.increment(module.exports.data, key);
        if (save) {
            module.exports.save();
        }
    },
    decrement: function (key, save = true) {
        module.exports.load();
        objects.decrement(module.exports.data, key);
        if (save) {
            module.exists.save();
        }
    },
    exists: function(key) {
        module.exports.load();
        return(objects.get(module.exports.data, key) == undefined);
    }
}

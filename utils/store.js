const fs = require('fs');
const objects = require('./objects');

module.exports = {
  filePath: './store.json',
  data: null,
  load() {
    if (module.exports.data == null) {
      if (fs.existsSync(module.exports.filePath)) {
        const fileData = fs.readFileSync(module.exports.filePath);
        try {
          module.exports.data = JSON.parse(fileData);
        } catch (error) {
          /* empty */
        }
      } else {
        module.exports.data = {};
      }
    }
  },
  save() {
    fs.writeFile(module.exports.filePath, JSON.stringify(module.exports.data), (error) => {
      if (error) {
        /* empty */
      }
    });
  },
  get(key, def = undefined) {
    module.exports.load();
    return objects.get(module.exports.data, key, def);
  },
  set(key, val, save = true) {
    module.exports.load();
    objects.set(module.exports.data, key, val);
    if (save) {
      module.exports.save();
    }
  },
  increment(key, save = true) {
    module.exports.load();
    objects.increment(module.exports.data, key);
    if (save) {
      module.exports.save();
    }
  },
  decrement(key, save = true) {
    module.exports.load();
    objects.decrement(module.exports.data, key);
    if (save) {
      module.exists.save();
    }
  },
  exists(key) {
    module.exports.load();
    return (objects.get(module.exports.data, key) === undefined);
  },
};

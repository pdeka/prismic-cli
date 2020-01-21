'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function configFile() {
  var home = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
  return _path2.default.join(home, '.prismic');
}

function save(data) {
  return new _promise2.default(function (resolve, reject) {
    _fs2.default.writeFile(configFile(), data, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

function read() {
  return new _promise2.default(function (resolve, reject) {
    var file = configFile();
    _fs2.default.stat(file, function (err) {
      if (err) {
        // File doesn't exist
        resolve({});
      } else {
        _fs2.default.readFile(file, 'utf8', function (errfile, data) {
          if (err) {
            return reject(errfile);
          }
          return resolve(data);
        });
      }
    });
  });
}

exports.default = {
  getAll: function getAll() {
    return read().then(function (json) {
      try {
        return JSON.parse(json);
      } catch (ex) {
        return {};
      }
    });
  },
  get: function get(key) {
    return this.getAll().then(function (all) {
      return all[key];
    });
  },
  set: function set(values) {
    return this.getAll().then(function (all) {
      _lodash2.default.extend(all, values);
      var json = (0, _stringify2.default)(all, null, 4);
      return save(json);
    });
  }
};
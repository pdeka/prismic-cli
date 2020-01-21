'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _admZip = require('adm-zip');

var _admZip2 = _interopRequireDefault(_admZip);

var _tmp = require('tmp');

var _tmp2 = _interopRequireDefault(_tmp);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _shelljs = require('shelljs');

var _shelljs2 = _interopRequireDefault(_shelljs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  get: function get(templates, name) {
    var template = templates.find(function (tmpl) {
      return tmpl.name === name;
    });
    if (!template) {
      throw new Error('Error: invalid template ' + name);
    }
    return template;
  },
  getDisplayed: function getDisplayed(templates) {
    return templates.filter(function (t) {
      return !t.isQuickstart;
    });
  },
  getOrDefault: function getOrDefault(templates, name) {
    var t = templates.find(function (tmpl) {
      return tmpl.name === name;
    });
    return t || templates[0];
  },
  unzip: function unzip(templateURL, innerFolder) {
    var tmpZipFile = _tmp2.default.tmpNameSync();
    var tmpFolder = _tmp2.default.dirSync().name;
    return new _promise2.default(function (resolve, reject) {
      (0, _request2.default)({ uri: templateURL }).pipe(_fs2.default.createWriteStream(tmpZipFile)).on('close', function () {
        try {
          var zip = new _admZip2.default(tmpZipFile);
          var tmpInner = innerFolder ? _path2.default.join(tmpFolder, innerFolder) : tmpFolder;
          zip.extractAllTo(tmpFolder, /* overwrite */true);
          _shelljs2.default.rm(tmpZipFile);
          resolve(tmpInner);
        } catch (e) {
          reject(e);
        }
      });
    });
  },
  replace: function replace(folder, template, data) {
    var configPath = _path2.default.join(folder, template.configuration);
    if (_shelljs2.default.test('-f', configPath)) {
      data.forEach(function (rule) {
        _shelljs2.default.sed('-i', rule.pattern, rule.value, configPath);
      });
    }
  }
};
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  post: function post(url, data, cookies) {
    var options = {
      followRedirect: false,
      form: data
    };
    if (cookies) {
      options.headers = { cookie: cookies };
    }
    return new _promise2.default(function (resolve, reject) {
      _request2.default.post(url, options, function (err, xhr) {
        if (err) {
          reject(xhr.statusCode);
          return;
        }
        if (xhr.statusCode === 200 || Math.floor(xhr.statusCode / 100) === 3) {
          var setCookies = xhr.headers['set-cookie'];
          if (setCookies) {
            var formattedCookie = setCookies.join(';');
            _config2.default.set({ cookies: formattedCookie }).then(function () {
              resolve();
            });
          } else resolve();
        } else {
          reject(xhr.statusCode);
        }
      });
    });
  },
  get: function get(url, cookies) {
    return new _promise2.default(function (resolve, reject) {
      var options = {};
      if (cookies) {
        options.headers = { cookie: cookies };
      }
      _request2.default.get(url, options, function (err, xhr, body) {
        if (err) {
          reject(err);
          return;
        }
        if (xhr.statusCode === 200) {
          var setCookies = xhr.headers['set-cookie'];
          if (setCookies) {
            _config2.default.set({ cookies: setCookies[0] }).then(function () {
              resolve(body);
            });
          } else resolve(body);
          return;
        }
        reject();
      });
    });
  }
};
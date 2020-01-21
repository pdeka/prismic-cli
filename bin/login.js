'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.default = signinWithCredentials;

var _inquirer = require('inquirer');

var _inquirer2 = _interopRequireDefault(_inquirer);

var _communication = require('./communication');

var _communication2 = _interopRequireDefault(_communication);

var _helpers = require('./helpers');

var _helpers2 = _interopRequireDefault(_helpers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function promptCredentials(email) {
  return _inquirer2.default.prompt([{
    type: 'input',
    name: 'email',
    message: 'Email: ',
    default: email,
    validate: function validate(mail) {
      return mail && mail.length > 0;
    }
  }, {
    type: 'password',
    name: 'password',
    message: 'Password: '
  }]);
}

function signinWithCredentials(base, email, password) {
  return new _promise2.default(function (resolve) {
    function run() {
      var answersP = email && password ? _promise2.default.resolve({ email: email, password: password }) : promptCredentials(email);
      answersP.then(function (credentials) {
        var url = base + '/authentication/signin';
        return _communication2.default.post(url, credentials).then(function () {
          return resolve();
        }).catch(function () {
          _helpers2.default.UI.display('Login error, check your credentials. If you forgot your password, visit ' + base + ' to reset it.');
          run();
        });
      });
    }
    run();
  });
}
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _inquirer = require('inquirer');

var _inquirer2 = _interopRequireDefault(_inquirer);

var _communication = require('./communication');

var _communication2 = _interopRequireDefault(_communication);

var _helpers = require('./helpers');

var _helpers2 = _interopRequireDefault(_helpers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function prompt() {
  return _inquirer2.default.prompt([{
    type: 'input',
    name: 'email',
    message: 'Email: ',
    validate: function validate(email) {
      return email && email.length > 0;
    }
  }, {
    type: 'password',
    name: 'password',
    message: 'Password: '
  }]);
}

function query(base, email, password) {
  var url = base + '/authentication/signup';
  var data = {
    email: email,
    password: password
  };
  return _communication2.default.post(url, data);
}

function exec(base) {
  return new _promise2.default(function (resolve) {
    function run() {
      return prompt().then(function (answers) {
        query(base, answers.email, answers.password).then(function () {
          return resolve();
        }).catch(function (err) {
          if (err) {
            var _JSON$parse = JSON.parse(err),
                errors = _JSON$parse.errors;

            _helpers2.default.UI.displayErrors(errors);
          }
          run();
        });
      });
    }
    return run();
  });
}
exports.default = exec;
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _inquirer = require('inquirer');

var _inquirer2 = _interopRequireDefault(_inquirer);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function prompt(newBase) {
  return _inquirer2.default.prompt([{
    type: 'input',
    name: 'base',
    message: 'New base domain: (staff only, ex: https://prismic.io )',
    default: newBase
  }]);
}

function exec(newBase) {
  var res;
  return _regenerator2.default.async(function exec$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          res = newBase ? _promise2.default.resolve({ base: newBase }) : prompt();
          return _context.abrupt('return', res.then(function (answers) {
            return _config2.default.set({
              base: answers.base,
              cookies: '' // clear the cookie because it won't be valid with the new base
            }).then(function () {
              return answers.base;
            });
          }).catch(function (err) {
            process.stdout.write('Error: ' + err + '\n');
          }));

        case 2:
        case 'end':
          return _context.stop();
      }
    }
  }, null, this);
}

exports.default = exec;
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _inquirer = require('inquirer');

var _inquirer2 = _interopRequireDefault(_inquirer);

var _signup = require('./signup');

var _signup2 = _interopRequireDefault(_signup);

var _login = require('./login');

var _login2 = _interopRequireDefault(_login);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _helpers = require('./helpers');

var _helpers2 = _interopRequireDefault(_helpers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function promptSignupOrLogin(base) {
  return _inquirer2.default.prompt([{
    type: 'list',
    name: 'login',
    message: 'Do you already have an account on ' + base + '?',
    choices: [{
      name: 'Yes, login to my existing account',
      value: 'login'
    }, {
      name: 'No, create a new account',
      value: 'create'
    }]
  }]);
}

function signupOrLogin(base) {
  var answers;
  return _regenerator2.default.async(function signupOrLogin$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return _regenerator2.default.awrap(promptSignupOrLogin(base));

        case 2:
          answers = _context.sent;

          if (!(answers.login === 'login')) {
            _context.next = 5;
            break;
          }

          return _context.abrupt('return', (0, _login2.default)(base));

        case 5:
          return _context.abrupt('return', (0, _signup2.default)(base));

        case 6:
        case 'end':
          return _context.stop();
      }
    }
  }, null, this);
}

function connect(base, args, noconfirm) {
  var email, password, cookies, cookiesPromise;
  return _regenerator2.default.async(function connect$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          email = args['--email'];
          password = args['--password'];
          _context2.next = 4;
          return _regenerator2.default.awrap(_config2.default.get('cookies'));

        case 4:
          cookies = _context2.sent;
          cookiesPromise = void 0;

          if (!cookies) {
            _context2.next = 10;
            break;
          }

          cookiesPromise = cookies;
          _context2.next = 20;
          break;

        case 10:
          if (!(email && password)) {
            _context2.next = 16;
            break;
          }

          _context2.next = 13;
          return _regenerator2.default.awrap((0, _login2.default)(base, email, password));

        case 13:
          cookiesPromise = _config2.default.get('cookies');
          _context2.next = 20;
          break;

        case 16:
          if (noconfirm) {
            // Can't proceed non-interactively if we can't login!
            _helpers2.default.UI.display('Error: to use noconfirm, login first or pass the email/password as options.');
            cookiesPromise = null;
          }
          // No login/pass, no cookie => need to signin or signup the user before we proceed
          _context2.next = 19;
          return _regenerator2.default.awrap(signupOrLogin(base));

        case 19:
          cookiesPromise = _config2.default.get('cookies');

        case 20:
          return _context2.abrupt('return', cookiesPromise);

        case 21:
        case 'end':
          return _context2.stop();
      }
    }
  }, null, this);
}

exports.default = { connect: connect };
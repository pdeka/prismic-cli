#!/usr/bin/env node
'use strict';

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _commandLineCommands = require('command-line-commands');

var _commandLineCommands2 = _interopRequireDefault(_commandLineCommands);

var _commandLineUsage = require('command-line-usage');

var _commandLineUsage2 = _interopRequireDefault(_commandLineUsage);

var _login = require('./login');

var _login2 = _interopRequireDefault(_login);

var _signup = require('./signup');

var _signup2 = _interopRequireDefault(_signup);

var _repository = require('./repository');

var _repository2 = _interopRequireDefault(_repository);

var _helpers = require('./helpers');

var _helpers2 = _interopRequireDefault(_helpers);

var _template = require('./template');

var _template2 = _interopRequireDefault(_template);

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

var _package = require('../package.json');

var _package2 = _interopRequireDefault(_package);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// === Help

// TODO:
// - specific runtime instructions from the template, directly on prompt?

function help() {
  console.log((0, _commandLineUsage2.default)([{
    header: 'Synopsis',
    content: '$ prismic <command> <domain> <options>'
  }, {
    header: 'Examples',
    content: [{ name: '$ prismic init', summary: 'Create a project from an existing prismic repository.' }, { name: '$ prismic new', summary: 'Create a project with a new prismic repository.' }, { name: '$ prismic init foobar', summary: 'Create a project for the foobar repository' }, { name: '$ prismic init foobar --folder ~/Desktop/myProject --template NodeJS --noconfirm', summary: 'Create a NodeJS project, non-interactive' }, { name: '$ prismic theme https://github.com/prismicio/nodejs-sdk', summary: 'Create a project from a zip file with a new prismic repository.' }]
  }, {
    header: 'Command List',
    content: [{ name: 'quickstart', summary: 'Create a project: initialize a node.js quickstart project with a new prismic repository.' }, { name: 'init', summary: 'Initialize a project: initialize the code from a template for an existing prismic repository.' }, { name: 'new', summary: 'Create a project: initialize the code for a new prismic repository.' }, { name: 'theme', summary: 'Create a project: initialize project from a theme with a new prismic repository.' }, { name: 'login', summary: 'Login to an existing prismic.io account.' }, { name: 'logout', summary: 'Logout from an existing prismic.io account.' }, { name: 'signup', summary: 'Create a new prismic.io account.' }, { name: 'list', summary: 'List the available code templates.' }, { name: 'version', summary: 'Print the version.' }]
  }, {
    header: 'Options',
    optionList: [{ name: 'email', description: 'The email of the account to use.' }, { name: 'password', description: 'The password of the account to use.' }, { name: 'folder', description: 'The folder to create the new project.' }, { name: 'template', description: 'Project template to use (see the list command for available templates).' }, { name: 'noconfirm', description: 'Prevent the interactive mode. Fails if informations are missing.' }, { name: 'conf', description: 'Specify path to prismic configuration file. Used with `theme` command.' }, { name: 'ignore-conf', description: 'Ignores prismic configuration file. Used with `theme` command.' }]
  }]));
}

// === Commands

function version() {
  _helpers2.default.UI.display(_package2.default.version);
}

function init(config, domain, args, theme) {
  var base, templates;
  return _regenerator2.default.async(function init$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          base = config.base || _helpers2.default.Domain.default;

          if (args['--new'] && _helpers2.default.Domain.default !== base) {
            _helpers2.default.UI.display('CAREFUL, your current base is: ' + base + '\n');
          }

          _helpers2.default.UI.display('Let\'s get to it!');
          _context.next = 5;
          return _regenerator2.default.awrap(_helpers2.default.Prismic.templates());

        case 5:
          templates = _context.sent;

          _repository2.default.create(templates, base, domain, args, theme).catch(function (err) {
            _helpers2.default.UI.display('Repository creation aborted: ' + err);
          });

        case 7:
        case 'end':
          return _context.stop();
      }
    }
  }, null, this);
}

function initWithTheme(config, url, args) {
  var opts, theme;
  return _regenerator2.default.async(function initWithTheme$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          opts = {
            configPath: args['--conf'] || _helpers2.default.Theme.defaultConfigPath,
            ignoreConf: args['--ignore-conf']
          };
          _context2.next = 4;
          return _regenerator2.default.awrap(_repository2.default.validateTheme(url, opts));

        case 4:
          theme = _context2.sent;
          _context2.next = 7;
          return _regenerator2.default.awrap(init(config, args['--domain'], args, theme));

        case 7:
          return _context2.abrupt('return', _context2.sent);

        case 10:
          _context2.prev = 10;
          _context2.t0 = _context2['catch'](0);
          return _context2.abrupt('return', _helpers2.default.UI.display('Repository creation aborted: ' + _context2.t0));

        case 13:
        case 'end':
          return _context2.stop();
      }
    }
  }, null, this, [[0, 10]]);
}

// For testing only
function heroku(config, args) {
  var templates;
  return _regenerator2.default.async(function heroku$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          templates = _helpers2.default.Prismic.templates();

          try {
            _repository2.default.heroku(templates, args['--template']);
          } catch (err) {
            _helpers2.default.UI.display(err);
          }

        case 2:
        case 'end':
          return _context3.stop();
      }
    }
  }, null, this);
}

function signup(config, args) {
  var base;
  return _regenerator2.default.async(function signup$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          base = config.base || _helpers2.default.Domain.default;
          _context4.next = 3;
          return _regenerator2.default.awrap((0, _signup2.default)(base, args['--email'], args['--password']));

        case 3:
          _helpers2.default.UI.display('Successfully created your account! You can now create repositories.');

        case 4:
        case 'end':
          return _context4.stop();
      }
    }
  }, null, this);
}

function login(config, args) {
  var base, email, password;
  return _regenerator2.default.async(function login$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          base = config.base || _helpers2.default.Domain.default;
          email = args['--email'];
          password = args['--password'];
          _context5.next = 5;
          return _regenerator2.default.awrap((0, _login2.default)(base, email, password));

        case 5:
          _helpers2.default.UI.display('Successfully logged in! You can now create repositories.');

        case 6:
        case 'end':
          return _context5.stop();
      }
    }
  }, null, this);
}

function logout() {
  return _regenerator2.default.async(function logout$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          _context6.next = 3;
          return _regenerator2.default.awrap(_config2.default.set({ cookies: '' }));

        case 3:
          // clear the cookies
          _helpers2.default.UI.display('Successfully logged out !');
          _context6.next = 9;
          break;

        case 6:
          _context6.prev = 6;
          _context6.t0 = _context6['catch'](0);

          console.log(_context6.t0);

        case 9:
        case 'end':
          return _context6.stop();
      }
    }
  }, null, this, [[0, 6]]);
}

function list() {
  var templates;
  return _regenerator2.default.async(function list$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _helpers2.default.UI.display('Available templates:');
          _context7.next = 3;
          return _regenerator2.default.awrap(_helpers2.default.Prismic.templates());

        case 3:
          templates = _context7.sent;

          _helpers2.default.UI.display(_template2.default.getDisplayed(templates).map(function (template) {
            return '* ' + template.name;
          }));

        case 5:
        case 'end':
          return _context7.stop();
      }
    }
  }, null, this);
}

// Should only be used by staff, which is why it's not documented
// prismic base http://wroom.dev
function updateBase(base) {
  var newBase;
  return _regenerator2.default.async(function updateBase$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.next = 2;
          return _regenerator2.default.awrap((0, _base2.default)(base));

        case 2:
          newBase = _context8.sent;

          _helpers2.default.UI.display('Successfully changed base ' + newBase + ' !');

        case 4:
        case 'end':
          return _context8.stop();
      }
    }
  }, null, this);
}

// === Main function

function parseArguments(args) {
  var withValueRegex = new RegExp('^--.+$');
  var argts = {};
  var current = null;
  args.forEach(function (value) {
    if (value.match(withValueRegex)) {
      argts[value] = true;
      current = value;
    } else {
      argts[current] = value;
    }
  });
  return argts;
}

function main() {
  var validCommands = [null, 'init', 'new', 'theme', 'quickstart', 'heroku', 'login', 'logout', 'signup', 'base', 'version', 'list'];
  var arr = (0, _commandLineCommands2.default)(validCommands);
  var command = arr.command;

  var firstArg = null;
  if (arr.argv.length > 0 && arr.argv[0].indexOf('--') !== 0) {
    firstArg = arr.argv.shift();
  }
  var args = parseArguments(arr.argv);
  _config2.default.getAll().then(function (config) {
    switch (command) {
      case 'login':
        login(config, args);
        break;
      case 'logout':
        logout(config, args);
        break;
      case 'signup':
        signup(config, args);
        break;
      case 'init':
        init(config, firstArg, args);
        break;
      case 'new':
        init(config, firstArg, (0, _assign2.default)(args, { '--new': true }));
        break;
      case 'quickstart':
        _helpers2.default.Prismic.templates().then(function (templates) {
          var t = templates.find(function (tmpl) {
            return tmpl.isQuickstart === true;
          });
          if (t) {
            init(config, firstArg, (0, _assign2.default)(args, { '--new': true, '--template': t.name }));
          } else {
            _helpers2.default.UI.display('Invalid quickstart template');
          }
        });
        break;
      case 'theme':
        initWithTheme(config, firstArg, (0, _assign2.default)(args, { '--new': true }));
        break;
      case 'heroku':
        heroku(config, args);
        break;
      case 'list':
        list();
        break;
      case 'base':
        _helpers2.default.UI.display('Current base: ' + config.base + '\n');
        updateBase(firstArg);
        break;
      case 'version':
        version(config);
        break;
      default:
        help(config);
    }
  });
}

try {
  main();
} catch (ex) {
  console.log(ex.message);
  help();
}
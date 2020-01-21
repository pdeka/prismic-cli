'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _inquirer = require('inquirer');

var _inquirer2 = _interopRequireDefault(_inquirer);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _shelljs = require('shelljs');

var _shelljs2 = _interopRequireDefault(_shelljs);

var _communication = require('./communication');

var _communication2 = _interopRequireDefault(_communication);

var _helpers = require('./helpers');

var _helpers2 = _interopRequireDefault(_helpers);

var _authentication = require('./authentication');

var _authentication2 = _interopRequireDefault(_authentication);

var _template = require('./template');

var _template2 = _interopRequireDefault(_template);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var isWin = /^win/.test(process.platform);

function queryCreateRepositoryWithCookie(base, domain, cookies, customTypes, signedDocuments, users) {
  var url = base + '/authentication/newrepository';
  var data = {
    domain: domain,
    plan: 'personal',
    isAnnual: 'false'
  };
  if (customTypes) data['custom-types'] = (0, _stringify2.default)(customTypes);
  if (signedDocuments) {
    data.signature = signedDocuments.signature;
    data.documents = (0, _stringify2.default)(signedDocuments.docs);
  }
  if (users) data.users = users;
  return _communication2.default.post(url, data, cookies);
}

function queryCreateRepositoryWithToken(base, domain, token, customTypes, signedDocuments, users) {
  var matches = base.match(/(https?:\/\/)(.*)/);
  var protocol = matches[1];
  var plateform = matches[2];
  var url = protocol + 'api.' + plateform + '/management/repositories?access_token=' + token;
  var data = {
    domain: domain,
    plan: 'personal',
    isAnnual: 'false'
  };
  if (customTypes) data['custom-types'] = (0, _stringify2.default)(customTypes);
  if (signedDocuments) {
    data.signature = signedDocuments.signature;
    data.documents = (0, _stringify2.default)(signedDocuments.docs);
  }
  if (users) data.users = users;
  return _communication2.default.post(url, data);
}

function createWithDomain(base, domain, args, customTypes, signedDocuments, users, noconfirm) {
  var oauthAccessToken, eventuallyCreateRepository, cookies;
  return _regenerator2.default.async(function createWithDomain$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          oauthAccessToken = args['--oauthaccesstoken'];
          eventuallyCreateRepository = void 0;

          if (!oauthAccessToken) {
            _context.next = 6;
            break;
          }

          eventuallyCreateRepository = queryCreateRepositoryWithToken(base, domain, oauthAccessToken, customTypes, signedDocuments, users);
          _context.next = 10;
          break;

        case 6:
          _context.next = 8;
          return _regenerator2.default.awrap(_authentication2.default.connect(base, args, noconfirm));

        case 8:
          cookies = _context.sent;

          eventuallyCreateRepository = queryCreateRepositoryWithCookie(base, domain, cookies, customTypes, signedDocuments, users);

        case 10:
          return _context.abrupt('return', eventuallyCreateRepository.then(function () {
            _helpers2.default.UI.display('You can access your backend here: ' + _helpers2.default.Domain.repository(base, domain));
            return domain;
          }).catch(function (statusCode) {
            if (statusCode === 401) {
              // remove cookie
              return _config2.default.set({ cookies: '' }).then(function () {
                return createWithDomain(base, domain, args, customTypes, signedDocuments, users, noconfirm);
              });
            }
            return _helpers2.default.UI.displayErrors('An unexpected error occured');
          }));

        case 11:
        case 'end':
          return _context.stop();
      }
    }
  }, null, this);
}

function promptName(domain) {
  return _inquirer2.default.prompt([{
    type: 'input',
    name: 'domain',
    message: 'Name your prismic repository: ',
    default: domain,
    validate: function validate(value) {
      return new RegExp('^[\\-\\w]+$').test(value) ? true : 'Your repository name can only contains alphanumeric characters, underscores or dashes';
    }
  }]);
}

function queryAvailable(base, domain) {
  var url = base + '/app/dashboard/repositories/' + domain + '/exists';
  return _communication2.default.get(url);
}

function exists(newRepository, base, domain) {
  var isAvailable;
  return _regenerator2.default.async(function exists$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return _regenerator2.default.awrap(queryAvailable(base, domain));

        case 3:
          isAvailable = _context2.sent;
          return _context2.abrupt('return', isAvailable === 'false');

        case 7:
          _context2.prev = 7;
          _context2.t0 = _context2['catch'](0);

          _helpers2.default.UI.display('Unable to check if ' + domain + ' exists.');
          return _context2.abrupt('return', null);

        case 11:
        case 'end':
          return _context2.stop();
      }
    }
  }, null, this, [[0, 7]]);
}

function isDomainAvailableOrRetry(newRepository, base, domain, args, noconfirm) {
  var exec;
  return _regenerator2.default.async(function isDomainAvailableOrRetry$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          exec = function exec(d) {
            var retry, isExist;
            return _regenerator2.default.async(function exec$(_context4) {
              while (1) {
                switch (_context4.prev = _context4.next) {
                  case 0:
                    retry = function retry(err) {
                      var answers;
                      return _regenerator2.default.async(function retry$(_context3) {
                        while (1) {
                          switch (_context3.prev = _context3.next) {
                            case 0:
                              _helpers2.default.UI.display(err);
                              _context3.next = 3;
                              return _regenerator2.default.awrap(promptName());

                            case 3:
                              answers = _context3.sent;
                              return _context3.abrupt('return', exec(answers.domain));

                            case 5:
                            case 'end':
                              return _context3.stop();
                          }
                        }
                      }, null, this);
                    };

                    _context4.next = 3;
                    return _regenerator2.default.awrap(exists(newRepository, base, d, args, noconfirm));

                  case 3:
                    isExist = _context4.sent;

                    if (!isExist) {
                      _context4.next = 8;
                      break;
                    }

                    if (!newRepository) {
                      _context4.next = 7;
                      break;
                    }

                    return _context4.abrupt('return', retry('This Repository already exists, please choose another name.'));

                  case 7:
                    return _context4.abrupt('return', d);

                  case 8:
                    if (!newRepository) {
                      _context4.next = 10;
                      break;
                    }

                    return _context4.abrupt('return', d);

                  case 10:
                    return _context4.abrupt('return', retry('Either the repository doesn\'t exists or you don\'t have access to it.'));

                  case 11:
                  case 'end':
                    return _context4.stop();
                }
              }
            }, null, this);
          };

          return _context5.abrupt('return', exec(domain));

        case 2:
        case 'end':
          return _context5.stop();
      }
    }
  }, null, this);
}

function chooseDomain(newRepository, base, domain, args, noconfirm) {
  var answers;
  return _regenerator2.default.async(function chooseDomain$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          if (!domain) {
            _context6.next = 4;
            break;
          }

          return _context6.abrupt('return', isDomainAvailableOrRetry(newRepository, base, domain, args, noconfirm));

        case 4:
          if (!noconfirm) {
            _context6.next = 8;
            break;
          }

          throw new Error('The noconfirm options requires the domain option to be set.');

        case 8:
          _context6.next = 10;
          return _regenerator2.default.awrap(promptName());

        case 10:
          answers = _context6.sent;
          return _context6.abrupt('return', isDomainAvailableOrRetry(newRepository, base, answers.domain, args, noconfirm));

        case 12:
        case 'end':
          return _context6.stop();
      }
    }
  }, null, this);
}

function promptFolder(folderName) {
  return _inquirer2.default.prompt([{
    type: 'input',
    name: 'folder',
    message: 'Local folder to initalize project: ',
    default: folderName,
    validate: function validate(value) {
      return _shelljs2.default.test('-e', value) ? 'Folder already exists' : true;
    }
  }]);
}

function chooseFolder(domain, args, noconfirm) {
  var prompt, folder;
  return _regenerator2.default.async(function chooseFolder$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          prompt = function prompt(folder) {
            var answers;
            return _regenerator2.default.async(function prompt$(_context7) {
              while (1) {
                switch (_context7.prev = _context7.next) {
                  case 0:
                    _context7.next = 2;
                    return _regenerator2.default.awrap(promptFolder(folder));

                  case 2:
                    answers = _context7.sent;
                    return _context7.abrupt('return', answers.folder);

                  case 4:
                  case 'end':
                    return _context7.stop();
                }
              }
            }, null, this);
          };

          folder = args['--folder'];

          if (!folder) {
            _context8.next = 11;
            break;
          }

          if (!_shelljs2.default.test('-e', folder)) {
            _context8.next = 8;
            break;
          }

          _helpers2.default.UI.display('Error: folder ' + folder + ' already exists.');
          if (!noconfirm) prompt(folder);
          _context8.next = 9;
          break;

        case 8:
          return _context8.abrupt('return', folder);

        case 9:
          _context8.next = 12;
          break;

        case 11:
          return _context8.abrupt('return', prompt(domain));

        case 12:
          return _context8.abrupt('return', null);

        case 13:
        case 'end':
          return _context8.stop();
      }
    }
  }, null, this);
}

function promptTemplate(templates, templateName) {
  var displayTemplates = _template2.default.getDisplayed(templates);
  return _inquirer2.default.prompt([{
    type: 'list',
    name: 'template',
    message: 'Technology for your project: ',
    default: (0, _lodash2.default)(displayTemplates).findIndex(function (tmpl) {
      return tmpl.name === templateName;
    }),
    choices: _lodash2.default.map(displayTemplates, function (template) {
      return { name: template.name, value: template };
    })
  }]);
}

function chooseTemplate(domain, templates, args, noconfirm) {
  var prompt, template, temp;
  return _regenerator2.default.async(function chooseTemplate$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          prompt = function prompt(template) {
            var answers;
            return _regenerator2.default.async(function prompt$(_context9) {
              while (1) {
                switch (_context9.prev = _context9.next) {
                  case 0:
                    _context9.next = 2;
                    return _regenerator2.default.awrap(promptTemplate(templates, template));

                  case 2:
                    answers = _context9.sent;
                    return _context9.abrupt('return', answers.template);

                  case 4:
                  case 'end':
                    return _context9.stop();
                }
              }
            }, null, this);
          };

          template = args['--template'];

          if (!template) {
            _context10.next = 13;
            break;
          }

          temp = _template2.default.get(templates, template);

          if (temp) {
            _context10.next = 10;
            break;
          }

          _helpers2.default.UI.display('Error: invalid template ' + template);

          if (noconfirm) {
            _context10.next = 8;
            break;
          }

          return _context10.abrupt('return', prompt());

        case 8:
          _context10.next = 11;
          break;

        case 10:
          return _context10.abrupt('return', temp);

        case 11:
          _context10.next = 14;
          break;

        case 13:
          return _context10.abrupt('return', prompt());

        case 14:
          return _context10.abrupt('return', null);

        case 15:
        case 'end':
          return _context10.stop();
      }
    }
  }, null, this);
}

function readCustomTypes(folder) {
  if (folder) {
    var customTypesFolder = _path2.default.join(folder, 'custom_types');
    var customTypesPath = _path2.default.join(customTypesFolder, 'index.json');
    if (_shelljs2.default.test('-e', customTypesPath)) {
      var customTypes = JSON.parse(_shelljs2.default.cat(customTypesPath));
      customTypes.forEach(function (t) {
        var customType = t;
        var valuePath = _path2.default.join(customTypesFolder, customType.value);
        customType.value = JSON.parse(_shelljs2.default.cat(valuePath));
      });
      return customTypes;
    }
  }
  return null;
}

function readDocuments(folder) {
  var docNameFromFilename = function docNameFromFilename(filename) {
    var matched = filename.match(/(.*)\.json/);
    if (!matched) throw new Error('Invalid document filename ' + filename);else return matched[1];
  };

  if (folder) {
    var docsFolder = _path2.default.join(folder, 'documents');
    var metaPath = _path2.default.join(docsFolder, 'index.json');
    if (_shelljs2.default.test('-e', metaPath)) {
      var _JSON$parse = JSON.parse(_shelljs2.default.cat(metaPath)),
          signature = _JSON$parse.signature;

      if (!signature) throw new Error('Missing signature in your prismic documents dump.');
      var langIds = _shelljs2.default.ls(docsFolder).filter(function (p) {
        return !p.match('index.json');
      });

      var docs = langIds.reduce(function (docByLangAcc, langId) {
        var langPath = _path2.default.join(docsFolder, langId);
        var docsFilename = _shelljs2.default.ls(langPath);
        var docsForLang = docsFilename.reduce(function (docAcc, docFilename) {
          var docName = docNameFromFilename(docFilename);
          var docValue = JSON.parse(_shelljs2.default.cat(_path2.default.join(langPath, docFilename)));

          return (0, _assign2.default)({}, docAcc, (0, _defineProperty3.default)({}, docName, docValue));
        }, {});

        return (0, _assign2.default)({}, docByLangAcc, docsForLang);
      }, {});

      return { signature: signature, docs: docs };
    }
  }
  return null;
}

function readZipAndCreateRepoWithCustomTypes(newRepository, base, domain, args, template, folder, theme, noconfirm) {
  var tmpfolder, initTemplate, customTypes, signedDocs, users;
  return _regenerator2.default.async(function readZipAndCreateRepoWithCustomTypes$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          if (!theme) {
            _context11.next = 4;
            break;
          }

          _context11.t0 = theme.tmpFolder;
          _context11.next = 7;
          break;

        case 4:
          _context11.next = 6;
          return _regenerator2.default.awrap(_template2.default.unzip(template.url, template.innerFolder));

        case 6:
          _context11.t0 = _context11.sent;

        case 7:
          tmpfolder = _context11.t0;

          initTemplate = function initTemplate() {
            _helpers2.default.UI.display('Initialize local project');
            // use cp instead of mv, as it would fail if tmp_dir is mounted
            // on a different device from the plugin_dir
            // fix from cordova to prevent : EXDEV: cross-device link not permitted
            _shelljs2.default.cp('-R', tmpfolder, folder);
            // the tmp_dir is cleaned after copy
            _shelljs2.default.rm('-Rf', tmpfolder);

            if (template.configuration) {
              _template2.default.replace(folder, template, [{
                pattern: /your-repo-name/,
                value: domain
              }]);
            }
          };
          // Create repository if needed


          if (!newRepository) {
            _context11.next = 15;
            break;
          }

          customTypes = readCustomTypes(tmpfolder);
          signedDocs = readDocuments(tmpfolder);
          users = args['--users'];
          _context11.next = 15;
          return _regenerator2.default.awrap(createWithDomain(base, domain, args, customTypes, signedDocs, users, noconfirm));

        case 15:
          initTemplate();
          return _context11.abrupt('return', null);

        case 17:
        case 'end':
          return _context11.stop();
      }
    }
  }, null, this);
}

function installAndDisplayInstructions(template, folder) {
  if (folder) {
    _helpers2.default.UI.display('Running npm install...');
    var devnull = isWin ? 'NUL' : '/dev/null';
    _shelljs2.default.cd(folder);
    _shelljs2.default.exec('npm install > ' + devnull);
    _helpers2.default.UI.display('Your project is ready, to proceed:\n');
    _helpers2.default.UI.display('Go to the project folder : cd ' + folder);
    if (template.instructions) {
      _helpers2.default.UI.display(template.instructions);
    }
  }
  return template;
}

function create(templates, base, domain, args, theme) {
  var noconfirm, newRepository, d, folder, template;
  return _regenerator2.default.async(function create$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          noconfirm = args['--noconfirm'] === true;
          newRepository = args['--new'] === true;
          _context12.next = 4;
          return _regenerator2.default.awrap(chooseDomain(newRepository, base, domain, args, noconfirm));

        case 4:
          d = _context12.sent;
          _context12.next = 7;
          return _regenerator2.default.awrap(chooseFolder(d, args, noconfirm));

        case 7:
          folder = _context12.sent;

          if (!theme) {
            _context12.next = 12;
            break;
          }

          _context12.t0 = theme.template;
          _context12.next = 15;
          break;

        case 12:
          _context12.next = 14;
          return _regenerator2.default.awrap(chooseTemplate(d, templates, args, noconfirm));

        case 14:
          _context12.t0 = _context12.sent;

        case 15:
          template = _context12.t0;
          _context12.next = 18;
          return _regenerator2.default.awrap(readZipAndCreateRepoWithCustomTypes(newRepository, base, d, args, template, folder, theme, noconfirm));

        case 18:
          installAndDisplayInstructions(template, folder);

        case 19:
        case 'end':
          return _context12.stop();
      }
    }
  }, null, this);
}

function isGithubRepository(value) {
  var matchesGit = value.match(/^(https?:\/\/github\.com\/[\w-.]+\/[\w-.]+)\.git$/);
  var url = matchesGit && matchesGit[1] || value;
  var matches = url.match(/^(https?:\/\/github\.com\/[\w-.]+\/([\w-.]+))(\/tree\/([\w-./+]+))?$/);

  if (matches) {
    var branchName = matches[4] || 'master';
    var zipUrl = matches[1] + '/archive/' + branchName + '.zip';
    var repoName = matches[2];
    var innerFolder = repoName + '-' + branchName.replace(/\/|\+/g, '-');

    return {
      url: zipUrl,
      name: repoName,
      innerFolder: innerFolder
    };
  }

  return null;
}

function isGithubZip(url) {
  var regexp = new RegExp('^https://github\\.com/[\\w\\-\\.]+/([\\w\\-\\.]+)(/([\\w\\-\\.]+))+/([\\w\\-\\.]+).zip$');
  var matches = url.match(regexp);
  if (matches) {
    var innerFolder = matches[1] + '-' + matches[4];
    return { url: url, name: matches[1], innerFolder: innerFolder };
  }
  return null;
}

function isZipURL(url) {
  var regexp = /^https?:\/\/(.*?)\/.*\.zip$/;
  var matches = url.match(regexp);
  if (matches) {
    return { url: url, name: matches[1], innerFolder: null };
  }
  return null;
}

function isValidThemeURL(themeURL) {
  return isGithubRepository(themeURL) || isGithubZip(themeURL) || isZipURL(themeURL);
}

function promptThemeURL(themeURL) {
  return _inquirer2.default.prompt([{
    type: 'input',
    name: 'url',
    message: 'URL of your theme (zip/github): ',
    default: themeURL,
    validate: function validate(value) {
      return !isValidThemeURL(value) ? 'Invalid URL please try again!' : true;
    }
  }]);
}

function checkThemeConfig(themeTmpFolder, customConfigPath) {
  var configPath = customConfigPath || _helpers2.default.Theme.defaultConfigPath;
  return _shelljs2.default.test('-f', _path2.default.join(themeTmpFolder, configPath));
}

function validateTheme(themeURL, opts) {
  var ignoreConf, configPath, retry, themeData, tmpFolder, isValidConfig;
  return _regenerator2.default.async(function validateTheme$(_context14) {
    while (1) {
      switch (_context14.prev = _context14.next) {
        case 0:
          retry = function retry(url, message) {
            var answers;
            return _regenerator2.default.async(function retry$(_context13) {
              while (1) {
                switch (_context13.prev = _context13.next) {
                  case 0:
                    if (message) _helpers2.default.UI.display(message);
                    _context13.next = 3;
                    return _regenerator2.default.awrap(promptThemeURL(themeURL));

                  case 3:
                    answers = _context13.sent;
                    return _context13.abrupt('return', validateTheme(answers.url, opts));

                  case 5:
                  case 'end':
                    return _context13.stop();
                }
              }
            }, null, this);
          };

          ignoreConf = opts.ignoreConf, configPath = opts.configPath;

          if (themeURL) {
            _context14.next = 4;
            break;
          }

          return _context14.abrupt('return', retry());

        case 4:
          _context14.prev = 4;

          _helpers2.default.UI.display('We are checking the theme integrity');
          themeData = isValidThemeURL(themeURL);

          if (!themeData) {
            _context14.next = 15;
            break;
          }

          _context14.next = 10;
          return _regenerator2.default.awrap(_template2.default.unzip(themeData.url, themeData.innerFolder));

        case 10:
          tmpFolder = _context14.sent;
          isValidConfig = ignoreConf || checkThemeConfig(tmpFolder, configPath);

          if (!isValidConfig) {
            _context14.next = 14;
            break;
          }

          return _context14.abrupt('return', _helpers2.default.Theme.make(themeData.name, themeData.url, configPath, ignoreConf, tmpFolder, themeData.innerFolder));

        case 14:
          return _context14.abrupt('return', retry(themeURL, 'Invalid theme provided, check your zip file.'));

        case 15:
          return _context14.abrupt('return', retry(themeURL, 'Invalid theme provided, check your zip file.'));

        case 18:
          _context14.prev = 18;
          _context14.t0 = _context14['catch'](4);
          return _context14.abrupt('return', retry(themeURL, 'Invalid theme provided, check your zip file.'));

        case 21:
        case 'end':
          return _context14.stop();
      }
    }
  }, null, this, [[4, 18]]);
}

function heroku(templates, templateName) {
  var template, answers;
  return _regenerator2.default.async(function heroku$(_context15) {
    while (1) {
      switch (_context15.prev = _context15.next) {
        case 0:
          template = _template2.default.get(templates, templateName);

          _helpers2.default.UI.display('Initialize heroku project');

          answers = void 0;

          if (!template) {
            _context15.next = 7;
            break;
          }

          answers = { template: _template2.default.get(templates, templateName) };
          _context15.next = 10;
          break;

        case 7:
          _context15.next = 9;
          return _regenerator2.default.awrap(promptTemplate(templateName));

        case 9:
          answers = _context15.sent;

        case 10:
          if (answers.template.url) {
            _context15.next = 12;
            break;
          }

          throw new Error('Not implemented yet!');

        case 12:
          _helpers2.default.UI.display('Initialize local project...');
          _context15.next = 15;
          return _regenerator2.default.awrap(_template2.default.unzip(answers.template.url, answers.template.innerFolder));

        case 15:
          _template2.default.replace('.', answers.template, [{
            pattern: /['"]https:\/\/your-repo-name(\.cdn)?\.prismic\.io\/api['"]/,
            value: 'process.env.PRISMIC_ENDPOINT'
          }]);
          _helpers2.default.UI.display('Running npm install...');
          _shelljs2.default.exec('npm install > ' + (isWin ? 'NUL' : '/dev/null'));
          _helpers2.default.UI.display(['Your project in ready! Next steps:', ' => Open your writing room: \'heroku addons:docs prismic\'', ' => Create the custom types as described in the docs: \'heroku addons:docs prismic\'', ' => Run the project: \'heroku local\'']);

        case 19:
        case 'end':
          return _context15.stop();
      }
    }
  }, null, this);
}

exports.default = { create: create, validateTheme: validateTheme, heroku: heroku };
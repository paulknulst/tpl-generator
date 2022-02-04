'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var fs = require('fs');
var path = require('path');

var licensesFilenames = ['LICENSE', 'LICENSE.MD', 'LICENSE.md', 'license', 'license.md', 'LICENSE.TXT', 'LICENSE.txt', 'licensse.txt'];

var CWD = process.cwd();

var fileName = path.resolve(CWD, 'thirdPartyLicense.html');

/**
 * get app packages and store in an array
 */
var getProjectDependencies = function getProjectDependencies(packageFile) {
  var packageInfo = JSON.parse(packageFile);
  var packageDependencies = packageInfo.dependencies || {};

  return [].concat(_toConsumableArray(Object.keys(packageDependencies)));
};

/**
 * get an individual package name version url and license if they are applied
 */
var getDependencyByName = function getDependencyByName(dependencyName) {
  var packageFile = fs.readFileSync(path.resolve(CWD, 'node_modules/' + dependencyName + '/package.json'));
  var packageInfo = JSON.parse(packageFile);
  var packageLicense = licensesFilenames.find(function (filename) {
    if (fs.existsSync(path.resolve(CWD, 'node_modules/' + dependencyName + '/' + filename))) {
      return true;
    }
  });

  return {
    name: packageInfo.name,
    version: packageInfo.version,
    authors: packageInfo.author,
    uri: packageInfo.homepage,
    license: packageLicense && fs.readFileSync(path.resolve(CWD, 'node_modules/' + dependencyName + '/' + packageLicense))
  };
};

var tplGenerator = function tplGenerator() {
  var allDependencies = [];

  /**
   * get app package json file package names
   */
  allDependencies = getProjectDependencies(fs.readFileSync(path.resolve(CWD, 'package.json')));

  /**
   * exclude duplicated packages
   */
  allDependencies = Array.from(new Set(allDependencies));

  console.log('------------start to generate file------------', allDependencies.length);

  var html = '<body>';
  allDependencies.forEach(function (dependencyName) {
    if (fs.existsSync(path.resolve(CWD, 'node_modules/' + dependencyName + '/package.json'))) {
      var dependency = getDependencyByName(dependencyName);

      html += '<div class="dependency">';
      html += '<div class="dependency-name">' + dependency.name + '@' + dependency.version + '</div>';
      html += '<div class="dependency-uri">' + (dependency.uri ? dependency.uri + '' : '') + '</div>';
      html += '<div class="dependency-license">' + (dependency.license ? dependency.license : '') + '</div>';
      html += '</div>';
      html += '<hr />';
    } else {
      console.log(dependencyName + 'package json file is not found');
    }
  });
  html += '</body>';

  try {
    fs.writeFileSync(fileName, html);
  } catch (err) {
    console.error('ERR', err);
  }

  console.log('------------auto generate third party license is done------------');
};

exports.default = tplGenerator;
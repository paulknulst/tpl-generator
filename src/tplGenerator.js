const fs = require('fs');
const path = require('path');

const licensesFilenames = [
  'LICENSE',
  'LICENSE.MD',
  'LICENSE.md',
  'license',
  'license.md',
  'LICENSE.TXT',
  'LICENSE.txt',
  'licensse.txt'
];

const CWD = process.cwd();

const TPLfile = path.resolve(CWD, 'thirdPartyLicense.txt');

/**
 * get app packages and store in an array
 */
const getProjectDependencies = (packageFile) => {
  const packageInfo = JSON.parse(packageFile);
  const packageDependencies = packageInfo.dependencies || {};
  const packageDevDependencies = packageInfo.devDependencies || {};

  return [...Object.keys(packageDependencies), ...Object.keys(packageDevDependencies)];
};

/**
 * get an individual package name version url and license if they are applied
 */
const getDependencyByName = (dependencyName) => {
  const packageFile = fs.readFileSync(path.resolve(CWD, 'node_modules/' + dependencyName + '/package.json'));
  const packageInfo = JSON.parse(packageFile);
  const packageLicense = licensesFilenames.find((filename) => {
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

const tplGenerator = () => {
  let allDependencies = [];

  /**
   * get app package json file package names
   */
  allDependencies = getProjectDependencies(fs.readFileSync(path.resolve(CWD, 'package.json')));

  /**
   * exclude duplicated packages
   */
  allDependencies = Array.from(new Set(allDependencies));

  console.log('------------start to generate file------------', allDependencies.length);

  let string = '';
  allDependencies.forEach((dependencyName) => {
    if (fs.existsSync(path.resolve(CWD, 'node_modules/' + dependencyName + '/package.json'))) {
      let dependency = getDependencyByName(dependencyName);

      string += dependency.name + '@' + dependency.version + '\n';
      string += (dependency.uri ? dependency.uri + '\n' : '');
      string += (dependency.license ? dependency.license : '') + '\n\n';
    } else {
      console.log(dependencyName + 'package json file is not found');
    }
  });

  try {
    fs.writeFileSync(TPLfile, string);
  } catch (err) {
    console.error('ERR', err);
  }

  console.log('------------auto generate third party license is done------------');
};

export default tplGenerator;

# third-party-license-generator
this script will generate third party license content as a html file based on the included softwares from your application. It will only use the dependencies section from your package.json.


## how to use it
1. install the package
  - `npm install third-party-license-generator` or `yarn add third-party-license-generator`
2. go to your scripts folder and create a file `tplGenerator.js`. In this file, you can write: 
  - `import tplGenerator from 'third-party-license-generator';`
  - `tplGenerator()`
3. at your app package.json file, you can add `"generate:tpl": "babel-node --presets=es2015 scripts/tplGenerator.js"` to your scripts. Then you can run `yarn generate:tpl` to generate txt file.

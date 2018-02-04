const chalk = require("chalk");
const fs = require('fs');
const path = require('path');
const useDefaultConfig = require('@ionic/app-scripts/config/webpack.config.js');

const env = process.env.IONIC_ENV;

if (env === 'prod' || env === 'dev') {

  useDefaultConfig[env].resolve.alias = {
    "@pages": path.resolve('./src/pages/'),
    "@services": path.resolve('./src/core/data/services/'),
  };

} else {

  // Default to dev config
  useDefaultConfig[env] = useDefaultConfig.dev;
  useDefaultConfig[env].resolve.alias = {
    "@pages": path.resolve('./src/pages/'),
    "@services": path.resolve('./src/core/data/services/'),
  };

}

function environmentPath() {

  let filePath = './src/environments/environment' + (env === 'prod' ? '' : '.' + env) + '.ts';

  if (!fs.existsSync(filePath)) {
    console.log(chalk.red('\n' + filePath + ' does not exist!'));
  } else {
    return filePath;
  }
}

module.exports = function () {
  return useDefaultConfig;
};

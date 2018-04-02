const path = require('path');
const useDefaultConfig = require('@ionic/app-scripts/config/webpack.config.js');

const env = process.env.IONIC_ENV;

if (env === 'prod' || env === 'dev') {

  useDefaultConfig[env].resolve.alias = {
    "@pages": path.resolve('./src/pages/'),
    "@services": path.resolve('./src/core/data/services/'),
    "@enum": path.resolve('./src/core/data/enum/'),
    "@pipes": path.resolve('./src/pipes'),
    "@components": path.resolve('./src/components/'),
    "@directives": path.resolve('./src/directives/'),
    "@interfaces": path.resolve('./src/core/data/interfaces'),
    "@validators": path.resolve('./src/validators/')
  };

} else {

  // Default to dev config
  useDefaultConfig[env] = useDefaultConfig.dev;
  useDefaultConfig[env].resolve.alias = {
    "@pages": path.resolve('./src/pages/'),
    "@services": path.resolve('./src/core/data/services/'),
    "@enum": path.resolve('./src/core/data/enum/'),
    "@pipes": path.resolve('./src/pipes'),
    "@components": path.resolve('./src/components/'),
    "@directives": path.resolve('./src/directives/'),
    "@interfaces": path.resolve('./src/core/data/interfaces'),
    "@validators": path.resolve('./src/validators/')
  };

}

module.exports = function () {
  return useDefaultConfig;
};

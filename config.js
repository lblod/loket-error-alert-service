const defaultConfig = {
  base: 'http://lblod.data.gift',
  service: {
    uri: 'http://lblod.data.gift/services/loket-error-alert-service'
  },
  creators: [],
  email: {
    folder: 'http://data.lblod.info/id/mail-folders/2'
  },
  graph: {
    email: 'http://mu.semte.ch/graphs/system/email'
  }
};

let userConfig = {};
try {
  userConfig = require('/config/config.json');
} catch (e) {
  console.log('Couldn\'t find user config, continuing without ...');
}

const config = Object.assign(defaultConfig, userConfig);

export default config;
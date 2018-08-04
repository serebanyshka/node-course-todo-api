const env = process.env.NODE_ENV;

if(env === 'development' || env === 'test') {
  const config = require('./config.json');
  const envConfig = config[env];

  for(let prop in envConfig) {
    process.env[prop] = envConfig[prop];
  }
}

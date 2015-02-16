var _ = require('lodash'),
    fs = require('fs'),
    configFilePath = __dirname + '/config.prod.json';

module.exports = _.merge(
    {
        http: {
            port: 9001,
            address: 'localhost'
        },
        mongoose: {
            uri: 'mongodb://127.0.0.1:27017/swift-gift'
        },
        application: {
            payment: {
                url: 'http://...'
            }
        }
    },
    fs.existsSync(configFilePath) ? require(configFilePath) : {}
);

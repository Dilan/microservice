module.exports.shared = function() {
    var basePath = __dirname,
        config = require(basePath + '/config/'),
        resolveModulePath = require('./module_paths')(basePath).resolve;

    var shared = {
            config: config,
            basePath: basePath,
            modulesManager: {
                cachedModules: {},
                get: function(moduleName) {
                    if (typeof this.cachedModules[moduleName] === 'undefined') {
                        var m = require(resolveModulePath(moduleName));
                        this.cachedModules[moduleName] = (typeof m === 'function' ? m(shared) : m);
                    }
                    return this.cachedModules[moduleName];
                }
            }
        };

    return shared;
};

module.exports.express = function(shared) {
    var app = require('express')(),
        bodyParser = require('body-parser');

    app.set('json replacer', null);
    app.set('json spaces', 4);

    app.use(bodyParser.json({limit: '50mb'}));
    app.use(function(req, res, next) {
        console.log(
            '[%s %s]' + (req.method !== 'GET' ? ' %j' : ''),
            req.method,
            req.url,
            (req.method !== 'GET') ? req.body : ''
        );
        next();
    });

    require('./routes/')(app, shared);

    return app;
};

module.exports.mongodb = function(shared) {
    var mongoose = require('mongoose'),
        config = shared.config;

    mongoose.connection.on('connected', function() {
        console.log('Mongoose connection open.');
    });
    process.on('SIGINT', function() {
        mongoose.connection.close(function() {
            console.log('Mongoose default connection disconnected through app termination.');
            process.exit(0);
        });
    });
    mongoose.connection.on('disconnected', function() {
        console.log('Mongoose default connection disconnected.');
    });
    mongoose.connection.on('error', function(err) {
        console.error(err);
    });

    mongoose.connect(
        config.mongoose.uri,
        { server: { socketOptions: { keepAlive: 1 } } }
    );
};

module.exports.http = function(app, shared) {
    return require('http').createServer(app)
        .on('listening', function() {
            console.log('Express server listening on port ' + shared.config.http.port);
        })
        .on('error', function(error) {
            console.error(error);
            process.exit(1);
        })
        .listen(shared.config.http.port, shared.config.http.address);
};

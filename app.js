var when = require('when');

if (require.main === module) {
    var bootstrap = require('./bootstrap'),
        shared = bootstrap.shared();

    when(bootstrap.mongodb(shared))
        .then(function() {
            return bootstrap.express(shared);
        })
        .then(function(app) {
            bootstrap.http(app, shared);
        }).
        catch(function(err) {
            console.error(err);
        });
}

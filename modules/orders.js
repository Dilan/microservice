var _ = require('lodash'),
    when = require('when');

module.exports = function(core) {
    var mm = core.modulesManager,
        Order = mm.get('model.Order');

    return {
        find: function(options, offset, limit) {
            return Order.find(
                options,
                null,
                _.extend(
                    (isNaN(offset) ? {} : { skip: offset }),
                    (isNaN(limit) ? {} : { limit: limit })
                )
            ).exec();
        },

        create: function(order) {
            var deferred = when.defer();
            order.save(function(err, doc) {
                return (err) ? deferred.reject(err) : deferred.resolve(doc);
            });
            return deferred.promise;
        }
    };
};

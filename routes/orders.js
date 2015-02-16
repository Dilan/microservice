var _ = require('lodash'),
    when = require('when');

module.exports = function(core) {
    var mm = core.modulesManager;

    return {
        find: function(req, res) {
            var offset = parseInt(req.params.offset, 10),
                limit = parseInt(req.params.limit, 10),
                options = { userId: req.user.id };

            when(mm.get('orders').find(options, offset, limit)).
                then(function(list) {
                    return res.json(list);
                }).
                catch(function(err) {
                    console.error(err);
                    return res.status(500).json({ error: 'Server error.' });
                });
        }
    };
};

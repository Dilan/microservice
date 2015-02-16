module.exports = function(app, shared) {
    var ordersRoutes = require('./orders')(shared);

    var authentication = function(req, res, next) {
        req.user = { id: 'antony' };
        next();
    };

    app.get('/orders/offset/:offset/limit/:limit', authentication, ordersRoutes.find);
};

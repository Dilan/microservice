module.exports = function(basePath) {
    return {
        resolve: function(moduleName) {
            switch (moduleName) {
                case 'model.Order':
                    return basePath + '/models/order';
                case 'orders':
                    return basePath + '/modules/orders';
            }
        }
    };
};

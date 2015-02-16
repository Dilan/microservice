var _ = require('lodash'),
    mongoose = require('mongoose');

module.exports = function(core) {
    var Order = new mongoose.Schema({
        userId: { type: String, required: true },
        amount: { type: Number, required: true },
        transactionId: { type: String, required: true },
        modifiedTime: { type: Date },
        createdTime: { type: Date, default: Date.now }
    });

    Order.set('toObject', {
        transform: function(doc, ret, options) {
            delete ret._id;
            delete ret.__v;
        }
    });

    Order.virtual('id').get(function() {
        return this._id;
    });

    Order.set('toJSON', { virtuals: true });

    return mongoose.model('Order', Order);
};

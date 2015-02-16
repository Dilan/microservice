var when = require('when'),
    sequence = require('when/sequence'),
    request = require('supertest'),
    mongoose = require('mongoose'),
    sinon = require('sinon'),
    should = require('should');

var basePath = global.basePath,
    bootstrap = require(basePath + '/bootstrap'),
    shared = bootstrap.shared(),
    mm = shared.modulesManager,
    app = bootstrap.express(shared),
    Order = mm.get('model.Order');

describe('Orders routing integration testing:', function() {
    before(function(done) {
        if (!mongoose.connection.db) {
            when(bootstrap.mongodb(shared)).then(function() {
                done();
            });
        } else {
            done();
        }
    });

    beforeEach(function(done) {
        when.map([
            { userId: 'antony', amount: 1000, transactionId: '10000001', modifiedTime: new Date() }, // 1st
            { userId: 'antony', amount: 2000, transactionId: '10000002', modifiedTime: new Date() }, // 2nd
            { userId: 'antony', amount: 3000, transactionId: '10000003', modifiedTime: new Date() }  // 3rd
        ].map(function(data) {
            return mm.get('orders').create(new Order(data));
        })
        ).finally(function() {
            done();
        });
    });

    afterEach(function(done) {
        when(Order.find().remove({ userId: 'antony' }).exec()).
            finally(function() {
                done();
            });
    });

    it('/orders/offset/1/limit/1 return only 2nd order', function(done) {
        request(app)
            .get('/orders/offset/1/limit/1')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
                var result = res.body;
                result.should.be.instanceof(Array);
                result.length.should.equal(1);

                var order = result[0];
                order.should.have.property('amount', 2000);
                order.should.have.property('transactionId', '10000002');
                done();
            });
    });
});

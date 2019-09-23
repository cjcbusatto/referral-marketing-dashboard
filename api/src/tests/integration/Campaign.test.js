const request = require('supertest');
const chai = require('chai');
// const assert = chai.assert;
const expect = chai.expect;
const Campaign = require('../../models/Campaign');
const { Types } = require('mongoose');
chai.use(require('chai-shallow-deep-equal'));
let server;

describe('Campaign routes', () => {
    beforeEach(async () => {
        await Campaign.deleteMany();
        server = require('../../server');
    });

    afterEach(async () => {
        server.close();
    });

    // Useful function to write async tests with mocha chai
    const mochaAsync = (fn) => {
        return (done) => {
            fn.call().then(done, (err) => {
                done(err);
            });
        };
    };

    describe('GET /campaigns/', () => {
        it(
            'should return 204 if no campaigns created so far',
            mochaAsync(async () => {
                const res = await request(server).get('/campaigns/');

                // Response HTTP 204
                expect(res.status).to.equal(204);
            })
        );
        it(
            'should return 200 and a list of created campaigns, when there are campaigns already created',
            mochaAsync(async () => {
                const university = Types.ObjectId();
                const endDate = 1;
                const discountMode = Types.ObjectId();

                const campaign = new Campaign({ university, endDate, discountMode });
                await campaign.save();

                const res = await request(server).get('/campaigns/');

                // Response HTTP 200
                expect(res.status).to.equal(200);
            })
        );
    });
});

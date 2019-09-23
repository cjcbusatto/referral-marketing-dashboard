const request = require('supertest');
const chai = require('chai');
// const assert = chai.assert;
const expect = chai.expect;
const PromotionalCode = require('../../models/PromotionalCode');
const { Types } = require('mongoose');
chai.use(require('chai-shallow-deep-equal'));
let server;

describe('PromotionalCode routes', () => {
    beforeEach(async () => {
        await PromotionalCode.deleteMany();
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

    describe('GET /promotionalcodes/', () => {
        it(
            'should return 204 if no promotional codes created so far',
            mochaAsync(async () => {
                const res = await request(server).get('/promotionalcodes/');

                // Response HTTP 204
                expect(res.status).to.equal(204);
            })
        );
        it(
            'should return 200 and a list of created campaigns, when there are campaigns already created',
            mochaAsync(async () => {
                const code = Types.ObjectId();
                const campaign = Types.ObjectId();
                const discount = 1;

                const promotionalCode = new PromotionalCode({ code, campaign, discount });
                await promotionalCode.save();

                const res = await request(server).get('/promotionalcodes/');

                // Response HTTP 200
                expect(res.status).to.equal(200);
            })
        );
        //     it(
        //         'should return 404 if developer account is not found',
        //         mochaAsync(async () => {
        //             const validUserHeader = Types.ObjectId();
        //             const res = await request(server)
        //                 .get('/developers/')
        //                 .set('user', validUserHeader);

        //             expect(res.status).to.equal(404);
        //         })
        //     );
        //     it(
        //         'should return an empty list of developers if there are no developers stored',
        //         mochaAsync(async () => {
        //             // The developer making the request
        //             const developer = new Developer({
        //                 name: 'name',
        //                 user: 'user',
        //                 bio: 'bio',
        //                 avatar: 'avatar',
        //             });
        //             await developer.save();

        //             const res = await request(server)
        //                 .get('/developers/')
        //                 .set('user', developer._id);

        //             // we expect an HTTP Code 200 containing a list of developers
        //             expect(res.status).to.be.equal(200);
        //             expect(res.body).to.be.an('array').that.is.empty;
        //         })
        //     );
        //     it(
        //         'should return the list of developers if there are developers stored',
        //         mochaAsync(async () => {
        //             // The developer making the request
        //             const developer = new Developer({
        //                 name: 'name',
        //                 user: 'user',
        //                 bio: 'bio',
        //                 avatar: 'avatar',
        //             });
        //             await developer.save();

        //             // Include a developer on the database, otherwise the array is empty
        //             const developerListItemConfig = {
        //                 name: 'name-item',
        //                 user: 'user-item',
        //                 bio: 'bio-item',
        //                 avatar: 'avatar-item',
        //             };
        //             const developerListItem = new Developer(developerListItemConfig);
        //             await developerListItem.save();

        //             const res = await request(server)
        //                 .get('/developers/')
        //                 .set('user', developer._id);

        //             // HTTP 200
        //             expect(res.status).to.equal(200);
        //             // Containing a list of developers
        //             expect(res.body).to.be.an('array');
        //             expect(res.body[0]).to.shallowDeepEqual(developerListItemConfig);
        //         })
        //     );
        // });

        // describe('POST /developers/', () => {
        //     it(
        //         'should insert a new developer if github account exists',
        //         mochaAsync(async () => {
        //             const developer = {
        //                 username: 'cjcbusatto',
        //             };
        //             const res = await request(server)
        //                 .post('/developers/')
        //                 .send(developer);

        //             expect(res.status).to.equal(200);
        //             // Containing a list of developers
        //             expect(res.body).to.be.an('object');
        //             expect(res.body).to.shallowDeepEqual({ ok: true });
        //         })
        //     );

        //     it(
        //         'should throw a 404 if github account does not exist',
        //         mochaAsync(async () => {
        //             const developer = {
        //                 username:
        //                     '128937h12893h182931areallylongnamethatprobablygithubdoesnotallowtobeanuser',
        //             };
        //             const res = await request(server)
        //                 .post('/developers/')
        //                 .send(developer);

        //             expect(res.status).to.equal(404);
        //             // Containing a list of developers
        //             expect(res.body).to.be.an('object');
        //             expect(res.body).to.shallowDeepEqual({ message: 'Github user not found' });
        //         })
        //     );
        //     it(
        //         'should return the same developer if the entry is a duplicate',
        //         mochaAsync(async () => {
        //             const developer = {
        //                 username: 'cjcbusatto',
        //             };
        //             let res = await request(server)
        //                 .post('/developers/')
        //                 .send(developer);

        //             expect(res.status).to.equal(200);
        //             // Containing a list of developers
        //             expect(res.body).to.be.an('object');
        //             expect(res.body).to.shallowDeepEqual({ ok: true });

        //             res = await request(server)
        //                 .post('/developers/')
        //                 .send(developer);

        //             expect(res.status).to.equal(200);
        //             // Containing a list of developers
        //             expect(res.body).to.be.an('object');
        //             expect(res.body).to.shallowDeepEqual({ user: 'cjcbusatto' });
        //         })
        //     );
        // });
        // const developer1 = new Developer({
        //     name: 'name1',
        //     user: 'user1',
        //     bio: 'bio1',
        //     avatar: 'avatar1',
        // // });
        // // await developer1.save();

        // await developer2.save();
        //         await developer1.remove();
        //         await developer2.remove();
        // const developer2 = new Developer({
        //     name: 'name2',
        //     user: 'user2',
        //     bio: 'bio2',
        //     avatar: 'avatar2',
        // });
        // });
        // describe('GET /beacons/uuid/1/1', () => {
        //     it('should return an existent beacon', async () => {
        //         const beacon1 = new Beacon({
        //             uuid: 'uuid',
        //             major: 1,
        //             minor: 1,
        //             timestamp: 1,
        //             rssi: 1,
        //         });
        //         await beacon1.save();

        //         const res = await request(server).get('/api/beacons/uuid/1/1');
        //         expect(res.status).toBe(200);

        //         expect(res.body.uuid).toBe('uuid');
        //         expect(res.body.major).toBe(1);
        //         expect(res.body.minor).toBe(1);
        //         expect(res.body.timestamp).toBe(1);
        //         expect(res.body.rssi).toBe(1);

        //         await beacon1.remove();
        //     });
        // });
        // describe('GET /beacons/uuid/1/2', () => {
        //     it('should return a not found beacon', async () => {
        //         const res = await request(server).get('/beacons/uuid/1/2');
        //         expect(res.status).toBe(404);
        //     });
    });
});

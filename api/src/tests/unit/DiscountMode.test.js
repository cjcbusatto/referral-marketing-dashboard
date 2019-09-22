const DiscountMode = require('../../models/DiscountMode');
const expect = require('chai').expect;
const assert = require('chai').assert;
const server = require('../../server');

describe('DiscountMode constructor', () => {
    it('should not store if the model structure for rules are not strictly followed', async () => {
        const wrongRules = [
            {
                people: 10,
                disc: 10,
            },
        ];

        const discountMode = new DiscountMode({ rules: wrongRules });
        discountMode.validate(function(err) {
            expect(err)
                .to.exist.and.be.instanceof(Error)
                .and.have.property('message');
        });
    });
    it('should store a new discount mode when the rules are well defined', async () => {
        const correctRules = [
            {
                numberOfPeople: 10,
                discountGiven: 10,
            },
        ];

        const discountMode = new DiscountMode({ rules: correctRules });
        try {
            await discountMode.save();
        } catch (err) {
            console.error(err);
        }

        const storedDiscountMode = await DiscountMode.findById(discountMode._id);
        expect(storedDiscountMode).to.not.be.null;
    });
});

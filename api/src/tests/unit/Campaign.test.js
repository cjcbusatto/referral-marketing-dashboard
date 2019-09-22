const Campaign = require('../../models/Campaign');
const { Types } = require('mongoose');
const assert = require('chai').assert;
const expect = require('chai').expect;
const server = require('../../server');

describe('Campaign constructor', () => {
    it('should not store if the university name is missing', async () => {
        // University is missing!
        const wrongCampaign = {
            endDate: 123,
            discountMode: Types.ObjectId(),
        };

        const campaign = new Campaign(wrongCampaign);
        campaign.validate(function(err) {
            expect(err)
                .to.exist.and.be.instanceof(Error)
                .and.have.property('message');
        });
    });

    it('should not store if the university name is a number', async () => {
        // University is a number!
        const wrongCampaign = {
            university: 123,
            endDate: 123,
            discountMode: Types.ObjectId(),
        };

        const campaignWithUniversityAsANumber = new Campaign(wrongCampaign);
        campaignWithUniversityAsANumber.validate(function(err) {
            expect(err)
                .to.exist.and.be.instanceof(Error)
                .and.have.property('message');
        });
    });

    it('should not store if the university name is a null', async () => {
        // University is a null!
        const wrongCampaign = {
            university: null,
            endDate: 123,
            discountMode: Types.ObjectId(),
        };

        const campaignWithUniversityAsNull = new Campaign(wrongCampaign);
        campaignWithUniversityAsNull.validate(function(err) {
            expect(err)
                .to.exist.and.be.instanceof(Error)
                .and.have.property('message');
        });
    });
    it('should store if the university name follows the requirements', async () => {
        // University is a null!
        const correctCampaign = {
            university: "University",
            endDate: 123,
            discountMode: Types.ObjectId(),
        };

        const campaign = new Campaign(correctCampaign);
        try {
            await campaign.save();
        } catch(err){
            console.error(err);
        }

        const storedCampaign = await Campaign.findById(campaign._id);
        expect(storedCampaign).to.not.be.null;
    });
});

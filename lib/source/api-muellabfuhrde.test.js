'use strict';

const { expect } = require('chai');

const SourceApiMuellabfuhrde = require('./api-muellabfuhrde');

describe('SourceApiMuellabfuhrde', () => {
    it('uses city id when street id is empty and ignores malformed pickups', async () => {
        const source = new SourceApiMuellabfuhrde({
            config: {
                apiMuellabfuhrdeProvider: 'mandator',
                apiMuellabfuhrdeCityId: 'city',
                apiMuellabfuhrdeStreetId: '',
            },
            log: {
                error: () => {},
                info: () => {},
            },
        });

        let requestedUrl = '';
        source.getApi = async url => {
            requestedUrl = url;
            return JSON.stringify([
                {
                    date: '2026-07-01',
                    fraction: {
                        name: 'Restabfall',
                        shortname: 'RA',
                    },
                },
                {
                    date: '2026-07-02',
                },
            ]);
        };

        const dates = await source.getPickupDates();

        expect(requestedUrl).to.include('/location/city/pickups');
        expect(dates).to.deep.equal([
            {
                date: '2026-07-01',
                name: 'Restabfall',
                description: 'RA',
            },
        ]);
    });
});

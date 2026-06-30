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

    it('detects whether a street selection is required', async () => {
        const source = new SourceApiMuellabfuhrde({});

        source.getApiCached = async url => {
            if (url.includes('/location/city-with-streets?')) {
                return JSON.stringify({
                    id: 'city-with-streets',
                    children: [{ id: 'street' }],
                });
            }

            return JSON.stringify({
                id: 'city-without-streets',
                children: [],
            });
        };

        expect(await source.isStreetRequired('mandator', 'city-with-streets')).to.equal(true);
        expect(await source.isStreetRequired('mandator', 'city-without-streets')).to.equal(false);
    });
});

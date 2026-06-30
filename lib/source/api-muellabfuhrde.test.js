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
                warn: () => {},
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

    it('sorts cities and streets by name', async () => {
        const source = new SourceApiMuellabfuhrde({});

        source.getApiCached = async url => {
            if (url.endsWith('/config')) {
                return JSON.stringify({ calendarRootLocationId: 'root' });
            }
            if (url.includes('/location/root?')) {
                return JSON.stringify({
                    children: [
                        { id: '2', name: 'Zedlitz' },
                        { id: '1', name: 'Aachen' },
                    ],
                });
            }
            return JSON.stringify({
                children: [
                    { id: '2', name: 'Ziegelweg' },
                    { id: '1', name: 'Ahornweg' },
                ],
            });
        };

        expect((await source.getApiCities('mandator')).map(city => city.name)).to.deep.equal(['Aachen', 'Zedlitz']);
        expect((await source.getApiStreets('mandator', 'city')).map(street => street.name)).to.deep.equal([
            'Ahornweg',
            'Ziegelweg',
        ]);
    });

    it('rejects config without street when street selection is required', async () => {
        const source = new SourceApiMuellabfuhrde({
            config: {
                apiMuellabfuhrdeProvider: 'mandator',
                apiMuellabfuhrdeCityId: 'city',
                apiMuellabfuhrdeStreetId: '',
            },
            log: {
                warn: () => {},
            },
        });

        source.isStreetRequired = async () => true;

        expect(await source.validate()).to.equal(false);
    });

    it('accepts config without street when street selection is not required', async () => {
        const source = new SourceApiMuellabfuhrde({
            config: {
                apiMuellabfuhrdeProvider: 'mandator',
                apiMuellabfuhrdeCityId: 'city',
                apiMuellabfuhrdeStreetId: '',
            },
            log: {
                warn: () => {},
            },
        });

        source.isStreetRequired = async () => false;

        expect(await source.validate()).to.equal(true);
    });
});

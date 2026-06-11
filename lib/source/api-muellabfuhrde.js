'use strict';

const BaseSource = require('./base');

class SourceApiMuellabfuhrde extends BaseSource {
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 9e94661 (x)
    constructor(adapter) {
        super(adapter, 'api-muellabfuhrde');
    }

<<<<<<< HEAD
    async validate() {
        const mandator = this.adapter.config.apiMuellabfuhrdeProvider;
        const cityId = this.adapter.config.apiMuellabfuhrdeCityId;
        //const streetId = this.adapter.config.apiMuellabfuhrdeStreetId;

        if (mandator && cityId) {
=======
=======
>>>>>>> 9e94661 (x)
    async validate() {
        const mandator = this.adapter.config.apiMuellabfuhrdeProvider;
        const cityId = this.adapter.config.apiMuellabfuhrdeCityId;
        //const streetId = this.adapter.config.apiMuellabfuhrdeStreetId;

<<<<<<< HEAD
        if (mandator && cityId && streetId) {
>>>>>>> 281070c (first step for integration of muellabfuhr-deutschland.de)
=======
        if (mandator && cityId) {
>>>>>>> 19d1e63 (fix: completion check)
            return true;
        }

        this.adapter.log.info('[api-muellabfuhrde] configuration incomplete');
        return false;
    }

    async getPickupDates() {
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> cb9d3a7 (r)
        const mandator = this.adapter.config.apiMuellabfuhrdeProvider;
        const locationId = this.adapter.config.apiMuellabfuhrdeStreetId ?? this.adapter.config.apiMuellabfuhrdeCityId;

        try {
            const raw = await this.getApi(
                `https://portal.muellabfuhr-deutschland.de/api-portal/mandators/${mandator}/cal/location/${locationId}/pickups`,
=======
        const mandator = this.adapter.config.apiMuellabfuhrdeMandator;
        const locationId = this.adapter.config.apiMuellabfuhrdeStreetId ?? this.adapter.config.apiMuellabfuhrdeCityId;

        try {
            const raw = await this.getApi(
<<<<<<< HEAD
                `https://portal.muellabfuhr-deutschland.de/api-portal/mandators/${mandator}/cal/location/${streetId}/pickups`,
>>>>>>> 281070c (first step for integration of muellabfuhr-deutschland.de)
=======
                `https://portal.muellabfuhr-deutschland.de/api-portal/mandators/${mandator}/cal/location/${locationId}/pickups`,
>>>>>>> 9cedd4a (fix: city & street)
            );

            const pickups = JSON.parse(raw);

            return pickups.map(p => ({
                date: p.date,
                name: p.fraction.name,
                description: p.fraction.shortname,
            }));
        } catch (err) {
            this.adapter.log.error(
                `[api-muellabfuhrde] unable to load pickups: ${err}`,
            );

            return [];
        }
    }

    async getApiProviders() {
        const data = await this.getApiCached(
            'https://portal.muellabfuhr-deutschland.de/api-portal/mandators',
            'muellabfuhrde-mandators.json',
        );

        return JSON.parse(data);
    }

    async getApiCities(mandatorId) {
        const config = JSON.parse(
            await this.getApiCached(
                `https://portal.muellabfuhr-deutschland.de/api-portal/mandators/${mandatorId}/config`,
                `muellabfuhrde-config-${mandatorId}.json`,
            ),
        );

        const rootId = config.calendarRootLocationId;

        const cities = JSON.parse(
            await this.getApiCached(
                `https://portal.muellabfuhr-deutschland.de/api-portal/mandators/${mandatorId}/cal/location/${rootId}?includeChildren=true`,
                `muellabfuhrde-cities-${mandatorId}.json`,
            ),
        );

        return cities.children || [];
    }

    async getApiStreets(mandatorId, cityId) {
        const streets = JSON.parse(
            await this.getApiCached(
                `https://portal.muellabfuhr-deutschland.de/api-portal/mandators/${mandatorId}/cal/location/${cityId}?includeChildren=true`,
                `muellabfuhrde-streets-${mandatorId}-${cityId}.json`,
            ),
        );

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> a7117bb (t)
        if (!streets.children || streets.children.length === 0) {
            return [streets];
        }
        return streets.children;
<<<<<<< HEAD
=======
        return streets.children || [streets];
>>>>>>> 1575364 (fd)
=======
>>>>>>> a7117bb (t)
    }

    async getApiTypes(mandatorId, locationId) {
        const pickups = JSON.parse(
            await this.getApi(
                `https://portal.muellabfuhr-deutschland.de/api-portal/mandators/${mandatorId}/cal/location/${locationId}/pickups`,
=======
        return streets.children || [];
    }

    async getApiTypes(mandatorId, locationId) {
        const pickups = JSON.parse(
            await this.getApi(
<<<<<<< HEAD
                `https://portal.muellabfuhr-deutschland.de/api-portal/mandators/${mandatorId}/cal/location/${streetId}/pickups`,
>>>>>>> 281070c (first step for integration of muellabfuhr-deutschland.de)
=======
                `https://portal.muellabfuhr-deutschland.de/api-portal/mandators/${mandatorId}/cal/location/${locationId}/pickups`,
>>>>>>> 9cedd4a (fix: city & street)
            ),
        );

        const types = {};

        pickups.forEach(p => {
            types[p.fraction.id] = {
                id: p.fraction.id,
                name: p.fraction.name,
<<<<<<< HEAD
<<<<<<< HEAD
                shortname: p.fraction.shortname
=======
>>>>>>> 281070c (first step for integration of muellabfuhr-deutschland.de)
=======
                shortname: p.fraction.shortname
>>>>>>> 9cedd4a (fix: city & street)
            };
        });

        return Object.values(types);
    }
}

module.exports = SourceApiMuellabfuhrde;
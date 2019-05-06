import {
	ENTITIES_LOADED,
	ENTITY_LOADED,
	LOAD_GENERAL_PARTS,
	LOAD_NEED_PARTS,
	LOAD_TICKET_HISTORY,
	LOAD_TICKETS,
	SET_PART_STATUS,
	SET_TICKET_ID,
	GET_TICKET_FIELDS
} from '../constants'

import {
	enitityLoaded,
	entitiesLoaded,
	loadGeneralParts,
	loadNeedParts,
	loadTicketHistory,
	loadTickets,
	setPartStatus,
	setTicketId,
	getTicketFields
} from '../actions'

describe(`Entities actions`, () => {
	it(`return type of entitiesLoaded and passed payload`, () => {
		const expected = {
			type: ENTITIES_LOADED,
			payload: {cities: {'1': `Астана`}}
		}
		expect(entitiesLoaded({cities: {'1': `Астана`}})).toEqual(expected)
	})
	it(`return type of enitityLoaded, entity and passed payload`, () => {
		const expected = {
			type: ENTITY_LOADED,
			entity: `cities`,
			payload: {'1': `Астана`}
		}
		expect(enitityLoaded(`cities`, {'1': `Астана`})).toEqual(expected)
	})
	it(`return type of loadGeneralParts`, () => {
		const expected = {
			type: LOAD_GENERAL_PARTS
		}
		expect(loadGeneralParts()).toEqual(expected)
	})
	it(`return type of loadNeedParts`, () => {
		const expected = {
			type: LOAD_NEED_PARTS
		}
		expect(loadNeedParts()).toEqual(expected)
	})
	it(`return type of LOAD_TICKET_HISTORY`, () => {
		const expected = {
			type: LOAD_TICKET_HISTORY
		}
		expect(loadTicketHistory()).toEqual(expected)
	})
	it(`return type of LOAD_TICKETS and payload`, () => {
		const payload = {
			fields: [1, 2, 3],
			filters: {1: 2, 3: null}
		}
		const expected = {
			type: LOAD_TICKETS,
			payload
		}
		expect(loadTickets(payload)).toEqual(expected)
	})
	it(`return type of SET_PART_STATUS, entity, partId, and statusId`, () => {
		const expected = {
			type: SET_PART_STATUS,
			entity: `tickets`,
			partId: 123,
			statusId: 1
		}
		expect(setPartStatus(`tickets`, 123, 1)).toEqual(expected)
	})
	it(`return type of SET_TICKET_ID and value`, () => {
		const expected = {
			type: SET_TICKET_ID,
			value: 123
		}
		expect(setTicketId(123)).toEqual(expected)
	})
	it(`return type of GET_TICKET_FIELDS and payload`, () => {
		const expected = {
			type: GET_TICKET_FIELDS,
			payload: 123
		}
		expect(getTicketFields(123)).toEqual(expected)
	})
})

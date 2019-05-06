import {fromJS, List} from 'immutable'
import {
	BooleanRecord,
	NeedPartRecord,
	ReferenceRecord
} from '../schema'
import entityReducer from '../reducer'
import {
	entitiesLoaded,
	enitityLoaded,
	setPartStatus,
	setTicketId
} from '../actions'

const initialState = fromJS({
	appUser: {},
	booleans: {
		1: new BooleanRecord({id: true, name: `Да`}),
		2: new BooleanRecord({id: false, name: `Нет`}),
		index: [1, 2]
	},
	cities: {},
	customers: {},
	equipments: {},
	equipmentTypes: {},
	generalParts: [],
	needParts: [],
	serviceTypes: {},
	ticketComments: [],
	ticketHistory: [],
	ticketId: null,
	tickets: {},
	ticketStatuses: {},
	ticketTypes: {},
	users: {},
	vendors: {}
})

describe(`entityReducer`, () => {
	let store
	beforeEach(() => {
		store = initialState
	})
	it(`returns the initial state`, () => {
		expect(entityReducer(undefined, {})).toEqual(store)
	})
	it(`changes cities and customers entities`, () => {
		const payload = {
			cities: {
				'1': new ReferenceRecord({id: 1, name: `Астана`}),
				'2': new ReferenceRecord({id: 2, name: `Алматы`})
			},
			customers: {
				'1': new ReferenceRecord({id: 3, name: `Qazkom`}),
				'2': new ReferenceRecord({id: 4, name: `Halyk Bank`})
			}
		}
		const action = entitiesLoaded(payload)
		const expectedResult = store
			.set(`cities`, fromJS(payload.cities))
			.set(`customers`, fromJS(payload.customers))
		expect(entityReducer(store, action)).toEqual(expectedResult)
	})
	it(`changes cities state`, () => {
		const payload = {
			'1': new ReferenceRecord({id: 1, name: `Астана`}),
			'2': new ReferenceRecord({id: 2, name: `Алматы`})
		}
		const action = enitityLoaded(`cities`, payload)
		const expectedResult = store
			.set(`cities`, fromJS(payload))
		expect(entityReducer(store, action)).toEqual(expectedResult)
	})
	it(`changes statusId of part with id = 65`, () => {
		const mockedStore = store.set(`needParts`, List([
			new NeedPartRecord({id: 65, statusId: 1}),
			new NeedPartRecord({id: 72, statusId: 3})
		]))
		const partId = 65
		const statusId = 7
		const action = setPartStatus(`needParts`, partId, statusId)
		const expectedResult = store
			.set(`needParts`, List([
				new NeedPartRecord({id: 65, statusId: 7}),
				new NeedPartRecord({id: 72, statusId: 3})
			]))
		expect(entityReducer(mockedStore, action)).toEqual(expectedResult)
	})
	it(`changes tickeId`, () => {
		const action = setTicketId(777)
		const expectedResult = store.set(`ticketId`, 777)
		expect(entityReducer(store, action)).toEqual(expectedResult)
	})
})

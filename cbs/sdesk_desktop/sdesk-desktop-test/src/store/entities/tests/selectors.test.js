import {fromJS} from 'immutable'
import {
	AppUserRecord,
	BooleanRecord,
	ReferenceRecord
	// ,
	// TicketRecord,
	// PermissionRecord
} from '../schema'
import {
	selectEntities,
	makeSelectAppUser,
	makeSelectAppUserName,
	makeSelectReference,
	// makeSelectTickets,
	makeSelectUsers,
	makeSelectSelectedTicketId
	// ,
	// makeSelectTicket,
	// makeSelectTicketPermissions,
	// makeSelectPermissions
} from '../selectors'

describe(`Entity state selectors`, () => {
	// const date = new Date()
	const store = fromJS({
		global: {
			layout: `right`,
			loading: false
		},
		entities: {
			appUser: new AppUserRecord({
				id: 123,
				name: `Jacky Chan`
			}),
			booleans: {
				1: new BooleanRecord({id: true, name: `Да`}),
				2: new BooleanRecord({id: false, name: `Нет`})
			},
			cities: {
				'1': new ReferenceRecord({id: 1, name: `Астана`}),
				'2': new ReferenceRecord({id: 2, name: `Алматы`})
			},
			customers: {},
			equipments: {},
			equipmentTypes: {},
			generalParts: [],
			needParts: [],
			serviceTypes: {},
			ticketHistory: [],
			ticketId: 456,
			tickets: {
				// '123': new TicketRecord({
				// 	id: 123, date, permissions: new PermissionRecord({status: true})
				// }),
				// '456': new TicketRecord({
				// 	id: 456, date, permissions: new PermissionRecord({status: true})
				// })
			},
			ticketStatuses: {},
			ticketTypes: {},
			users: {
				'123': new ReferenceRecord({id: 123, name: `Dr. Alben`})
			},
			vendors: {}
		}
	})
	it(`should select the enities state`, () => {
		const expectedResult = fromJS({
			appUser: new AppUserRecord({
				id: 123,
				name: `Jacky Chan`
			}),
			booleans: {
				1: new BooleanRecord({id: true, name: `Да`}),
				2: new BooleanRecord({id: false, name: `Нет`})
			},
			cities: {
				'1': new ReferenceRecord({id: 1, name: `Астана`}),
				'2': new ReferenceRecord({id: 2, name: `Алматы`})
			},
			customers: {},
			equipments: {},
			equipmentTypes: {},
			generalParts: [],
			needParts: [],
			serviceTypes: {},
			ticketHistory: [],
			ticketId: 456,
			tickets: {
				// '123': new TicketRecord({
				// 	id: 123, date, permissions: new PermissionRecord({status: true})
				// }),
				// '456': new TicketRecord({
				// 	id: 456, date, permissions: new PermissionRecord({status: true})
				// })
			},
			ticketStatuses: {},
			ticketTypes: {},
			users: {
				'123': new ReferenceRecord({id: 123, name: `Dr. Alben`})
			},
			vendors: {}
		})
		expect(selectEntities(store)).toEqual(expectedResult)
	})
	it(`should select app user model`, () => {
		const expectedResult = fromJS(new AppUserRecord({
			id: 123,
			name: `Jacky Chan`
		}))
		const selectAppUser = makeSelectAppUser()
		expect(selectAppUser(store)).toEqual(expectedResult)
	})
	it(`should select app user name`, () => {
		const expectedResult = `Jacky Chan`
		const selectAppUserName = makeSelectAppUserName()
		expect(selectAppUserName(store)).toEqual(expectedResult)
	})
	it(`should select reference by name`, () => {
		const expectedResult = fromJS({
			'1': new ReferenceRecord({id: 1, name: `Астана`}),
			'2': new ReferenceRecord({id: 2, name: `Алматы`})
		})
		const selectReference = makeSelectReference(`cities`)
		expect(selectReference(store)).toEqual(expectedResult)
	})
	// it(`should select tickets model`, () => {
	// 	const expectedResult = fromJS({
	// 		'123': new TicketRecord({
	// 			id: 123, date, permissions: new PermissionRecord({status: true})
	// 		}),
	// 		'456': new TicketRecord({
	// 			id: 456, date, permissions: new PermissionRecord({status: true})
	// 		})
	// 	})
	// 	const selectTickets = makeSelectTickets()
	// 	expect(selectTickets(store)).toEqual(expectedResult)
	// })
	it(`should select users model`, () => {
		const expectedResult = fromJS({
			'123': new ReferenceRecord({id: 123, name: `Dr. Alben`})
		})
		const selectUsers = makeSelectUsers()
		expect(selectUsers(store)).toEqual(expectedResult)
	})
	it(`should select selected ticket id`, () => {
		const expectedResult = 456
		const selectSelectedTicketId = makeSelectSelectedTicketId()
		expect(selectSelectedTicketId(store)).toEqual(expectedResult)
	})
	// it(`should select ticket`, () => {
	// 	const expectedResult = new TicketRecord({
	// 		id: 456, date, permissions: new PermissionRecord({status: true})
	// 	})
	// 	const selectTicket = makeSelectTicket()
	// 	expect(selectTicket(store)).toEqual(expectedResult)
	// })
	// it(`should select ticket permissions`, () => {
	// 	const expectedResult = new PermissionRecord({status: true})
	// 	const selectTicketPermissions = makeSelectTicketPermissions()
	// 	expect(selectTicketPermissions(store)).toEqual(expectedResult)
	// })
	// it(`should select ticket permission by name`, () => {
	// 	const expectedResult = true
	// 	const selectPermissions = makeSelectPermissions(`status`)
	// 	expect(selectPermissions(store)).toEqual(expectedResult)
	// })
})

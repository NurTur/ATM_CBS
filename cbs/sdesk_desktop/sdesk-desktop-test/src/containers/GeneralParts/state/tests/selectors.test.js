import {fromJS, List} from 'immutable'
import {GeneralPartRecord} from 'store/entities/schema'
import {makeSelectPartsModel, makeSelectParts} from '../selectors'

describe(`General parts state selectors`, () => {
	const date = new Date(`2017-12-20`)
	const record = {
		id: 123,
		analog: `ThinkPad`,
		blockNumber: `think-different`,
		customerId: 5,
		name: `ThinkPad Monitor`,
		needPartId: 678,
		number: `think-monic`,
		orderDate: date,
		quantity: 2,
		ticketId: 777,
		vendorId: 1
	}
	const state = fromJS({
		entities: {
			generalParts: [new GeneralPartRecord(record)]
		},
		ticketTable: {selected: {ticketId: 777}},
		ticketDetails: {
			parts: {
				expandedAll: false,
				loading: false
			}
		}
	})

	it(`should select general parts model`, () => {
		const expected = state.getIn([`entities`, `generalParts`])
		const selectParts = makeSelectPartsModel()
		expect(selectParts(state)).toEqual(expected)
	})
	it(`should select general parts`, () => {
		const part = {
			id: 123,
			analog: `ThinkPad`,
			blockNumber: `think-different`,
			count: 2,
			customer: `Qazkom`,
			history: [],
			orderDate: `20 декабря 2017`,
			partNumber: `think-monic`,
			title: `ThinkPad Monitor`,
			vendor: `BOOGLE`
		}
		const expected = List([part])
		const selectParts = makeSelectParts()
		expect(selectParts(state)).toEqual(expected)
	})
})

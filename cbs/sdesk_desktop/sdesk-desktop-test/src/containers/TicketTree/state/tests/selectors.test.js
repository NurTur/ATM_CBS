import {fromJS} from 'immutable'
import {normalize} from 'normalizr'
import treeSchema from '../schema'
import {
	makeSelectTickets,
	makeSelectTicketIds,
	makeSelectNormalizedData,
	makeSelectLoading,
	makeSelectTicketTreeShow,
	selectTicketTree
} from '../selectors'

describe(`TicketTree state selectors`, () => {
	const store = fromJS({
		entities: {
			ticketId: 355733
		},
		ticketTree: {
			data: normalize([{
				id: 355733,
				number: `I353M-16`,
				children: [{
					id: 355876,
					number: `I298Q-16`,
					children: []
				}]
			}], treeSchema),
			loading: true,
			show: false
		}
	})

	it(`should select ticketTree state`, () => {
		const expectedResult = store.get(`ticketTree`)
		expect(selectTicketTree(store)).toEqual(expectedResult)
	})
	it(`should select tickets from tree data`, () => {
		const expectedResult = store.getIn([`ticketTree`, `data`, `entities`, `tickets`])
		const selectData = makeSelectTickets()
		expect(selectData(store)).toEqual(expectedResult)
	})
	it(`should select normalized data`, () => {
		const expectedResult = fromJS([{
			id: 355733,
			number: `I353M-16`,
			children: [{
				id: 355876,
				number: `I298Q-16`,
				children: []
			}]
		}])
		const selectData = makeSelectNormalizedData()
		expect(selectData(store)).toEqual(expectedResult)
	})
	it(`should select tickets ids`, () => {
		const expectedResult = [`355733`, `355876`]
		const selectData = makeSelectTicketIds()
		expect(selectData(store)).toEqual(expectedResult)
	})
	it(`should select show value from ticketTree state`, () => {
		const expectedResult = store
			.get(`ticketTree`)
			.get(`show`)
		const selectTicketTreeShow = makeSelectTicketTreeShow()
		expect(selectTicketTreeShow(store)).toEqual(expectedResult)
	})
	it(`should select loading from ticketTree state`, () => {
		const expectedResult = store
			.get(`ticketTree`)
			.get(`loading`)
		const selectLoading = makeSelectLoading()
		expect(selectLoading(store)).toEqual(expectedResult)
	})
})

import {
	LOAD_DATA,
	SET_DATA,
	SET_LOADING,
	SHOW_TICKET_TREE,
	TREE_SEARCH_REQUEST
} from '../constants'

import {
	loadData,
	setData,
	setLoading,
	showTicketTree,
	runTreeSearchRequest
} from '../actions'

describe(`TicketTree actions`, () => {
	const mockedData = [{
		id: 355733,
		number: `I353M-16`,
		children: [{
			id: 355876,
			number: `I298Q-16`,
			children: []
		}]
	}]
	it(`has a type of LOAD_DATA`, () => {
		const expected = {type: LOAD_DATA}
		expect(loadData(mockedData)).toEqual(expected)
	})
	it(`has a type of SHOW_TICKET_TREE`, () => {
		const value = true
		const expected = {
			type: SHOW_TICKET_TREE,
			value
		}
		expect(showTicketTree(value)).toEqual(expected)
	})
	it(`has a type of SET_DATA`, () => {
		const expected = {
			type: SET_DATA,
			payload: mockedData
		}
		expect(setData(mockedData)).toEqual(expected)
	})
	it(`has a type of SET_LOADING`, () => {
		const expected = {
			type: SET_LOADING,
			value: true
		}
		expect(setLoading(true)).toEqual(expected)
	})
	it(`has a type of TREE_SEARCH_REQUEST`, () => {
		const expected = {
			type: TREE_SEARCH_REQUEST,
			payload: null
		}
		expect(runTreeSearchRequest()).toEqual(expected)
	})
})

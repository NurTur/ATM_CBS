import {fromJS} from 'immutable'
import {normalize} from 'normalizr'
import treeSchema from '../schema'
import ticketTreeReducer from '../reducer'
import {setData, setLoading, showTicketTree} from '../actions'

describe(`ticketTreeReducer`, () => {
	const mockedState = fromJS({
		data: [],
		loading: false,
		show: false
	})

	it(`returns the initial state`, () => {
		expect(ticketTreeReducer(undefined, {})).toEqual(mockedState)
	})
	it(`changes show state`, () => {
		const action = showTicketTree(true)
		const expectedResult = mockedState.set(`show`, action.value)
		expect(ticketTreeReducer(mockedState, action)).toEqual(expectedResult)
	})
	it(`changes data state`, () => {
		const payload = [{
			id: 355733,
			number: `I353M-16`,
			children: [{
				id: 355876,
				number: `I298Q-16`,
				children: []
			}]
		}]
		const action = setData(payload)
		const expectedResult = mockedState.set(`data`, fromJS(normalize(payload, treeSchema)))
		expect(ticketTreeReducer(mockedState, action)).toEqual(expectedResult)
	})
	it(`changes loading state`, () => {
		const action = setLoading(true)
		const expectedResult = mockedState.set(`loading`, true)
		expect(ticketTreeReducer(mockedState, action)).toEqual(expectedResult)
	})
})

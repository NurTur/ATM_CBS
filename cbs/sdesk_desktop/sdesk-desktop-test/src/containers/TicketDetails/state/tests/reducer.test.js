import {fromJS} from 'immutable'
import ticketDetailsReducer from '../reducer'
import {setActiveTab, setLoading} from '../actions'

describe(`ticketDetailsReducer`, () => {
	const mockedState = fromJS({
		activeTab: `comments`,
		loading: false
	})

	it(`should return the initial state`, () => {
		const state = ticketDetailsReducer(undefined, {})
		expect(state).toEqual(mockedState)
	})
	it(`should handle setActiveTab action`, () => {
		const action = setActiveTab(`history`)
		const expected = mockedState.set(`activeTab`, `history`)
		const state = ticketDetailsReducer(mockedState, action)
		expect(state).toEqual(expected)
	})
	it(`should handle setLoading action`, () => {
		const action = setLoading(true)
		const expected = mockedState.set(`loading`, true)
		const state = ticketDetailsReducer(mockedState, action)
		expect(state).toEqual(expected)
	})
})

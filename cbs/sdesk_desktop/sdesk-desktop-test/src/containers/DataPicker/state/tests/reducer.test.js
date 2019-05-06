import reducer from '../reducer'
import {setPickerData} from '../actions'
import {initialState} from '../constants'
import {testValues} from './constants'

describe(`DataPicker reducer`, () => {
	let state
	beforeEach(() => {
		state = initialState
	})
	it(`should return the initial state`, () => {
		const expectedResult = state
		expect(reducer(undefined, {})).toEqual(expectedResult)
	})
	it(`should set picker data`, () => {
		const expectedResult = state.set(`customer`, testValues.string)
		const action = setPickerData(`customer`, testValues.string)
		expect(reducer(state, action)).toEqual(expectedResult)
	})
})

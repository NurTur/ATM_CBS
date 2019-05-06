import {fromJS} from 'immutable'
import generalPartsReducer from '../reducer'
import {setExpandAll} from '../actions'

describe(`generalPartsReducer`, () => {
	const mockedState = fromJS({
		parts: {
			expandAll: false
		}
	})

	it(`should handle expandAll action`, () => {
		const action = setExpandAll()
		const expected = mockedState.setIn([`parts`, `expandAll`], true)
		const state = generalPartsReducer(mockedState, action)
		expect(state).toEqual(expected)
	})
})

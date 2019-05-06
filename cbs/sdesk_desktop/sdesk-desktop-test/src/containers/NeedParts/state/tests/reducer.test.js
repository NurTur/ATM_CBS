import {fromJS} from 'immutable'
import needPartsReducer from '../reducer'
import {setExpandAll} from '../actions'

describe(`needPartsReducer`, () => {
	const mockedState = fromJS({
		parts: {
			expandAll: false
		}
	})

	it(`should handle expandAll action`, () => {
		const action = setExpandAll()
		const expected = mockedState.setIn([`parts`, `expandAll`], true)
		const state = needPartsReducer(mockedState, action)
		expect(state).toEqual(expected)
	})
})

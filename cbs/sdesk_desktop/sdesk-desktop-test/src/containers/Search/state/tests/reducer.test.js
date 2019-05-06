import {fromJS} from 'immutable'
import reducer from '../reducer'
import {
	setSearchValue,
	setSearchField,
	updateSearchHistory,
	clearFilters,
	setFilter,
	applyFilters,
	showFilters,
	setTag
} from '../actions'
import {initialState} from '../constants'
import {testValues} from './constants'

describe(`Search reducer`, () => {
	let state
	beforeEach(() => {
		state = initialState
	})
	it(`should return the initial state`, () => {
		const expectedResult = state
		expect(reducer(undefined, {})).toEqual(expectedResult)
	})
	it(`should handle the setSearchValue action`, () => {
		const expectedResult = state.set(`value`, testValues.string)
		const action = setSearchValue(testValues.string)
		expect(reducer(state, action)).toEqual(expectedResult)
	})
	it(`should handle the setSearchField action`, () => {
		const expectedResult = state.set(`field`, testValues.string)
		const action = setSearchField(testValues.string)
		expect(reducer(state, action)).toEqual(expectedResult)
	})
	it(`should handle the updateSearchHistory action`, () => {
		const expectedResult = state.set(`history`, fromJS(testValues.outputHistoryArray).reverse())
		const action = updateSearchHistory()
		const prepareState = () => {
			testValues.inputHistoryArray.forEach(item => {
				state = state.set(`value`, item)
				state = reducer(state, action)
			})
			return state
		}
		expect(prepareState()).toEqual(expectedResult)
	})
	it(`should handle the clearFilters action`, () => {
		const expectedResult = initialState
		state = state.setIn([`filters`, `city`, `value`], testValues.string)
		const action = clearFilters()
		expect(reducer(state, action)).toEqual(expectedResult)
	})
	it(`should handle the setFilter action`, () => {
		const expectedResult = state.setIn([`filters`, `city`, `value`], testValues.string)
		const action = setFilter(`city`, testValues.string)
		expect(reducer(state, action)).toEqual(expectedResult)
	})
	it(`should handle the applyFilters action`, () => {
		const expectedResult = state.updateIn([`filters`, `applied`], value => !value)
		const action = applyFilters()
		expect(reducer(state, action)).toEqual(expectedResult)
	})
	it(`should handle the showFilters action`, () => {
		const expectedResult = state.updateIn([`filters`, `visible`], value => !value)
		const action = showFilters()
		expect(reducer(state, action)).toEqual(expectedResult)
	})
	it(`should handle the setTag action`, () => {
		const expectedResult = state
			.setIn([`tags`, `city`, `selected`], true)
			.setIn([`tags`, `city`, `visible`], true)
		const action = setTag(`city`, {selected: true, visible: true})
		expect(reducer(state, action)).toEqual(expectedResult)
	})
})

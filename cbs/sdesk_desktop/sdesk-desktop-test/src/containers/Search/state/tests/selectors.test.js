import {Map} from 'immutable'
import {
	makeSelectSearchValue,
	makeSelectSearchField,
	makeSelectHistory,
	makeSelectFilterData,
	makeSelectTag,
	makeSelectFilterTags,
	makeSelectFilterDataPickers
} from '../selectors'
import {testValues} from './constants'
import {initialState} from '../constants'

describe(`Search state selectors`, () => {
	let mockedState
	beforeEach(() => {
		mockedState = Map({search: initialState})
			.setIn([`search`, `value`], testValues.string)
			.setIn([`search`, `field`], testValues.string)
			.setIn([`search`, `history`], testValues.outputHistoryArray)
			.setIn([`search`, `tags`, `city`, `selected`], true)
			.setIn([`search`, `tags`, `city`, `visible`], true)
	})
	it(`should select value of search state`, () => {
		const expectedResult = mockedState.getIn([`search`, `value`])
		const selectSearchValue = makeSelectSearchValue()
		expect(selectSearchValue(mockedState)).toEqual(expectedResult)
	})
	it(`should select field of search state`, () => {
		const expectedResult = mockedState.getIn([`search`, `field`])
		const selectSearchField = makeSelectSearchField()
		expect(selectSearchField(mockedState)).toEqual(expectedResult)
	})
	it(`should select history of search state`, () => {
		const expectedResult = mockedState.getIn([`search`, `history`])
		const selectSearchHistory = makeSelectHistory()
		expect(selectSearchHistory(mockedState)).toEqual(expectedResult)
	})
	it(`should select value of search city filter`, () => {
		const expectedResult = mockedState.getIn([`search`, `filters`, `city`, `value`])
		const selectFilterValue = makeSelectFilterData(`city`, `value`)
		expect(selectFilterValue(mockedState)).toEqual(expectedResult)
	})
	it(`should select data of search city tag`, () => {
		const expectedResult = mockedState.getIn([`search`, `tags`, `city`])
		const selectSearchTag = makeSelectTag(`city`)
		expect(selectSearchTag(mockedState)).toEqual(expectedResult)
	})
	it(`should select array of search tags`, () => {
		const expectedResult = mockedState
			.getIn([`search`, `tags`])
			.sort((a, b) => {
				let result = 0
				a.order > b.order && result ++
				a.order < b.order && result --
				return result
			})
			.filter(tag => tag.visible === true)
			.map(tag => tag.selected)
		const makeSelect = makeSelectFilterTags()
		expect(makeSelect(mockedState)).toEqual(expectedResult)
	})
	it(`should select array of search filter names`, () => {
		const expectedResult = mockedState
			.getIn([`search`, `tags`])
			.sort((a, b) => {
				let result = 0
				a.order > b.order && result ++
				a.order < b.order && result --
				return result
			})
			.filter(tag => tag.selected === true && tag.visible === true)
			.map(() => null)
		const makeSelect = makeSelectFilterDataPickers()
		expect(makeSelect(mockedState)).toEqual(expectedResult)
	})
})

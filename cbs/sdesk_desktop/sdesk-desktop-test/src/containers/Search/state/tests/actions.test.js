import {
	SET_SEARCH_VALUE,
	SET_SEARCH_FIELD,
	UPDATE_SEARCH_HISTORY,
	SET_FILTERS_APPLIED,
	SHOW_FILTERS,
	SET_FILTER,
	SET_TAG,
	CLEAR_FILTERS,
	LOAD_SEARCH
} from '../constants'
import {
	setSearchValue,
	setSearchField,
	updateSearchHistory,
	applyFilters,
	showFilters,
	setFilter,
	setTag,
	clearFilters,
	loadSearch
} from '../actions'
import {testValues} from './constants'

describe(`Search actions`, () => {
	describe(`setSearchValue`, () => {
		it(`should return the type and the passed value`, () => {
			const expectedResult = {
				type: SET_SEARCH_VALUE,
				value: testValues.string
			}
			expect(setSearchValue(testValues.string)).toEqual(expectedResult)
		})
	})
	describe(`setSearchField`, () => {
		it(`should return the type and the passed field`, () => {
			const expectedResult = {
				type: SET_SEARCH_FIELD,
				field: testValues.string
			}
			expect(setSearchField(testValues.string)).toEqual(expectedResult)
		})
	})
	describe(`updateSearchHistory`, () => {
		it(`should return the type`, () => {
			const expectedResult = {type: UPDATE_SEARCH_HISTORY, payload: null}
			expect(updateSearchHistory()).toEqual(expectedResult)
		})
	})
	describe(`applyFilters`, () => {
		it(`should return the type`, () => {
			const expectedResult = {type: SET_FILTERS_APPLIED}
			expect(applyFilters()).toEqual(expectedResult)
		})
	})
	describe(`showFilters`, () => {
		it(`should return the type`, () => {
			const expectedResult = {type: SHOW_FILTERS}
			expect(showFilters()).toEqual(expectedResult)
		})
	})
	describe(`setFilter`, () => {
		it(`should return the type and the passed fields`, () => {
			const expectedResult = {
				type: SET_FILTER,
				payload: {name: testValues.string, value: testValues.string}
			}
			expect(setFilter(testValues.string, testValues.string)).toEqual(expectedResult)
		})
	})
	describe(`setTag`, () => {
		it(`should return the type and the passed fields`, () => {
			const expectedResult = {
				type: SET_TAG,
				payload: {name: testValues.string, value: testValues.string}
			}
			expect(setTag(testValues.string, testValues.string)).toEqual(expectedResult)
		})
	})
	describe(`clearFilters`, () => {
		it(`should return the type`, () => {
			const expectedResult = {type: CLEAR_FILTERS}
			expect(clearFilters()).toEqual(expectedResult)
		})
	})
	describe(`storeSearch`, () => {
		it(`should return the type and payload`, () => {
			const expectedResult = {type: LOAD_SEARCH, payload: testValues.string}
			expect(loadSearch(testValues.string)).toEqual(expectedResult)
		})
	})
})

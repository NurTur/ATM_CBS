import {List, Map} from 'immutable'
import {normalize} from 'normalizr'
import ticketTableReducer from '../reducer'
import {
	setColumns,
	setConfigs,
	setGrouping,
	setPage,
	setInitialPage,
	setPageSize,
	setTotalRecords,
	sortData,
	setLoading,
	setGroupingColumnVisibility,
	setPreventUpdate
} from '../actions'
import {initialState, sorter as defaultSorter} from '../constants'
import {columns, columnsSchema, positions} from '../../columns'

describe(`ticketTableReducer`, () => {
	const store = initialState
	it(`returns the initial state`, () => {
		expect(ticketTableReducer(undefined, {})).toEqual(store)
	})
	it(`changes columns state`, () => {
		const action = setColumns(columns)
		const expectedResult = store.set(`columns`, List(columns))
		expect(ticketTableReducer(store, action)).toEqual(expectedResult)
	})
	it(`changes configs state`, () => {
		const action = setConfigs({
			columns,
			positions,
			sorter: defaultSorter,
			pageSize: 125,
			groupedColumn: `groupedColumn`
		})
		const expectedResult = store
			.set(`columns`, Map(normalize(columns, columnsSchema).entities.columns))
			.set(`positions`, List(positions))
			.update(`sorter`, sorter =>
				sorter.withMutations(swm => swm
					.set(`columnKey`, defaultSorter.columnKey)
					.set(`order`, defaultSorter.order)
				))
			.setIn([`page`, `size`], 125)
			.setIn([`groupedBy`, `column`], `groupedColumn`)

		expect(ticketTableReducer(store, action)).toEqual(expectedResult)
	})
	it(`changes grouping state`, () => {
		const colName = `number`
		const action = setGrouping(colName)
		const expectedResult = store.setIn([`groupedBy`, `column`], colName)
		expect(ticketTableReducer(store, action)).toEqual(expectedResult)
	})
	it(`changes page value`, () => {
		const value = 2
		const action = setPage(value)
		const expectedResult = store.setIn([`page`, `current`], value)
		expect(ticketTableReducer(store, action)).toEqual(expectedResult)
	})
	it(`changes page value to initial value`, () => {
		const mockedStore = store.setIn([`page`, `current`], 325)
		const action = setInitialPage()
		const expectedResult = store
			.setIn([`page`, `current`], initialState.getIn([`page`, `current`]))
		expect(ticketTableReducer(mockedStore, action)).toEqual(expectedResult)
	})
	it(`changes total records`, () => {
		const value = 653
		const action = setTotalRecords(value)
		const expectedResult = store.setIn([`page`, `totalRecords`], value)
		expect(ticketTableReducer(store, action)).toEqual(expectedResult)
	})
	it(`changes page size`, () => {
		const value = 2
		const action = setPageSize(value)
		const expectedResult = store.setIn([`page`, `size`], value)
		expect(ticketTableReducer(store, action)).toEqual(expectedResult)
	})
	it(`changes column sort order`, () => {
		const colName = `number`
		const order = `asc`
		const action = sortData({colName, order})
		const expectedResult = store.set(`sorter`, Map({colName, order}))
		expect(ticketTableReducer(store, action)).toEqual(expectedResult)
	})
	it(`changes table loading`, () => {
		const value = true
		const action = setLoading(value)
		const expectedResult = store.set(`loading`, value)
		expect(ticketTableReducer(store, action)).toEqual(expectedResult)
	})
	it(`changes grouping column visibility`, () => {
		const value = true
		const action = setGroupingColumnVisibility(value)
		const expectedResult = store
			.set(`columns`, List(columns))
			.updateIn([`columns`, 0], ({visible, ...column}) =>
				({visible: value, ...column})
			)
		expect(ticketTableReducer(store.set(`columns`, List(columns)), action))
			.toEqual(expectedResult)
	})
	it(`changes table preventUpdate`, () => {
		const value = true
		const action = setPreventUpdate(value)
		const expectedResult = store.set(`preventUpdate`, value)
		expect(ticketTableReducer(store, action)).toEqual(expectedResult)
	})
})

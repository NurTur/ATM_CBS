import {fromJS, Map, List} from 'immutable'
import {normalize} from 'normalizr'
import {columns, columnStatics, columnsSchema, positions} from '../../columns'
import {initialState} from '../constants'
import {
	makeSelectLoading,
	makeSelectUpdate,
	makeSelectColumns,
	makeSelectPage,
	makeSelectSelectedRow,
	makeSelectGroupingValue,
	makeSelectGroupingList,
	makeSelectSortColumns,
	makeSelectVisibleSort
} from '../selectors'

describe(`TicketTable state selectors`, () => {
	const store = fromJS({
		entities: {ticketId: 123},
		ticketTable: initialState
	})
		.setIn([`ticketTable`, `columns`], Map(normalize(columns, columnsSchema).entities.columns))
		.setIn([`ticketTable`, `positions`], List(positions))
		.setIn([`ticketTable`, `groupedBy`], Map({column: `number`}))
	it(`should select loading from ticketTable state`, () => {
		const expectedResult = initialState.get(`loading`)
		const selector = makeSelectLoading()
		expect(selector(store)).toEqual(expectedResult)
	})
	it(`should select preventUpdate from ticketTable state`, () => {
		const expectedResult = initialState.get(`preventUpdate`)
		const selector = makeSelectUpdate()
		expect(selector(store)).toEqual(expectedResult)
	})
	it(`should select columns from ticketTable state`, () => {
		const expectedResult = List(columns)
			.filter(column => column.visible)
			.map(column => ({...columnStatics[column.key], ...column}))
		const selector = makeSelectColumns()
		expect(selector(store)).toEqual(expectedResult)
	})
	it(`should select page from ticketTable state`, () => {
		const expectedResult = initialState.get(`page`)
		const selectPage = makeSelectPage()
		expect(selectPage(store)).toEqual(expectedResult)
	})
	it(`should select selected row from ticketTable state`, () => {
		const expectedResult = {
			key: `id`,
			value: 123
		}
		const selectSelectedRow = makeSelectSelectedRow()
		expect(selectSelectedRow(store)).toEqual(expectedResult)
	})
	it(`should select grouping -> value from ticketTable state`, () => {
		const expectedResult = `number`
		const selectGroupingValue = makeSelectGroupingValue()
		expect(selectGroupingValue(store)).toEqual(expectedResult)
	})
	it(`should select grouping and merge labels for drop list`, () => {
		const expectedResult = List(columns)
			.filter(column => column.visible)
			.map(column => ({...columnStatics[column.key], ...column}))
			.filter(column => !column.hidden)
			.map(column => ({
				value: column.key,
				label: column.title
			}))
		const selectGroupingList = makeSelectGroupingList()
		expect(selectGroupingList(store)).toEqual(expectedResult)
	})
	it(`should select sorted columns from ticketTable state`, () => {
		const expectedResult = List(columns)
			.filter(column => column.visible)
			.map(column => ({...columnStatics[column.key], ...column}))
			.update(2, column =>
				({...column, sortOrder: `ascend`})
			)
		const selector = makeSelectSortColumns()
		expect(selector(store)).toEqual(expectedResult)
	})
	it(`should select default sort to find tickets`, () => {
		const testStore = store.setIn([`ticketTable`, `columns`, `date`, `visible`], false)
		const expectedResult = Map({columnKey: `id`, order: `asc`})
		const selector = makeSelectVisibleSort()
		expect(selector(testStore)).toEqual(expectedResult)
	})
})

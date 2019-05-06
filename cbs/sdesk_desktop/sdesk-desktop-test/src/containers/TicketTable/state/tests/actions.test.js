import {
	SET_COLUMNS,
	SET_CONFIGS,
	SET_GROUPING,
	SET_PAGE_SIZE,
	SET_PAGE,
	SET_INITIAL_PAGE,
	SET_TOTAL_RECORDS,
	SORT_DATA,
	SET_LOADING,
	SET_GROUPING_COLUMN_VISIBILITY,
	SET_PREVENT_UPDATE,
	EXPORT_TICKETS
} from '../constants'
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
	setPreventUpdate,
	exportTickets
} from '../actions'

describe(`TicketTable actions`, () => {
	describe(`set table columns`, () => {
		it(`has a type of SET_COLUMNS`, () => {
			const value = `number`
			const expected = {
				type: SET_COLUMNS,
				payload: value
			}
			expect(setColumns(value)).toEqual(expected)
		})
	})
	describe(`set configs, all settings from local storage`, () => {
		it(`has a type of SET_CONFIGS`, () => {
			const columns = [
				{hidden: false, name: `number`, sort: null, visible: true, size: 150},
				{hidden: false, name: `daate`, sort: null, visible: true, size: 100}
			]
			const pageSize = 12
			const expected = {
				type: SET_CONFIGS,
				payload: {columns, pageSize}
			}
			expect(setConfigs({columns, pageSize})).toEqual(expected)
		})
	})
	describe(`set grouping values`, () => {
		it(`has a type of SET_GROUPING`, () => {
			const colName = `date`
			const expected = {
				type: SET_GROUPING,
				colName
			}
			expect(setGrouping(colName)).toEqual(expected)
		})
	})
	describe(`set page value`, () => {
		it(`has a type of SET_PAGE`, () => {
			const value = 1
			const expected = {
				type: SET_PAGE,
				value
			}
			expect(setPage(value)).toEqual(expected)
		})
	})
	describe(`set initial page value`, () => {
		it(`has a type of SET_INITIAL_PAGE`, () => {
			const expected = {
				type: SET_INITIAL_PAGE
			}
			expect(setInitialPage()).toEqual(expected)
		})
	})
	describe(`set page size`, () => {
		it(`has a type of SET_PAGE_SIZE`, () => {
			const size = 50
			const expected = {
				type: SET_PAGE_SIZE,
				size
			}
			expect(setPageSize(size)).toEqual(expected)
		})
	})
	describe(`set total records in table`, () => {
		it(`has a type of SET_TOTAL_RECORDS`, () => {
			const value = 5000
			const expected = {
				type: SET_TOTAL_RECORDS,
				value
			}
			expect(setTotalRecords(value)).toEqual(expected)
		})
	})
	describe(`sort data`, () => {
		it(`has a type of SORT_DATA`, () => {
			const colName = `number`
			const order = `desc`
			const expected = {
				type: SORT_DATA,
				payload: {colName, order}
			}
			expect(sortData({colName, order})).toEqual(expected)
		})
	})
	describe(`set loading in table`, () => {
		it(`has a type of SET_LOADING`, () => {
			const value = false
			const expected = {
				type: SET_LOADING,
				payload: value
			}
			expect(setLoading(value)).toEqual(expected)
		})
	})
	describe(`set grouping column visibility in table`, () => {
		it(`has a type of SET_GROUPING_COLUMN_VISIBILITY`, () => {
			const value = false
			const expected = {
				type: SET_GROUPING_COLUMN_VISIBILITY,
				payload: value
			}
			expect(setGroupingColumnVisibility(value)).toEqual(expected)
		})
	})
	describe(`set preventUpdate in table`, () => {
		it(`has a type of SET_GROUPING_COLUMN_VISIBILITY`, () => {
			const value = false
			const expected = {
				type: SET_PREVENT_UPDATE,
				payload: value
			}
			expect(setPreventUpdate(value)).toEqual(expected)
		})
	})
	describe(`run prepare report`, () => {
		it(`has a type of EXPORT_TICKETS and payload object`, () => {
			const payload = {additionalFields: [`123`], email: `test@cbs.kz`}
			const expected = {
				type: EXPORT_TICKETS,
				payload
			}
			expect(exportTickets(payload)).toEqual(expected)
		})
	})
})

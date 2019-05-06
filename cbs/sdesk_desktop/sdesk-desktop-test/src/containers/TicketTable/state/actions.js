import {
	SET_COLUMNS,
	SWAP_COLUMNS,
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
} from './constants'

export function setColumns(columns) {
	return {
		type: SET_COLUMNS,
		payload: columns
	}
}
export function swapColumns(first, second) {
	return {
		type: SWAP_COLUMNS,
		first,
		second
	}
}

export function setConfigs(table) {
	return {
		type: SET_CONFIGS,
		payload: table
	}
}

export function setGrouping(colName) {
	return {
		type: SET_GROUPING,
		colName
	}
}

export function setPageSize(size) {
	return {
		type: SET_PAGE_SIZE,
		size
	}
}

export function setPage(value) {
	return {
		type: SET_PAGE,
		value
	}
}

export function setInitialPage() {
	return {
		type: SET_INITIAL_PAGE
	}
}

export function setTotalRecords(value) {
	return {
		type: SET_TOTAL_RECORDS,
		value
	}
}

export function sortData(sorter) {
	return {
		type: SORT_DATA,
		payload: sorter
	}
}

export function setLoading(value) {
	return {
		type: SET_LOADING,
		payload: value
	}
}

export function setGroupingColumnVisibility(value) {
	return {
		type: SET_GROUPING_COLUMN_VISIBILITY,
		payload: value
	}
}

export function setPreventUpdate(value) {
	return {
		type: SET_PREVENT_UPDATE,
		payload: value
	}
}

export function exportTickets(payload) {
	return {
		type: EXPORT_TICKETS,
		payload
	}
}
import {List, Map} from 'immutable'
import {
	SET_COLUMNS,
	SET_CONFIGS,
	SET_GROUPING,
	SET_PAGE_SIZE,
	SET_PAGE,
	SET_INITIAL_PAGE,
	SET_TOTAL_RECORDS,
	SORT_DATA,
	SWAP_COLUMNS,
	SET_LOADING,
	SET_GROUPING_COLUMN_VISIBILITY,
	SET_PREVENT_UPDATE,
	initialState
} from './constants'
import {normalize} from 'normalizr'
import {columnsSchema} from '../columns'

function ticketTableReducer(state = initialState, action) {
	switch (action.type) {
	case SET_LOADING: {
		return state.set(`loading`, action.payload)
	}
	case SET_COLUMNS: {
		return state.set(`columns`, List(action.payload))
	}
	case SET_CONFIGS: {
		return state.withMutations(map => map
			.set(`columns`, Map(normalize(action.payload.columns, columnsSchema).entities.columns))
			.set(`positions`, List(action.payload.positions))
			.update(`sorter`, sorter =>
				sorter.withMutations(swm => swm
					.set(`columnKey`, action.payload.sorter.columnKey)
					.set(`order`, action.payload.sorter.order)
				))
			.setIn([`page`, `size`], action.payload.pageSize)
			.setIn([`groupedBy`, `column`], action.payload.groupedColumn)
		)
	}
	case SET_GROUPING: {
		return state.setIn([`groupedBy`, `column`], action.colName)
	}
	case SET_PAGE_SIZE: {
		return state.setIn([`page`, `size`], action.size)
	}
	case SET_PAGE: {
		return state.setIn([`page`, `current`], action.value)
	}
	case SET_INITIAL_PAGE: {
		return state.setIn([`page`, `current`], initialState.getIn([`page`, `current`]))
	}
	case SET_TOTAL_RECORDS: {
		return state.setIn([`page`, `totalRecords`], action.value)
	}
	case SORT_DATA: {
		return state.set(`sorter`, Map(action.payload))
	}
	case SWAP_COLUMNS: {
		const {first, second} = action
		const found = []
		const columns = state.get(`columns`)
		columns.forEach((column, index) => {
			if ([first, second].includes(column.name)) {
				found.push({index, column})
			}
			if (found.length >= 2) return
		})
		return state.withMutations(map => map
			.setIn([`columns`, found[0].index], found[1].column)
			.setIn([`columns`, found[1].index], found[0].column)
		)
	}
	case SET_GROUPING_COLUMN_VISIBILITY: {
		const index = state
			.get(`columns`)
			.findKey(value => value.key === `groupingValue`)
		return index !== undefined
			? state.updateIn([`columns`, index.toString()], ({visible, ...column}) => {
				column.visible = action.payload
				return column
			})
			: state
	}
	case SET_PREVENT_UPDATE: {
		return state.set(`preventUpdate`, action.payload)
	}
	default:
		return state
	}
}

export default ticketTableReducer

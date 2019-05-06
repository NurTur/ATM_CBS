import {Record, List} from 'immutable'
import {
	SET_SEARCH_FIELD,
	SET_SEARCH_VALUE,
	UPDATE_SEARCH_HISTORY,
	HISTORY_LENGTH,
	CLEAR_FILTERS,
	SET_FILTER,
	SET_FILTERS_APPLIED,
	SHOW_FILTERS,
	SET_TAG,
	LOAD_SEARCH,
	initialState,
	InitialRecord,
	positions
} from './constants'

const moveListItem = (list, item, pos) => {
	if (List.isList(list) && list.indexOf(item) !== -1) {
		return list
			.delete(list.indexOf(item))
			.insert(pos, item)
	}

	return list
}

export default function searchReducer(state = initialState, action) {
	switch (action.type) {
	case SET_SEARCH_FIELD: {
		return state.set(`field`, action.field)
	}
	case SET_SEARCH_VALUE: {
		return state.set(`value`, action.value)
	}
	case UPDATE_SEARCH_HISTORY: {
		const newItem = state.get(`value`)
		const checkHistoryLength = history => history.size < HISTORY_LENGTH
			? history
			: history.pop()
		const updateHistory = () => state.update(`history`, history => {
			const pos = history.indexOf(newItem)
			return pos !== -1
				? history.splice(pos, 1).unshift(newItem)
				: checkHistoryLength(history).unshift(newItem)
		})

		return newItem !== `` ? updateHistory() : state
	}
	case CLEAR_FILTERS: {
		const iFilters = initialState.get(`filters`)
		return state
			.update(`filters`, filters => filters
				.map((filter, key) => Record.isRecord(filter)
					? filter.set(`value`, iFilters.get(key).value)
					: filter
				)
			)
	}
	case SET_FILTER: {
		const {name, value} = action.payload
		return state.setIn([`filters`, name, `value`], value)
	}
	case SET_FILTERS_APPLIED: {
		return state.updateIn([`filters`, `applied`], value => !value)
	}
	case SHOW_FILTERS: {
		return state.updateIn([`filters`, `visible`], value => !value)
	}
	case SET_TAG: {
		const {name, value} = action.payload
		for (let key in value) {
			const path = [`tags`, name, key]
			state = state.setIn(path, value[key])
		}
		return state
	}
	case LOAD_SEARCH: {
		const search = action.payload
		if (search) {
			const storagePositions = search.positions
			delete search.positions
			delete search.value

			let basePositions = new List(positions)

			// обновление позиций тэгов из local storage
			if (storagePositions && Array.isArray(storagePositions)) {
				if (!positions.equals(new List(storagePositions))) {
					storagePositions.forEach((item, index) => {
						basePositions = basePositions.update(list => moveListItem(list, item, index))
					})
				}
			}

			const recordStore = new InitialRecord().withMutations(map => {
				map.mergeDeep(search).delete(`positions`)
				// обновление tags.order в зависимости от списка basePositions
				basePositions.forEach((tagName, pos) => {
					map.updateIn([`tags`, tagName], tag => tag.set(`order`, pos))
					return true
				})
			})

			return state.withMutations(map => map
				.mergeDeep(recordStore, {filters: {visible: true}})
				.set(`positions`, basePositions)
			)
		}
	}
	default:
		return state
	}
}

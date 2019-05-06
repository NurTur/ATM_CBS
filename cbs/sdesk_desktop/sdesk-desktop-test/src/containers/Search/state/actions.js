import {
	MY_TICKETS_SEARCH_REQUEST,
	SIMPLE_SEARCH_REQUEST,
	SEARCH_REQUEST,
	SET_SEARCH_FIELD,
	SET_SEARCH_VALUE,
	UPDATE_SEARCH_HISTORY,
	CLEAR_FILTERS,
	SET_FILTER,
	SET_FILTERS_APPLIED,
	SHOW_FILTERS,
	SET_TAG,
	LOAD_SEARCH
} from './constants'

export function findMyTickets() {
	return {type: MY_TICKETS_SEARCH_REQUEST, payload: null}
}

export function setSearchValue(value) {
	return {
		type: SET_SEARCH_VALUE,
		value
	}
}
export function setSearchField(field) {
	return {
		type: SET_SEARCH_FIELD,
		field
	}
}
export function updateSearchHistory() {
	return {type: UPDATE_SEARCH_HISTORY, payload: null}
}
export function fastSearch() {
	return {type: SIMPLE_SEARCH_REQUEST, payload: null}
}

export function applyFilters() {
	return {type: SET_FILTERS_APPLIED}
}
export function showFilters() {
	return {type: SHOW_FILTERS}
}
export function setFilter(name, value) {
	return {
		type: SET_FILTER,
		payload: {name, value}
	}
}
export function setTag(name, value) {
	return {
		type: SET_TAG,
		payload: {name, value}
	}
}
export function clearFilters() {
	return {type: CLEAR_FILTERS}
}
export function filteredSearch() {
	return {type: SEARCH_REQUEST, payload: null}
}

export function loadSearch(search) {
	return {type: LOAD_SEARCH, payload: search}
}
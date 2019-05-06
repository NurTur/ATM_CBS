import {
	LOAD_DATA,
	SET_DATA,
	SET_LOADING,
	SHOW_TICKET_TREE,
	TREE_SEARCH_REQUEST
} from './constants'

export function loadData() {
	return {
		type: LOAD_DATA
	}
}

export function setData(payload) {
	return {
		type: SET_DATA,
		payload
	}
}

export function setLoading(value) {
	return {
		type: SET_LOADING,
		value
	}
}

export function showTicketTree(value) {
	return {
		type: SHOW_TICKET_TREE,
		value
	}
}

export function runTreeSearchRequest() {
	return {
		type: TREE_SEARCH_REQUEST,
		payload: null
	}
}
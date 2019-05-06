import {SET_LAYOUT, SET_LOADING, SET_ERROR} from './constants'

export function setLayout(position) {
	return {
		type: SET_LAYOUT,
		position
	}
}

export function setLoading(payload) {
	return {
		type: SET_LOADING,
		payload
	}
}

export function setError(payload) {
	return {
		type: SET_ERROR,
		payload
	}
}

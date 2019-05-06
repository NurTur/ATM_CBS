import {SET_ACTIVE_TAB,	SET_LOADING} from './constants'

export function setActiveTab(payload) {
	return {
		type: SET_ACTIVE_TAB,
		payload
	}
}

export function setLoading(payload) {
	return {
		type: SET_LOADING,
		payload
	}
}

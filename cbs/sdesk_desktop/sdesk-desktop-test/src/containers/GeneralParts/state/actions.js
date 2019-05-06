import {SET_EXPAND_ALL} from './constants'

export function setExpandAll(payload) {
	return {
		type: SET_EXPAND_ALL,
		payload
	}
}

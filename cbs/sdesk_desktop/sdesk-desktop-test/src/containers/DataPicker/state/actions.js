import {SET_PICKER_DATA, REFERENCE_SEARCH} from './constants'

export function setPickerData(name, value) {
	return {
		type: SET_PICKER_DATA,
		payload: {name, value}
	}
}

export function searchReference(name, value, postProcessingAction = null) {
	return {
		type: REFERENCE_SEARCH,
		payload: {name, value, postProcessingAction}
	}
}
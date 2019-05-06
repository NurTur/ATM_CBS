import {SET_PICKER_DATA, initialState} from './constants'

export default function pickersReducer(state = initialState, action) {
	switch (action.type) {
	case SET_PICKER_DATA: {
		const {name, value} = action.payload
		return state.set(name, value)
	}
	default: return state
	}
}
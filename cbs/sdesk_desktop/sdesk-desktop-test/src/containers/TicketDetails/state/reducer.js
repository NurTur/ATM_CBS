import {fromJS} from 'immutable'
import {
	SET_ACTIVE_TAB,
	SET_LOADING
} from './constants'

export const initialState = fromJS({
	activeTab: `comments`,
	loading: false
})

function ticketDetailsReducer(state = initialState, action) {
	switch (action.type) {
	case SET_ACTIVE_TAB: {
		return state.set(`activeTab`, action.payload)
	}
	case SET_LOADING: {
		return state.set(`loading`, action.payload)
	}
	default:
		return state
	}
}

export default ticketDetailsReducer

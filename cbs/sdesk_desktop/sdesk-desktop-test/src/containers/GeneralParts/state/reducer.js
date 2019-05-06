import {fromJS} from 'immutable'
import {
	SET_EXPAND_ALL
} from './constants'

export const initialState = fromJS({
	parts: {
		expandAll: false
	}
})

function generalPartsReducer(state = initialState, action) {
	switch (action.type) {
	case SET_EXPAND_ALL: {
		return state.updateIn([`parts`, `expandAll`], value => !value)
	}
	default:
		return state
	}
}

export default generalPartsReducer

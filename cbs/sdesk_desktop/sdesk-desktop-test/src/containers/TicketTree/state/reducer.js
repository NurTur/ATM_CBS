import {fromJS} from 'immutable'
import {normalize} from 'normalizr'
import treeSchema from './schema'
import {
	SET_DATA,
	SET_LOADING,
	SHOW_TICKET_TREE
} from './constants'

const initialState = fromJS({
	data: [],
	loading: false,
	show: false
})

function ticketTreeReducer(state = initialState, action) {
	switch (action.type) {
	case SET_DATA: {
		const data = normalize(action.payload, treeSchema)
		return state.withMutations(map => map
			.set(`data`, fromJS(data))
			.set(`loading`, false)
		)
	}
	case SET_LOADING: {
		return state.set(`loading`, action.value)
	}
	case SHOW_TICKET_TREE: {
		return state.set(`show`, action.value)
	}
	default:
		return state
	}
}

export default ticketTreeReducer

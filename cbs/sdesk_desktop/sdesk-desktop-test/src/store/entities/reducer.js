import {fromJS} from 'immutable'
import {BooleanRecord} from './schema'
import {every} from 'utils/convert-fns'
import {
	ENTITIES_LOADED,
	ENTITY_LOADED,
	SET_PART_STATUS,
	SET_TICKET_ID
} from './constants'

const initialState = fromJS({
	appUser: {},
	booleans: {
		1: new BooleanRecord({id: true, name: `Да`}),
		2: new BooleanRecord({id: false, name: `Нет`}),
		index: [1, 2]
	},
	cities: {},
	customers: {},
	equipments: {},
	equipmentTypes: {},
	generalParts: [],
	needParts: [],
	serviceTypes: {},
	ticketComments: [],
	ticketHistory: [],
	ticketId: null,
	tickets: {},
	ticketStatuses: {},
	ticketTypes: {},
	users: {},
	vendors: {}
})

export default function entityReducer(state = initialState, action) {
	switch (action.type) {
	case ENTITIES_LOADED: {
		const entities = action.payload
		return state.withMutations(list =>
			every(entities, (ref, name) => list.set(name, fromJS(ref)))
		)
	}
	case ENTITY_LOADED: {
		const {entity, payload} = action
		return state.set(entity, fromJS(payload))
	}
	case SET_PART_STATUS: {
		const {entity, partId, statusId} = action
		const index = state.get(entity).findIndex(item => item.id === partId)
		return state.updateIn([entity, index], value => value.set(`statusId`, statusId))
	}
	case SET_TICKET_ID: {
		return state.set(`ticketId`, action.value)
	}
	default: return state
	}
}

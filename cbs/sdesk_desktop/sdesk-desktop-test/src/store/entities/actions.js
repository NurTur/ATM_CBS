import {
	ENTITIES_LOADED,
	ENTITY_LOADED,
	LOAD_GENERAL_PARTS,
	LOAD_NEED_PARTS,
	LOAD_TICKET_HISTORY,
	LOAD_TICKETS,
	SET_PART_STATUS,
	SET_TICKET_ID,
	GET_TICKET_FIELDS
} from './constants'

export function entitiesLoaded(payload) {
	return {
		type: ENTITIES_LOADED,
		payload
	}
}

export function enitityLoaded(entity, payload) {
	return {
		type: ENTITY_LOADED,
		entity,
		payload
	}
}

export function loadGeneralParts() {
	return {type: LOAD_GENERAL_PARTS}
}

export function loadNeedParts() {
	return {type: LOAD_NEED_PARTS}
}

export function loadTicketHistory() {
	return {type: LOAD_TICKET_HISTORY}
}

export function loadTickets(data) {
	return {
		type: LOAD_TICKETS,
		payload: data
	}
}

export function setPartStatus(entity, partId, statusId) {
	return {
		type: SET_PART_STATUS,
		entity,
		partId,
		statusId
	}
}

export function setTicketId(value) {
	return {
		type: SET_TICKET_ID,
		value
	}
}

export function getTicketFields(data) {
	return {
		type: GET_TICKET_FIELDS,
		payload: data
	}
}

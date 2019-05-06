import {createSelector} from 'reselect'
import {denormalize} from 'normalizr'
import treeSchema from './schema'

export const selectTicketTree = (state) => state.get(`ticketTree`)

const makeSelectData = () => createSelector(
	selectTicketTree,
	tree => tree && tree.get(`data`)
)
export const makeSelectTickets = () => createSelector(
	makeSelectData(),
	data => data && data.getIn([`entities`, `tickets`])
)
export const makeSelectNormalizedData = () => createSelector(
	makeSelectData(),
	data => data
		? denormalize(data.get(`result`), treeSchema, data.get(`entities`))
		: null
)
export const makeSelectTicketIds = () => createSelector(
	makeSelectTickets(),
	tickets => tickets && tickets.keySeq().toArray()
)

export const makeSelectLoading = () => createSelector(
	selectTicketTree,
	state => state && state.get(`loading`) || false
)

export const makeSelectTicketTreeShow = () => createSelector(
	selectTicketTree,
	state => state && state.get(`show`) || false
)

import {createSelector} from 'reselect'
import {makeSelectTickets as makeSelectTreeTickets} from 'containers/TicketTree/state/selectors'

export const selectEntities = (state) => state.get(`entities`)

export const makeSelectAppUser = () => createSelector(
	selectEntities,
	globalState => globalState.get(`appUser`)
)

export const makeSelectAppUserName = () => createSelector(
	makeSelectAppUser(),
	user => user.name || ``
)

export const makeSelectReference = name => createSelector(
	selectEntities,
	entities => entities.get(name)
)

export const makeSelectTickets = () => createSelector(
	selectEntities,
	entities => entities.get(`tickets`)
)

export const makeSelectUsers = () => createSelector(
	selectEntities,
	entities => entities.get(`users`)
)

export const makeSelectSelectedTicketId = () => createSelector(
	selectEntities,
	state => state.get(`ticketId`)
)

export const makeSelectTicket = () => createSelector(
	makeSelectSelectedTicketId(),
	makeSelectTickets(),
	makeSelectTreeTickets(),
	(id, tickets, treeTickets) => tickets.get(`${id}`) || treeTickets && treeTickets.get(`${id}`)
)

export const makeSelectTicketParam = param => createSelector(
	makeSelectTicket(),
	ticket => ticket && ticket.get(param)
)

export const makeSelectTicketPermissions = () => createSelector(
	makeSelectTicket(),
	ticket => ticket && ticket.get(`perm`)
)

export const makeSelectPermissions = name => createSelector(
	makeSelectTicketPermissions(),
	permissions => permissions ? permissions[name] : []
)

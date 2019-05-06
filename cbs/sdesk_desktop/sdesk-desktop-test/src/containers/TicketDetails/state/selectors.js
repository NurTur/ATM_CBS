import {createSelector} from 'reselect'

export const selectTicketDetailsDomain = (state) => state.get(`ticketDetails`)

export const makeSelectActiveTab = () => createSelector(
	selectTicketDetailsDomain,
	state => state.get(`activeTab`)
)

export const makeSelectLoading = () => createSelector(
	selectTicketDetailsDomain,
	state => state.get(`loading`)
)

import {createSelector} from 'reselect'
import {selectEntities} from 'store/entities/selectors'
import moment from 'moment'
moment.locale(`ru`)

export const makeSelectTicketHistory = () => createSelector(
	selectEntities,
	models => models.get(`ticketHistory`).map(item => ({
		date: moment(item.date).format(`DD MMMM YYYY HH:mm:ss`),
		owner: item.owner,
		performer: item.performer,
		serviceType: item.serviceType,
		status: item.status,
		statusId: item.statusId
	}))
)

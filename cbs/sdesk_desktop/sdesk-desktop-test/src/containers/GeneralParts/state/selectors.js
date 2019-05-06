import {createSelector} from 'reselect'
import {selectEntities} from 'store/entities/selectors'
import moment from 'moment'
moment.locale(`ru`)

export const makeSelectPartsModel = () => createSelector(
	selectEntities,
	models => models.get(`generalParts`)
)

export const makeSelectParts = () => createSelector(
	makeSelectPartsModel(),
	parts => parts.map(part => ({
		id: part.id,
		analog: part.analog,
		blockNumber: part.blockNumber,
		count: part.quantity,
		customer: `Qazkom`,
		history: [
			/* {
				status: `Размещен`,
				date: `08.12.2017`,
				count: 2,
				comment: `К сожалению наличие батарей на европейском складе не подтвердилось.`
			} */
		],
		orderDate: part.orderDate && moment(part.orderDate).format(`DD MMMM YYYY`),
		partNumber: part.number,
		title: part.name,
		vendor: `BOOGLE`
	}))
)

// export const makeSelectParts = () => createSelector(
// 	selectTicketDetailsDomain,
// 	state => state.get(`parts`)
// )

// export const makeSelectExpandAll = () => createSelector(
// 	makeSelectParts(),
// 	state => state.get(`expandAll`)
// )

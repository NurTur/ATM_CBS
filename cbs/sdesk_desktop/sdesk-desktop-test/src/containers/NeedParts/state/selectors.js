import {createSelector} from 'reselect'
import {selectEntities, makeSelectUsers, makeSelectPermissions} from 'store/entities/selectors'
import moment from 'moment'
moment.locale(`ru`)

const getUnit = record => {
	if (!record) return null
	const parent = record.parent.name
	const child = record.name
	const all = [parent, child]
	return all.filter(unit => unit !== null).join(`\\`)
}

const getApplicant = (users, userId) => {
	const id = userId.toString()
	const user = users.get(id)
	return user ? user.name : ``
}

const getStatusList = statuses => statuses.map(status => ({value: status.id, label: status.name}))

export const makeSelectPartsEntity = () => createSelector(
	selectEntities,
	models => models.get(`needParts`)
)

export const makeSelectParts = () => createSelector(
	makeSelectPermissions(`needPart`),
	makeSelectPartsEntity(),
	makeSelectUsers(),
	(permissions, parts, users) => parts.map(part => ({
		id: part.id,
		appendTime: moment(part.appendTime).format(`DD MMMM YYYY`),
		applicant: getApplicant(users, part.userId),
		count: part.quantity,
		partNumber: part.number,
		// TODO для прав на изменения статуса бэкенд должен вернуть в perm.partOrder.needPart.editing
		permission: permissions ? permissions.includes(`update`) : false,
		statusId: part.statusId,
		statusList: getStatusList(part.statusList),
		title: part.name,
		unit: getUnit(part.unit)
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

import {Record} from 'immutable'
import {schema} from 'normalizr'

export const AppUserRecord = new Record({
	id: null,
	cityId: null,
	departmentId: null,
	weight: 0,
	roleId: null,
	email: ``,
	login: ``,
	name: ``
})
export const BooleanRecord = new Record({
	id: null,
	name: ``
})
export const GeneralPartRecord = new Record({
	id: null,
	analog: null, // substitution -> аналог
	blockNumber: null,
	customerId: null,
	history: [],
	name: ``,
	needPartId: null,
	number: ``,
	orderDate: null, // commonTimeStamp/coord_order_date -> дата подачи заказа
	provider: null, // commonFieldText/coord_order_number -> поставщик
	providerNumber: null, // commonFieldString/sordernumber -> номер от поставщика
	providerSerialNumber: null, // commonField2String/pserialnumber -> серийный номер от поставщика
	quantity: 0,
	ticketId: null,
	vendorId: null
})
export const HistoryRecord = new Record({
	date: null,
	owner: null,
	performer: null,
	serviceType: null,
	status: null,
	statusId: null
})
export const NeedPartRecord = new Record({
	id: null,
	appendTime: null,
	name: ``,
	number: ``,
	quantity: 0,
	statusId: null,
	ticketId: null,
	userId: null,
	unit: {
		id: null,
		name: ``,
		parent: {
			id: null,
			name: ``
		}
	},
	statusList: []
})

export const ReferenceRecord = new Record({
	id: null,
	name: ``
})

export const city = new schema.Entity(`cities`)
export const customer = new schema.Entity(`customers`)
export const equipmentType = new schema.Entity(`equipmentTypes`)
export const performer = new schema.Entity(`users`)
export const serviceType = new schema.Entity(`serviceTypes`)
export const ticketStatus = new schema.Entity(`ticketStatuses`)
export const ticketType = new schema.Entity(`ticketTypes`)
export const vendor = new schema.Entity(`vendors`)

export const equipment = new schema.Entity(`equipments`, {equipmentType})
export const ticket = new schema.Entity(`tickets`, {
	city,
	customer,
	equipment,
	performer,
	serviceType,
	status: ticketStatus,
	type: ticketType
})

export const ticketSchema = [ticket]
export const referenceSchema = {
	cities: [city],
	serviceTypes: [serviceType],
	ticketStatuses: [ticketStatus],
	ticketTypes: [ticketType],
	vendors: [vendor]
}

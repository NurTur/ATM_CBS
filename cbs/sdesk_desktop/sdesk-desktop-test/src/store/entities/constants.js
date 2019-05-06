export const ENTITIES_LOADED = `Entity/ENTITIES_LOADED`
export const ENTITY_LOADED = `Entity/ENTITY_LOADED`
export const LOAD_GENERAL_PARTS = `Entity/LOAD_GENERAL_PARTS`
export const LOAD_NEED_PARTS = `Entity/LOAD_NEED_PARTS`
export const LOAD_TICKET_HISTORY = `Entity/LOAD_TICKET_HISTORY`
export const LOAD_TICKETS = `Entity/LOAD_TICKETS`
export const SET_PART_STATUS = `Entity/SET_PART_STATUS`
export const SET_TICKET_ID = `Entity/SET_TICKET_ID`

export const GET_TICKET_FIELDS = `Entity/GET_TICKET_FIELDS`
// наименования моделей для формирования запроса в ts
export const MODELS = {
	// общая модель полей для справочников
	export: {
		fields: [`name`]
	},
	reference: {
		// используется для построения fields при запросе заявок
		fields: [`id`, `name`],
		sort: `name`
	},
	ticket: {
		name: `ticket`,
		fields: {
			number: `number`,
			commonFieldString: `commonFieldString`,
			type: `typeId`,
			city: `cityId`,
			vendor: `vendorId`,
			status: `statusId`,
			customer: `customerId`,
			serviceType: `serviceTypeId`,
			performer: `performerId`,
			date: `date`,
			warranty: `warrantyFlag`,
			cbsWarranty: `cbsWarrantyFlag`,
			contractor: `subcontractorFlag`,
			malfunction: `reasonId`,
			customerNumber: `numberFromCustomer`,
			malfunctionText: `reasonDescription`,
			description: `description`,
			partName: `partName`,
			blockNumber: `blockNumber`,
			serialNumber: `serialNumber`
		}
	},
	serviceType: {
		name: `serviceType`
	},
	customer: {
		name: `customer`
	},
	performer: {
		name: `performer`
	},
	city: {
		name: `city`
	},
	equipment: {
		name: `equipment`,
		fields: {
			id: `id`,
			regNumber: `regNumber`,
			serialNumber: `serialNumber`,
			endWarrantyDate: `endWarrantyDate`,
			endCBSWarrantyDate: `endCBSWarrantyDate`,
			type: `typeId`,
			device: `bnaFlag`,
			location: `location`
		}
	},
	equipmentType: {
		name: `equipmentType`,
		fields: {
			model: `model`,
			name: `name`
		}
	},
	part: {
		name: `generalPart`,
		fields: {
			number: `number`,
			substitution: `substitution`,
			commonFieldString: `sordernumber`
		}
	},
	needPart: {
		name: `needPart`,
		user: `needPartUser`,
		unit: `needPartUnit`,
		parent: `needPartParentUnit`,
		status: `currentStatus`,
		fields: [`name`, `number`, `quantity`]
	},
	instPart: {
		name: `instPart`,
		user: `instPartUser`,
		unit: `instPartUnit`,
		parent: `instPartParentUnit`,
		tickets: `tickets`,
		fields: [`type`, `name`, `number`, `quantity`, `comment`]
	},
	comment: {
		name: `comment`,
		user: `commentUser`,
		device: `device`,
		parent: `parentDevice`,
		fields: [`type`, `date`, `text`]
	},
	history: {
		name: `history`,
		fields: [`date`]
	},
	status: {
		name: `status`,
		fields: {
			final: `final`
		}
	},
	timeout: {
		name: `timeout`,
		fields: {
			timeout: `timeout`
		}
	}
}

import {schema} from 'normalizr'

const checkNull = value => value === null ? `Без значения` : value

export const columns = [
	{
		key: `groupingValue`,
		width: 250,
		visible: false
	},
	{
		key: `number`,
		width: 140,
		visible: true
	},
	{
		key: `serviceType`,
		width: 230,
		visible: true
	},
	{
		key: `date`,
		width: 120,
		visible: true
	},
	{
		key: `warrantyFlag`,
		width: 120,
		visible: true
	},
	{
		key: `cbsWarrantyFlag`,
		width: 120,
		visible: true
	},
	{
		key: `vendorWarrantyDate`,
		width: 120,
		visible: true
	},
	{
		key: `cbsWarrantyDate`,
		width: 120,
		visible: true
	},
	{
		key: `commonFieldString`,
		width: 120,
		visible: true
	},
	{
		key: `customer`,
		width: 165,
		visible: true
	},
	{
		key: `status`,
		width: 200,
		visible: true
	},
	{
		key: `timeout`,
		width: 150,
		visible: true
	},
	{
		key: `performer`,
		width: 200,
		visible: true
	},
	{
		key: `equipment`,
		width: 400,
		visible: true
	},
	{
		key: `regNumber`,
		width: 120,
		visible: true
	},
	{
		key: `bna`,
		width: 120,
		visible: true
	},
	{
		key: `city`,
		width: 150,
		visible: true
	},
	{
		key: `subContractor`,
		width: 150,
		visible: true
	},
	{
		key: `reasonDescription`,
		width: 250,
		visible: true
	}
]

export const columnStatics = {
	groupingValue: {
		title: `Значение группировки`,
		dataIndex: `groupingValue`,
		hidden: true
	},
	number: {
		title: `Номер заявки`,
		dataIndex: `number`,
		getGroupValue: data => checkNull(data.number)
	},
	serviceType: {
		title: `Вид работ`,
		dataIndex: `serviceType.name`,
		getGroupValue: data => checkNull(data.serviceType.name)
	},
	date: {
		title: `Дата подачи`,
		dataIndex: `date`,
		getGroupValue: data => checkNull(data.date)
	},
	warrantyFlag: {
		title: `Гарантия`,
		dataIndex: `warrantyFlag`,
		getGroupValue: data => checkNull(data.warrantyFlag)
	},
	cbsWarrantyFlag: {
		title: `Гарантия CBS`,
		dataIndex: `cbsWarrantyFlag`,
		getGroupValue: data => checkNull(data.cbsWarrantyFlag)
	},
	vendorWarrantyDate: {
		title: `Гарантия до`,
		dataIndex: `equipment.endWarrantyDate`,
		getGroupValue: data => checkNull(data.equipment.endWarrantyDate)
	},
	cbsWarrantyDate: {
		title: `Гарантия CBS до`,
		dataIndex: `equipment.endCBSWarrantyDate`,
		getGroupValue: data => checkNull(data.equipment.endCBSWarrantyDate)
	},
	commonFieldString: {
		title: `№ заказа`,
		dataIndex: `commonFieldString`,
		getGroupValue: data => checkNull(data.commonFieldString)
	},
	customer: {
		title: `Заказчик`,
		dataIndex: `customer.name`,
		getGroupValue: data => checkNull(data.customer.name)
	},
	status: {
		title: `Статус`,
		dataIndex: `status.name`,
		getGroupValue: data => checkNull(data.status.name)
	},
	timeout: {
		title: `Срок ожидания до`,
		dataIndex: `timeout.timeout`,
		getGroupValue: data => checkNull(data.timeout.timeout)
	},
	performer: {
		title: `Исполнитель`,
		dataIndex: `performer.name`,
		getGroupValue: data => checkNull(data.performer.name)
	},
	equipment: {
		title: `Оборудование`,
		children: [
			{
				title: `TM`,
				dataIndex: `equipment.equipmentType.name`,
				width: 200
			},
			{
				title: `SN`,
				dataIndex: `equipment.serialNumber`,
				width: 200
			}
		],
		getGroupValue: data => {
			const tmLabel = data.equipment
				&& data.equipment.equipmentType
				&& data.equipment.equipmentType.name !== ``
				&& data.equipment.equipmentType.name !== null ? `TM - ` : null
			const snLabel = data.equipment
				&& data.equipment.serialNumber !== ``
				&& data.equipment.serialNumber !== null ? `SN - ` : null
			if (tmLabel === null && snLabel === null) {
				return checkNull(null)
			}
			return `
				${tmLabel}
				${tmLabel && data.equipment.equipmentType.name}
				${tmLabel && ` `}
				${snLabel}
				${snLabel && data.equipment.serialNumber}
			`
		}
	},
	regNumber: {
		title: `Рег.номер`,
		dataIndex: `equipment.regNumber`,
		getGroupValue: data => checkNull(data.equipment.regNumber)
	},
	bna: {
		title: `Устройство`,
		dataIndex: `equipment.bnaFlag`,
		getGroupValue: data => checkNull(data.equipment.bnaFlag)
	},
	city: {
		title: `Город`,
		dataIndex: `city.name`,
		getGroupValue: data => checkNull(data.city.name)
	},
	subContractor: {
		title: `Субподрядчик`,
		dataIndex: `subcontractorFlag`,
		getGroupValue: data => checkNull(data.subcontractorFlag)
	},
	reasonDescription: {
		title: `Причины неисправности`,
		dataIndex: `reasonDescription`,
		getGroupValue: data => checkNull(data.reasonDescription)
	}
}

export const positions = []

for (let key in columnStatics) {
	positions.push(key)
	columnStatics[key].sorter = true
}

const columnSchema = new schema.Entity(`columns`, {}, {idAttribute: `key`})
export const columnsSchema = [columnSchema]

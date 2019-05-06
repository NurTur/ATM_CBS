import {all, call, put, takeLatest, select} from 'redux-saga/effects'
import {delay} from 'redux-saga'
import {mergeDeep} from 'immutable'
import {notification} from 'antd'
import storage from 'utils/local-storage'
import request from 'utils/request'

import {
	BASE_FIELDS,
	SET_COLUMNS,
	SET_GROUPING,
	SET_GROUPING_COLUMN_VISIBILITY,
	SET_PAGE,
	SET_PAGE_SIZE,
	SORT_DATA,
	sorter as defaultSorter,
	EXPORT_TICKETS,
	reportAdditionalFields
} from './constants'
import {columns as colList, positions} from '../columns'
import {setConfigs, setLoading, setInitialPage} from './actions'
import {
	selectTicketTable,
	makeSelectColumns,
	makeSelectGroupingValue,
	makeSelectPage,
	makeSelectVisibleSort,
	makeSelectOrderedColumns
} from './selectors'

import {GET_TICKET_FIELDS, MODELS} from 'store/entities/constants'
import {loadTickets} from 'store/entities/actions'

let lastSearch = null

function moveArrayItem(arr, item, pos) {
	if (Array.isArray(arr) && arr.includes(item) && pos !== 0 && item !== `groupingValue`) {
		arr.splice(arr.indexOf(item), 1)
		arr.splice(pos, 0, item)
	}
}

function prepareTableData(storageTable) {
	const table = {
		columns: colList,
		pageSize: 50,
		positions,
		sorter: defaultSorter,
		groupedColumn: undefined
	}

	if (storageTable) {
		if (`columns` in storageTable && Array.isArray(storageTable.columns)) {
			storageTable.columns.forEach(storageColumn => {
				if (`key` in storageColumn && `visible` in storageColumn && `width` in storageColumn) {
					for (let i = 0; i < table.columns.length; i++) {
						if (table.columns[i].key === storageColumn.key) {
							table.columns[i].width = storageColumn.width
							table.columns[i].visible = storageColumn.visible
							break
						}
					}
				}
			})
		}
		if (`pageSize` in storageTable && Number.isInteger(storageTable.pageSize)) {
			table.pageSize = storageTable.pageSize
		}
		if (`positions` in storageTable && Array.isArray(storageTable.positions)) {
			storageTable.positions.forEach((item, pos) => {
				moveArrayItem(table.positions, item, pos)
			})
		}
		if (`sorter` in storageTable) {
			if (`columnKey` in storageTable.sorter
				&& typeof storageTable.sorter.columnKey === `string`
				&& table.positions.includes(storageTable.sorter.columnKey)
				&& `order` in storageTable.sorter
				&& [`ascend`, `descend`].includes(storageTable.sorter.order)
			) {
				table.sorter = {
					columnKey: storageTable.sorter.columnKey,
					order: storageTable.sorter.order
				}
			}
		}
		if (`groupedColumn` in storageTable && table.positions.includes(storageTable.groupedColumn)) {
			table.groupedColumn = storageTable.groupedColumn
		}
	}

	storage.ticketTable = table
	return table
}

function getValue(sort = false, field) {
	if (sort) {
		const result = {}
		result[field] = sort
		return result
	}

	return Array.isArray(field) ? field : [field]
}

function getFieldName(value, sort, report) {
	const result = {}
	let fields = []
	let sorts = {}
	switch (value) {
	case `id`:
		if (sort) {
			result[MODELS.ticket.name] = getValue(sort, `id`)
		}
	case `number`:
		result[MODELS.ticket.name] = getValue(sort, MODELS.ticket.fields.number)
		break
	case `serviceType`:
		if (sort || report) {
			result[MODELS.serviceType.name] = getValue(sort, MODELS.reference.sort)
		}
		else {
			result[MODELS.ticket.name] = getValue(sort, MODELS.ticket.fields.serviceType)
		}
		break
	case `date`:
		result[MODELS.ticket.name] = getValue(sort, MODELS.ticket.fields.date)
		break
	case `warrantyFlag`:
		result[MODELS.ticket.name] = getValue(sort, MODELS.ticket.fields.warranty)
		break
	case `cbsWarrantyFlag`:
		result[MODELS.ticket.name] = getValue(sort, MODELS.ticket.fields.cbsWarranty)
		break
	case `customerNumber`:
		result[MODELS.ticket.name] = getValue(sort, MODELS.ticket.fields.customerNumber)
		break
	case `commonFieldString`:
		result[MODELS.ticket.name] = getValue(sort, MODELS.ticket.fields.commonFieldString)
		break
	case `customer`:
		if (sort || report) {
			result[MODELS.customer.name] = getValue(sort, MODELS.reference.sort)
		}
		else {
			result[MODELS.customer.name] = getValue(sort, MODELS.reference.fields)
		}
		break
	case `status`:
		if (sort || report) {
			result[MODELS.status.name] = getValue(sort, MODELS.reference.sort)
		}
		else {
			result[MODELS.ticket.name] = getValue(sort, MODELS.ticket.fields.status)
		}
		break
	case `timeout`:
		result[MODELS.timeout.name] = getValue(sort, MODELS.timeout.fields.timeout)
		break
	case `performer`:
		if (sort || report) {
			result[MODELS.performer.name] = getValue(sort, MODELS.reference.sort)
		}
		else {
			result[MODELS.performer.name] = getValue(sort, MODELS.reference.fields)
		}
		break
	case `equipment`:
		if (sort) {
			sorts[MODELS.equipmentType.fields.name] = sort
			result[MODELS.equipmentType.name] = sorts
			sorts = {}
			sorts[MODELS.equipment.fields.serialNumber] = sort
			result[MODELS.equipment.name] = sorts
		}
		else {
			fields = [
				...MODELS.reference.fields,
				MODELS.equipmentType.fields.model
			]
			result[MODELS.equipmentType.name] = fields
			fields = [
				MODELS.equipment.fields.id,
				MODELS.equipment.fields.serialNumber
			]
			result[MODELS.equipment.name] = fields
		}
		break
	case `regNumber`:
		if (sort) {
			sorts[MODELS.equipment.fields.regNumber] = sort
			result[MODELS.equipment.name] = sorts
		}
		else {
			fields = [
				MODELS.equipment.fields.id,
				MODELS.equipment.fields.regNumber
			]
			result[MODELS.equipment.name] = fields
		}
		break
	case `bna`:
		if (sort) {
			sorts[MODELS.equipment.fields.device] = sort
			result[MODELS.equipment.name] = sorts
		}
		else {
			fields = [
				MODELS.equipment.fields.id,
				MODELS.equipment.fields.device
			]
			result[MODELS.equipment.name] = fields
		}
		break
	case `vendorWarrantyDate`:
		if (sort) {
			sorts[MODELS.equipment.fields.endWarrantyDate] = sort
			result[MODELS.equipment.name] = sorts
		}
		else {
			fields = [
				MODELS.equipment.fields.id,
				MODELS.equipment.fields.endWarrantyDate
			]
			result[MODELS.equipment.name] = fields
		}
		break
	case `cbsWarrantyDate`:
		if (sort) {
			sorts[MODELS.equipment.fields.endCBSWarrantyDate] = sort
			result[MODELS.equipment.name] = sorts
		}
		else {
			fields = [
				MODELS.equipment.fields.id,
				MODELS.equipment.fields.endCBSWarrantyDate
			]
			result[MODELS.equipment.name] = fields
		}
		break
	case `city`:
		if (sort || report) {
			result[MODELS.city.name] = getValue(sort, MODELS.reference.sort)
		}
		else {
			result[MODELS.ticket.name] = getValue(sort, MODELS.ticket.fields.city)
		}
		break
	case `subContractor`:
		result[MODELS.ticket.name] = getValue(sort, MODELS.ticket.fields.contractor)
		break
	case `reasonDescription`:
		result[MODELS.ticket.name] = getValue(sort, MODELS.ticket.fields.malfunctionText)
		break
	case `description`:
		result[MODELS.ticket.name] = getValue(sort, MODELS.ticket.fields.description)
		break
	case `partName`:
		result[MODELS.ticket.name] = getValue(sort, MODELS.ticket.fields.partName)
		break
	case `blockNumber`:
		result[MODELS.ticket.name] = getValue(sort, MODELS.ticket.fields.blockNumber)
		break
	case `serialNumber`:
		result[MODELS.ticket.name] = getValue(sort, MODELS.ticket.fields.serialNumber)
		break
	case `equipmentName`:
		fields = [
			MODELS.equipmentType.fields.name,
			MODELS.equipmentType.fields.model
		]
		result[MODELS.equipmentType.name] = fields
		break
	case `equipmentPlace`:
		result[MODELS.equipment.name] = [MODELS.equipment.fields.location]
		break
	case `needParts`:
		result[MODELS.needPart.name] = [MODELS.needPart.fields]
		result[MODELS.needPart.user] = [MODELS.export.fields]
		result[MODELS.needPart.unit] = [MODELS.export.fields]
		result[MODELS.needPart.parent] = [MODELS.export.fields]
		result[MODELS.needPart.status] = [MODELS.export.fields]
		break
	case `instParts`:
		result[MODELS.instPart.name] = [MODELS.instPart.fields]
		result[MODELS.instPart.user] = [MODELS.export.fields]
		result[MODELS.instPart.unit] = [MODELS.export.fields]
		result[MODELS.instPart.parent] = [MODELS.export.fields]
		result[MODELS.instPart.tickets] = [MODELS.ticket.fields.number]
		break
	case `comments`:
		result[MODELS.comment.name] = [MODELS.comment.fields]
		result[MODELS.comment.user] = [MODELS.export.fields]
		result[MODELS.comment.device] = [MODELS.export.fields]
		result[MODELS.comment.parent] = [MODELS.export.fields]
		break
	case `closedDate`:
		result[MODELS.history.name] = [MODELS.history.fields]
		break
	}
	return result
}

function *storeTable() {
	yield call(delay, 1000)
	const [table, columns] = yield all([
		select(selectTicketTable),
		select(makeSelectOrderedColumns())
	])

	storage.ticketTable = {
		columns,
		pageSize: table.getIn([`page`, `size`]),
		positions: table.get(`positions`),
		sorter: table.get(`sorter`),
		groupedColumn: table.getIn([`groupedBy`, `column`])
	}
}

function *prepareFields() {
	const fields = yield select(makeSelectColumns())
	return fields.reduce((result, field) =>
		mergeDeep(result, getFieldName(field.key)),
	BASE_FIELDS)
}

function *prepareSort() {
	const [groupingName, sorter] = yield all([
		select(makeSelectGroupingValue()),
		select(makeSelectVisibleSort())
	])

	const order = sorter.get(`order`) === `descend` ? `desc` : `asc`
	return mergeDeep(
		getFieldName(groupingName, `asc`),
		getFieldName(sorter.get(`columnKey`), order))
}

function *prepareLimit() {
	const page = yield select(makeSelectPage())
	const limit = page.get(`size`)
	const offset = page.get(`current`) * limit - limit
	return [limit, offset]
}

function *beforePrepareAttributes(action) {
	yield put(setInitialPage())
	yield call(prepareRequestAttributes, action)
}

function *prepareRequestAttributes(action) {
	const result = action.payload
	result.fields = yield call(prepareFields)
	result.sort = yield call(prepareSort)
	result.limit = yield call(prepareLimit)

	lastSearch = result
	yield put(setLoading(true))
	yield put(loadTickets(result))
}

function *runLastSearch() {
	return lastSearch
		? yield call(prepareRequestAttributes, {payload: lastSearch})
		: null
}

function *prepareReportAttributes({additionalFields, email}) {
	const {filters, sort} = lastSearch
	const columns = yield select(makeSelectColumns())
	const fields = columns.reduce((result, field) =>
		mergeDeep(result, getFieldName(field.key, null, true)), BASE_FIELDS)
	const fullFields = additionalFields.reduce((result, item) =>
		mergeDeep(result, getFieldName(item, null, true)), fields)

	if (`closedDate` in additionalFields) {
		filters.historyStatus = {final: 1}
	}

	if (`comments` in additionalFields) {
		sort.comment = {date: `ASC`}
	}

	const additional = []
	const tsFields = columns.map(column => column.dataIndex)
	const needToConvertFields = [
		`equipment.bnaFlag`,
		`warrantyFlag`,
		`cbsWarrantyFlag`,
		`subcontractorFlag`,
		`date`,
		`equipment.endWarrantyDate`,
		`equipment.endCBSWarrantyDate`,
		`timeout.timeout`
	]

	needToConvertFields.forEach(value => {
		if (tsFields.includes(value)) {
			additional.push(value)
		}
	})

	const fullColumns = additionalFields
		.reduce((result, item) => {
			switch (item) {
			case `needParts`:
			case `instParts`:
			case `comments`:
			case `closedDate`:
			case `equipmentName`:
			case `description`:
				additional.push(item)
			default:
				const {label: title, dataIndex, value, ...data} = reportAdditionalFields[item]
				if (title && (dataIndex || data.children)) {
					return result.push({title, dataIndex, ...data})
				}
			}
			return result
		}, columns)
		.map(({title, dataIndex, children}) => ({title, dataIndex, children}))

	return {
		fields: fullFields,
		filters,
		sort,
		columns: fullColumns,
		additional,
		email,
		reportName: `Заявки`
	}
}

function *exportTickets(action) {
	if (lastSearch === null) return

	const query = yield call(prepareReportAttributes, action.payload)

	const url = `api/v2/reports`
	const response = yield call(request.get, url, query)
	if (response && response.queueNumber) {
		notification[`info`]({
			description: `Запрос отправлен в очередь. Id запроса ${response.queueNumber}`,
			duration: null,
			message: `Экспорт заявок`,
			placement: `topLeft`
		})
	}
}

export default function *getConfigs() {
	yield put(setConfigs(prepareTableData(storage.ticketTable)))
	yield takeLatest(GET_TICKET_FIELDS, beforePrepareAttributes)
	yield takeLatest(
		[SET_GROUPING, SET_PAGE, SET_PAGE_SIZE, SORT_DATA],
		runLastSearch
	)
	yield takeLatest(
		[SET_COLUMNS, SET_GROUPING, SET_GROUPING_COLUMN_VISIBILITY, SET_PAGE_SIZE, SORT_DATA],
		storeTable
	)
	yield takeLatest(EXPORT_TICKETS, exportTickets)
}

import {call, put, takeLatest} from 'redux-saga/effects'
import {List, Map} from 'immutable'
import {normalize} from 'normalizr'
import request from 'utils/request'
import {ticketSchema} from '../schema'
import {LOAD_TICKETS} from '../constants'
import {entitiesLoaded} from '../actions'
import {DATE_PICKER_FOTMAT} from 'containers/App/constants'
import {setLoading, setPreventUpdate, setTotalRecords} from 'containers/TicketTable/state/actions'
import moment from 'moment'

const names = {
	cityId: `city`,
	serviceTypeId: `serviceType`,
	statusId: `status`,
	typeId: `type`,
	vendorId: `vendor`
}
const mapKeys = Object.keys(names)
const getCorrectDateValue = value => value && moment(value).format(DATE_PICKER_FOTMAT)
const getCorrectBooleanValue = value =>
	value !== null
		? value === 1 ? `Да` : null
		: null
const convert = {
	date: getCorrectDateValue,
	timeout: getCorrectDateValue,
	warrantyFlag: getCorrectBooleanValue,
	cbsWarrantyFlag: getCorrectBooleanValue,
	equipment: (data, item) => {
		if (data) {
			if (data.bnaFlag !== null) {
				data.bnaFlag = [1, 7].includes(item.vendorId)
					? data.bnaFlag === 0 ? `ATM` : `BNA`
					: null
			}
			if (data.endWarrantyDate !== null) {
				data.endWarrantyDate = getCorrectDateValue(data.endWarrantyDate)
			}
			if (data.endCBSWarrantyDate !== null) {
				data.endCBSWarrantyDate = getCorrectDateValue(data.endCBSWarrantyDate)
			}
		}
		return data
	},
	subcontractorFlag: getCorrectBooleanValue
}
const convertKeys = Object.keys(convert)

function ticketMap(tickets) {
	return tickets.map(item => {
		const ticketKeys = Object.keys(item)
		const result = {}
		ticketKeys.forEach(key => {
			result[mapKeys.includes(key) ? names[key] : key] = convertKeys.includes(key)
				? convert[key](item[key], item)
				: item[key]
		})
		return result
	})
}

function *storeTickets({count, rows: json}) {
	let payload = {tickets: new Map()}
	if (Array.isArray(json) && json.length > 0) {
		const data = ticketMap(json)
		const {entities, result: index} = normalize(data, ticketSchema)
		entities.tickets.index = List(index)
		payload = entities
	}
	yield put(setLoading(false))
	yield put(setPreventUpdate(false))
	yield put(setTotalRecords(count))
	yield put(entitiesLoaded(payload))
}

export function *fetchTickets(action) {
	const url = `api/v2/tickets`
	const response = yield call(request.get, url, {...action.payload, count: true})
	if (response) {
		yield storeTickets(response)
	}
	else {
		yield put(setLoading(false))
		yield put(setPreventUpdate(false))
	}
}

export default function *ticketSaga() {
	yield takeLatest(LOAD_TICKETS, fetchTickets)
}

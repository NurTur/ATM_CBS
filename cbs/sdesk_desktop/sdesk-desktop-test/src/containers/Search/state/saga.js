import {all, call, put, takeLatest, select} from 'redux-saga/effects'
import {mergeDeep} from 'immutable'
import {
	MY_TICKETS_SEARCH_REQUEST,
	SIMPLE_SEARCH_REQUEST,
	SEARCH_REQUEST,
	CLEAR_FILTERS
} from './constants'
import {
	selectSearch,
	makeSelectSearchValue,
	makeSelectSearchField,
	makeSelectFilter,
	makeSelectSelectedFilterValues
} from './selectors'
import {MODELS} from 'store/entities/constants'
import {getTicketFields} from 'store/entities/actions'
import {makeSelectAppUser} from 'store/entities/selectors'
import moment from 'moment'
import {loadSearch} from './actions'
import storage from 'utils/local-storage'

function *storeSearch() {
	const search = yield select(selectSearch)
	storage.search = search
}

function *buildSimpleSearch() {
	const [value, field] = yield all([
		select(makeSelectSearchValue()),
		select(makeSelectSearchField())
	])

	if (value === ``) {
		return null
	}

	const filterValue = {$like: `%${value.toLowerCase()}%`}
	const result = {}
	const filter = {}
	const filter2 = {}

	switch (field) {
	case `number`:
		filter[MODELS.ticket.fields.number] = filterValue
		result[MODELS.ticket.name] = filter
		break
	case `partNumber`:
		filter[MODELS.part.fields.number] = filterValue
		filter2[MODELS.part.fields.substitution] = filterValue
		result[MODELS.part.name] = {$or: [filter, filter2]}
		break
	case `orderNumber`:
		filter[MODELS.ticket.fields.commonFieldString] = filterValue
		filter2[`$${MODELS.part.name}.${MODELS.part.fields.commonFieldString}$`] = filterValue
		result[MODELS.ticket.name] = {$or: [filter, filter2]}
		break
	case `regNumber`:
		filter[MODELS.equipment.fields.regNumber] = filterValue
		result[MODELS.equipment.name] = filter
		break
	case `serialNumber`:
		filter[MODELS.equipment.fields.serialNumber] = filterValue
		result[MODELS.equipment.name] = filter
		break
	}
	return result === {} ? null : result
}

const prepareDates = value =>
	Array.isArray(value)
		? value.map(item => moment(item).format(`YYYY-MM-DD`))
		: moment(value).format(`YYYY-MM-DD`)

const getCorrectValue = value =>
	typeof value === `object` && `key` in value ? value.key : value

const prepareFilterValue = value => {
	if (Array.isArray(value)) {
		const correctValues = value.map(item => getCorrectValue(item))
		return correctValues.length > 1 ? {$in: correctValues} : correctValues[0]
	}

	return getCorrectValue(value)
}

const setValue = (key, value, result) => {
	if (key !== `ticketStatus`) {
		if (Array.isArray(value) && value.length === 0 || value === ``) {
			return result
		}
	}

	const filter = {}
	const field = {}
	const data = prepareFilterValue(value)
	let individualData = value ? 1 : {$ne: 1}
	switch (key) {
	case `ticketType`:
		field[MODELS.ticket.fields.type] = data
		filter[MODELS.ticket.name] = field
		break
	case `city`:
		field[MODELS.ticket.fields.city] = data
		filter[MODELS.ticket.name] = field
		break
	case `vendor`:
		field[MODELS.ticket.fields.vendor] = data
		filter[MODELS.ticket.name] = field
		break
	case `ticketStatus`:
		if (Array.isArray(value) && value.length === 0 || value === ``) {
			field[MODELS.status.fields.final] = null
			filter[MODELS.status.name] = field
			break
		}
		field[MODELS.ticket.fields.status] = data
		filter[MODELS.ticket.name] = field
		break
	case `customer`:
		field[MODELS.ticket.fields.customer] = data
		filter[MODELS.ticket.name] = field
		break
	case `serviceType`:
		field[MODELS.ticket.fields.serviceType] = data
		filter[MODELS.ticket.name] = field
		break
	case `performer`:
		field[MODELS.ticket.fields.performer] = data
		filter[MODELS.ticket.name] = field
		break
	case `period`:
		individualData = {$between: prepareDates(value)}
		field[MODELS.ticket.fields.date] = individualData
		filter[MODELS.ticket.name] = field
		break
	case `warranty`:
		field[MODELS.ticket.fields.warranty] = individualData
		filter[MODELS.ticket.name] = field
		break
	case `warrantyBeefore`:
		individualData = prepareFilterValue(prepareDates(value))
		field[MODELS.equipment.fields.endWarrantyDate] = individualData
		filter[MODELS.equipment.name] = field
		break
	case `cbsWarranty`:
		field[MODELS.ticket.fields.cbsWarranty] = individualData
		filter[MODELS.ticket.name] = field
		break
	case `cbsWarrantyBeefore`:
		individualData = prepareFilterValue(prepareDates(value))
		field[MODELS.equipment.fields.endCBSWarrantyDate] = individualData
		filter[MODELS.equipment.name] = field
		break
	case `waitBeefore`:
		// производит поиск без учёта activeFlag у таймаута
		// реализовано в ts
		individualData = prepareFilterValue(prepareDates(value))
		field[MODELS.timeout.fields.timeout] = individualData
		filter[MODELS.timeout.name] = field
		break
	case `typeModel`:
		field[MODELS.equipment.fields.type] = data
		filter[MODELS.equipment.name] = field
		break
	case `device`:
		field[MODELS.equipment.fields.device] = individualData
		filter[MODELS.equipment.name] = field
		break
	case `contractor`:
		field[MODELS.ticket.fields.contractor] = individualData
		filter[MODELS.ticket.name] = field
		break
	case `malfunction`:
		field[MODELS.ticket.fields.malfunction] = data
		filter[MODELS.ticket.name] = field
		break
	}

	return mergeDeep(result, filter)
}

function *buildFilteredSearch() {
	const filters = yield select(makeSelectSelectedFilterValues())
	let result = {}

	filters.map((value, key) => {
		if (value) {
			result = setValue(key, value, result)
		}
		return null
	})

	return Object.keys(result).length === 0 ? null : result
}

function *buildSearch(main, additional) {
	let filters = yield call(main)

	if (!filters) {
		return
	}

	yield call(storeSearch)

	const filtersApplied = yield select(makeSelectFilter(`applied`))
	if (filtersApplied) {
		const additionalFilters = yield call(additional)
		if (additionalFilters) {
			filters = mergeDeep(filters, additionalFilters)
		}
	}

	yield put(getTicketFields({filters}))
}

function *runSimpleSearch() {
	yield call(buildSearch, buildSimpleSearch, buildFilteredSearch)
}

function *runFilteredSearch() {
	yield call(buildSearch, buildFilteredSearch, buildSimpleSearch)
}

function *runMyTicketsSearch() {
	const filters = {}
	const performerField = {}
	const statusField = {}
	const user = yield select(makeSelectAppUser())
	performerField[MODELS.ticket.fields.performer] = user.id
	filters[MODELS.ticket.name] = performerField
	statusField[MODELS.status.fields.final] = null
	filters[MODELS.status.name] = statusField
	yield put(getTicketFields({filters}))
}

export default function *searchSaga() {
	yield put(loadSearch(storage.search))
	yield takeLatest(MY_TICKETS_SEARCH_REQUEST, runMyTicketsSearch)
	yield takeLatest(SIMPLE_SEARCH_REQUEST, runSimpleSearch)
	yield takeLatest(SEARCH_REQUEST, runFilteredSearch)
	yield takeLatest(CLEAR_FILTERS, storeSearch)
}
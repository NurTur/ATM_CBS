import {call, put, takeLatest} from 'redux-saga/effects'
import {delay} from 'redux-saga'
import request from 'utils/request'
import {
	REFERENCE_SEARCH,
	ASYNC_SELECT_WAIT_TIME,
	SELECT_MAX_OPTIONS_COUNT,
	asyncType
} from './constants'
import {setPickerData} from './actions'
import {Map} from 'immutable'
import {schema, normalize} from 'normalizr'
import {every} from 'utils/convert-fns'
import {ReferenceRecord} from 'store/entities/schema'

const dataSchema = new schema.Entity(`options`)

const prepareData = (reference, response) => {
	if (Array.isArray(response) && response.length > 0) {
		const {entities, result} = normalize(response, [dataSchema])
		const toRecord = record => {
			return reference === `typeModel`
				? new ReferenceRecord({
					id: record.id,
					name: `TM - ${record.model} Наименование - ${record.name}`
				})
				: new ReferenceRecord(record)
		}
		const each = ref => every(ref, toRecord)
		const options = each(entities.options)
		options.index = result
		return new asyncType({options: Map(options)})
	}
	return new asyncType()
}

function *apiRequest(reference, url, query) {
	yield put(setPickerData(reference, new asyncType({fetching: true})))
	yield call(delay, ASYNC_SELECT_WAIT_TIME)
	const response = yield call(request.get, url, query)
	const limitedResponse = response && response.length > SELECT_MAX_OPTIONS_COUNT
		? response.slice(0, SELECT_MAX_OPTIONS_COUNT)
		: response
	const data = prepareData(reference, limitedResponse)
	yield put(setPickerData(reference, data))
	return data
}

function *apiPostProcessing(reference, data, postProcessingAction) {
	switch (reference) {
	case `malfunctionReason`:
		const initialData = new asyncType()
		// При отсутствии дочерних подпричин неисправности вызывается postProcessingAction
		// (добавление причины неисправности в итоговый селектор)
		if (data.options === initialData.options && postProcessingAction) {
			const {noChildAction, noChildValue} = postProcessingAction
			yield put(noChildAction(noChildValue))
		}
		break
	}
}

function *fetchReference(action) {
	const {name, value, postProcessingAction} = action.payload
	let url = ``
	let params = null
	switch (name) {
	case `customer`:
		url = `api/v2/customers/`
		params = {name: value}
		break
	case `performer`:
		url = `api/v2/users/`
		params = {name: value}
		break
	case `malfunctionReasonParent`:
		url = `api/v2/reasons/parent/${value}`
		break
	case `malfunctionReason`:
		url = `api/v2/reasons/child/${value}`
		break
	case `typeModel`:
		url = `api/v2/equipment-types/`
		params = value
		break
	}

	if (value && value !== ``) {
		const data = yield call(apiRequest, name, url, params)
		yield call(apiPostProcessing, name, data, postProcessingAction)
	}
	else {
		yield put(setPickerData(name, {fetching: false}))
	}
}

export default function *pickerSaga() {
	yield takeLatest(REFERENCE_SEARCH, fetchReference)
}

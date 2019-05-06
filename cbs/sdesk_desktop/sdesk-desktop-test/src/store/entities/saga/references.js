import {call, put} from 'redux-saga/effects'
import {every, rename} from 'utils/convert-fns'
import {normalize} from 'normalizr'
import {referenceSchema, ReferenceRecord} from 'store/entities/schema'
import {entitiesLoaded} from 'store/entities/actions'
import request from 'utils/request'
import storage from 'utils/local-storage'

const names = {
	'service-types': `serviceTypes`,
	types: `ticketTypes`,
	statuses: `ticketStatuses`
}

export function *fetchReferences() {
	const url = `api/v2/references`
	const hash = storage.hash || ``
	const response = yield call(request.get, url, {hash})
	if (response) {
		const refs = rename(response, names)
		const normalized = normalize(refs, referenceSchema)
		const data = every(normalized.entities, (entity, name) => {
			entity.index = normalized.result[name]
			return entity
		})
		storage.references = data
		storage.hash = response.hash
	}
	return storage.references
}

export default function *getReferences() {
	const references = yield fetchReferences()
	const toRecord = (record, key) => key !== `index` ? new ReferenceRecord(record) : record
	const each = ref => every(ref, toRecord)
	const refs = every(references, each)
	yield put(entitiesLoaded(refs))
}

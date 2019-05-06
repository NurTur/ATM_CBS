import {call, put, select, takeLatest} from 'redux-saga/effects'
import {enitityLoaded} from 'store/entities/actions'
import {LOAD_NEED_PARTS, SET_PART_STATUS, SET_TICKET_ID} from 'store/entities/constants'
import {makeSelectActiveTab} from 'containers/TicketDetails/state/selectors'
import {makeSelectAppUser, makeSelectSelectedTicketId} from 'store/entities/selectors'
import {NeedPartRecord} from 'store/entities/schema'
import {toDate} from 'utils/convert-fns'
import request from 'utils/request'

const getStatusList = status => {
	const currentStatus = {
		id: status.id,
		name: status.name
	}
	return [currentStatus, ...status.next]
}

const map = data => data.map(record => {
	record.appendTime = toDate(record.appendTime)
	record.quantity = parseInt(record.quantity, 10)
	record.statusList = getStatusList(record.currentStatus)
	return new NeedPartRecord(record)
})

export function *fetchParts() {
	const ticketId = yield select(makeSelectSelectedTicketId())
	const activeTab = yield select(makeSelectActiveTab(`activeTab`))
	if (!ticketId || activeTab !== `needParts`) return
	const user = yield select(makeSelectAppUser())
	const url = `api/v2/parts/need`
	const query = {ticketId, userId: user.id}
	const response = yield call(request.get, url, query)
	const data = map(response)
	yield put(enitityLoaded(`needParts`, data))
}

export function *changeStatus({partId, statusId}) {
	const url = `api/v2/parts/need/status`
	const params = {
		id: partId,
		statusId
	}
	yield call(request.put, url, params)
	/* TODO надо понять что возвращет новый список статусов или за ним надо идти повторно */
}

export default function *needPartsSaga() {
	yield takeLatest(LOAD_NEED_PARTS, fetchParts)
	yield takeLatest(SET_TICKET_ID, fetchParts)
	yield takeLatest(SET_PART_STATUS, changeStatus)
}

import {call, put, select, takeLatest} from 'redux-saga/effects'
import {enitityLoaded} from 'store/entities/actions'
import {GeneralPartRecord} from 'store/entities/schema'
import {LOAD_GENERAL_PARTS, SET_TICKET_ID} from 'store/entities/constants'
import {makeSelectActiveTab} from 'containers/TicketDetails/state/selectors'
import {makeSelectAppUser, makeSelectSelectedTicketId} from 'store/entities/selectors'
import request from 'utils/request'

const map = data => data.map(record =>
	new GeneralPartRecord({
		id: record.id,
		analog: record.substitution,
		blockNumber: record.blockNumber,
		customerId: record.customerId,
		name: record.name,
		needPartId: record.needPartId,
		number: record.number,
		orderDate: record.commonTimeStamp && new Date(record.commonTimeStamp),
		provider: record.commonFieldText,
		providerNumber: record.commonFieldString,
		providerSerialNumber: record.commonField2String,
		quantity: record.quantity && parseInt(record.quantity, 10),
		ticketId: record.ticketId,
		vendorId: record.vendorId
	})
)

export function *fetchGeneralParts() {
	const ticketId = yield select(makeSelectSelectedTicketId())
	const activeTab = yield select(makeSelectActiveTab(`activeTab`))
	if (!ticketId || activeTab !== `generalParts`) return
	const user = yield select(makeSelectAppUser())
	const url = `api/v2/parts/general`
	const query = {ticketId, userId: user.id}
	const response = yield call(request.get, url, query)
	const data = map(response)
	yield put(enitityLoaded(`generalParts`, data))
}

export default function *generalPartsSaga() {
	yield takeLatest(LOAD_GENERAL_PARTS, fetchGeneralParts)
	yield takeLatest(SET_TICKET_ID, fetchGeneralParts)
}

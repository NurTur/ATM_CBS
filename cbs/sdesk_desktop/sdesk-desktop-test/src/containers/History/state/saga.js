import {call, put, select, takeLatest} from 'redux-saga/effects'
import request from 'utils/request'
import {enitityLoaded} from 'store/entities/actions'
import {setLoading} from 'containers/TicketDetails/state/actions'
import {HistoryRecord} from 'store/entities/schema'
import {SET_ACTIVE_TAB} from 'containers/TicketDetails/state/constants'
import {SET_TICKET_ID} from 'store/entities/constants'
import {makeSelectActiveTab} from 'containers/TicketDetails/state/selectors'
import {makeSelectSelectedTicketId} from 'store/entities/selectors'
import {toDate, toId, toName} from 'utils/convert-fns'

const map = data => data.map(record =>
	new HistoryRecord({
		date: toDate(record.date),
		owner: toName(record.owner),
		performer: toName(record.performer),
		serviceType: toName(record.serviceType),
		status: toName(record.status),
		statusId: toId(record.status)
	})
)

function *checkTicketId({value: ticketId}) {
	if (!ticketId) return
	const activeTab = yield select(makeSelectActiveTab(`activeTab`))
	if (activeTab !== `history`) return
	yield call(fetchTicketHistory, ticketId)
}
function *checkActiveTab({payload}) {
	if (payload !== `history`) return
	const ticketId = yield select(makeSelectSelectedTicketId())
	if (!ticketId) return
	yield call(fetchTicketHistory, ticketId)
}

export function *fetchTicketHistory(ticketId) {
	yield put(setLoading(true))
	const url = `api/v2/ticket-history`
	const response = yield call(request.get, url, {ticketId})
	const data = map(response)
	yield put(enitityLoaded(`ticketHistory`, data))
	yield put(setLoading(false))
}

export default function *ticketHistorySaga() {
	yield takeLatest(SET_ACTIVE_TAB, checkActiveTab)
	yield takeLatest(SET_TICKET_ID, checkTicketId)
}

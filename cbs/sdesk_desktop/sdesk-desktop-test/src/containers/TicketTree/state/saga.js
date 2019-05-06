import {call, put, select, takeLatest} from 'redux-saga/effects'
import request from 'utils/request'
import storage from 'utils/local-storage'
import {LOAD_DATA, SHOW_TICKET_TREE, TREE_SEARCH_REQUEST} from './constants'
import {setData, setLoading, showTicketTree} from './actions'
import {
	makeSelectTicketTreeShow,
	makeSelectTicketIds
} from './selectors'

import {makeSelectSelectedTicketId} from 'store/entities/selectors'
import {MODELS} from 'store/entities/constants'
import {getTicketFields} from 'store/entities/actions'

function *dontFetch(ticketId) {
	const visible = yield select(makeSelectTicketTreeShow())
	if (!visible || !ticketId) return true
	return false
}

export function *fetchTicketTreeData() {
	const ticketId = yield select(makeSelectSelectedTicketId())
	const dontMind = yield call(dontFetch, ticketId)
	if (dontMind) return
	yield put(setLoading(true))
	const url = `api/v2/tickets/tree/${ticketId}`
	const response = yield call(request.get, url)
	yield put(setData([response]))
}

function storeVisibilityFlag(action) {
	storage.ticketTree = {show: action.value}
}

function *loadVisibilityFlag() {
	if (`ticketTree` in storage && `show` in storage.ticketTree) {
		yield put(showTicketTree(Boolean(storage.ticketTree.show)))
	}
}

function *runTreeSearch() {
	const ticketIds = yield select(makeSelectTicketIds())
	if (ticketIds) {
		const filters = {}
		filters[MODELS.ticket.name] = {id: {$in: ticketIds}}

		yield put(getTicketFields({filters}))
	}
}

export default function *ticketTreeSaga() {
	yield call(loadVisibilityFlag)
	yield takeLatest(LOAD_DATA, fetchTicketTreeData)
	yield takeLatest(SHOW_TICKET_TREE, storeVisibilityFlag)
	yield takeLatest(TREE_SEARCH_REQUEST, runTreeSearch)
}

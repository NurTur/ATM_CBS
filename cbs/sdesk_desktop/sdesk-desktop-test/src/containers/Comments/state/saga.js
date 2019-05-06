import {normalize} from 'normalizr'
import request from 'utils/request'
import {call, put, select, takeLatest} from 'redux-saga/effects'
import {enitityLoaded} from 'store/entities/actions'
import {mergeParentDevices, setCascaderOption} from './actions'
import {setLoading} from 'containers/TicketDetails/state/actions'
import {SET_ACTIVE_TAB} from 'containers/TicketDetails/state/constants'
import {SET_TICKET_ID} from 'store/entities/constants'
import {makeSelectSelectedTicketId, makeSelectTicketParam} from 'store/entities/selectors'
import {makeSelectActiveTab} from 'containers/TicketDetails/state/selectors'
import {CommentRecord, commentsSchema, DeviceOptionsRecord} from './schema'
import {
	DELETE_COMMENT,
	EDIT_COMMENT,
	LOAD_CHILDREN_DEVICES,
	LOAD_PARENT_DEVICES,
	POST_COMMENT
} from './constants'

const url = `api/v2/comments`

function *checkTicketId({value: ticketId}) {
	if (!ticketId) return
	const activeTab = yield select(makeSelectActiveTab(`activeTab`))
	if (activeTab !== `comments`) return
	yield call(fetchTicketComments, ticketId)
}
function *checkActiveTab({payload}) {
	if (payload !== `comments`) return
	const ticketId = yield select(makeSelectSelectedTicketId())
	if (!ticketId) return
	yield call(fetchTicketComments, ticketId)
}

function *fetchTicketComments(ticketId) {
	yield put(setLoading(true))
	const response = yield call(request.get, url, {ticketId})
	const normalizedComments = normalize(response, commentsSchema)
	const comments = normalizedComments.entities.comments

	for (let key in comments) {
		comments[key] = new CommentRecord(comments[key])
	}

	yield put(enitityLoaded(`ticketComments`, normalizedComments))
	yield put(setLoading(false))
}

function *postTicketComment({payload: comment}) {
	comment.ticketId = yield select(makeSelectSelectedTicketId())
	yield call(request.post, url, comment)
	yield call(fetchTicketComments)
}

function *editTicketComment(action) {
	yield call(request.put, url, action.payload)
	yield call(fetchTicketComments)
}

function *deleteTicketComment(action) {
	yield call(request.delete, `${url}/${action.payload}`)
	yield call(fetchTicketComments)
}

function *fetchParentDevices({payload}) {
	const vendorId = yield select(makeSelectTicketParam(`vendor`))
	const parentArray = yield call(request.get, `${url}/devices/parent/${vendorId}`)
	yield put(mergeParentDevices(parentArray))
	if (payload) {
		yield call(fetchChildrenDevices, {payload})
	}
}

function *fetchChildrenDevices({payload}) {
	const Option = new DeviceOptionsRecord(payload)
	let option = Option.set(`loading`, true)
	yield put(setCascaderOption(option))
	const parentId = payload.value
	const children = yield call(request.get, `${url}/devices/child/${parentId}`)
	const childOptions = prepareChildrenOptions(children)
	option = Option.set(`children`, childOptions)

	if (children && children.length === 0) {
		option = option
			.set(`isLeaf`, true)
	}
	yield put(setCascaderOption(option))
}

function prepareChildrenOptions(children) {
	if (children && Array.isArray(children)) {
		return children.length === 0
			? children
			: children.map(({id: value, name: label}) => ({value, label}))
	}
	return null
}

export default function *ticketDetailsSaga() {
	yield takeLatest(SET_ACTIVE_TAB, checkActiveTab)
	yield takeLatest(SET_TICKET_ID, checkTicketId)
	yield takeLatest(DELETE_COMMENT, deleteTicketComment)
	yield takeLatest(POST_COMMENT, postTicketComment)
	yield takeLatest(EDIT_COMMENT, editTicketComment)
	yield takeLatest(LOAD_PARENT_DEVICES, fetchParentDevices)
	yield takeLatest(LOAD_CHILDREN_DEVICES, fetchChildrenDevices)
}

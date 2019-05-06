import {call, put} from 'redux-saga/effects'
import request from 'utils/request'

import {enitityLoaded} from '../actions'
import {AppUserRecord} from '../schema'

export default function *fetchAppUser() {
	const url = `me`
	const response = yield call(request.get, url)
	const appUser = new AppUserRecord(response)
	yield put(enitityLoaded(`appUser`, appUser))
}

import {all, call, put} from 'redux-saga/effects'
import {setLoading, setError} from 'store/global/actions'
import fetchAppUser from 'store/entities/saga/users'
import fetchReferences from 'store/entities/saga/references'

export default function *startUp() {
	try {
		yield put(setLoading(true))
		yield all([
			call(fetchReferences),
			call(fetchAppUser)
		])
	}
	catch (err) {
		yield put(setError(err))
	}
	finally {
		yield put(setLoading(false))
	}
}

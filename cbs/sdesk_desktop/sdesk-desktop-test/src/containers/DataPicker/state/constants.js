import {Record, fromJS, Map} from 'immutable'

export const REFERENCE_SEARCH = `DataPicker/REFERENCE_SEARCH`
export const SET_PICKER_DATA = `DataPicker/SET_PICKER_DATA`
export const ASYNC_SELECT_WAIT_TIME = 750
export const SELECT_MAX_OPTIONS_COUNT = 100
export const ASYNC_SELECT_REQUEST_TIMEOUT = 25000
export const LIMITED_MESSAGE = `Отображены первые ${SELECT_MAX_OPTIONS_COUNT} элементов`

export const asyncType = Record({
	fetching: false,
	options: Map({})
})

export const initialState = fromJS({
	customer: new asyncType(),
	performer: new asyncType(),
	malfunctionReasonParent: new asyncType(),
	malfunctionReason: new asyncType(),
	typeModel: new asyncType()
})

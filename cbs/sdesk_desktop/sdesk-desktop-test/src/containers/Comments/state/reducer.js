import {fromJS, List, Map} from 'immutable'
import {normalize} from 'normalizr'
import {types} from './commentTypes'
import {optionsSchema, DeviceOptionsRecord} from './schema'
import {
	MERGE_PARENT_DEVICES,
	PREPARE_OPTIONS,
	SET_CASCADER_OPTION,
	SET_TYPE
} from './constants'

const initialState = fromJS({
	type: types[0].value,
	deviceOptions: []
})

export default function commentsTabReducer(state = initialState, action) {
	switch (action.type) {
	case SET_TYPE: {
		return state.set(`type`, action.payload)
	}
	case PREPARE_OPTIONS: {
		const defaultParentArray = action.payload
		const normalizedParentArray = normalize(defaultParentArray, optionsSchema)

		return state.set(`deviceOptions`, fromJS(normalizedParentArray))
	}
	case MERGE_PARENT_DEVICES: {
		const parentArray = action.payload
		const {entities: {options}, result} = normalize(parentArray, optionsSchema)

		return state.withMutations(map => map
			.deleteIn([`deviceOptions`, `entities`, `options`, `none`])
			.updateIn([`deviceOptions`, `entities`, `options`], defaultOptions =>
				Map(options).mergeDeep(defaultOptions))
			.setIn([`deviceOptions`, `result`], List(result))
		)
	}
	case SET_CASCADER_OPTION: {
		const id = action.payload.value
		return state.setIn(
			[`deviceOptions`, `entities`, `options`, `${id}`],
			new DeviceOptionsRecord(action.payload))
	}
	default: return state
	}
}

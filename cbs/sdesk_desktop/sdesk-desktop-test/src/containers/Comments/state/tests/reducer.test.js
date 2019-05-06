import {fromJS, List, Map} from 'immutable'
import {normalize} from 'normalizr'
import commentsReducer from '../reducer'
import {
	setDisplayType,
	prepareOptions,
	mergeParentDevices,
	setCascaderOption
} from '../actions'
import {optionsSchema, DeviceOptionsRecord} from '../schema'

describe(`commentsReducer`, () => {
	const mockedState = fromJS({
		type: null,
		deviceOptions: []
	})

	it(`should return the initial state`, () => {
		const state = commentsReducer(undefined, {})
		expect(state).toEqual(mockedState)
	})
	it(`should handle setDisplayType action`, () => {
		const action = setDisplayType(`0`)
		const expected = mockedState.set(`type`, `0`)
		const state = commentsReducer(mockedState, action)
		expect(state).toEqual(expected)
	})
	it(`should handle prepareOptions action`, () => {
		const action = prepareOptions([])
		const defaultParentArray = action.payload
		const normalizedParentArray = normalize(defaultParentArray, optionsSchema)
		const expected = mockedState.set(`deviceOptions`, fromJS(normalizedParentArray))
		const state = commentsReducer(mockedState, action)
		expect(state).toEqual(expected)
	})
	it(`should handle mergeParentDevices action`, () => {
		const action = mergeParentDevices([{0: {id: 147, name: `ATM`}}])
		const parentArray = action.payload
		const {entities: {options}, result} = normalize(parentArray, optionsSchema)
		const expected = mockedState.withMutations(map => map
			.deleteIn([`deviceOptions`, `entities`, `options`, `none`])
			.updateIn(
				[`deviceOptions`, `entities`, `options`],
				defaultOptions =>	Map(options).mergeDeep(defaultOptions)
			)
			.setIn([`deviceOptions`, `result`], List(result))
		)
		const state = commentsReducer(mockedState, action)
		expect(state).toEqual(expected)
	})
	it(`should handle setCascaderOption action`, () => {
		const action = setCascaderOption([{device: `BNA`}])
		const expected = mockedState.setIn(
			[`deviceOptions`, `entities`, `options`, `${action.payload.value}`],
			new DeviceOptionsRecord(action.payload))
		const state = commentsReducer(mockedState, action)
		expect(state).toEqual(expected)
	})
})

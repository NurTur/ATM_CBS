import {Map} from 'immutable'
import {makeSelectPickerData} from '../selectors'
import {testValues} from './constants'
import {initialState} from '../constants'

const mockedState = Map({dataPicker: initialState})
	.setIn([`dataPicker`, `customer`, `options`], testValues.string)
	.setIn([`dataPicker`, `customer`, `fetching`], true)

describe(`DataPicker state selectors`, () => {
	it(`should select options of customer picker`, () => {
		const expectedResult = mockedState.getIn([`dataPicker`, `customer`, `options`])
		const makeSelect = makeSelectPickerData(`customer`, `options`)
		expect(makeSelect(mockedState)).toEqual(expectedResult)
	})
	it(`should select fetching of customer picker`, () => {
		const expectedResult = mockedState.getIn([`dataPicker`, `customer`, `fetching`])
		const makeSelect = makeSelectPickerData(`customer`, `fetching`)
		expect(makeSelect(mockedState)).toEqual(expectedResult)
	})
})

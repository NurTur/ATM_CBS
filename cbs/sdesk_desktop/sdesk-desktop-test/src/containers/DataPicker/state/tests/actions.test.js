import {SET_PICKER_DATA, REFERENCE_SEARCH} from '../constants'
import {setPickerData, searchReference} from '../actions'
import {testValues} from './constants'

describe(`DataOicker actions`, () => {
	describe(`setPickerData`, () => {
		it(`should return the type and payload object {name, value}`, () => {
			const expectedResult = {
				type: SET_PICKER_DATA,
				payload: {name: testValues.string, value: testValues.string}
			}
			expect(setPickerData(testValues.string, testValues.string)).toEqual(expectedResult)
		})
	})
	describe(`searchReference`, () => {
		it(`should return the type and payload object {name, value, postProcessingAction}`, () => {
			const expectedResult = {
				type: REFERENCE_SEARCH,
				payload: {
					name: testValues.string,
					value: testValues.string,
					postProcessingAction: null
				}
			}
			expect(searchReference(testValues.string, testValues.string)).toEqual(expectedResult)
		})
	})
})

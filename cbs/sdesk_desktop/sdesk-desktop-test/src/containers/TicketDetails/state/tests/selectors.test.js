import {fromJS} from 'immutable'
import {makeSelectActiveTab, makeSelectLoading} from '../selectors'

describe(`makeSelectData`, () => {
	let state = fromJS({ticketDetails: {
		activeTab: `comments`,
		loading: true
	}})
	it(`should select an active tab`, () => {
		const expected = `comments`
		expect(makeSelectActiveTab(`activeTab`)(state)).toEqual(expected)
	})
	it(`should select loading`, () => {
		const expected = true
		expect(makeSelectLoading(`loading`)(state)).toEqual(expected)
	})
})

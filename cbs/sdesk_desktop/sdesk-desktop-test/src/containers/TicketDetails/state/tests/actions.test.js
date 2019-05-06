import {SET_ACTIVE_TAB, SET_LOADING} from '../constants'

import {setActiveTab, setLoading} from '../actions'

describe(`TicketDetails actions`, () => {
	it(`should set an active tab`, () => {
		const expected = {
			type: SET_ACTIVE_TAB,
			payload: `comment`
		}
		expect(setActiveTab(`comment`)).toEqual(expected)
	})
	it(`should set loading`, () => {
		const expected = {
			type: SET_LOADING,
			payload: true
		}
		expect(setLoading(true)).toEqual(expected)
	})
})

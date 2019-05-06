import {fromJS, List, Map} from 'immutable'
import {normalize, denormalize} from 'normalizr'
import {CommentRecord, commentsSchema, DeviceOptionsRecord} from '../schema'
import {AppUserRecord} from 'store/entities/schema'

import {
	makeSelectComments,
	makeSelectCommentsType,
	makeSelectDeviceOptions,
	makeSelectUserRole,
	selectCommentsTab
} from '../selectors'

describe(`Comments state selectors`, () => {
	const systemComment = {
		id: 540389,
		date: `2016-10-20T11:32:02.000Z`,
		text: `Автоназначение (Правило #22)`,
		type: `3`,
		perm: {
			edit: 0
		},
		user: null,
		device: null
	}
	const userComment = {
		id: 540862,
		date: `2016-10-21T10:51:21.000Z`,
		text: `необходимо заказать системную плату`,
		type: `0`,
		perm: {
			edit: 1
		},
		user: Map({
			id: 158,
			name: `Александр Бобко`
		}),
		device: Map({
			id: 186,
			name: `System board (Системная/материнская плата)`,
			parent: Map({
				id: 161,
				name: `Notebook: Основной блок`
			})
		})
	}

	const normalizedComments = normalize([systemComment, userComment], commentsSchema)
	const comments = normalizedComments.entities.comments

	for (let key in comments) {
		comments[key] = new CommentRecord(comments[key])
	}

	const state = fromJS({
		entities: {
			ticketId: 777,
			ticketComments: normalizedComments,
			appUser: new AppUserRecord({weight: 5})
		},
		commentsTab: {
			type: `0`,
			deviceOptions: {
				entities: {},
				result: []
			}
		}
	})

	it(`should select commentsTab`, () => {
		const expected = state.get(`commentsTab`)
		expect(selectCommentsTab(state)).toEqual(expected)
	})

	it(`should select test deviceOptions`, () => {
		const data = new DeviceOptionsRecord({
			value: 123,
			label: `test`
		})
		const expected = [data.toJS()]
		const mockedState = state
			.setIn([`commentsTab`, `deviceOptions`, `result`], List([123]))
			.setIn([`commentsTab`, `deviceOptions`, `entities`, `options`], Map({
				123: data
			}))
		const selectOptions = makeSelectDeviceOptions()
		expect(selectOptions(mockedState)).toEqual(expected)
	})

	it(`should select empty deviceOptions`, () => {
		const expected = []
		const selectOptions = makeSelectDeviceOptions()
		expect(selectOptions(state)).toEqual(expected)
	})

	it(`should select type of commentsType`, () => {
		const expected = `0`
		const selectCommentsType = makeSelectCommentsType()
		expect(selectCommentsType(state)).toEqual(expected)
	})

	it(`should select comments`, () => {
		const expected = denormalize(
			List([540862]),
			commentsSchema,
			state.getIn([`entities`, `ticketComments`, `entities`])
		)
		const selectComments = makeSelectComments()
		expect(selectComments(state)).toEqual(expected)
	})

	it(`should select user role`, () => {
		const expected = 5
		const selector = makeSelectUserRole()
		expect(selector(state)).toEqual(expected)
	})
})

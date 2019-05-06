import {createSelector} from 'reselect'
import {denormalize} from 'normalizr'
import {makeSelectReference, makeSelectAppUser} from 'store/entities/selectors'
import {commentsSchema, optionsSchema} from './schema'

const filterCommentsResult = (type, comments) => {
	const filteredComments = comments
		.getIn([`entities`, `comments`])
		.filter(comment => comment.type === type)
		.map((comment, key) => key)
		.toList()
	return comments
		.get(`result`)
		.filter(value => filteredComments.includes(value.toString()))
}

export const selectCommentsTab = (state) => state.get(`commentsTab`)

export const makeSelectDeviceOptions = () => createSelector(
	selectCommentsTab,
	commentsTab => {
		commentsTab.get(`deviceOptions`)
		const result = commentsTab.getIn([`deviceOptions`, `result`])
		const entities = commentsTab.getIn([`deviceOptions`, `entities`])
		return result && entities && denormalize(result, optionsSchema, entities).toJS() || []
	}
)

export const makeSelectCommentsType = () => createSelector(
	selectCommentsTab,
	commentsTab => commentsTab.get(`type`)
)

export const makeSelectComments = () => createSelector(
	makeSelectCommentsType(),
	makeSelectReference(`ticketComments`),
	(type, comments) => {
		const commentsResult = comments.get(`result`)
		const result = type && commentsResult && commentsResult.size > 0
			? filterCommentsResult(type, comments)
			: commentsResult
		return denormalize(
			result, commentsSchema, comments.get(`entities`)
		) || comments
	}
)

export const makeSelectUserRole = () => createSelector(
	makeSelectAppUser(),
	appUser => appUser.weight
)

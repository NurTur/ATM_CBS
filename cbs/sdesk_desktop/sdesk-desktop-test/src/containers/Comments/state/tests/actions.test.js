import {
	DELETE_COMMENT,
	EDIT_COMMENT,
	LOAD_CHILDREN_DEVICES,
	LOAD_COMMENTS,
	LOAD_PARENT_DEVICES,
	MERGE_PARENT_DEVICES,
	POST_COMMENT,
	PREPARE_OPTIONS,
	SET_CASCADER_OPTION,
	SET_TYPE
} from '../constants'
import {
	deleteComment,
	editComment,
	loadChildrenDevices,
	loadComments,
	loadParentDevices,
	mergeParentDevices,
	postComment,
	prepareOptions,
	setCascaderOption,
	setDisplayType
} from '../actions'

describe(`Comments actions`, () => {
	it(`return type of loadComments`, () => {
		const expected = {
			type: LOAD_COMMENTS
		}
		expect(loadComments()).toEqual(expected)
	})
	it(`return type and payload of displayed comments`, () => {
		const type = 0
		const expected = {
			type: SET_TYPE,
			payload: type
		}
		expect(setDisplayType(type)).toEqual(expected)
	})
	it(`return type and payload of deleteComment`, () => {
		const commentId = 123
		const expected = {
			type: DELETE_COMMENT,
			payload: commentId
		}
		expect(deleteComment(commentId)).toEqual(expected)
	})
	it(`return type and payload of postComment`, () => {
		const payload = 123
		const expected = {
			type: POST_COMMENT,
			payload
		}
		expect(postComment(payload)).toEqual(expected)
	})
	it(`return type and payload of editComment`, () => {
		const payload = 123
		const expected = {
			type: EDIT_COMMENT,
			payload
		}
		expect(editComment(payload)).toEqual(expected)
	})
	it(`return type and payload of prepareOptions`, () => {
		const payload = 123
		const expected = {
			type: PREPARE_OPTIONS,
			payload
		}
		expect(prepareOptions(payload)).toEqual(expected)
	})
	it(`return type and payload of loadParentDevices`, () => {
		const payload = 123
		const expected = {
			type: LOAD_PARENT_DEVICES,
			payload
		}
		expect(loadParentDevices(payload)).toEqual(expected)
	})
	it(`return type and payload of mergeParentDevices`, () => {
		const payload = 123
		const expected = {
			type: MERGE_PARENT_DEVICES,
			payload
		}
		expect(mergeParentDevices(payload)).toEqual(expected)
	})
	it(`return type and payload of loadChildrenDevices`, () => {
		const payload = 123
		const expected = {
			type: LOAD_CHILDREN_DEVICES,
			payload
		}
		expect(loadChildrenDevices(payload)).toEqual(expected)
	})
	it(`return type and payload of setCascaderOption`, () => {
		const payload = 123
		const expected = {
			type: SET_CASCADER_OPTION,
			payload
		}
		expect(setCascaderOption(payload)).toEqual(expected)
	})
})

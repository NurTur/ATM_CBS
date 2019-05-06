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
}	from './constants'

export function loadComments() {
	return {type: LOAD_COMMENTS}
}

export function setDisplayType(type) {
	return {
		type: SET_TYPE,
		payload: type
	}
}

export function deleteComment(commentId) {
	return {
		type: DELETE_COMMENT,
		payload: commentId
	}
}

export function postComment(payload) {
	return {
		type: POST_COMMENT,
		payload
	}
}

export function editComment(payload) {
	return {
		type: EDIT_COMMENT,
		payload
	}
}

export function prepareOptions(payload) {
	return {
		type: PREPARE_OPTIONS,
		payload
	}
}

export function loadParentDevices(payload) {
	return {
		type: LOAD_PARENT_DEVICES,
		payload
	}
}

export function mergeParentDevices(payload) {
	return {
		type: MERGE_PARENT_DEVICES,
		payload
	}
}

export function loadChildrenDevices(payload) {
	return {
		type: LOAD_CHILDREN_DEVICES,
		payload
	}
}

export function setCascaderOption(payload) {
	return {
		type: SET_CASCADER_OPTION,
		payload
	}
}

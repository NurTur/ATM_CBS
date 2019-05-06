import {schema} from 'normalizr'
import {Record} from 'immutable'

export const CommentRecord = Record({
	id: null,
	date: null,
	user: null,
	perm: {edit: 0},
	text: ``,
	type: null,
	device: {}
})

const user = new schema.Entity(`users`)
const parent = new schema.Entity(`devices`)
const device = new schema.Entity(`devices`, {parent})
const comment = new schema.Entity(`comments`, {
	user,
	device
})

export const commentsSchema = new schema.Array(comment)

export const DeviceOptionsRecord = Record({
	label: ``,
	value: null,
	loading: false,
	isLeaf: false,
	children: null
})

const optionSchema = new schema.Entity(`options`, {}, {
	processStrategy: (entity) => {
		const {id: value, name: label, haveChildren, loading, isLeaf, children} = entity
		const isLeafValue = isLeaf || haveChildren === false
		return new DeviceOptionsRecord({value, label, loading, isLeaf: isLeafValue, children})
	}
})

export const optionsSchema = new schema.Array(optionSchema)

import {schema} from 'normalizr'

const ticket = new schema.Entity(`tickets`, {
	children: [new schema.Entity(`tickets`, {
		children: [new schema.Entity(`tickets`, {
			children: [new schema.Entity(`tickets`, {
				children: [new schema.Entity(`tickets`, {
					children: [new schema.Entity(`tickets`)]
				})]
			})]
		})]
	})]
})
export default [ticket]
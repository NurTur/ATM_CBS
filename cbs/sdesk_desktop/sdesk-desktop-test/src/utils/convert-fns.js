export const toDate = value => value ? new Date(value) : ``
export const toId = value => value ? value.id : ``
export const toName = value => value ? value.name : ``
export const toYesNo = value => value ? `Да` : `Нет`

export const every = (item, ...rest) => {
	const fn = rest[rest.length - 1]
	const type = typeof rest[0]
	const skip = type === `string` && [rest[0]] || Array.isArray(rest[0]) && rest[0] || []
	const result = {}
	Object.keys(item).forEach(key => {
		if (skip.includes(key)) return
		result[key] = fn(item[key], key)
	})
	return result
}

export const rename = (value, ...rest) => {
	const list = rest[rest.length - 1]
	const type = typeof rest[0]
	const skip = type === `string` && [rest[0]] || Array.isArray(rest[0]) && rest[0] || []
	const result = {}
	const renamed = key => list[key] || key
	for (let key in value) {
		if (skip.includes(key)) continue
		const name = renamed(key, list)
		result[name] = value[key]
	}
	return result
}

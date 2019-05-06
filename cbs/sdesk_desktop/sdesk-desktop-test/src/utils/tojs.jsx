import React from 'react'

const toJS = WrappedComponent => wrappedProps => {
	const props = Object
		.keys(wrappedProps)
		.reduce((propList, key) => {
			propList[key] = wrappedProps[key] && wrappedProps[key].toJS
				? wrappedProps[key].toJS()
				: wrappedProps[key]
			return propList
		}, {})
	return <WrappedComponent {...props} />
}

export default toJS

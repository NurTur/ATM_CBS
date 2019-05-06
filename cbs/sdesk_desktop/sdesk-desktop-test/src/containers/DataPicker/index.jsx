import React from 'react'
import Picker from 'components/Picker'
import randomString from 'randomstring'

import Selects from './connect-selects'

import labels from './labels'

export default ({name, label, mapActions, mapState, ...additionalProps}) => {
	const Select = Selects(name, mapState, mapActions)
	return Select
		? <Picker key={randomString.generate()} title={label || labels[name]}>
			<Select name={name} {...additionalProps}/>
		</Picker>
		: null
}

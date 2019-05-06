import React from 'react'
import Wrapper from './Wrapper'
import Label from './Label'

const Picker = ({title, children}) =>
	<Wrapper>
		{title && title !== `none` ? <Label>{title}</Label> : null}
		{children}
	</Wrapper>

export default Picker

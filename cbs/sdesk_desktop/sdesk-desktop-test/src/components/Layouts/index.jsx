import React from 'react'
import Vertical from './Vertical'
import Horizontal from './Horizontal'

const HomeLayout = ({position, children}) => position === `right`
	? <Vertical>{children}</Vertical>
	: <Horizontal>{children}</Horizontal>

export default HomeLayout

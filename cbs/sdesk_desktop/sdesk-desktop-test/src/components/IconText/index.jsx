import React from 'react'
import {Icon} from 'antd'
import styled from 'styled-components'

const StyledIcon = styled(Icon)`
	margin-right: 8px;
`
const IconText = ({type, text}) =>
	<span>
		<StyledIcon type={type}/>
		{text}
	</span>

export default IconText

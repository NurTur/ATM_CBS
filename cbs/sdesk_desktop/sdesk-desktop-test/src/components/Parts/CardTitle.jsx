import React from 'react'
import {Icon, Tag} from 'antd'
import styled from 'styled-components'

const Wrapper = styled.span`
	cursor:pointer;

	> i {
		transform: ${({expanded}) => expanded ? `rotate(90deg)` : `rotate(0deg)`};
		transition: all .3s ease;
	}
`
const StyledTag = styled(Tag)`
	float: right;
	margin: 0;
`
const CardTitle = ({title, count, color, expanded, onClick}) =>
	<Wrapper expanded={expanded} onClick={onClick}>
		<Icon type="right"/>&nbsp;
		{title}
		<StyledTag color={color ? color : `#f3730c`}>x{count}</StyledTag>
	</Wrapper>

export default CardTitle

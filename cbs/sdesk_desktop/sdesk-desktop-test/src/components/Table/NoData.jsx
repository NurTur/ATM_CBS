import React from 'react'
import styled from 'styled-components'

const Tr = styled.tr`
	color: #565656;
	display: inline-block;
	font-weight: bold;
	margin-top: 250px;
	text-transform: uppercase;
`

const NoData = props => !props.visible ? null :
	<Tr>
		<td>{props.children}</td>
	</Tr>

export default NoData

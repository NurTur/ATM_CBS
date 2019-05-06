import React from 'react'
import styled from 'styled-components'

import Section from './Section'
import Middle from './Middle'
import Br from './Br'

const LeftSide = styled.div`
	float: left;
	width: 380px;
`
const RightSide = styled.div`
	float: right;
	width: calc(100% - 400px);
`

const Horizontal = props =>
	<Section>
		{props.children[0]}
		<Middle>
			{props.children[1]}
			<Br/>
		</Middle>
		<LeftSide>
			{props.children[2]}
		</LeftSide>
		<RightSide>
			{props.children[3]}
		</RightSide>
	</Section>

export default Horizontal

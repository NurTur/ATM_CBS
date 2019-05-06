import React from 'react'
import styled from 'styled-components'

import Section from './Section'
import Middle from './Middle'
import Br from './Br'

const LeftSide = styled.div`
	float: left;
	height: 100%;
	width: calc(100% - 440px);
`
const RightSide = styled.div`
	float: right;
	height: 100%;
	margin-left: 20px;
	width: 420px;
`
const Vertical = props =>
	<Section>
		<Middle>
			<LeftSide>
				{props.children[0]}
			</LeftSide>
			<RightSide>
				{props.children[1]}
				{props.children[2]}
				{props.children[3]}
			</RightSide>
			<Br/>
		</Middle>
	</Section>

export default Vertical

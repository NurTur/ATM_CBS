import React from 'react'
import styled from 'styled-components'
import image from './under-construction.png'

const UnderConstruction = styled.div`
	background-image: url(${image});
	height: 355px;
	width: auto;
	opacity: 0.2;
	background-position:50% 50%;
`
const Text = styled.div`
	text-align: center;
	color: #111;
	font-size: 20px;
	font-weight: 600;
	position: relative;
	top: 100%;
`

export default (props) =>
	<UnderConstruction>
		{props.children || <Text>Компонент находится в разработке</Text>}
	</UnderConstruction>

import styled from 'styled-components'
import arrow from './arrow.png'

export default styled.div`
	background-color: #3679d4;
	background-image: url(${arrow});
	background-position: 92% 48%;
	border: none;
	box-sizing: border-box;
	color: white;
	cursor: pointer;
	font-size: 14px;
	font-weight: 400;
	height: 42px;
	outline: none;
	padding: 10px 24px 4px 8px;

	&:hover {
		background-color: #4083dd;
		transition: all 0.2s;
	}
`

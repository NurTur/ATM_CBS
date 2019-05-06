import styled from 'styled-components'

export default styled.span`
	background-color: ${({color}) => color || `gray`};
	border-radius: 50%;
	display: inline-block;
	height: ${({size}) => size || 6}px;
	position: relative;
	top: -1px;
	vertical-align: middle;
	width: ${({size}) => size || 6}px;
`

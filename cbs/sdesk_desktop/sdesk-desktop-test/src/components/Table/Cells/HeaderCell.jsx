import React from 'react'
import styled, {css} from 'styled-components'
import up from './sort-asc.png'
import down from './sort-desc.png'

const sorted = css`
	color: #343434;
	font-weight: 600;

	&:active {
		background-color: #f8f8f8;
		height: 27px;
		position: relative;
		top: 1px;
	}
`
const def = css`
	&:active {
		background-color: #f8f8f8;
		color: #343434;
		height: 27px;
		position: relative;
		top: 1px;
	}
`

const Th = styled.th`
	color: #565656;
	cursor: pointer;
	display: inline-block;
	font-size: 13px;
	font-weight: 400;
	overflow: hidden;
	padding: 5px 5px 5px 5px;
	text-align: left;
	text-overflow: ellipsis;
	user-select: none;
	vertical-align: middle;

	img {
		margin-left: 5px;
		vertical-align: middle;
	}

	${props => props.sort ? sorted : def}
`
function getIcon(dir) {
	if (!dir) return null
	return dir === `asc`
		? <img src={up}/>
		: <img src={down}/>
}

const HeaderCell = ({sort, children, ...props}) =>
	<Th sort={sort} {...props}>
		{children}
		{getIcon(sort)}
	</Th>

export default HeaderCell

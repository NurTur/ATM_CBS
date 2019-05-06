import React from 'react'
import styled from 'styled-components'

const Line = styled.div`
	overflow-x: hidden;
	padding: 5px;
	position: relative;
	text-overflow: ellipsis;
	white-space: nowrap;

	> :first-child {
		float: left;
		vertical-align: middle;
	}
	> :last-child {
		color: rgba(0, 0, 0, 0.85);
		float: right;
		font-weight: 500;
		vertical-align: middle;
	}
	&:hover {
		background-color: #eaf2fe
	}
	&::after {
		clear: both;
		content: '';
		display: block;
	}
`
export default props => props.children ? <Line {...props}/> : null

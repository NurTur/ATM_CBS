import styled from 'styled-components'
import icon from './icons/tree-icon.png'
import line from './icons/dashed-line.png'

export default styled.div`
	background-color: #fff;
	background-image: url(${icon}), url(${line});
	background-position: 6px 45%, center bottom;
	background-repeat: no-repeat, repeat-x;
	color: #343434;
	display: block;
	font-size: 13px;
	padding: 3px 3px 6px 28px;
`

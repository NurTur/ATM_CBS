import styled, {css} from 'styled-components'
import dashedLine from '../../../icons/dashed-line.png'

const rest = css`
	color: #191919;

	&:hover {
		color: #111111;
	}
`
const selected = css`
	background: #f1f1f1;
	color: #787878;

	&:hover {
		color: #454545;
	}
`
export default styled.li `
	background-image: url(${dashedLine});
	background-position: center bottom;
	background-repeat: repeat-x;
	cursor: pointer;
	display: inline-block;
	font-size: 13px;
	font-weight: 400;
	margin-right: 12px;
	padding: 1px 6px 3px 6px;
	user-select: none;

	&:active {
		position: relative;
		top: 1px;
	}
	${props => props.selected ? selected : rest}
`

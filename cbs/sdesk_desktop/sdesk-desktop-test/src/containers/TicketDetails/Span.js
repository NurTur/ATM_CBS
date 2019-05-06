import styled from 'styled-components'

const Span = styled.span`
	background-color: ${({active}) => active ? `#3679d4` : `#6f6f6f`};
	cursor: pointer;
	display: inline-block;
	height: 24px;
	mask: url(${({icon}) => icon}) no-repeat;
	vertical-align: middle;
	width: 24px;

	&:hover {
		background-color: #3679d4;
	}
`
export default Span

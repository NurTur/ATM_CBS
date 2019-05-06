import styled from 'styled-components'
import Wrapper from './Wrapper'

export default styled.div`
	background-color: #fefefe;
	box-shadow: 0 0.2em 0.6em 0 rgba(0, 0, 0, 0.2);
	display: none;
	padding: 10px 0px;
	position: absolute;
	width: 300px;
	z-index: 1001;

	${Wrapper}:hover & {
		display: block;
	}
`

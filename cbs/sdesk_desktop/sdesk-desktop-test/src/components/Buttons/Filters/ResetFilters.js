import styled from 'styled-components'
import filterEraser from './filter-eraser.png'

export default styled.div`
	background-image: url(${filterEraser});
	background-repeat: no-repeat;
	cursor: pointer;
	float: left;
	height: 18px;
	margin: 5px 0px 0px 16px;
	width: 17px;

	&:active {
		position: relative;
		top: 1px;
	}
	&:hover {
		opacity: 0.8;
	}
`

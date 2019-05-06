import styled from 'styled-components'
import filtersIcon from './filters.png'

export default styled.div`
	background-image: url(${filtersIcon});
	background-repeat: no-repeat;
	cursor: pointer;
	float: left;
	height: 18px;
	margin: 5px 0px 0px 7px;
	width: 74px;

	&:active {
		position: relative;
		top: 1px;
	}
	&:hover {
		opacity: 0.8;
	}
`

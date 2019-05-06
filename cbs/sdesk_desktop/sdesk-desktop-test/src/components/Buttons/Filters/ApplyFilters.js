import styled, {css} from 'styled-components'
import filtersActive from './filters-active.png'
import filtersPassive from './filters-passive.png'

const active = css`
	background-color: #2a6fcc;
	background-image: url(${filtersActive});
	box-shadow: inset 0px 1px 1px 0px rgba(0,0,0,0.19);
`
const passive = css`
	background-color: #3679d4;
	background-image: url(${filtersPassive});
`
export default styled.div`
	background-position: center 10px;
	background-repeat: no-repeat;
	border-radius: 2px;
	cursor: pointer;
	float: left;
	height: 29px;
	margin: 0px 2px 0px 15px;
	width: 31px;
	${props => props.active ? active : passive}

	&:active {
		position: relative;
		top: 1px;
	}
	&:hover {
		opacity: 0.8;
	}
`

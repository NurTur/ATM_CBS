import styled from 'styled-components'
import icon from './icon.png'
import clear from './clear.svg'
import arrow from './arrow-down.svg'

export default styled.input`
	background-image: url(${icon});
	background-position: 4px 50%;
	background-repeat: no-repeat;
	background-color: #ffffff00;
	border: solid 0px;
	height: 25px;
	margin-left: 3px;
	margin-top: 0px;
	padding: 1px 0px 0px 25px;
	width: 145px;

	&::-webkit-inner-spin-button {
		display: none;
	}
	&::-webkit-clear-button {
		appearance: none;
		background-image: url(${clear});
		background-position: center;
		background-repeat: no-repeat;
		background-size: 15px;
		height: 15px;
		width: 15px;
	}
	&::-webkit-calendar-picker-indicator {
		appearance: none;
		background-image: url(${arrow});
		background-position: center;
		background-repeat: no-repeat;
		background-size: 14px;
		color: rgba(0 ,0, 0, 0);
		height: 15px;
		opacity: 1;
		width: 15px;
	}
`

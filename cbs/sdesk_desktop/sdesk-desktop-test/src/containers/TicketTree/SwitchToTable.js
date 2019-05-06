import styled from 'styled-components'
import icon from './icons/switch-to-ticket-table.png'

export default styled.div`
	background-image: url(${icon});
	background-position: 0px 45%;
	background-repeat: no-repeat;
	color: #454545;
	cursor: pointer;
	float: right;
	padding-left: 24px;
	user-select: none;

	&:active {
		margin-top: 1px;
	}
`

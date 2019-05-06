import {Link} from 'react-router-dom'
import styled from 'styled-components'
import circle from './menu-circle.png'

export default styled(Link)`
	background-image: url(${circle});
	background-repeat: no-repeat;
	color: #272727;
	display: block;
	text-decoration: underline;
	background-position: 4% center;
	font-size: 14px;
	padding: 2px 2px 3px 25px;

	&:hover {
		color: #565656;
	}
`

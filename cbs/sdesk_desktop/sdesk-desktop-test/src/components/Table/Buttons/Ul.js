import styled from 'styled-components'

export default styled.ul`
	background-color: #fff;
	border-radius: 4px;
	display: inline-block;
	font-size: 0px;

	li:first-child {
		border-bottom-left-radius: 2px;
		border-left: solid 1px #bbb;
		border-top-left-radius: 2px;
	}
	li:last-child {
		border-bottom-right-radius: 2px;
		border-top-right-radius: 2px;
	}
`

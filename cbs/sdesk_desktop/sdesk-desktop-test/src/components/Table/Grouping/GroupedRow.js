import styled from 'styled-components'

const bg = `repeating-linear-gradient(135deg, #f8f8f8, #f8f8f8 10px, #fefefe 10px, #fefefe 20px);`

export default styled.tr`
	background-image: ${bg}
	border-bottom: solid 1px #f5eeee;
	border-collapse: collapse;
	border-top: solid 1px #f5eeee;
	height: 30px;
	text-align: left;
	vertical-align: middle;

	span {
		background: #454545;
		border-radius: 1px;
		color: #fff;
		padding: 0px 5px 1px 5px;
	}
`

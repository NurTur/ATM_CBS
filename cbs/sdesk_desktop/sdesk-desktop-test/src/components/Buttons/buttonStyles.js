import {css} from 'styled-components'

const buttonStyles = css`
display: inline-block;
box-sizing: border-box;
text-decoration: none;
user-select: none;
cursor: pointer;
outline: 0;

border: solid 1px #b1b1b1;
font-size: 13px;
font-weight: 600;
color: #303030;
padding: 4px 10px 4px 10px;
background: #f6f6f6;
background: #fff;
max-height: 30px;
border-radius: 0px;
text-align: center;

&:active {
	transform: translateY(1px);
}

&:disabled {
	background-color: #757575 !important;
}

&.primary {
	color: #fff;
	background: #3390ef;
	border: solid 1px #3679d4;
}

&:first-child {
		 border-radius: 2px 0 0 2px;
	 }

	 &:last-child {
		 border-radius: 0 2px 2px 0;
	 }

&:not(:last-child) {
    border-right: none; /* Prevent double borders for button-group */
}

> span {
	text-align: center;
	vertical-align: top;
	padding-left: 10px;
}
> img {
	height: 24px;
	vertical-align: top;
}
`

export default buttonStyles

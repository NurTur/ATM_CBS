import React from 'react'
import styled from 'styled-components'
import arrow from './arrow.png'

const Wrapper = styled.div`
	float: right;
	padding: 1px 1px 0px 0px;
	width: 130px;
`
const Select = styled.select`
	appearance: none;
	background-color: #2a6fcc;
	background-image: url(${arrow});
	background-position: right 7px center;
	background-repeat: no-repeat;
	border-left: solid 1px #1d63c1;
	border: solid 0px;
	color: #fff;
	cursor: pointer;
	font-size: 13px;
	height: 27px;
	height: 28px;
	outline: 0;
	padding: 0px 5px 3px 7px;
	user-select: none;
	white-space: nowrap;
	width: 100%;
`
const Option = styled.option`
	background: #fff;
	border: solid 0px;
	color: #343434;
	height: 20px;
	padding: 0px;
`

export default ({onChange}) =>
	<Wrapper>
		<Select onChange={onChange}>
			<Option value="ticketNo">Номер заявки</Option>
			<Option value="partNo">Партномер</Option>
			<Option value="orderNo">Номер заказа</Option>
		</Select>
	</Wrapper>

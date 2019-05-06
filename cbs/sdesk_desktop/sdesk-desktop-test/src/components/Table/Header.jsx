import React from 'react'
import styled from 'styled-components'
import Cell from './Cells/HeaderCell'
import Row from './Rows/Row'

const Header = styled.thead`
	border-bottom: solid 1px #d2d2d2;
	border-collapse: collapse;
	border-top: solid 1px #d2d2d2;
	display: block;
	height: 30px;
`
const handler = (column, callback) => callback ? event => callback({column, event}) : undefined

const getHeaders = ({columns = [], onClick, ...props}) => columns.map((col, key) =>
	<Cell
		key={key}
		sort={col.sort}
		style={{width: `${col.size}px`}}
		onClick={handler(col, onClick)}
		{...props}
	>
		{col.label}
	</Cell>
)

export default (props) =>
	<Header>
		<Row>
			{getHeaders(props)}
		</Row>
	</Header>

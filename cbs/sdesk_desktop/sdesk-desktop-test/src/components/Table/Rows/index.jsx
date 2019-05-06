import React from 'react'
import Row from './Row'
import Cell from '../Cells/Cell'

const handler = (index, record, callback) => callback
	? event => callback({index, record, event})
	: undefined

const getCells = (columns, record) =>
	columns.map(({name, size}, index) =>
		<Cell key={index} style={{width: `${size}px`}}>
			{record[name]}
		</Cell>
	)

const isSelected = ({key, value}) => record => record[key] === value

const Rows = ({selectedRow, data, columns, onClick, onContextMenu, ...props}) => {
	const selected = isSelected(selectedRow)
	return data.map((record, idx) =>
		<Row
			key={idx}
			onClick={handler(idx, record, onClick)}
			onContextMenu={handler(record, onContextMenu)}
			selected={selected(record)}
			{...props}
		>
			{getCells(columns, record)}
		</Row>
	)
}

export default Rows

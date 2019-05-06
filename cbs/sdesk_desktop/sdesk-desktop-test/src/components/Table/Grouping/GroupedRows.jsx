import React from 'react'
import GroupedRow from './GroupedRow'
import Rows from 'components/Table/Rows'

const GroupedRows = ({
	columns = [],
	groups = [],
	selectedRow,
	onClick,
	onContextMenu
}) => groups.map((group, idx) => [
	<GroupedRow key={`caption-${idx}`}>
		<td><span>{group.label}</span></td>
	</GroupedRow>,
	<Rows
		key={`rows-${idx}`}
		columns={columns}
		data={group.data}
		onClick={onClick}
		onContextMenu={onContextMenu}
		selectedRow={selectedRow}
	/>
])

export default GroupedRows

import React from 'react'
import {Table} from 'antd'

export default class TicketTable extends React.PureComponent {
	constructor(props) {
		super(props)
		this.state = {
			columnsList: props.columnsList,
			dataSource: props.dataSource
		}
		this.onChange = this.onChange.bind(this)
	}
	componentWillReceiveProps(nextProps) {
		if (!nextProps.preventUpdate) {
			this.setState({
				columnsList: nextProps.columnsList,
				dataSource: nextProps.dataSource
			})
		}
	}
	onChange(pagination, filters, sorter) {
		if (sorter.columnKey !== `groupingValue`) {
			this.props.onClickHeader(sorter)
		}
	}
	render() {
		let {columnsList, dataSource, ...props} = this.props
		if (props.preventUpdate) {
			columnsList = this.state.columnsList
			dataSource = this.state.dataSource
		}

		const width = columnsList.reduce((result, item) => result + item.width, 0)
		return <Table key="table"
			bordered
			rowKey="id"
			dataSource={dataSource}
			columns={columnsList.toJS()}
			pagination={false}
			size="small"
			scroll={{x: width, y: `calc(100vh - 180px)`}}
			onRow={record => ({
				onClick: () => {
					if (`selectable` in record && !record.selectable) {
						return null
					}
					return props.onClick(record)
				}
			})}
			rowClassName={record => {
				if (record.id === props.selectedRow.value) {
					return `tableSelectedRow`
				}
				if (`groupingValue` in record) {
					return `tableGroupingRow`
				}
				return ``
			}}
			onChange={this.onChange}
			{...props}
		/>
	}
}

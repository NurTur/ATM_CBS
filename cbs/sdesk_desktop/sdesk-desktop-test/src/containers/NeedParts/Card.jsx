import React from 'react'
import {getNeedPartStatusColor as getColor} from 'utils/status-colors'
import Card from 'components/Parts/Card'
import CardTitle from 'components/Parts/CardTitle'
import Line from 'components/Parts/Line'
import Select from 'components/DropList'

const cardTitle = ({title, count, statusId}, expanded, onClick) =>
	<CardTitle
		color={getColor(statusId)}
		count={count}
		expanded={expanded}
		onClick={onClick}
		title={title}
	/>

class CardPart extends React.Component {
	constructor(props) {
		super(props)
		this.onClick = this.onClick.bind(this)
		this.state = {expanded: false}
	}
	onClick() {
		this.setState(() => ({expanded: !this.state.expanded}))
	}
	collapsed() {
		const {part} = this.props
		return <Card title={cardTitle(part, false, this.onClick)}/>
	}
	expanded() {
		const {part} = this.props
		const onChange = statusId => this.props.onChange(part.id, statusId)
		return (
			<Card title={cardTitle(part, true, this.onClick)}>
				<Line>
					<span>Дата запроса</span>
					<span>{part.appendTime}</span>
				</Line>
				<Line>
					<span>Текущий статус</span>
					<Select
						color={getColor(part.statusId)}
						disabled={!part.permission}
						onChange={onChange}
						options={part.statusList}
						value={part.statusId}
					/>
				</Line>
				<Line>
					<span>Кем заказано</span>
					<span>{part.applicant}</span>
				</Line>
				<Line>
					<span>Парт номер</span>
					<span>{part.partNumber}</span>
				</Line>
				<Line>{part.unit}</Line>
			</Card>
		)
	}
	isExpanded() {
		if (this.expand === this.props.expanded) {
			return this.state.expanded
		}
		this.expand = this.props.expanded
		this.state.expanded = this.props.expanded
		return this.props.expanded
	}
	render() {
		return this.isExpanded()
			? this.collapsed()
			: this.expanded()
	}
}

export default CardPart

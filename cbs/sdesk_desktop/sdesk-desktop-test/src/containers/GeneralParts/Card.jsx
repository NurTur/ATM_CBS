import {Icon, List} from 'antd'
import Card from 'components/Parts/Card'
import CardTitle from 'components/Parts/CardTitle'
import Collapse from 'components/Collapse'
import IconText from 'components/IconText'
import Item from './Item'
import Line from 'components/Parts/Line'
import React from 'react'
import Tag from 'components/Parts/Tag'

const Meta = List.Item.Meta

const cardTitle = ({title, count}, expanded, onClick) =>
	<CardTitle
		count={count}
		expanded={expanded}
		onClick={onClick}
		title={title}
	/>

const cardActions = permission => permission ? [
	<IconText text="Изменить" type="edit"/>,
	<IconText text="Удалить" type="delete"/>
] : null

const listTitle = (title, count) =>
	<span style={{fontSize: `14px`}}>
		{title} <Tag>x{count}</Tag>
	</span>

const listActions = permission => permission ? [
	<Icon type="edit"/>,
	<Icon type="delete"/>
] : null

const renderItem = permission => item =>
	<Item actions={listActions(permission)}>
		<Meta
			title={listTitle(item.status, item.count)}
			description={item.comment}
		/>
	</Item>

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
		const {part, permissions} = this.props
		const canEdit = permissions.includes(`update`)
		return (
			<Card
				title={cardTitle(part, true, this.onClick)}
				actions={cardActions(canEdit)}>
				<Line>
					<span>Вендор</span>
					<span>{part.vendor}</span>
				</Line>
				<Line>
					<span>Парт номер</span>
					<span>{part.partNumber}</span>
				</Line>
				<Line>
					<span>Номер блока</span>
					<span>{part.blockNumber}</span>
				</Line>
				<Line>
					<span>Аналог</span>
					<span>{part.analog}</span>
				</Line>
				<Collapse title="История">
					<List
						size="small"
						itemLayout="vertical"
						dataSource={part.history}
						renderItem={renderItem(canEdit)}
					/>
				</Collapse>
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

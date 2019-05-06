import React from 'react'
import styled from 'styled-components'
import {Timeline} from 'antd'
import {getTicketStatusColor as getColor} from 'utils/status-colors'
import {Body, TimeLine} from 'components/TabPane'
import Caption from './Caption'
import Card from 'components/Parts/Card'
import Line from 'components/Parts/Line'
import inject from './inject'

const Item = Timeline.Item

const StyledBody = styled(Body)`
	height: 100%;
	padding-top: 20px;
`

const loop = data => data.map((item, index) =>
	<Item key={index} color={getColor(item.statusId)}>
		<Caption>{item.status} <span>{item.date}</span></Caption>
		<Card>
			<Line>
				<span>Установил статус</span>
				<span>{item.owner}</span>
			</Line>
			<Line>
				<span>Исполнитель</span>
				<span>{item.performer}</span>
			</Line>
			<Line>
				<span>Вид работ</span>
				<span>{item.serviceType}</span>
			</Line>
		</Card>
	</Item>
)

const History = props =>
	<StyledBody>
		<TimeLine>
			{loop(props.data)}
		</TimeLine>
	</StyledBody>
export default inject(History)

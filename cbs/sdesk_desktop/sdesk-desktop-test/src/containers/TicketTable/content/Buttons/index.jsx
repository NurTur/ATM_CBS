import React from 'react'
import styled from 'styled-components'
import {Button} from 'antd'
// import Wrapper from 'components/Table/Buttons/Wrapper'
// import Ul from 'components/Table/Buttons/Ul'
// import Li from 'components/Table/Buttons/Li'
import ButtonExport from 'containers/TicketTable/content/ButtonExport'
import connect from './connect'

const ButtonGroup = Button.Group
const StyledButtonGroup = styled(ButtonGroup)`
	> button {
		vertical-align: top;
	}
`

const recordsAvailable = page => page && page.get(`totalRecords`) > 0
const Buttons = props =>
	<StyledButtonGroup>
		<Button size="default" icon="plus"/>
		<ButtonExport
			size="default"
			icon="export"
			email={props.appUser.email}
			onClick={props.exportTickets}
			disabled={!recordsAvailable(props.page)}
		/>
	</StyledButtonGroup>
// {<Wrapper>
// 	<Ul>
// 		<Li icon="addTicket" onClick={onClick}/>
// 		<Li icon="addSimilarTicket"/>
// 		<Li icon="addParts"/>
// 		<Li icon="editTicket"/>
// 		<Li icon="changePerformer"/>
// 		<Li icon="serviceType"/>
// 		<Li icon="changeTicketStatus"/>
// 		<Li icon="moreActions"/>
// 	</Ul>
// </Wrapper>}

export default connect(Buttons)

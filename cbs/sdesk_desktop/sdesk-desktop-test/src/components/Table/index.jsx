import React from 'react'
import Wrapper from './Wrapper'
import Ul from './Ul'
import Li from './Li'

const Buttons = () =>
	<Wrapper>
		<Ul>
			<Li icon="addTicket"/>
			<Li icon="addSimilarTicket"/>
			<Li icon="addParts"/>
			<Li icon="editTicket"/>
			<Li icon="changePerformer"/>
			<Li icon="serviceType"/>
			<Li icon="changeTicketStatus"/>
			<Li icon="moreActions"/>
		</Ul>
	</Wrapper>

export default Buttons

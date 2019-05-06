import React from 'react'
import {Layout} from 'antd'
import {StyledSider, StyledLayout, StyledContent, SiderLayout} from './LayoutComponents'
import ControlPanel from 'containers/TicketTree/ControlPanel'
import TicketDetails from 'containers/TicketDetails'
import TicketTable from 'containers/TicketTable'
import TicketTree from 'containers/TicketTree'

const {Content} = Layout

const HomePage = () =>
	<StyledLayout>
		<Content>
			<TicketTable/>
		</Content>
		<StyledSider width="420">
			<ControlPanel/>
			<SiderLayout>
				<TicketTree/>
				<StyledContent>
					<TicketDetails/>
				</StyledContent>
			</SiderLayout>
		</StyledSider>
	</StyledLayout>

export default HomePage

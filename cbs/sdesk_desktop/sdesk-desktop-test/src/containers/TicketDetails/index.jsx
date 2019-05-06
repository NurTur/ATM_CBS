import React from 'react'
import styled from 'styled-components'
// import GeneralInfo from 'containers/GeneralInfo'
import History from 'containers/History'
// import GeneralParts from 'containers/GeneralParts'
// import NeedParts from 'containers/NeedParts'
import Comments from 'containers/Comments'
import Span from './Span'
import Loader from './Loader'
import {getTabs} from './availableTabs'
import {Tab, Tabs} from 'components/TabPane'
import UnderConstruction from 'components/UnderConstruction'
import tabIcons from './icons'
import inject from './inject'
import {Pane} from 'components/TabPane'

const StyledPane = styled(Pane)`
	height: calc(100% - 44px);
`

const tabContent = {
	detailInfo: <UnderConstruction key="info"/>,
	history: <History key="history"/>,
	needParts: <UnderConstruction key="needParts"/>,
	generalParts: <UnderConstruction key="generalParts"/>,
	installedParts: <UnderConstruction key="installedParts"/>,
	comments: <Comments key="comments"/>
}

const tab = (icon, active) => <Span icon={icon} active={active}/>
const tabBody = (activeTab) => <StyledPane key="pane">{tabContent[activeTab]}</StyledPane>
const TicketDetails = ({activeTab, tabClick, loading, ticketType}) => [
	<Tabs key="Tabs" activeKey={activeTab} onChange={tabClick}>
		{getTabs(ticketType).map(tabName =>
			<Tab key={tabName} tab={tab(tabIcons[tabName], activeTab === tabName)}/>
		)}
	</Tabs>,
	loading ? <Loader key="loader" /> : tabBody(activeTab)
]

export default inject(TicketDetails)

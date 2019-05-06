import React from 'react'
import {Switch, Route} from 'react-router-dom'
import connect from './connect'
import Logo from 'components/Logo'
import IconButton from 'components/Buttons/IconButton'
import Search from 'containers/Search'
import Filters from 'containers/Search/content/Filters'
import Wrapper from './content/Wrapper'
import HeaderPadding from './content/HeaderPadding'
import LogoText from './content/LogoText'
import Username from './content/UserName'
// import Notification from './icons/notification.svg'
import Settings from './icons/settings.svg'
import Logout from './icons/logout.svg'

const Header = (props) => [
	<Wrapper key="header">
		<div className="left-panel">
			<Logo/>
			<LogoText>CBS Service</LogoText>
			<Switch>
				<Route exact path="/" component={Search}/>
			</Switch>
		</div>
		<div className="right-panel">
			<IconButton
				onClick={() => window.location = `logout`}
				icon={Logout}
				data-balloon="Выход"
				data-balloon-pos="left"
			/>
			<Switch>
				<Route exact path="/" component={() =>
					<IconButton
						onClick={props.showSettings}
						icon={Settings}
						data-balloon="Настройки"
						data-balloon-pos="down"
					/>
				}/>
			</Switch>
			{ // вернуть сообщения, когда будут готовы
				/* <IconButton
				onClick={props.showNotifications}
				icon={Notification}
				data-balloon="Уведомления"
				data-balloon-pos="down"
			/> */}
			<Username/>
		</div>
	</Wrapper>,
	<HeaderPadding key="HeaderPadding"/>,
	<Switch key="filters">
		<Route exact path="/" component={Filters}/>
	</Switch>
]

export default connect(Header)

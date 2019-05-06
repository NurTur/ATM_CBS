import React from 'react'

import Wrapper from './Wrapper'
import Caption from './Caption'
import List from './List'
import Label from './Label'
import Link from './Link'
import SubLink from './SubLink'

const Menu = () =>
	<Wrapper>
		<Caption>Заявки</Caption>
		<List>
			<Label>Меню</Label>
			<Link to="/">Заказчики</Link>
			<Link to="/nopage">Оборудование</Link>
			<SubLink to="#">Устройства / Узлы</SubLink>
			<SubLink to="#">Типы оборудования</SubLink>
			<SubLink to="#">Данные по оборудованию</SubLink>
			<SubLink to="#">Производители</SubLink>
			<Link to="#">Поставщики</Link>
			<Link to="#">Причины возникновения заявок</Link>
		</List>
	</Wrapper>

export default Menu

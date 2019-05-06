// import React from 'react'

// import {Button, Switch} from 'antd'
// import {Body, Pane, ToolBar} from 'components/TabPane'
// // import Body from '../TabPane/Body'
// import Card from './Card'
// // import Pane from '../TabPane/Pane'
// import Span from 'components/Parts/Span'
// // import ToolBar from '../TabPane/ToolBar'
// import inject from './inject'
// 
// const addButton = can => can && <Button icon="plus" type="primary">Добавить</Button>
// 
// const makeLoop = (permissions, expanded, onChange) => parts => parts.map((part, index) =>
// 	<Card
// 		key={index}
// 		expanded={expanded}
// 		onChange={onChange}
// 		part={part}
// 		permissions={permissions}
// 	/>
// )
// class NeedParts extends React.Component {
// 	componentDidMount() {
// 		this.props.onMount()
// 	}
// 	render() {
// 		const {permissions, data, expanded, onExpand, onChangeStatus} = this.props
// 		const loop = makeLoop(permissions, expanded, onChangeStatus)
// 		return (
// 			<Pane>
// 				<ToolBar>
// 					{addButton(permissions.includes(`create`))}
// 					<Span>
// 						Свернуть карточки:&nbsp;
// 						<Switch size="small" checked={expanded} onChange={onExpand}/>
// 					</Span>
// 				</ToolBar>
// 				<Body>
// 					{loop(data)}
// 				</Body>
// 			</Pane>
// 		)
// 	}
// }
// 
// export default inject(NeedParts)

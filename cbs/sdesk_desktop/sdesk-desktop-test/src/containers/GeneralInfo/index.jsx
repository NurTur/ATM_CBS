import React from 'react'
// import {Body, Pane, ToolBar} from 'components/TabPane'
import UnderConstruction from 'components/UnderConstruction'
import connect from './connect'

class GeneralInfo extends React.Component {
	componentDidMount() {
		this.props.onMount()
	}
	render() {
		return (
			// <Pane>
			// 	<ToolBar/>
			// 	<Body>
			// 		Для отображения информации по заявке, в начале следует выделить заявку.
			// 	</Body>
			// </Pane>
			<UnderConstruction/>
		)
	}
}

export default connect(GeneralInfo)

import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'
import {loadData, showTicketTree} from '../state/actions'
import {makeSelectTicketTreeShow} from '../state/selectors'
import {Switch} from 'antd'
import React from 'react'
import Wrapper from './Wrapper'

const ControlPanel = ({checked, onChange}) =>
	<Wrapper>
		Отобразить дерево заявок:&nbsp;
		<Switch size="small" checked={checked} onChange={onChange}/>
	</Wrapper>

const props = createStructuredSelector({
	checked: makeSelectTicketTreeShow()
})
const actions = dispatch => ({
	onChange: value => {
		dispatch(showTicketTree(value))
		dispatch(loadData())
	}
})

export default connect(props, actions)(ControlPanel)

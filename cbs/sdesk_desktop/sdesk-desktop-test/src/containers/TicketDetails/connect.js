import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'
import {makeSelectTicketParam} from 'store/entities/selectors'
import {makeSelectActiveTab, makeSelectLoading} from './state/selectors'
import {setActiveTab} from './state/actions'

const props = createStructuredSelector({
	activeTab: makeSelectActiveTab(`activeTab`),
	ticketType: makeSelectTicketParam(`type`),
	loading: makeSelectLoading(`loading`)
})

const actions = dispatch => ({tabClick: e => dispatch(setActiveTab(e))})

export default TicketDetails => connect(props, actions)(TicketDetails)

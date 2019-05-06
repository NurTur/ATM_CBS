import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'
import {setTicketId} from 'store/entities/actions'
import {makeSelectSelectedTicketId} from 'store/entities/selectors'
import {
	makeSelectNormalizedData,
	makeSelectLoading,
	makeSelectTicketTreeShow
} from './state/selectors'
import {runTreeSearchRequest} from './state/actions'

const props = createStructuredSelector({
	dataSource: makeSelectNormalizedData(),
	loading: makeSelectLoading(),
	selectedKey: makeSelectSelectedTicketId(),
	visible: makeSelectTicketTreeShow()
})
const actions = dispatch => ({
	onClick: () => dispatch(runTreeSearchRequest()),
	onSelect: keys => {
		const ids = keys.checked ? keys.checked : keys
		const ticketId = parseInt(ids.pop(), 10)
		dispatch(setTicketId(ticketId))
	}
})

export default connect(props, actions)

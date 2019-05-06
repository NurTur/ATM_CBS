import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'
import {makeSelectTicketHistory} from './state/selectors'

const props = createStructuredSelector({
	data: makeSelectTicketHistory()
})

export default connect(props)

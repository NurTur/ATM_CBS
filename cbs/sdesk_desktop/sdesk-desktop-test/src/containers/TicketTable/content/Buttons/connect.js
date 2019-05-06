import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'
import {exportTickets} from 'containers/TicketTable/state/actions'
import {makeSelectAppUser} from 'store/entities/selectors'
import {makeSelectPage} from 'containers/TicketTable/state/selectors'

const mapProps = createStructuredSelector({
	appUser: makeSelectAppUser(),
	page: makeSelectPage()
})

const mapActions = dispatch => ({
	exportTickets: data => dispatch(exportTickets(data))
})

export default Buttons => connect(mapProps, mapActions)(Buttons)

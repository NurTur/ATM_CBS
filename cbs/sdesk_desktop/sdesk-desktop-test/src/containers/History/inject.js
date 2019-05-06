import {compose} from 'redux'
import {DAEMON} from 'utils/constants'
import injectSaga from 'utils/inject-saga'
import saga from './state/saga'
import withConnect from './connect'

const withSaga = injectSaga({ticketHistory: saga}, DAEMON)
const inject = compose(
	withSaga,
	withConnect
)

export default TicketDetails => inject(TicketDetails)

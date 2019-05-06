import {compose} from 'redux'
import {DAEMON} from 'utils/constants'
import injectSaga from 'utils/inject-saga'
import historySaga from 'containers/History/state/saga'
import commentsSaga from 'containers/Comments/state/saga'
import withConnect from './connect'

const withSaga = injectSaga({
	ticketHistory: historySaga,
	ticketComments: commentsSaga
}, DAEMON)
const inject = compose(
	withSaga,
	withConnect
)

export default TicketDetails => inject(TicketDetails)

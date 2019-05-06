import {compose} from 'redux'
import injectSaga from 'utils/inject-saga'
import {DAEMON} from 'utils/constants'
import withConnect from './connect'
import saga from './state/saga'

const withSaga = injectSaga({ticketComments: saga}, DAEMON)
const inject = compose(withSaga, withConnect)

export default TicketDetails => inject(TicketDetails)

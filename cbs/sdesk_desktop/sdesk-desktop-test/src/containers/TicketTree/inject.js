import {compose} from 'redux'
import {ONCE_TILL_UNMOUNT} from 'utils/constants'
import injectSaga from 'utils/inject-saga'
import withConnect from './connect'

import saga from './state/saga'

const withSaga = injectSaga({ticketTree: saga}, ONCE_TILL_UNMOUNT)
const inject = compose(withSaga, withConnect)

export default TicketTree => inject(TicketTree)

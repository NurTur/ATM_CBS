import {compose} from 'redux'
import injectSaga from 'utils/inject-saga'
import {ONCE_TILL_UNMOUNT} from 'utils/constants'

import ticketTable from './state/saga'
import ticketsSaga from 'store/entities/saga/tickets'

const withTableSaga = injectSaga({ticketTable}, ONCE_TILL_UNMOUNT)
const withTicketsSaga = injectSaga({ticketsSaga}, ONCE_TILL_UNMOUNT)
const inject = compose(
	withTableSaga,
	withTicketsSaga
)

export default TicketTable => inject(TicketTable)

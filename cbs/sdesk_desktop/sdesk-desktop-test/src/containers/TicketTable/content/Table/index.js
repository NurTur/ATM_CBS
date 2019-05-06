import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'
import Table from './style'
import {sortData} from 'containers/TicketTable/state/actions'
import {loadData} from 'containers/TicketTree/state/actions'
import {setTicketId} from 'store/entities/actions'
import {
	makeSelectSelectedRow,
	makeSelectTickets,
	makeSelectLoading,
	makeSelectUpdate,
	makeSelectSortColumns
} from 'containers/TicketTable/state/selectors'

const props = createStructuredSelector({
	columnsList: makeSelectSortColumns(),
	dataSource: makeSelectTickets(),
	selectedRow: makeSelectSelectedRow(),
	loading: makeSelectLoading(),
	preventUpdate: makeSelectUpdate()
})

const actions = dispatch => ({
	onClickHeader: ({columnKey, order}) => {
		dispatch(sortData({columnKey, order}))
	},
	onClick: (record) => {
		dispatch(setTicketId(record.id))
		dispatch(loadData())
	}
})

export default connect(props, actions)(Table)
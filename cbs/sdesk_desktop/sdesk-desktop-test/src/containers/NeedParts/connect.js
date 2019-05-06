import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'
import {loadNeedParts, setPartStatus} from 'store/entities/actions'
import {makeSelectExpandAll} from '../TicketDetails/state/selectors'
import {makeSelectParts} from './state/selectors'
import {makeSelectPermissions} from 'store/entities/selectors'
// import {setExpandAll} from '../TicketDetails/state/actions'

const props = createStructuredSelector({
	data: makeSelectParts(),
	expanded: makeSelectExpandAll(),
	permissions: makeSelectPermissions(`needPart`)
})

const actions = dispatch => ({
	onChangeStatus: (partId, statusId) => dispatch(setPartStatus(`needParts`, partId, statusId)),
	// onExpand: () => dispatch(setExpandAll()),
	onMount: () => dispatch(loadNeedParts())
})

export default connect(props, actions)

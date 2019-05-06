import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'
import {loadGeneralParts} from 'store/entities/actions'
import {makeSelectExpandAll} from '../TicketDetails/state/selectors'
import {makeSelectParts} from './state/selectors'
import {makeSelectPermissions} from 'store/entities/selectors'
// import {setExpandAll} from '../TicketDetails/state/actions'

const props = createStructuredSelector({
	data: makeSelectParts(),
	expanded: makeSelectExpandAll(),
	permissions: makeSelectPermissions(`generalPart`)
})

const actions = dispatch => ({
	// onExpand: () => dispatch(setExpandAll()),
	onMount: () => dispatch(loadGeneralParts())
})

export default connect(props, actions)

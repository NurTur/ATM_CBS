import DropList from 'components/Table/Grouping/DropList'

import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'
import {setGrouping, setPreventUpdate, setGroupingColumnVisibility} from '../state/actions'
import {
	makeSelectGroupingValue,
	makeSelectGroupingList
} from '../state/selectors'
import toJS from 'utils/tojs'

const props = createStructuredSelector({
	value: makeSelectGroupingValue(),
	options: makeSelectGroupingList()
})

const actions = dispatch => ({
	onChange: value => {
		dispatch(setPreventUpdate(true))
		dispatch(setGrouping(value))
		const visible = Boolean(value)
		dispatch(setGroupingColumnVisibility(visible))
	}
})

export default connect(props, actions)(toJS(DropList))

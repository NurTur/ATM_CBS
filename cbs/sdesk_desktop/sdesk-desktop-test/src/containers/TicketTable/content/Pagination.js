import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'
import {makeSelectPage} from '../state/selectors'
import {setPage, setPageSize} from '../state/actions'
import Pagination from 'components/Table/Pagination'
import toJS from 'utils/tojs'

const props = createStructuredSelector({page: makeSelectPage()})

const actions = dispatch => ({
	onChangePage: value => dispatch(setPage(value)),
	onChangeSize: value => dispatch(setPageSize(value))
})

export default connect(props, actions)(toJS(Pagination))

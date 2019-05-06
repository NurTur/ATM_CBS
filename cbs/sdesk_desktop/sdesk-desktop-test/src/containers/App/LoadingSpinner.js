import LoadingSpinner from 'components/LoadingSpinner'
import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'
import {makeSelectLoading} from 'store/global/selectors'

const props = createStructuredSelector({loading: makeSelectLoading()})

export default connect(props)(LoadingSpinner)

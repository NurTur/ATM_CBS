import Layout from 'components/Layouts'
import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'
import {makeSelectLayout} from 'store/global/selectors'

const props = createStructuredSelector({position: makeSelectLayout()})

export default connect(props)(Layout)

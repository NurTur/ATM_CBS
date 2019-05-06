import {compose} from 'redux'
import {ONCE_TILL_UNMOUNT} from 'utils/constants'
import injectSaga from 'utils/inject-saga'
import saga from './saga'

const withSaga = injectSaga({app: saga}, ONCE_TILL_UNMOUNT)
const inject = compose(withSaga)

export default App => inject(App)

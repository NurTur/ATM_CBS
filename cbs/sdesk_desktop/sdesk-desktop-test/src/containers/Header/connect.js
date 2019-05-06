import {connect} from 'react-redux'

// Не забыть заменить реальными действиями !
const mockActions = {
	showSettings: () => {
		return {
			type: `showSettings`,
			payload: null
		}
	},
	showNotifications: () => {
		return {
			type: `showNotifications`,
			payload: null
		}
	}
}

const actions = dispatch => ({
	showSettings: () => dispatch(mockActions.showSettings()),
	showNotifications: () => dispatch(mockActions.showNotifications())
})

export default Header => connect(null, actions)(Header)
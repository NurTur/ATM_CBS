import React from 'react'
import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'
import {Cascader} from 'antd'
import {makeSelectDeviceOptions} from '../state/selectors'
import {loadChildrenDevices} from '../state/actions'

const mapStateToProps = createStructuredSelector({
	options: makeSelectDeviceOptions()
})

const Component = ({dispatch, ...props}) =>
	<Cascader {...props}/>

const mapActionsToProps = dispatch => ({
	loadData: ([option]) => option && dispatch(loadChildrenDevices(option))
})

export default connect(mapStateToProps, mapActionsToProps)(Component)

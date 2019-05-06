import React from 'react'
import styled from 'styled-components'
import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'
import {makeSelectAppUserName} from 'store/entities/selectors'

export const User = styled.div`
    color: #fff;
	font-size: 13px;
	margin: 10px 10px 0px 10px;
`

const UserName = ({name}) => <User>{name}</User>

const props = createStructuredSelector({name: makeSelectAppUserName()})

export default connect(props)(UserName)

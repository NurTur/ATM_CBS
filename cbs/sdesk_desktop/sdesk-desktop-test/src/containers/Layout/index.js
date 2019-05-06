import styled from 'styled-components'
import {Layout} from 'antd'

const {Header, Sider, Content} = Layout

export const StyledContent = styled(Content)`
	background-color: white;
	height: auto;
`
export const StyledHeader = styled(Header)`
	background-color: white;
	height: auto;
	margin: 0px;
	padding: 0px;
	line-height: 40px !important;
`
export const StyledSider = styled(Sider)`
	background-color: white;
`
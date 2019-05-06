import {Layout} from 'antd'
import styled from 'styled-components'

const {Sider, Content} = Layout

export const StyledLayout = styled(Layout)`
	margin: 10px;
	background: none;
	height: calc(100vh - 62px);
`

export const StyledContent = styled(Content)`
	background: #fff;
	overflow: hidden;
  height: 100%;
`

export const StyledSider = styled(Sider)`
	background: none;
	margin-left: 10px;
`

export const SiderLayout = styled(Layout)`
	background: #fff;
	height: calc(100% - 40px);
`

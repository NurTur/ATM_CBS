import {Timeline} from 'antd'
import {TimeLine} from 'components/TabPane'
import styled from 'styled-components'

export const StyledTimeline = styled(TimeLine)`
	> li > div > i {
		font-size: 18px;
		background-color: rgb(248, 248, 248);
	}
`

export const Item = Timeline.Item

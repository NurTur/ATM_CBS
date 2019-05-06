import {List} from 'antd'
import styled from 'styled-components'

export default styled(List.Item)`
	> .ant-list-item-meta {
		margin-bottom: 4px;
	}
	> ul {
		opacity: 0;
		text-align: right;
		transition: opacity .3s;
	}
	> ul li:hover {
		color: #1890ff;
	}
	&:hover {
		> ul {opacity: 1;}
	}
`

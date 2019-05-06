import {Card} from 'antd'
import styled, {css} from 'styled-components'

const active = css`
	border-color: rgb(24, 144, 255);
`

export default styled(Card)`
	border-radius: 5px;
	box-shadow: rgba(24, 144, 255, 0.2);

	${props => props.active ? active : ``}

	:hover {
		border-color: rgb(24, 144, 255);
	}

	> .ant-card-head{
		border-radius: 5px 5px 0 0;
		min-height: 40px;
	}

	> .ant-card-body {
		line-height: 20px;
		padding: 16px 24px;
		box-shadow: 0 1px 6px 0 rgba(0,0,0,0.06);
		border-radius: 0 0 5px 5px;
	}

	> * .ant-card-head-title {
		font-size: 13px;
		padding: 11px 0;
	}

	> .ant-card-actions {
		 border-top: 1px solid #d2d2d2;
		 border-radius: 0 0 5px 5px;

		 > li {
	 		margin: 11px 0;

			> span {
				width: 100%;
				height: 100%
			}
	 	}
	}

`

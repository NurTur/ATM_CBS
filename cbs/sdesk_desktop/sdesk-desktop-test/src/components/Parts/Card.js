import {Card} from 'antd'
import styled, {keyframes} from 'styled-components'

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`
export default styled(Card)`
	margin-bottom: 10px;
	animation: 1s ${fadeIn} ease-out;

	> div .ant-card-head {
		padding: 0 15px;
	}
	> div .ant-card-body {
		padding: 15px;
	}
`

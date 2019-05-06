import React from 'react'
import {Select} from 'antd'
import styled, {css} from 'styled-components'

const Option = Select.Option

const colored = color => css`
	&::before {
		content: "";
		z-index: 1;
		border-right: 3px solid ${color};
		bottom: 0;
		left: 0;
		position: absolute;
		top: 0;
	}
`
const StyledSelect = styled(Select)`
	width: ${props => props.width || `120px`};
	${({color}) => color && colored(color)};
`

const loop = options => options.map(({value, label}) =>
	<Option key={value} value={value}>{label}</Option>
)

export default ({options, ...props}) =>
	<StyledSelect {...props}>
		{loop(options)}
	</StyledSelect>

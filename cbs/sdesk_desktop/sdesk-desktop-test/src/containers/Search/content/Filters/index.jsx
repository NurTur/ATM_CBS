import React from 'react'
import Picker from 'containers/DataPicker'
import {Button} from 'antd'
import Wrapper from './content/Wrapper'
import Line from './content/Line'
import Selects from './connect-selects'
import settings from './settings'
import styled from 'styled-components'

const StyledButton = styled(Button)`
	float: left;
	height: 32px;
	margin: 21px 20px 10px 0px;
`

const getPicker = name => {
	const props = {name, ...Selects[name], ...settings[name]}
	return Picker(props)
}

const DataPickers = ({filters, runSearch}) =>
	<Wrapper>
		{filters
			.map((filter, filterName) => getPicker(filterName))
			.toIndexedSeq()
			.toArray()
		}
		{filters.count()
			? <StyledButton icon="search" onClick={runSearch}>Найти</StyledButton>
			: null
		}
		<Line/>
	</Wrapper>

export default DataPickers

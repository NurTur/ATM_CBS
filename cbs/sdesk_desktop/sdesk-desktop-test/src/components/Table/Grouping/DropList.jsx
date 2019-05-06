import React from 'react'
import Wrapper from './Wrapper'
import DropList from 'components/DropList'
import groupIcon from './grouping-icon.png'

const Grouping = ({value, options, onChange}) =>
	<Wrapper>
		<img src={groupIcon}/>
		<DropList
			allowClear
			onChange={onChange}
			options={options}
			placeholder="Группировка"
			showSearch
			style={{marginRight: 0}}
			value={value}
			width="160px"
		/>
	</Wrapper>

export default Grouping

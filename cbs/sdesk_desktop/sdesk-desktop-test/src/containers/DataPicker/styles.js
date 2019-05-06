import styled from 'styled-components'
import {Steps} from 'antd'
import ReferenceSelect from './content/ReferenceSelect'
import {DateSelect, RangeSelect} from './content/DateSelect'

const defaultStyle = `
	min-width: 300px;
	width: auto;
	max-width: 600px;
`

export const StyledReferenceSelect = styled(ReferenceSelect)`
	${defaultStyle}
`
export const StyledDateSelect = styled(DateSelect)`
	${defaultStyle}
`
export const StyledRangeSelect = styled(RangeSelect)`
	${defaultStyle}
`

export const Step = Steps.Step
export const StyledSteps = styled(Steps)`
`

import React from 'react'
import styled, {css} from 'styled-components'

const expanded = css`
	height: ${props => props.height}px;
	opacity: 1;
`
const collapsed = css`
	height: 0;
	opacity: 0;
`

export default styled(({_ref, visible, ...rest}) => <div ref={_ref} {...rest}/>)`
	margin-left: 20px;
	overflow-y: hidden;
	transition: all .5s;
	${props => props.visible ? expanded : collapsed}
`

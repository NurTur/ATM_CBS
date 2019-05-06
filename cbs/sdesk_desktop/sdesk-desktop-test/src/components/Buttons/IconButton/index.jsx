import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import StyledButton from 'components/Buttons/StyledButton'

const Image = styled.img`
		width: auto;
`

function IconButton(props) {
	const {icon, text, ...newProps} = props
	const MyImage = () => icon ? <Image src={icon} /> : null
	const Span = () => text ? <span>{text}</span> : null

	return (
		<StyledButton {... newProps}>
			<MyImage />
			<Span />
		</StyledButton>
	)
}

IconButton.propTypes = {
	icon: PropTypes.any,
	text: PropTypes.string
}

export default IconButton

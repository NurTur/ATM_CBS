import React from 'react'
import PropTypes from 'prop-types'
import StyledButton from 'components/Buttons/StyledButton'

function TextButton(props) {
	const {text, ...newProps} = props
	// const Span = () => text ? <span>{text}</span> : null
	return (
		<StyledButton {... newProps} className={props.className}>
			{/* <Span /> */}{text}
		</StyledButton>
	)
}

TextButton.propTypes = {text: PropTypes.string}

export default TextButton

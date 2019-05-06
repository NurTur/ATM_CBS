import React from 'react'
import {Button, Modal, Checkbox, Divider, Input} from 'antd'
import styled from 'styled-components'
import {reportOptions} from 'containers/TicketTable/state/constants'

const CheckboxGroup = Checkbox.Group
const StyledCheckboxGroup = styled(CheckboxGroup)`
	> label {
		display: block;
	}
`
const StyledDivider = styled(Divider)`
	margin: 10px 0 5px;
`
const plainOptions = reportOptions.reduce((result, option) => {
	result.push(option.value)
	return result
}, [])

const ErrorInput = styled(Input)`
	:active, :hover {
		border-color: #f5222d;
	}
	:focus {
		border-color: #f5222d;
		-webkit-box-shadow: 0 0 0 2px rgba(245, 34, 45, 0.2);
		box-shadow: 0 0 0 2px rgba(245, 34, 45, 0.2);
	}
`

function validateEmail(email) {
	var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	return re.test(String(email).toLowerCase())
}

export default class ButtonExport extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			visible: false,
			options: reportOptions,
			value: [],
			checkAll: false,
			email: this.props.email,
			correct: true
		}

		this.onClick = this.onClick.bind(this)
		this.handleOk = this.handleOk.bind(this)
		this.handleCancel = this.handleCancel.bind(this)
		this.onChange = this.onChange.bind(this)
		this.clearModal = this.clearModal.bind(this)
		this.onCheckAllChange = this.onCheckAllChange.bind(this)
		this.mailChange = this.mailChange.bind(this)
		this.onBlur = this.onBlur.bind(this)
	}
	onClick() {
		this.setState({visible: true})
	}
	handleOk() {
		if (validateEmail(this.state.email)) {
			this.props.onClick({
				additionalFields: this.state.value,
				email: this.state.email
			})
			this.clearModal()
		}
	}
	handleCancel() {
		this.clearModal()
	}
	onChange(value) {
		this.setState({
			value,
			checkAll: value.length === plainOptions.length
		})
	}
	clearModal() {
		this.setState({
			visible: false,
			value: [],
			checkAll: false,
			correct: true
		})
	}
	onCheckAllChange(e) {
		this.setState({
			value: e.target.checked ? plainOptions : [],
			checkAll: e.target.checked
		})
	}
	mailChange(e) {
		this.setState({email: e.target.value})
	}
	onBlur() {
		this.setState({correct: validateEmail(this.state.email)})
	}
	render() {
		const {onClick, ...props} = this.props
		const Component = this.state.correct ? Input : ErrorInput

		return [<Button key="button" {...props} onClick={this.onClick}/>,
			<Modal
				key="modal"
				title="Дополнительные поля для экспорта"
				visible={this.state.visible}
				onOk={this.handleOk}
				onCancel={this.handleCancel}
			>
				<Component
					autoFocus={!this.state.correct}
					addonBefore="eMail"
					defaultValue={this.state.email}
					onChange={this.mailChange}
					onBlur={this.onBlur}
					placeholder="Введите адрес получателя"
				/>
				<StyledDivider/>
				<Checkbox
					onChange={this.onCheckAllChange}
					checked={this.state.checkAll}
				>
					Все
				</Checkbox>
				<StyledDivider/>
				<StyledCheckboxGroup
					options={this.state.options}
					onChange={this.onChange}
					value={this.state.value}
				/>
			</Modal>
		]
	}
}

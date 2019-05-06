import React from 'react'
import Form from './Form'
import connect from './connect'

const prepareData = data => {
	const id = data.deviceId
	return id && Array.isArray(id)
		? {
			deviceId: id[id.length - 1],
			text: data.text
		}
		: data
}

class CommentModal extends React.PureComponent {
	constructor(props) {
		super(props)

		this.state = this.props.action === `edit`
			? {
				title: `Редактирование комментария`,
				action: this.props.editComment,
				okText: `Изменить`,
				comment: {
					device: this.props.comment.device,
					text: this.props.comment.text
				}
			}
			: {
				title: `Добавление комментария`,
				action: this.props.postComment,
				okText: `Добавить`,
				comment: {
					device: null,
					text: null
				}
			}
		this.handleOk = this.handleOk.bind(this)
	}
	handleOk() {
		const form = this.form

		form.validateFields((err, values) => {
			if (err) {
				return
			}

			const payload = prepareData(values)
			if (this.props.action === `edit`) {
				payload.id = this.props.comment.id
			}

			this.state.action(payload)
			this.props.callback()
		})
	}

	saveFormRef = (form) => {
		this.form = form
	}

	render() {
		return (
			<Form
				userRole={this.props.userRole}
				ref={this.saveFormRef}
				onCancel={this.props.callback}
				onOk={this.handleOk}
				title={this.state.title}
				comment={this.state.comment}
				okText={this.state.okText}
			/>
		)
	}
}

export default connect(CommentModal)

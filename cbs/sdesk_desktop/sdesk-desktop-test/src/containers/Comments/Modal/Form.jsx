import React from 'react'
import {Form, Modal, Input} from 'antd'
import Cascader from './Cascader'

const FormItem = Form.Item
const {TextArea} = Input

export default Form.create()(
	(props) => {
		const {onCancel, onOk, form, comment, userRole} = props
		const {getFieldDecorator} = form

		const parentDevice = comment.device && comment.device.get(`parent`)
		const commentDevice = comment.device

		let initialValue = null
		if (commentDevice) {
			initialValue = parentDevice && [parentDevice.get(`id`)] || []
			initialValue.push(commentDevice.get(`id`))
		}

		return (
			<Modal
				visible={true}
				title={props.title}
				okText={props.okText}
				onCancel={onCancel}
				onOk={onOk}
			>
				<Form layout="vertical">
					{userRole < 5 ? <FormItem label="Устройство">
						{getFieldDecorator(`deviceId`, {
							initialValue,
							rules: [{
								required: true // Скрываем выбор устройства для координаторов
							}]
						})(
							<Cascader	/>
						)}
					</FormItem> : null}
					<FormItem
						label="Комментарий"
						className="collection-create-form_last-form-item"
					>
						{getFieldDecorator(`text`, {
							initialValue: comment.text,
							rules: [{
								required: true,
								min: 3,
								message: `Введите комментарий`
							}]
						})(
							<TextArea rows={4}
								placeholder="Введите текст комментария"
							/>
						)}
					</FormItem>
				</Form>
			</Modal>
		)
	}
)

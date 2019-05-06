import React from 'react'
import {Modal, Button} from 'antd'
import {StyledSteps, Step} from 'containers/DataPicker/styles'
import Vendor from './Vendor'
import connect, {getComponent} from './connect'

const TypeModel = getComponent(`typeModel`)

class TypeModelSelect extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			visible: false,
			step: 0,
			vendor: {key: ``, label: ``},
		}
		this.showModal = this.showModal.bind(this)
		this.searchReference = this.searchReference.bind(this)
		this.vendorChange = this.vendorChange.bind(this)
		this.modelSearch = this.modelSearch.bind(this)
		this.handleCancel = this.handleCancel.bind(this)
		this.handleOk = this.handleOk.bind(this)
	}
	showModal() {
		this.setState({
			visible: true
		})
	}
	handleOk() {
		this.setState({
			visible: false
		})
	}
	handleCancel() {
		this.setState({
			visible: false
		})
	}
	vendorChange(obj) {
		this.setState({vendor: obj, step: 1})
		this.props.setPickerData && this.props.setPickerData(`typeModel`, null)
	}
	modelSearch(value) {
		return this.state.vendor.key !== `` && value && value !== []
			? this.searchReference(`typeModel`, {
				vendorId: this.state.vendor.key,
				name: value
			})
			: null
	}
	searchReference(name, value, postProcessingAction) {
		this.props.searchReference && this.props.searchReference(name, value, postProcessingAction)
	}
	render() {
		return [
			<TypeModel
				{...this.props}
				name="TypeModel"
				key="type-model"
				onChange={this.props.onChange}
				prefix={`${this.state.vendor.label}\\`}
			/>,
			<Button icon="search" key="button" onClick={this.showModal}/>,
			<Modal
				key="modal"
				title="Подготовка тип-моделей"
				visible={this.state.visible}
				onOk={this.handleOk}
				onCancel={this.handleCancel}
				footer={null}
				width="700px"
			>
				<StyledSteps
					current={this.state.step}
					direction="vertical"
					size="small"
				>
					<Step
						title="Выбор вендора"
						description={
							<Vendor
								defaultValue={this.state.vendor}
								name="Vendor"
								labelInValue={true}
								showSearch={true}
								onChange={this.vendorChange}
							/>
						}/>
					<Step
						title="Выбор тип-модели"
						description={
							<TypeModel
								{...this.props}
								name="TypeModel"
								disabled={this.state.step === 0}
								onSearch={this.modelSearch}
								onChange={this.props.onChange}
								prefix={`${this.state.vendor.label}\\`}
							/>
						}/>
				</StyledSteps>
			</Modal>
		]
	}
}

export default connect(TypeModelSelect)
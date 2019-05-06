import React from 'react'
import {Modal, Button} from 'antd'
import {StyledSteps, Step} from 'containers/DataPicker/styles'
import Vendor from './Vendor'
import connect, {getComponent} from './connect'

const MalfunctionReasonParent = getComponent(`malfunctionReasonParent`)
const MalfunctionReason = getComponent(`malfunctionReason`)

const checkDuplicateValue = (malfunctions, item) => {
	const filtered = malfunctions.filter(malfunction => malfunction.key === item.key)
	return filtered.length === 0 ? [...malfunctions, item] : malfunctions
}

class Malfunction extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			visible: false,
			step: 0,
			vendor: {key: ``, label: ``},
			parent: {key: ``, label: ``},
			compositLabel: ``
		}
		this.showModal = this.showModal.bind(this)
		this.searchReference = this.searchReference.bind(this)
		this.vendorChange = this.vendorChange.bind(this)
		this.parentChange = this.parentChange.bind(this)
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
	searchReference(name, value, postProcessingAction) {
		this.props.searchReference && this.props.searchReference(name, value, postProcessingAction)
	}
	vendorChange(obj) {
		this.setState({vendor: obj, step: 1, parent: {key: ``, label: ``}})
		return this.searchReference(`malfunctionReasonParent`, obj.key)
	}
	parentChange({key, label = ``}) {
		const vendorLabel = this.state.vendor ? `${this.state.vendor.label}\\` : ``
		const compositLabal = `${vendorLabel}${label}`
		const compositValue = {key, label: compositLabal}
		const noChildValue = Array.isArray(this.props.value)
			? checkDuplicateValue(this.props.value, compositValue)
			: compositValue
		this.setState({parent: {key, label}, compositLabal, step: 2})
		return this.searchReference(
			`malfunctionReason`,
			key,
			{noChildAction: this.props.onChange, noChildValue})
	}
	render() {
		return [
			<MalfunctionReason
				{...this.props}
				name="MalfunctionReason"
				key="malfunction"
				onChange={this.props.onChange}
				prefix={`${this.state.compositLabal}\\`}
			/>,
			<Button icon="search" key="button" onClick={this.showModal}/>,
			<Modal
				key="modal"
				title="Подготовка причин неисправности"
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
						title="Выбор причины"
						description={
							<MalfunctionReasonParent
								defaultValue={this.state.parent}
								name="MalfunctionReasonParent"
								labelInValue={true}
								showSearch={true}
								onChange={this.parentChange}
							/>
						}/>
					<Step
						title="Выбор подпричины"
						description={
							<MalfunctionReason
								{...this.props}
								name="MalfunctionReason"
								onChange={this.props.onChange}
								prefix={`${this.state.compositLabal}\\`}
							/>
						}/>
				</StyledSteps>
			</Modal>
		]
	}
}

export default connect(Malfunction)
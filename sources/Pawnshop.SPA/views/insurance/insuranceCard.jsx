import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import InsuranceForm from './insuranceForm';
import Restrict from '../controls/restrict';
import permissions from '../../engine/permissions';
import { card as cardLoad, save as cardSave } from '../../actions/insurances';

class InsuranceCard extends React.Component {
    constructor(props, context, queue) {
        super(props, context, queue);
    }

    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    componentWillMount = () => {
        this.onLoad(this.props.params.id);
    };

    onLoad = id => this.props.cardLoad(id);
    onSave = model => this.props.cardSave(model).then(action => {
        if (action && action.data) {
            this.context.router.push(`/insurances/${action.data.id}`);
        }
    });

    render() {
        if (!this.props.card) return <div></div>;

        return (
            <div>
                <Restrict permissions={permissions.InsuranceManage} pass>
                    <InsuranceForm onSubmit={e => this.onSave(e)} initialValues={this.props.card} enableReinitialize
                                   status={this.props.card.status} id={this.props.params.id} />
                </Restrict>
            </div>
        );
    }
}

export default connect(state => {
    const { insurance } = state;

    return {
        card: insurance.card
    }
}, { cardLoad, cardSave })(InsuranceCard);
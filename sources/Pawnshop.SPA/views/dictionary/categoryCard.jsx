import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import CategoryForm, { selector } from './categoryForm';

import { card as cardLoad, save as cardSave } from '../../actions/categories';

import Restrict from '../controls/restrict';
import permissions from '../../engine/permissions';

class CategoryCard extends React.Component {
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
    onSave = category =>
        this.props
            .cardSave(category)
            .then(action => {
                if (action && action.data) {
                    this.context.router.push(`/categories/${action.data.id}`);
                }
            });

    render = () => {
        if (!this.props.card) return <div></div>;
        return (
            <Restrict permissions={permissions.CategoryManage} pass>
                <CategoryForm onSubmit={this.onSave} initialValues={this.props.card} enableReinitialize />
            </Restrict>
        );
    };
}

export default connect(state => {
    const { workspace } = state;
    return {
        card: workspace.card,
    }
}, { cardLoad, cardSave })(CategoryCard);
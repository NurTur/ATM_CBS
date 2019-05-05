import React from 'react';

export default class Container extends React.Component {
    render() {
        return (
            <div>
                {!!this.props.children ? this.props.children : "This container is empty!"}
            </div>
        );
    }
}
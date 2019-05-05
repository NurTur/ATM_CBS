import React from 'react';

export default class WorkspaceContainer extends React.Component {
    render() {
        return (
            <div>
                <div className="panel panel-default">
                    {!!this.props.children ? this.props.children : "This container is empty!"}
                </div>
            </div>
        );
    }
}
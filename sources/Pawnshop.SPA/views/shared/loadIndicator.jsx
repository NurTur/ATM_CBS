import React from 'react';

export default class LoadIndicator extends React.Component {
    static propTypes = {
        inProgress: React.PropTypes.bool.isRequired
    };
    static defaultProps = {
        inProgress: false
    };

    render() {
        if (!this.props.inProgress) return <div></div>;
        return (
            <div className="loadIndicator load8">
                <div className="outer">
                    <div className="middle">
                        <div className="inner">
                            <div className="loader"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
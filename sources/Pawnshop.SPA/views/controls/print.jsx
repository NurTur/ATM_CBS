import React, { PropTypes } from 'react';

export default class Print extends React.Component {
    render = () => {
        return (
            <html>
            <head>
                <meta name="viewport" content="width=device-width"/>
                <meta charSet="UTF-8" />
                <title>{this.props.title || 'Печать'}</title>
                <style>{' \
                    @media print { \
                        @page { \
                            size: letter ' + this.props.orientation || 'portrait' + '; \
                            margin: 1.0cm \
                        } \
                    } \
                '}</style>
            </head>
            <body style={{marginTop:0}}>
                {this.props.children}
            </body>
            </html>            
        );
    };
}
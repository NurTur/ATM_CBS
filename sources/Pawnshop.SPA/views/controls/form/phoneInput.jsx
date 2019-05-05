import React from 'react';
import InputMask from 'react-input-mask';

export default class PhoneInput extends React.Component {
    render() {
        let { input } = this.props;

        return <InputMask mask={'+7 (000) 000 00 00'} formatChars={{
            '0': '[0-9]'
        }} {...input} {...this.props} />;
    }
}

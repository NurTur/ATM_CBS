import React from 'react';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import InputMask from 'react-input-mask';

export default class DateInput extends React.Component {
    _value = undefined;

    _getValue() {
        let { input, value } = this.props;
        if (input) {
            value = input.value;
        }
        if (value) {
            value = moment(value).startOf('day');
        }
        if (value === undefined) {
            value = this._value;
        }
        return value;
    }

    _setValue(value) {
        let { input, onChange, onAfterChange } = this.props;
        if (input) {
            onChange = input.onChange;
        }
        if (value) {
            value = moment(value).startOf('day');
        }
        if (onChange)
        {
            onChange(value);
        }
        // todo obsolete
        if (onAfterChange) {
            onAfterChange(value);
        }
        this._value = value;
    }

    render() {
        let { disabled, readOnly, className, placeholder } = this.props;

        return <DatePicker showMonthDropdown showYearDropdown selected={this._getValue()} onChange={e => this._setValue(e)}
                           disabled={disabled || readOnly} className={className} placeholderText={placeholder}
                           customInput={<DateInputMask />} />
    }
}

class DateInputMask extends React.Component {
    render() {
        const mask = moment.localeData().longDateFormat('L');

        return <InputMask mask={mask} formatChars={{
                            'D': '[0-9]',
                            'M': '[0-9]',
                            'Y': '[0-9]'
                          }} {...this.props} />;
    }
}
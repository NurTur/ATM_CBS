import React from 'react';
import { reduxForm, Field, formValueSelector } from 'redux-form';

class LoanPercentForm extends React.Component {
    render = () => {
        let { readOnly } = this.props;
        return (
            <form onSubmit={this.props.handleSubmit} className="form-horizontal">
                <div className="panel-body">
                    <fieldset className="form-group" disabled={readOnly}>
                        <label htmlFor="branchId" className="col-sm-2">Филиал</label>
                        <div className="col-sm-10">
                            <Field name="branchId" component="select" className="form-control">
                                {this.props.auth.profile.branches.map(b =>
                                    <option value={b.id}>{b.displayName}</option>
                                )}
                            </Field>
                        </div>
                    </fieldset>
                    <fieldset className="form-group" disabled={readOnly}>
                        <label htmlFor="collateralType" className="col-sm-2">Вид залога</label>
                        <div className="col-sm-4">
                            <Field name="collateralType" component="select" className="form-control">
                                <option value="0">Все</option>
                                <option value="10">Золото</option>
                                <option value="20">Автотранспорт</option>
                                <option value="30">Товар</option>
                                <option value="40">Спецтехника</option>
                            </Field>
                        </div>
                        <label htmlFor="cardType" className="col-sm-2">Тип карты</label>
                        <div className="col-sm-4">
                            <Field name="cardType" component="select" className="form-control">
                                <option value="0">Все</option>
                                <option value="10">Standard</option>
                                <option value="20">Bronze</option>
                                <option value="30">Silver</option>
                                <option value="40">Gold</option>
                                <option value="50">Platinum</option>
                            </Field>
                        </div>
                    </fieldset>
                    <fieldset className="form-group" disabled={readOnly}>
                        <label htmlFor="loanCostFrom" className="col-sm-2">Ссуда от</label>
                        <div className="col-sm-4">
                            <Field name="loanCostFrom" component="input" type="number" min="0" max="100000000" className="form-control" />
                        </div>
                        <label htmlFor="loanCostTo" className="col-sm-2">Ссуда до</label>
                        <div className="col-sm-4">
                            <Field name="loanCostTo" component="input" type="number" min="0" max="100000000" className="form-control" />
                        </div>
                    </fieldset>
                    <fieldset className="form-group" disabled={readOnly}>
                        <label htmlFor="loanPeriod" className="col-sm-2">Срок залога</label>
                        <div className="col-sm-4">
                            <Field name="loanPeriod" component="input" type="number" min="0" max="730" className="form-control" />
                        </div>
                        <label htmlFor="minLoanPeriod" className="col-sm-2">Мин срок залога</label>
                        <div className="col-sm-4">
                            <Field name="minLoanPeriod" component="input" type="number" min="0" max="730" className="form-control" />
                        </div>
                    </fieldset>
                    <fieldset className="form-group" disabled={readOnly}>
                        <label htmlFor="loanPercent" className="col-sm-2">% кредита</label>
                        <div className="col-sm-4">
                            <Field name="loanPercent" component="input" type="number" min="0" max="100" step="0.0001" className="form-control" />
                        </div>                    
                        <label htmlFor="penaltyPercent" className="col-sm-2">% штрафа</label>
                        <div className="col-sm-4">
                            <Field name="penaltyPercent" component="input" type="number" min="0" max="100" step="0.0001" className="form-control" />
                        </div>
                    </fieldset>
                </div>
                    <div className="panel-footer">
                        <button type="button" className="btn btn-warning" onClick={() => history.back()}>Назад</button>
                        {readOnly ||
                            <button type="submit" className="btn btn-primary">Сохранить</button>
                        }
                    </div>
            </form>
        );
    }
}

export default reduxForm({
    form: 'LoanPercentForm'
})(LoanPercentForm);

export const selector = formValueSelector('LoanPercentForm');
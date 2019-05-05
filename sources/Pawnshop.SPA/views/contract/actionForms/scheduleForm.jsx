import React from 'react';
import moment from 'moment';
import calculator from '../../../engine/scheduleCalculator';

export default class ScheduleForm extends React.Component {
    static contextTypes = {
        store: React.PropTypes.object.isRequired
    };

    render() {
        let data = this.props.initialValues;
        if (!data) return <div></div>;

        let schedule = calculator.buildSchedule(data.contractDate, data.maturityDate, data.loanCost, data.loanPercent);
        let total = calculator.totalSchedule(data.contractDate, data.maturityDate, data.loanCost, data.loanPercent);
        let contractDate = moment(data.contractDate).startOf('day');
        let maturityDate = moment(data.maturityDate).startOf('day');
        let monthCount = Math.round(maturityDate.diff(contractDate, 'months', true));

        return (
            <form>
                <div className="row form-group">
                    <div className="col-sm-3">
                        <strong>Сумма займа</strong>
                    </div>
                    <div className="col-sm-9">
                        <span>{data.loanCost} тенге</span>
                    </div>
                </div>
                <div className="row form-group">
                    <div className="col-sm-3">
                        <strong>Ставка</strong>
                    </div>
                    <div className="col-sm-9">
                        <span>{(data.loanPercent * 30 * 12).toFixed(1)}% годовых</span>
                    </div>
                </div>
                <div className="row form-group">
                    <div className="col-sm-3">
                        <strong>Срок</strong>
                    </div>
                    <div className="col-sm-9">
                        <span>{monthCount} мес.</span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-12">
                        <table className="table table-bordered" style={{tableLayout:'fixed',width:'100%'}}>
                            <thead>
                                <tr>
                                    <th className="text-center">№</th>
                                    <th className="text-center">Дата</th>
                                    <th className="text-center">Платеж</th>
                                    <th className="text-center">Погашение процентов</th>
                                    <th className="text-center">Погашение основного долга</th>
                                    <th className="text-center">Остаток основного долга</th>
                                </tr>
                            </thead>
                            <tbody>
                                {schedule.map((item, index) => (
                                    <tr key={index} className="text-right">
                                        <td>{index + 1}</td>
                                        <td>{moment(item.date).format('L')}</td>
                                        <td>{item.cost.toLocaleString('ru')}</td>
                                        <td>{item.percent.toLocaleString('ru')}</td>
                                        <td>{item.debt.toLocaleString('ru')}</td>
                                        <td>{item.loan.toLocaleString('ru')}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr className="text-right">
                                    <td></td>
                                    <td></td>
                                    <td><strong>{total.cost.toLocaleString('ru')}</strong></td>
                                    <td><strong>{total.percent.toLocaleString('ru')}</strong></td>
                                    <td><strong>{total.debt.toLocaleString('ru')}</strong></td>
                                    <td></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </form>
        );
    }
}
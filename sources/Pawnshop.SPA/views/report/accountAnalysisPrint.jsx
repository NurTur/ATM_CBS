import React, { PropTypes } from 'react';
import Print from '../controls/print';
import moment from 'moment';

export default class AccountAnalysisPrint extends React.Component {
    render = () => {
        return (
            <Print title="Анализ счета" orientation="landscape">
                <table style={{tableLayout:'fixed', width:'100%', margin:'0px auto'}}>
                    <tbody>
                        <tr>
                            <td colSpan="12" style={{textAlign:'center'}}><strong>АНАЛИЗ СЧЕТА {this.props.data.accountCode}</strong></td>
                        </tr>
                        <tr>
                            <td colSpan="6" style={{textAlign:'center'}}><strong>с {moment(this.props.data.beginDate).format('L')}</strong></td>
                            <td colSpan="6" style={{textAlign:'center'}}><strong>по {moment(this.props.data.endDate).format('L')}</strong></td>
                        </tr>
                        <tr>
                            <td colSpan="12"><strong>Филиал {this.props.data.branchName}</strong></td>
                        </tr>
                        <tr>
                            <td colSpan="12">
                                <table style={{
                                    border:'1px solid black',
                                    borderCollapse:'collapse',
                                    tableLayout:'fixed',
                                    width:'100%',
                                    margin:'0px auto',
                                    textAlign:'center',
                                    fontSize:'x-small'
                                }}>
                                    <thead>
                                        <tr>
                                            <td colSpan="6" style={{border:'1px solid black'}}>Наименование счета</td>
                                            <td style={{border:'1px solid black'}}>Счет</td>
                                            <td style={{border:'1px solid black'}}>С кредита счетов</td>
                                            <td style={{border:'1px solid black'}}>В дебет счетов</td>
                                        </tr>
                                        <tr>
                                            <td colSpan="6" style={{border:'1px solid black'}}>Остаток на начало периода</td>
                                            <td style={{border:'1px solid black'}}></td>
                                            <td style={{border:'1px solid black'}}>{this.props.data.group.CashBeginPeriod && this.props.data.group.CashBeginPeriod.toLocaleString('ru') || null}</td>
                                            <td style={{border:'1px solid black'}}></td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.props.data.list.map((item, i) => {
                                            return (
                                                <tr key={i}>
                                                    <td colSpan="6" style={{border:'1px solid black', textAlign:'left'}}>{item.AccountName}</td>
                                                    <td style={{border:'1px solid black'}}>{item.AccountCode}</td>
                                                    <td style={{border:'1px solid black'}}>{item.FromCredit && item.FromCredit.toLocaleString('ru') || null}</td>
                                                    <td style={{border:'1px solid black'}}>{item.ToDebit && item.ToDebit.toLocaleString('ru') || null}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <td colSpan="6" style={{border:'1px solid black', textAlign:'left'}}>Обороты за период</td>
                                            <td style={{border:'1px solid black'}}></td>
                                            <td style={{border:'1px solid black'}}>{this.props.data.total.fromCredit && this.props.data.total.fromCredit.toLocaleString('ru') || null}</td>
                                            <td style={{border:'1px solid black'}}>{this.props.data.total.toDebit && this.props.data.total.toDebit.toLocaleString('ru') || null}</td>
                                        </tr>
                                        <tr>
                                            <td colSpan="6" style={{border:'1px solid black', textAlign:'left'}}>Остаток на конец периода</td>
                                            <td style={{border:'1px solid black'}}></td>
                                            <td style={{border:'1px solid black'}}>{this.props.data.group.CashEndPeriod && this.props.data.group.CashEndPeriod.toLocaleString('ru') || null}</td>
                                            <td style={{border:'1px solid black'}}></td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </Print>
        );
    };
}
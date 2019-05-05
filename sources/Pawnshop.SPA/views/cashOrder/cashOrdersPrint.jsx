import React, { PropTypes } from 'react';
import Print from '../controls/print';
import moment from 'moment';

export default class CashOrdersPrint extends React.Component {
    render = () => {
        return (
            <Print title="Реестр кассовых ордеров" orientation="landscape">
                <table style={{tableLayout:'fixed', width:1200, margin:'0px auto'}}>
                    <tbody>
                        <tr>
                            <td colSpan="12"><strong>{this.props.auth.configuration.legalSettings.legalName}</strong></td>
                        </tr>
                        <tr>
                            <td colSpan="12" style={{textAlign:'center'}}><h3>Реестр кассовых ордеров</h3></td>
                        </tr>
                        <tr>
                            <td style={{paddingTop:20}}></td>
                        </tr>
                        <tr>
                            <td colSpan="12">
                                <table style={{
                                    border:'1px solid black',
                                    borderCollapse:'collapse',
                                    tableLayout:'fixed',
                                    width:'100%',
                                    margin:'0px auto',
                                    textAlign:'center'
                                }}>
                                    <thead>
                                        <tr>
                                            <td style={{border:'1px solid black'}}>Вид</td>
                                            <td style={{border:'1px solid black'}}>№</td>
                                            <td style={{border:'1px solid black'}}>Дата</td>
                                            <td style={{border:'1px solid black', width:'20%'}}>Основание</td>
                                            <td style={{border:'1px solid black', width:'15%'}}>Примечание</td>
                                            <td style={{border:'1px solid black'}}>Сумма</td>
                                            <td style={{border:'1px solid black'}}>Дебет</td>
                                            <td style={{border:'1px solid black'}}>Кредит</td>
                                            <td style={{border:'1px solid black'}}>Клиент</td>
                                            <td style={{border:'1px solid black'}}>Филиал</td>
                                            <td style={{border:'1px solid black'}}>Автор</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.props.data.list.map((item, i) => {
                                            return (
                                                <tr key={i}>
                                                    <td style={{border:'1px solid black'}}>{item.orderType == 10 && <span>Приход</span> ||
                                                        item.orderType == 20 && <span>Расход</span>}</td>
                                                    <td style={{border:'1px solid black'}}>{item.orderNumber}</td>
                                                    <td style={{border:'1px solid black'}}>{moment(item.orderDate).format('L')}</td>
                                                    <td style={{border:'1px solid black', textAlign:'left'}}>{item.reason}</td>
                                                    <td style={{border:'1px solid black', textAlign:'left'}}>{item.note}</td>
                                                    <td style={{border:'1px solid black'}}>{item.orderCost}</td>
                                                    <td style={{border:'1px solid black'}}>{item.debitAccount.code}</td>
                                                    <td style={{border:'1px solid black'}}>{item.creditAccount.code}</td>
                                                    <td style={{border:'1px solid black', textAlign:'left'}}>{item.clientName}</td>
                                                    <td style={{border:'1px solid black'}}>{item.branch.displayName}</td>
                                                    <td style={{border:'1px solid black', textAlign:'left'}}>{item.author.fullname}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </Print>
        );
    };
}
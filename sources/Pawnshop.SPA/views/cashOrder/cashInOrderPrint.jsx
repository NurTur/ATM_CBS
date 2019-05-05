import React, { PropTypes } from 'react';
import Print from '../controls/print';
import moment from 'moment';
import nums from '../../engine/nums';

export default class CashInOrderPrint extends React.Component {
    render = () => {
        return (
            <Print title="Приходный кассовый ордер" orientation="portrait">
                <table style={{tableLayout:'fixed', width:'90%', margin:'0px auto'}}>
                    <tbody>
                        <tr>
                            <td colSpan="7" style={{paddingRight:10, borderRight:'1px solid black'}}>
                                <table style={{tableLayout:'fixed', width:'100%', margin:'0px auto', fontSize:'x-small'}}>
                                    <tbody>
                                        <tr>
                                            <td colSpan="12">
                                                <em>Организация (индивидуальный предприниматель)</em>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colSpan="12">
                                                <strong><u>{this.props.auth.configuration.legalSettings.legalName}</u></strong>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colSpan="12" style={{textAlign:'right'}}>
                                                <em>Приложение 1</em><br />
                                                <em>к приказу Министра финансов Республики Казахстан</em><br />
                                                <em>от 20 декабря 2012 года № 562</em><br />
                                                <em>Форма № КО-1</em>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{paddingTop:10}}></td>
                                        </tr>
                                        <tr>
                                            <td colSpan="7"></td>
                                            <td colSpan="2" style={{textAlign:'right', paddingRight:10}}>
                                                ИИН/БИН 
                                            </td>
                                            <td colSpan="3" style={{border:'1px solid black'}}>
                                                {this.props.data.identityNumber}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{paddingTop:10}}></td>
                                        </tr>
                                        <tr>
                                            <td colSpan="6">
                                                <strong>ПРИХОДНЫЙ КАССОВЫЙ ОРДЕР</strong>
                                            </td>
                                            <td colSpan="6">
                                                <table style={{
                                                    border:'1px solid black',
                                                    borderCollapse:'collapse',
                                                    tableLayout:'fixed',
                                                    width:'100%',
                                                    margin:'0px auto',
                                                    textAlign:'center',
                                                    fontSize:'small'
                                                }}>
                                                    <thead>
                                                        <tr>
                                                            <td style={{border:'1px solid black'}}>Номер документа</td>
                                                            <td style={{border:'1px solid black'}}>Дата составления</td>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td style={{border:'1px solid black'}}>{this.props.data.orderNumber}</td>
                                                            <td style={{border:'1px solid black'}}>{moment(this.props.data.orderDate).format('L')}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{paddingTop:10}}></td>
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
                                                    fontSize:'small'
                                                }}>
                                                    <thead>
                                                        <tr>
                                                            <td style={{border:'1px solid black', width:'25%'}}>Дебет</td>
                                                            <td style={{border:'1px solid black', width:'25%'}}>Корреспондирующий счет, субсчет</td>
                                                            <td style={{border:'1px solid black', width:'25%'}}>Сумма</td>
                                                            <td style={{border:'1px solid black', width:'25%'}}>Код целевого назначения</td>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td style={{border:'1px solid black'}}>{this.props.data.debitAccount.code}</td>
                                                            <td style={{border:'1px solid black'}}>{this.props.data.creditAccount.code}</td>
                                                            <td style={{border:'1px solid black'}}>{this.props.data.orderCost}</td>
                                                            <td style={{border:'1px solid black'}}></td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colSpan="2">Принято от:</td>
                                            <td colSpan="10">
                                                <strong>{this.props.data.clientName}</strong>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colSpan="2">Основание:</td>
                                            <td colSpan="10">{this.props.data.reason}</td>
                                        </tr>
                                        <tr>
                                            <td colSpan="2">Сумма:</td>
                                            <td colSpan="10">{nums(this.props.data.orderCost).toUpperCase()} ТЕНГЕ 00 ТИЫН</td>
                                        </tr>
                                        <tr>
                                            <td colSpan="2">Приложение:</td>
                                            <td colSpan="10">{this.props.data.note}</td>
                                        </tr>
                                        <tr>
                                            <td style={{paddingTop:10}}></td>
                                        </tr>
                                        <tr>
                                            <td colSpan="2">Главный бухгалтер</td>
                                            <td colSpan="2" style={{borderBottom:'1px solid black'}}></td>
                                            <td colSpan="8">{this.props.auth.configuration.legalSettings.chiefAccountantName}</td>
                                        </tr>
                                        <tr>
                                            <td style={{paddingTop:10}}></td>
                                        </tr>
                                        <tr>
                                            <td colSpan="2">Кассир</td>
                                            <td colSpan="2" style={{borderBottom:'1px solid black'}}></td>
                                            <td colSpan="8">{this.props.auth.configuration.legalSettings.cashierName}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                            <td colSpan="5" style={{paddingLeft:10}}>
                                <table style={{tableLayout:'fixed', width:'100%', margin:'0px auto', fontSize:'x-small'}}>
                                    <tbody>
                                        <tr>
                                            <td colSpan="12">
                                                <em>Организация (индивидуальный предприниматель)</em>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colSpan="12">
                                                <strong><u>{this.props.auth.configuration.legalSettings.legalName}</u></strong>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colSpan="12" style={{textAlign:'center'}}>
                                                <strong>КВИТАНЦИЯ</strong><br />
                                                <strong>к приходному кассовому</strong><br />
                                                <strong>ордеру № {this.props.data.orderNumber}</strong>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colSpan="12">Принято от:</td>
                                        </tr>
                                        <tr>
                                            <td colSpan="12">
                                                <strong>{this.props.data.clientName}</strong>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colSpan="12">Основание:</td>
                                        </tr>
                                        <tr>
                                            <td colSpan="12">{this.props.data.reason}</td>
                                        </tr>
                                        <tr>
                                            <td colSpan="12">Приложение:</td>
                                        </tr>
                                        <tr>
                                            <td colSpan="12">{this.props.data.note}</td>
                                        </tr>
                                        <tr>
                                            <td colSpan="12">Сумма:</td>
                                        </tr>
                                        <tr>
                                            <td colSpan="12">{this.props.data.orderCost} ({nums(this.props.data.orderCost).toUpperCase()} ТЕНГЕ 00 ТИЫН)</td>
                                        </tr>
                                        <tr>
                                            <td style={{paddingTop:30}}></td>
                                        </tr>
                                        <tr>
                                            <td colSpan="12">
                                                <strong>{moment(this.props.data.orderDate).format('LL')}</strong>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colSpan="12">М.П.</td>
                                        </tr>
                                        <tr>
                                            <td style={{paddingTop:10}}></td>
                                        </tr>
                                        <tr>
                                            <td colSpan="4">Главный бухгалтер</td>
                                            <td colSpan="2" style={{borderBottom:'1px solid black'}}></td>
                                            <td colSpan="6">{this.props.auth.configuration.legalSettings.chiefAccountantName}</td>
                                        </tr>
                                        <tr>
                                            <td style={{paddingTop:10}}></td>
                                        </tr>
                                        <tr>
                                            <td colSpan="4">Кассир</td>
                                            <td colSpan="2" style={{borderBottom:'1px solid black'}}></td>
                                            <td colSpan="6">{this.props.auth.configuration.legalSettings.cashierName}</td>
                                        </tr>
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
import React, { PropTypes } from 'react';
import Print from '../controls/print';
import moment from 'moment';

export default class ContractsPrint extends React.Component {
    render = () => {
        return (
            <Print title="Реестр залоговых билетов" orientation="landscape">
                <table style={{tableLayout:'fixed', width:1200, margin:'0px auto'}}>
                    <tbody>
                        <tr>
                            <td colSpan="12"><strong>{this.props.auth.configuration.legalSettings.legalName}</strong></td>
                        </tr>
                        <tr>
                            <td colSpan="12" style={{textAlign:'center'}}><h3>Реестр залоговых билетов</h3></td>
                        </tr>
                        <tr>
                            <td colSpan="12" style={{textAlign:'center'}}>
                                <strong>
                                    с {this.props.beginDate ? moment(this.props.beginDate).format('L') : 'Не указано'} по {this.props.endDate ? moment(this.props.endDate).format('L') : 'Не указано'}
                                </strong>
                            </td>
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
                                            <td style={{border:'1px solid black'}}>№</td>
                                            <td style={{border:'1px solid black'}}>Дата</td>
                                            <td style={{border:'1px solid black'}}>Дата возврата</td>
                                            <td style={{border:'1px solid black'}}>Статус</td>
                                            <td style={{border:'1px solid black'}}>Сумма</td>
                                            <td style={{border:'1px solid black'}}>Тип залога</td>
                                            <td style={{border:'1px solid black'}}>Тип карты</td>
                                            <td style={{border:'1px solid black'}}>Клиент</td>
                                            <td style={{border:'1px solid black'}}>Филиал</td>
                                            <td style={{border:'1px solid black'}}>Автор</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.props.data.list.map((item, i) => {
                                            return (
                                                <tr key={i}>
                                                    <td style={{border:'1px solid black'}}>{item.contractNumber}</td>
                                                    <td style={{border:'1px solid black'}}>{moment(item.contractDate).format('L')}</td>
                                                    <td style={{border:'1px solid black'}}>{moment(item.maturityDate).format('L')}</td>
                                                    <td style={{border:'1px solid black'}}>{item.status == 0 && <span>Черновик</span> ||
                                                        item.status == 20 && <span>Заблокирован</span> ||
                                                        item.status == 30 && <span>Подписан</span> ||
                                                        item.status == 40 && <span>Выкуплен</span> ||
                                                        item.status == 50 && <span>На реализации</span>}
                                                    </td>
                                                    <td style={{border:'1px solid black'}}>{item.loanCost}</td>
                                                    <td style={{border:'1px solid black'}}>{item.collateralType == 10 && <span>Золото</span> ||
                                                        item.collateralType == 20 && <span>Автотранспорт</span> ||
                                                        item.collateralType == 30 && <span>Товар</span> ||
                                                        item.collateralType == 40 && <span>Спецтехника</span>}
                                                    </td>
                                                    <td style={{border:'1px solid black'}}>{item.contractData.client.cardType == 10 && <span>Standard</span> ||
                                                        item.contractData.client.cardType == 20 && <span>Bronze</span> ||
                                                        item.contractData.client.cardType == 30 && <span>Silver</span> ||
                                                        item.contractData.client.cardType == 40 && <span>Gold</span> ||
                                                        item.contractData.client.cardType == 50 && <span>Platinum</span>}
                                                    </td>
                                                    <td style={{border:'1px solid black'}}>{item.contractData.client.fullname}</td>
                                                    <td style={{border:'1px solid black'}}>{item.branch.displayName}</td>
                                                    <td style={{border:'1px solid black'}}>{item.author.fullname}</td>
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
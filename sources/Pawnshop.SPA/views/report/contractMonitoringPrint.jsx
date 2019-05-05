import React, { PropTypes } from 'react';
import Print from '../controls/print';
import moment from 'moment';

export default class ContractMonitoringPrint extends React.Component {
    sum = (data) => {
        var result = 0;

        if (!data) return result;

        data.map((item, i) => {
            result += item.LoanCost;
        });

        return result;
    };

    render = () => {
        return (
            <Print title="Мониторинг по билетам" orientation="landscape">
                <table style={{tableLayout:'fixed', width:'100%', margin:'0px auto'}}>
                    <tbody>
                        <tr>
                            <td colSpan="12" style={{textAlign:'center'}}><strong>МОНИТОРИНГ ПО БИЛЕТАМ</strong></td>
                        </tr>                        
                        <tr>
                            <td colSpan="6"><strong>Дата с {moment(this.props.data.beginDate).format('L')} года</strong></td>
                            <td colSpan="6"><strong>по {moment(this.props.data.endDate).format('L')} года</strong></td>
                        </tr>                        
                        <tr>
                            <td colSpan="6"><strong>Филиал {this.props.data.branchName}</strong></td>
                            <td colSpan="6"><strong>Вид залога {
                                this.props.data.collateralType == 10 && 'Золото' ||
                                this.props.data.collateralType == 20 && 'Автомобиль' ||
                                this.props.data.collateralType == 30 && 'Товар' ||
                                this.props.data.collateralType == 40 && 'Спецтехника'
                            }</strong></td>
                        </tr>
                        <tr hidden={!this.props.data.displayStatus}>
                            <td colSpan="12"><strong>Статус {
                                this.props.data.displayStatus == 0 && <span>Новый</span> ||
                                this.props.data.displayStatus == 10 && <span>Открыт</span> ||
                                this.props.data.displayStatus == 20 && <span>Просрочен</span> ||
                                this.props.data.displayStatus == 30 && <span>Продлен</span> ||
                                this.props.data.displayStatus == 40 && <span>Выкуплен</span> ||
                                this.props.data.displayStatus == 50 && <span>На реализации</span> ||
                                this.props.data.displayStatus == 60 && <span>Удален</span>
                            }</strong></td>
                        </tr>
                        <tr hidden={!this.props.data.prolongDayCount}>
                            <td colSpan="12">
                                Дней просрочки {this.props.data.prolongDayCount && this.props.data.prolongDayCount.displayOperator} {this.props.data.prolongDayCount && this.props.data.prolongDayCount.value}
                            </td>
                        </tr>
                        <tr hidden={!this.props.data.loanCost}>
                            <td colSpan="12">
                                Ссуда {this.props.data.loanCost && this.props.data.loanCost.displayOperator} {this.props.data.loanCost && this.props.data.loanCost.value}
                            </td>
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
                                            <td style={{border:'1px solid black'}}>№</td>
                                            <td style={{border:'1px solid black'}}>№ билета</td>
                                            <td style={{border:'1px solid black'}}>Вид залога</td>
                                            <td style={{border:'1px solid black'}}>Дата</td>
                                            <td style={{border:'1px solid black'}}>Сумма</td>
                                            <td style={{border:'1px solid black'}}>Статус</td>
                                            <td style={{border:'1px solid black'}}>Дата возврата</td>
                                            <td style={{border:'1px solid black', width:'20%'}}>Клиент</td>
                                            <td style={{border:'1px solid black'}}>Категория</td>
                                            <td style={{border:'1px solid black'}} hidden={this.props.data.collateralType != 10}>Общий вес</td>
                                            <td style={{border:'1px solid black'}} hidden={this.props.data.collateralType != 10}>Чистый вес</td>
                                            <td style={{border:'1px solid black'}} hidden={this.props.data.collateralType != 10}>Проба</td>
                                            <td style={{border:'1px solid black'}} hidden={this.props.data.collateralType != 20 && this.props.data.collateralType != 40}>Каско</td>
                                            <td style={{border:'1px solid black'}} hidden={!this.props.data.displayStatus || this.props.data.displayStatus != 30}>Дата продления</td>
                                            <td style={{border:'1px solid black'}} hidden={!this.props.data.displayStatus || this.props.data.displayStatus != 30}>Сумма продления</td>
                                            <td style={{border:'1px solid black'}} hidden={!this.props.data.displayStatus || this.props.data.displayStatus != 30}>Автор продления</td>
                                            <td style={{border:'1px solid black'}}>Дата выкупа</td>
                                            <td style={{border:'1px solid black'}}>Автор</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.props.data.list.map((item, i) => {
                                            return (
                                                <tr key={i}>
                                                    <td style={{border:'1px solid black'}}>{i + 1}</td>
                                                    <td style={{border:'1px solid black'}}>{item.ContractNumber}</td>
                                                    <td style={{border:'1px solid black'}}>{
                                                        item.CollateralType == 10 && 'Золото' ||
                                                        item.CollateralType == 20 && 'Автомобиль' ||
                                                        item.CollateralType == 30 && 'Товар'
                                                    }</td>
                                                    <td style={{border:'1px solid black'}}>{moment(item.ContractDate).format('L')}</td>
                                                    <td style={{border:'1px solid black'}}>{item.LoanCost && item.LoanCost.toLocaleString('ru') || null}</td>
                                                    <td style={{border:'1px solid black'}}>{
                                                        item.DisplayStatus == 0 && <span>Новый</span> ||
                                                        item.DisplayStatus == 10 && <span>Открыт</span> ||
                                                        item.DisplayStatus == 20 && <span>Просрочен</span> ||
                                                        item.DisplayStatus == 30 && <span>Продлен</span> ||
                                                        item.DisplayStatus == 40 && <span>Выкуплен</span> ||
                                                        item.DisplayStatus == 50 && <span>На реализации</span> ||
                                                        item.DisplayStatus == 60 && <span>Удален</span>
                                                    }</td>
                                                    <td style={{border:'1px solid black'}}>{moment(item.MaturityDate).format('L')}</td>
                                                    <td style={{border:'1px solid black', textAlign:'left'}}>{item.ClientName}</td>
                                                    <td style={{border:'1px solid black'}}>{item.CategoryName}</td>
                                                    <td style={{border:'1px solid black'}} hidden={this.props.data.collateralType != 10}>{item.TotalWeight}</td>
                                                    <td style={{border:'1px solid black'}} hidden={this.props.data.collateralType != 10}>{item.SpecificWeight}</td>
                                                    <td style={{border:'1px solid black'}} hidden={this.props.data.collateralType != 10}>{item.Purity}</td>
                                                    <td style={{border:'1px solid black'}} hidden={this.props.data.collateralType != 20}>{item.HasCasco ? 'Да' : 'Нет'}</td>
                                                    <td style={{border:'1px solid black'}} hidden={!this.props.data.displayStatus || this.props.data.displayStatus != 30}>{item.ProlongDate && moment(item.ProlongDate).format('L') || null}</td>
                                                    <td style={{border:'1px solid black'}} hidden={!this.props.data.displayStatus || this.props.data.displayStatus != 30}>{item.ProlongCost && item.ProlongCost.toLocaleString('ru') || null}</td>
                                                    <td style={{border:'1px solid black'}} hidden={!this.props.data.displayStatus || this.props.data.displayStatus != 30}>{item.ActionAuthor}</td>
                                                    <td style={{border:'1px solid black'}}>{item.BuyoutDate && moment(item.BuyoutDate).format('L') || null}</td>
                                                    <td style={{border:'1px solid black'}}>{item.ContractAuthor}</td>
                                                </tr>
                                            );
                                        })}                                        
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <td colSpan="4" style={{border:'1px solid black'}}></td>
                                            <td style={{border:'1px solid black'}}>{this.sum(this.props.data.list).toLocaleString('ru')}</td>
                                            <td colSpan={6 + (this.props.data.collateralType == 10 ? 3 : 0) + (this.props.data.collateralType == 20 ? 1 : 0) + (this.props.data.displayStatus == 30 ? 3 : 0)} style={{border:'1px solid black'}}></td>
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
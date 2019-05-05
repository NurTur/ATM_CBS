import React, { PropTypes } from 'react';
import Print from '../controls/print';
import moment from 'moment';
import nums from '../../engine/nums';

export default class ContractPrint extends React.Component {
    findPurity(purityId) {
        if (!this.props.purities || this.props.purities.length == 0) return '';

        let purity = this.props.purities[this.props.purities.map((item) => { return item.id; }).indexOf(purityId)];
        return purity && purity.name || '';
    }

    render = () => {
        return (
            <Print title="Залоговый билет">
                <div style={{pageBreakAfter:'always'}}>
                    <table style={{tableLayout:'fixed', width:1000, margin:'0px auto'}}>
                        <tbody>
                            <tr>
                                <td colSpan="4" style={{verticalAlign:'top'}}><strong>ТОО {this.props.auth.configuration.legalSettings.legalName}</strong></td>
                                <td colSpan="4"></td>
                                <td colSpan="4">
                                    <strong>
                                        {this.props.auth.configuration.contactSettings.address}<br />
                                        {this.props.auth.configuration.contactSettings.phone}<br />
                                        {this.props.auth.configuration.contactSettings.schedule}<br />
                                        Call-центр: 7788, с мобильного бесплатно
                                    </strong>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan="12" style={{textAlign:'center', borderBottom:'1px solid black'}}>
                                    <strong>Залоговый билет №{this.props.data.contractNumber}</strong>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan="2">Клиент:</td>
                                <td colSpan="6"><strong>{this.props.data.contractData.client.fullname}</strong></td>
                                <td colSpan="1">ИИН:</td>
                                <td colSpan="2"><strong>{this.props.data.contractData.client.identityNumber}</strong></td>
                            </tr>
                            <tr>
                                <td>Документ:</td>
                                <td colSpan="3">
                                    {this.props.data.contractData.client.documentType == 10 && <strong>Уд. личности</strong> ||
                                    this.props.data.contractData.client.documentType == 20 && <strong>Паспорт</strong> ||
                                    this.props.data.contractData.client.documentType == 30 && <strong>Свид. о гос. регистрации</strong>}
                                </td>
                                <td>серия:</td>
                                <td><strong>{this.props.data.contractData.client.documentSeries}</strong></td>
                                <td>№</td>
                                <td><strong>{this.props.data.contractData.client.documentNumber}</strong></td>
                                <td>Выдан:</td>
                                <td colSpan="2">
                                    <strong>{moment(this.props.data.contractData.client.documentDate).format('L')} {this.props.data.contractData.client.documentProvider}</strong>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan="2" style={{borderBottom:'1px solid black'}}>Адрес:</td>
                                <td colSpan="10" style={{borderBottom:'1px solid black'}}>
                                    <strong>{this.props.data.contractData.client.address}</strong>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan="2">Дата выдачи:</td>
                                <td colSpan="10">
                                    <strong>{moment(this.props.data.contractDate).format('L')} ( {moment(this.props.data.contractDate).format('LL')} )</strong>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan="2">Дата возврата:</td>
                                <td colSpan="10">
                                    <strong>{moment(this.props.data.originalMaturityDate).format('L')} ( {moment(this.props.data.originalMaturityDate).format('LL')} )</strong>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan="2">Срок залога:</td>
                                <td colSpan="2"><strong>{this.props.data.loanPeriod} {nums(this.props.data.loanPeriod)} дней</strong></td>
                                <td colSpan="2">% за кредит:</td>
                                <td colSpan="3"><strong>{this.props.data.loanPercent}% = {this.props.data.loanPercentCost} в день</strong></td>
                                <td colSpan="1"></td>
                                <td colSpan="2"><strong>ГЭСВ не более 100%</strong></td>
                            </tr>
                            <tr>
                                <td colSpan="2">Сумма к возврату:</td>
                                <td colSpan="10">
                                    <strong>
                                        {this.props.data.loanPeriod} дней:{' '}
                                        {this.props.data.loanCost + this.props.data.loanPercentCost * this.props.data.loanPeriod}{' '}
                                        ( {nums(this.props.data.loanCost + this.props.data.loanPercentCost * this.props.data.loanPeriod)} тенге, 00 тиын)
                                    </strong>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan="2" style={{borderBottom:'1px solid black'}}>Кол-во предметов:</td>
                                <td colSpan="10" style={{borderBottom:'1px solid black'}}>
                                    <strong>{this.props.data.positions.length}</strong>
                                </td>
                            </tr>
                            {this.props.data.collateralType == 10 && (
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
                                                <tbody>
                                                <tr>
                                                    <td style={{border:'1px solid black'}}>Наименование</td>
                                                    <td style={{border:'1px solid black'}}>Кол-во</td>
                                                    <td style={{border:'1px solid black'}}>Проба</td>
                                                    <td style={{border:'1px solid black'}}>Общий вес</td>
                                                    <td style={{border:'1px solid black'}}>Чистый вес</td>
                                                    <td style={{border:'1px solid black'}}>Ссуда, в тг</td>
                                                </tr>
                                                {this.props.data.positions.map((position, i) => {
                                                    return (
                                                        <tr>
                                                            <td style={{border:'1px solid black', textAlign:'left'}}>{position.position.name}</td>
                                                            <td style={{border:'1px solid black'}}>{position.positionCount}</td>
                                                            <td style={{border:'1px solid black'}}>{this.findPurity(position.positionSpecific && position.positionSpecific.purityId || 0)}</td>
                                                            <td style={{border:'1px solid black'}}>{position.positionSpecific && position.positionSpecific.collateralTotalWeight || ''}</td>
                                                            <td style={{border:'1px solid black'}}>{position.positionSpecific && position.positionSpecific.collateralSpecificWeight || ''}</td>
                                                            <td style={{border:'1px solid black'}}>{position.loanCost}</td>
                                                        </tr>
                                                    );
                                                })}
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                )
                            }
                            {(this.props.data.collateralType == 20 || this.props.data.collateralType == 40) && this.props.data.positions.map((position, i) => {
                                return [
                                    <tr>
                                        <td colSpan="2">
                                            {this.props.data.collateralType == 10 && 'Золото:' ||
                                            this.props.data.collateralType == 20 && 'Автотранспорт:' ||
                                            this.props.data.collateralType == 30 && 'Товар:' ||
                                            this.props.data.collateralType == 40 && 'Спецтехника:'}
                                        </td>
                                        <td colSpan="2"><strong>{position.position.mark} {position.position.model}</strong></td>
                                        <td colSpan="2">гос. номер:</td>
                                        <td colSpan="2"><strong>{position.position.transportNumber}</strong></td>
                                        <td colSpan="2">категория залога:</td>
                                        <td colSpan="2"><strong>{position.category.name}</strong></td>
                                    </tr>,
                                    <tr>
                                        <td colSpan="2">год выпуска:</td>
                                        <td colSpan="2"><strong>{position.position.releaseYear}</strong></td>
                                        <td colSpan="2">№ двигателя:</td>
                                        <td colSpan="2"><strong>{position.position.motorNumber}</strong></td>
                                        <td colSpan="2">№ кузова:</td>
                                        <td colSpan="2"><strong>{position.position.bodyNumber}</strong></td>
                                    </tr>,
                                    <tr>
                                        <td colSpan="2">№ техпаспорта:</td>
                                        <td colSpan="2"><strong>{position.position.techPassportNumber}</strong></td>
                                        <td colSpan="2">дата выдачи СР ТС:</td>
                                        <td colSpan="2"><strong>{position.position.techPassportDate && moment(position.position.techPassportDate).format('L') || ''}</strong></td>
                                        <td colSpan="2">цвет:</td>
                                        <td colSpan="2"><strong>{position.position.color}</strong></td>
                                    </tr>
                                ];
                            })}
                            {this.props.data.collateralType == 30 && (
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
                                            <tbody>
                                            <tr>
                                                <td style={{border:'1px solid black'}}>Наименование</td>
                                                <td style={{border:'1px solid black'}}>Кол-во</td>
                                                <td style={{border:'1px solid black'}}>Ссуда, в тг</td>
                                            </tr>
                                            {this.props.data.positions.map((position, i) => {
                                                return (
                                                    <tr>
                                                        <td style={{border:'1px solid black', textAlign:'left'}}>{position.position.name}</td>
                                                        <td style={{border:'1px solid black'}}>{position.positionCount}</td>
                                                        <td style={{border:'1px solid black'}}>{position.loanCost}</td>
                                                    </tr>
                                                );
                                            })}
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            )}
                            <tr>
                                <td colSpan="2">Дополнительно:</td>
                                <td colSpan="10" style={{borderBottom:'1px solid black'}}>
                                    {this.props.data.positions.map((position, i) => {
                                        return (
                                            <span>{position.note}</span>
                                        );
                                    })}
                                </td>
                            </tr>
                            <tr>
                                <td colSpan="12" style={{borderBottom:'1px solid black'}}></td>
                            </tr>
                            <tr>
                                <td style={{paddingTop:60}}></td>
                            </tr>
                            <tr>
                                <td colSpan="2">Оценка:</td>
                                <td colSpan="10"><strong>{this.props.data.estimatedCost} ( {nums(this.props.data.estimatedCost)} тенге 00 тиын )</strong></td>
                            </tr>
                            <tr>
                                <td colSpan="2">Ссуда:</td>
                                <td colSpan="10"><strong>{this.props.data.loanCost} ( {nums(this.props.data.loanCost)} тенге 00 тиын )</strong></td>
                            </tr>
                            <tr>
                                <td colSpan="12">
                                    <p style={{textAlign:'justify'}}>
                                        {
                                            this.props.data.collateralType == 10 && '\
В случае досрочного погашения займа, вознаграждение оплачивается за фактически использованные дни. Выкуп заложенного \
имущества производится при предъявлении залогового билета и документа подтверждающего личность Клиента. При неявки Клиента \
в установленный срок, ему предоставляется Гарантированный срок ожидания в количестве 20 дней. В период гарантированного срока \
ожидания (по истечении основного срока займа), ТОО ' + this.props.auth.configuration.legalSettings.legalName + ' (далее – Компания) имеет право начислить пеню \
(штраф) в двойном размере за каждый день просрочки займа, а Клиент обязуется её оплатить. Клиент обязан предоставить \
автотранспортное средство во временное хранение в Компанию до погашения просроченного займа. \
Клиент соглашается, что в случае неисполнения или ненадлежащего исполнения им обязательств по погашению основного долга \
и/или уплате вознаграждения, штрафа Компания по истечении гарантированного срока, указанного в залоговом билете, вправе \
обратить взыскание на предмет залога и осуществить его реализацию в принудительном внесудебном порядке. \
Клиент подтверждает, что предмет залога принадлежит ему на правах личной собственности и в залоге не состоит. \
Клиент подтверждает, что он ознакомлен и согласен с условиями залогового билета и Правилами проведения ломбардных операций, \
являющихся неотъемлемой частью залогового билета, а также получил свой экземпляр залогового билета.' ||
                                            (this.props.data.collateralType == 20 || this.props.data.collateralType == 40) && '\
В случае досрочного погашения займа, вознаграждение оплачивается за фактически использованные дни. Выкуп заложенного имущества \
производится при предъявлении залогового билета и документа подтверждающего личность Клиента. При неявки Клиента в установленный срок, \
ему предоставляется Гарантированный срок ожидания в количестве 10 дней. В период гарантированного срока ожидания (по истечении основного срока \
займа), ТОО  ' + this.props.auth.configuration.legalSettings.legalName + ' (далее – Компания) имеет право начислить пеню (штраф) в размере 0,5% от \
суммы подлежащей оплате за каждый день просрочки, а Клиент обязуется её оплатить. По первому требованию Компании, Клиент обязан незамедлительно \
предоставить автотранспортное средство во временное хранение в Компанию до погашения просроченного займа.\
Клиент соглашается, что в случае неисполнения или ненадлежащего исполнения им обязательств по погашению основного долга и/или уплате вознаграждения, \
штрафа, Компания по истечении гарантированного срока, указанного в залоговом билете, вправе обратить взыскание на предмет залога и осуществить его \
реализацию в принудительном внесудебном порядке.\
Клиент подтверждает, что предмет залога принадлежит ему на правах личной собственности и в залоге не состоит.\
Клиент подтверждает, что он ознакомлен и согласен с условиями залогового билета и Правилами проведения ломбардных операций, являющихся неотъемлемой \
частью залогового билета, а так же получил свой экземпляр залогового билета.' ||
                                            this.props.data.collateralType == 30 && '\
В случае досрочного погашения займа, вознаграждение оплачивается за фактически использованные дни. Выкуп заложенного имущества производится \
при предъявлении залогового билета и документа подтверждающего личность Клиента. При неявки Клиента в установленный срок, \
ему предоставляется Гарантированный срок ожидания в количестве 10 дней. В период гарантированного срока ожидания (по \
истечении основного срока займа), ТОО ' + this.props.auth.configuration.legalSettings.legalName + ' (далее – Компания) имеет право начислить пеню (штраф) в двойном \
размере за каждый день просрочки займа, а Клиент обязуется её оплатить. Клиент обязан предоставить автотранспортное средство во \
временное хранение в Компанию до погашения просроченного займа. \
Клиент соглашается, что в случае неисполнения или ненадлежащего исполнения им обязательств по погашению основного долга \
и/или уплате вознаграждения, штрафа Компания по истечении гарантированного срока, указанного в залоговом билете, вправе \
обратить взыскание на предмет залога и осуществить его реализацию в принудительном внесудебном порядке. \
Клиент подтверждает, что предмет залога принадлежит ему на правах личной собственности и в залоге не состоит. \
Клиент подтверждает, что он ознакомлен и согласен с условиями залогового билета и Правилами проведения ломбардных операций, \
являющихся неотъемлемой частью залогового билета, а также получил свой экземпляр залогового билета.'
                                        }
                                    </p>
                                </td>
                            </tr>
                            <tr>
                                <td style={{paddingTop:30}}></td>
                            </tr>
                            <tr>
                                <td colSpan="8"></td>
                                <td colSpan="2" style={{textAlign:'center',fontSize:'large'}}><strong>М.П.</strong></td>
                                <td colSpan="2"></td>
                            </tr>
                            <tr>
                                <td style={{paddingTop:20}}></td>
                            </tr>
                            <tr>
                                <td colSpan="2">Залогодатель</td>
                                <td colSpan="2" style={{borderBottom:'1px solid black'}}></td>
                                <td colSpan="2"></td>
                                <td colSpan="2">Приемщик ломбарда</td>
                                <td colSpan="2" style={{borderBottom:'1px solid black'}}></td>
                                <td colSpan="2">{this.props.data.author.fullname}</td>
                            </tr>
                            <tr>
                                <td colSpan="12" style={{borderBottom:'1px solid black'}}></td>
                            </tr>
                            <tr>
                                <td style={{paddingTop:20}}></td>
                            </tr>
                            <tr>
                                <td colSpan="3" style={{border:'1px solid black'}}><strong>ТОО {this.props.auth.configuration.legalSettings.legalName}</strong></td>
                                <td></td>
                                <td colSpan="4">РАСХОДНЫЙ КАССОВЫЙ ОРДЕР №{this.props.order.orderNumber}</td>
                                <td></td>
                                <td colSpan="3">от {moment(this.props.order.orderDate).format('L')}</td>
                            </tr>
                            <tr>
                                <td colSpan="12" style={{paddingTop:20}}>
                                    <table style={{
                                        border:'1px solid black',
                                        borderCollapse:'collapse',
                                        tableLayout:'fixed',
                                        width:700,
                                        margin:'0px auto',
                                        textAlign:'center'
                                    }}>
                                        <tbody>
                                            <tr>
                                                <td style={{border:'1px solid black'}}>Коресп. счет</td>
                                                <td style={{border:'1px solid black'}}>Код учета</td>
                                                <td style={{border:'1px solid black'}}>СУММА</td>
                                            </tr>
                                            <tr>
                                                <td style={{border:'1px solid black'}}>{this.props.order.debitAccount.code}</td>
                                                <td style={{border:'1px solid black'}}>{this.props.order.creditAccount.code}</td>
                                                <td style={{border:'1px solid black'}}>{this.props.order.orderCost}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan="2">Получатель:</td>
                                <td colSpan="6">{this.props.order.clientName} </td>
                                {this.props.order.client && <td colSpan="1">ИИН:</td> || ''}
                                {this.props.order.client && <td colSpan="2">{this.props.order.client.identityNumber}</td> || ''}
                                
                            </tr>
                            <tr>
                                <td colSpan="2">Основание:</td>
                                <td colSpan="10">{this.props.order.reason}</td>
                            </tr>
                            <tr>
                                <td colSpan="2">Сумма прописью:</td>
                                <td colSpan="10">{this.props.order.orderCost} ( {nums(this.props.order.orderCost)} тенге, 00 тиын )</td>
                            </tr>
                            <tr>
                                <td colSpan="2">Приложение:</td>
                                <td colSpan="10">{this.props.order.note}</td>
                            </tr>
                            <tr>
                                <td colSpan="2">Ген. директор</td>
                                <td colSpan="2" style={{borderBottom:'1px solid black'}}></td>
                                <td colSpan="2">{this.props.auth.configuration.legalSettings.chiefName}</td>
                                <td colSpan="2">Гл. бухгалтер</td>
                                <td colSpan="2" style={{borderBottom:'1px solid black'}}></td>
                                <td colSpan="2">{this.props.auth.configuration.legalSettings.chiefAccountantName}</td>
                            </tr>
                            <tr>
                                <td colSpan="2">Получил:</td>
                                <td colSpan="10" style={{borderBottom:'1px solid black'}}></td>
                            </tr>
                            <tr>
                                <td colSpan="3">
                                    <table style={{tableLayout:'fixed', width:'100%'}}>
                                        <tbody>
                                            <tr>
                                                <td style={{borderBottom:'1px solid black'}}></td>
                                                <td style={{borderBottom:'1px solid black'}}></td>
                                                <td style={{borderBottom:'1px solid black'}}>20</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                                <td colSpan="9"></td>
                            </tr>
                            <tr>
                                <td>Документ:</td>
                                <td colSpan="3">
                                    {this.props.data.contractData.client.documentType == 10 && <span>Уд. личности</span> ||
                                    this.props.data.contractData.client.documentType == 20 && <span>Паспорт</span> ||
                                    this.props.data.contractData.client.documentType == 30 && <span>Свид. о гос. регистрации</span>}
                                </td>
                                <td>серия:</td>
                                <td>{this.props.data.contractData.client.documentSeries}</td>
                                <td>№</td>
                                <td>{this.props.data.contractData.client.documentNumber}</td>
                                <td>Выдан:</td>
                                <td colSpan="2">
                                    {moment(this.props.data.contractData.client.documentDate).format('L')} {this.props.data.contractData.client.documentProvider}
                                </td>
                            </tr>
                            <tr>
                                <td colSpan="2"><strong>Выдал кассир</strong></td>
                                <td colSpan="2" style={{borderBottom:'1px solid black'}}></td>
                                <td colSpan="2">{this.props.auth.configuration.legalSettings.cashierName}</td>
                                <td colSpan="2"><strong>Подпись клиента</strong></td>
                                <td colSpan="2" style={{borderBottom:'1px solid black'}}></td>
                                <td colSpan="2"></td>
                            </tr>
                            <tr>
                                <td colSpan="12" style={{borderBottom:'1px solid black'}}></td>
                            </tr>
                            <tr>
                                <td colSpan="6"><strong>упаковочный талон к залоговому билету №{this.props.data.contractNumber}</strong></td>
                                <td colSpan="2"><strong>от {moment(this.props.data.contractDate).format('L')}</strong></td>
                                <td colSpan="4"><strong>{this.props.data.contractData.client.fullname}</strong></td>
                            </tr>
                            <tr>
                                <td colSpan="2">Оценка:</td>
                                <td colSpan="2"><strong>{this.props.data.estimatedCost}</strong></td>
                                <td colSpan="2">Ссуда:</td>
                                <td colSpan="6"><strong>{this.props.data.loanCost}</strong></td>
                            </tr>
                            <tr>
                                <td colSpan="2" style={{borderBottom:'1px solid black'}}>Кол-во предметов:</td>
                                <td colSpan="10" style={{borderBottom:'1px solid black'}}>
                                    <strong>{this.props.data.positions.length}</strong>
                                </td>
                            </tr>
                            {this.props.data.collateralType == 10 && (
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
                                            <tbody>
                                            <tr>
                                                <td style={{border:'1px solid black'}}>Наименование</td>
                                                <td style={{border:'1px solid black'}}>Кол-во</td>
                                                <td style={{border:'1px solid black'}}>Проба</td>
                                                <td style={{border:'1px solid black'}}>Общий вес</td>
                                                <td style={{border:'1px solid black'}}>Чистый вес</td>
                                                <td style={{border:'1px solid black'}}>Ссуда, в тг</td>
                                            </tr>
                                            {this.props.data.positions.map((position, i) => {
                                                return (
                                                    <tr>
                                                        <td style={{border:'1px solid black', textAlign:'left'}}>{position.position.name}</td>
                                                        <td style={{border:'1px solid black'}}>{position.positionCount}</td>
                                                        <td style={{border:'1px solid black'}}>{this.findPurity(position.positionSpecific && position.positionSpecific.purityId || 0)}</td>
                                                        <td style={{border:'1px solid black'}}>{position.positionSpecific && position.positionSpecific.collateralTotalWeight || ''}</td>
                                                        <td style={{border:'1px solid black'}}>{position.positionSpecific && position.positionSpecific.collateralSpecificWeight || ''}</td>
                                                        <td style={{border:'1px solid black'}}>{position.loanCost}</td>
                                                    </tr>
                                                );
                                            })}
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            )}
                            {(this.props.data.collateralType == 20 || this.props.data.collateralType == 40) && this.props.data.positions.map((position, i) => {
                                return [
                                    <tr>
                                        <td colSpan="2">
                                            {this.props.data.collateralType == 10 && 'Золото:' ||
                                            this.props.data.collateralType == 20 && 'Автотранспорт:' ||
                                            this.props.data.collateralType == 30 && 'Товар:' ||
                                            this.props.data.collateralType == 40 && 'Спецтехника:'}
                                        </td>
                                        <td colSpan="2"><strong>{position.position.mark} {position.position.model}</strong></td>
                                        <td colSpan="2">гос. номер:</td>
                                        <td colSpan="2"><strong>{position.position.transportNumber}</strong></td>
                                        <td colSpan="2">категория залога:</td>
                                        <td colSpan="2"><strong>{position.category.name}</strong></td>
                                    </tr>,
                                    <tr>
                                        <td colSpan="2">год выпуска:</td>
                                        <td colSpan="2"><strong>{position.position.releaseYear}</strong></td>
                                        <td colSpan="2">№ двигателя:</td>
                                        <td colSpan="2"><strong>{position.position.motorNumber}</strong></td>
                                        <td colSpan="2">№ кузова:</td>
                                        <td colSpan="2"><strong>{position.position.bodyNumber}</strong></td>
                                    </tr>,
                                    <tr>
                                        <td colSpan="2">№ техпаспорта:</td>
                                        <td colSpan="2"><strong>{position.position.techPassportNumber}</strong></td>
                                        <td colSpan="2">дата выдачи СР ТС:</td>
                                        <td colSpan="2"><strong>{position.position.techPassportDate && moment(position.position.techPassportDate).format('L') || ''}</strong></td>
                                        <td colSpan="2">цвет:</td>
                                        <td colSpan="2"><strong>{position.position.color}</strong></td>
                                    </tr>
                                ];
                            })}
                            {this.props.data.collateralType == 30 && (
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
                                            <tbody>
                                            <tr>
                                                <td style={{border:'1px solid black'}}>Наименование</td>
                                                <td style={{border:'1px solid black'}}>Кол-во</td>
                                                <td style={{border:'1px solid black'}}>Ссуда, в тг</td>
                                            </tr>
                                            {this.props.data.positions.map((position, i) => {
                                                return (
                                                    <tr>
                                                        <td style={{border:'1px solid black', textAlign:'left'}}>{position.position.name}</td>
                                                        <td style={{border:'1px solid black'}}>{position.positionCount}</td>
                                                        <td style={{border:'1px solid black'}}>{position.loanCost}</td>
                                                    </tr>
                                                );
                                            })}
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            )}
                            <tr>
                                <td colSpan="2">Дополнительно:</td>
                                <td colSpan="10" style={{borderBottom:'1px solid black'}}></td>
                            </tr>
                            <tr>
                                <td colSpan="12" style={{borderBottom:'1px solid black'}}></td>
                            </tr>
                            <tr>
                                <td style={{paddingTop:30}}></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div>
                    <table style={{
                        border:'1px solid black',
                        borderCollapse:'collapse',
                        tableLayout:'fixed',
                        width:1000,
                        margin:'0px auto'
                    }}>
                        <tbody>
                            <tr>
                                <td colSpan="12" style={{border:'1px solid black', textAlign:'center'}}>
                                    <strong>РАСЧЕТ СОГЛАШЕНИЯ ССУДНОЙ ЗАДОЛЖЕННОСТИ</strong>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan="5" style={{border:'1px solid black'}}>
                                    Выдана ссуда в размере
                                </td>
                                <td colSpan="7" style={{border:'1px solid black'}}>
                                    <strong>{this.props.data.loanCost}</strong> ({nums(this.props.data.loanCost)} тенге, 00 тиын)
                                </td>
                            </tr>
                            {[...Array(5)].map((element, i) => {
                                return (
                                    <tr>
                                        <td colSpan="8" style={{borderBottom:'1px solid black'}}></td>
                                        <td colSpan="4" style={{borderBottom:'1px solid black'}}>
                                            оплачено<br />
                                            продлено до
                                        </td>
                                    </tr>
                                );
                            })}
                            <tr>
                                <td colSpan="8" style={{borderBottom:'1px solid black'}}></td>
                                <td colSpan="4" style={{borderBottom:'1px solid black'}}>
                                    <br />
                                    <br />
                                </td>
                            </tr>
                            <tr>
                                <td colSpan="4" style={{textAlign:'center', paddingTop:20}}>
                                    <h3>ИТОГО К ОПЛАТЕ</h3>
                                </td>
                                <td colSpan="7" style={{borderBottom:'1px solid black'}}></td>
                                <td colSpan="1"></td>
                            </tr>
                            <tr>
                                <td colSpan="12" style={{paddingTop:20}}></td>
                            </tr>
                            <tr>
                                <td colSpan="1"></td>
                                <td colSpan="2">Ген. директор</td>
                                <td colSpan="2" style={{borderBottom:'1px solid black'}}></td>
                                <td colSpan="2">{this.props.auth.configuration.legalSettings.chiefName}</td>
                                <td colSpan="2">Гл. бухгалтер</td>
                                <td colSpan="2" style={{borderBottom:'1px solid black'}}></td>
                                <td colSpan="1">{this.props.auth.configuration.legalSettings.chiefAccountantName}</td>
                            </tr>
                            <tr>
                                <td colSpan="12" style={{paddingTop:20, borderBottom:'1px solid black'}}></td>
                            </tr>
                            <tr>
                                <td colSpan="12" style={{textAlign:'center'}}>
                                    РАСПИСКА В ПОЛУЧЕНИИ ЗАЛОГОВОГО ИМУЩЕСТВА
                                </td>
                            </tr>
                            <tr>
                                <td colSpan="1"></td>
                                <td colSpan="7">Я, <strong>{this.props.data.contractData.client.fullname.toUpperCase()} 
                                {this.props.data.contractData.client.identityNumber}  </strong></td>
                                <td colSpan="1">ИИН:</td> 
                                <td colSpan="3"><strong>{this.props.order.client.identityNumber}</strong></td>
                            </tr>
                            <tr>
                                <td>Документ:</td>
                                <td colSpan="3">
                                    {this.props.data.contractData.client.documentType == 10 && <strong>Уд. личности</strong> ||
                                    this.props.data.contractData.client.documentType == 20 && <strong>Паспорт</strong> ||
                                    this.props.data.contractData.client.documentType == 30 && <strong>Свид. о гос. регистрации</strong>}
                                </td>
                                <td>серия:</td>
                                <td><strong>{this.props.data.contractData.client.documentSeries}</strong></td>
                                <td>№</td>
                                <td><strong>{this.props.data.contractData.client.documentNumber}</strong></td>
                                <td>Выдан:</td>
                                <td colSpan="3">
                                    <strong>{moment(this.props.data.contractData.client.documentDate).format('L')} {this.props.data.contractData.client.documentProvider}</strong>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan="2">прописан(а) по адресу:</td>
                                <td colSpan="10">{this.props.data.contractData.client.address}</td>
                            </tr>
                            <tr>
                                <td colSpan="2">выкупил(а) из залога</td>
                                <td colSpan="3">ТОО {this.props.auth.configuration.legalSettings.legalName}</td>
                                <td colSpan="7">ранее заложенное имущество</td>
                            </tr>
                            <tr>
                                <td colSpan="2">Кол-во предметов:</td>
                                <td colSpan="10">
                                    <strong>{this.props.data.positions.length}</strong>
                                </td>
                            </tr>
                            {this.props.data.collateralType == 10 && (
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
                                            <tbody>
                                            <tr>
                                                <td style={{border:'1px solid black'}}>Наименование</td>
                                                <td style={{border:'1px solid black'}}>Кол-во</td>
                                                <td style={{border:'1px solid black'}}>Проба</td>
                                                <td style={{border:'1px solid black'}}>Общий вес</td>
                                                <td style={{border:'1px solid black'}}>Чистый вес</td>
                                                <td style={{border:'1px solid black'}}>Ссуда, в тг</td>
                                            </tr>
                                            {this.props.data.positions.map((position, i) => {
                                                return (
                                                    <tr>
                                                        <td style={{border:'1px solid black', textAlign:'left'}}>{position.position.name}</td>
                                                        <td style={{border:'1px solid black'}}>{position.positionCount}</td>
                                                        <td style={{border:'1px solid black'}}>{this.findPurity(position.positionSpecific && position.positionSpecific.purityId || 0)}</td>
                                                        <td style={{border:'1px solid black'}}>{position.positionSpecific && position.positionSpecific.collateralTotalWeight || ''}</td>
                                                        <td style={{border:'1px solid black'}}>{position.positionSpecific && position.positionSpecific.collateralSpecificWeight || ''}</td>
                                                        <td style={{border:'1px solid black'}}>{position.loanCost}</td>
                                                    </tr>
                                                );
                                            })}
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            )}
                            {(this.props.data.collateralType == 20 || this.props.data.collateralType == 40) && this.props.data.positions.map((position, i) => {
                                return [
                                    <tr>
                                        <td colSpan="2">
                                            {this.props.data.collateralType == 10 && 'Золото:' ||
                                            this.props.data.collateralType == 20 && 'Автотранспорт:' ||
                                            this.props.data.collateralType == 30 && 'Товар:' ||
                                            this.props.data.collateralType == 40 && 'Спецтехника:'}
                                        </td>
                                        <td colSpan="2"><strong>{position.position.mark} {position.position.model}</strong></td>
                                        <td colSpan="2">гос. номер:</td>
                                        <td colSpan="2"><strong>{position.position.transportNumber}</strong></td>
                                        <td colSpan="2">категория залога:</td>
                                        <td colSpan="2"><strong>{position.category.name}</strong></td>
                                    </tr>,
                                    <tr>
                                        <td colSpan="2">год выпуска:</td>
                                        <td colSpan="2"><strong>{position.position.releaseYear}</strong></td>
                                        <td colSpan="2">№ двигателя:</td>
                                        <td colSpan="2"><strong>{position.position.motorNumber}</strong></td>
                                        <td colSpan="2">№ кузова:</td>
                                        <td colSpan="2"><strong>{position.position.bodyNumber}</strong></td>
                                    </tr>,
                                    <tr>
                                        <td colSpan="2">№ техпаспорта:</td>
                                        <td colSpan="2"><strong>{position.position.techPassportNumber}</strong></td>
                                        <td colSpan="2">дата выдачи СР ТС:</td>
                                        <td colSpan="2"><strong>{position.position.techPassportDate && moment(position.position.techPassportDate).format('L') || ''}</strong></td>
                                        <td colSpan="2">цвет:</td>
                                        <td colSpan="2"><strong>{position.position.color}</strong></td>
                                    </tr>
                                ];
                            })}
                            {this.props.data.collateralType == 30 && (
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
                                            <tbody>
                                            <tr>
                                                <td style={{border:'1px solid black'}}>Наименование</td>
                                                <td style={{border:'1px solid black'}}>Кол-во</td>
                                                <td style={{border:'1px solid black'}}>Ссуда, в тг</td>
                                            </tr>
                                            {this.props.data.positions.map((position, i) => {
                                                return (
                                                    <tr>
                                                        <td style={{border:'1px solid black', textAlign:'left'}}>{position.position.name}</td>
                                                        <td style={{border:'1px solid black'}}>{position.positionCount}</td>
                                                        <td style={{border:'1px solid black'}}>{position.loanCost}</td>
                                                    </tr>
                                                );
                                            })}
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            )}
                            <tr>
                                <td colSpan="12" style={{paddingTop:20}}></td>
                            </tr>
                            <tr>
                                <td colSpan="12">Претензий по расчету задолженности и сохранности моего имущества не имею</td>
                            </tr>
                            <tr>
                                <td></td>
                                <td style={{borderBottom:'1px solid black'}}></td>
                                <td colSpan="2" style={{borderBottom:'1px solid black'}}></td>
                                <td style={{borderBottom:'1px solid black'}}>{moment(this.props.data.orderDate).format('YYYY')} г.</td>
                                <td colSpan="3"></td>
                                <td>Подпись</td>
                                <td colSpan="2" style={{borderBottom:'1px solid black'}}></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td colSpan="12" style={{paddingTop:20, borderBottom:'1px solid black'}}></td>
                            </tr>
                        </tbody>
                    </table>
                    <table style={{tableLayout:'fixed', width:1000, margin:'0px auto'}}>
                        <tbody>
                            <tr>
                                <td colSpan="12" style={{paddingTop:200}}></td>
                            </tr>
                            <tr>
                                <td colSpan="6">Имущество отпущено со склада на основании</td>
                                <td colSpan="6" style={{border:'1px solid black'}}></td>
                            </tr>
                            <tr>
                                <td colSpan="1">Дата</td>
                                <td colSpan="5" style={{border:'1px solid black'}}></td>
                                <td colSpan="6"></td>
                            </tr>
                            <tr>
                                <td colSpan="12" style={{paddingTop:20}}></td>
                            </tr>
                            <tr>
                                <td colSpan="2">Зав. складом</td>
                                <td colSpan="2" style={{borderBottom:'1px solid black'}}></td>
                                <td colSpan="2"></td>
                                <td colSpan="2">Клиент</td>
                                <td colSpan="2" style={{borderBottom:'1px solid black'}}></td>
                                <td colSpan="2"></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Print>
        );
    };
}
import React, { PropTypes } from 'react';
import Print from '../controls/print';
import moment from 'moment';
import nums from '../../engine/nums';

export default class ContractBailmentPrint extends React.Component {
    render = () => {
        return (
            <Print title="Договор на ответственное хранение ценностей">
                <table style={{tableLayout:'fixed', width:1000, margin:'0px auto', fontFamily:'Times New Roman'}}>
                    <tbody>
                        <tr>
                            <td colSpan="12" style={{textAlign:'center'}}>
                                <h4>ДОГОВОР НА ОТВЕТСТВЕННОЕ<br/>
                                ХРАНЕНИЕ ЦЕННОСТЕЙ</h4>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="2"><strong>{this.props.auth.configuration.contactSettings.city}</strong></td>
                            <td colSpan="8"></td>
                            <td colSpan="2" style={{textAlign:'right'}}>
                                <strong>{moment(this.props.data.contractDate).format('L')}</strong>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="12">
                                <p style={{textAlign:'justify'}}>
                                    {this.props.auth.configuration.legalSettings.legalName}, именуемое в дальнейшем Заказчик, в лице Генерального Директора {this.props.auth.configuration.legalSettings.chiefName}, 
                                    действующего на основании Устава и {this.props.data.contractData.client.fullname}, именуемый в дальнейшем Исполнитель, 
                                    с другой стороны, заключили настоящий договор о нижеследующем:
                                </p>
                                <p style={{textAlign:'center'}}>
                                    1. Предмет Договора.
                                </p>
                                <p style={{textAlign:'justify'}}>
                                    1.1. Исполнитель принимает на себя обязательство по хранению ценностей: {
                                    this.props.data.collateralType == 10 && 'Золото, ' ||
                                    this.props.data.collateralType == 20 && 'Автотранспорт, ' ||
                                    this.props.data.collateralType == 30 && 'Товар, ' ||
                                    this.props.data.collateralType == 40 && 'Спецтехника, '
                                    }
                                    {this.props.data.positions.map((position, index) => {
                                        if (this.props.data.collateralType == 20 || this.props.data.collateralType == 40) {
                                            return (
                                                <span>
                                                    {position.position.mark} {position.position.model}, 
                                                    гос. номер {position.position.transportNumber}, 
                                                    год выпуска {position.position.releaseYear}, 
                                                    № двигателя {position.position.motorNumber}, 
                                                    № кузова {position.position.bodyNumber}, 
                                                    № техпаспорта {position.position.techPassportNumber}, 
                                                    дата выдачи ТС {moment(this.props.data.contractDate).format('L')}, 
                                                    цвет {position.position.color}
                                                </span>
                                            );
                                        } else {
                                            return (
                                                <span>{position.position.name}</span>
                                            );
                                        }
                                    })}
                                </p>
                                <p style={{textAlign:'center'}}>
                                    2. Ответственность Сторон.
                                </p>
                                <p style={{textAlign:'justify'}}>
                                    2.1. На основании договора Исполнитель несет ответственность за сохранность ценностей и их повреждения, 
                                    возникшие по вине Исполнителя, кроме случаев форс-мажорных обстоятельств, возникших не по вине сторон.<br />
                                    2.2. За неисполнение либо ненадлежащее исполнение обязательств по настоящему Договору Исполнителем, 
                                    Заказчик вправе изымать автомобиль, указанный в п.п. 1.1. настоящего Договора и осуществить внесудебную 
                                    реализацию автомобиля, в порядкепредусмотренном действующим законодательством.<br />
                                    2.3. За неисполнение обязательств по настоящему Договору в случаях неурегулированных настоящим Договором, 
                                    стороны несут ответственность в соответствии с действующим законодательством Республики Казахстан.
                                </p>
                                <p style={{textAlign:'center'}}>
                                    3. Сроки и условия действия Договора.
                                </p>
                                <p style={{textAlign:'justify'}}>
                                    Согласно залогового билета №{this.props.data.contractNumber} от {moment(this.props.data.contractDate).format('L')}
                                </p>
                                <p style={{textAlign:'center'}}>
                                    4. Прочие условия.
                                </p>
                                <p style={{textAlign:'justify'}}>
                                    4.1. Настоящий договор вступает в силу с момента его подписания Сторонами идействует до полного исполнения 
                                    Сторонами своих обязательств по нему, либо прекращается досрочно, по условиям, предусмотренным настоящим Договором.<br />
                                    4.2. Все споры, возникшие между Сторонами по настоящему Договору, разрешаются путем переговоров. В случае 
                                    не достижения согласия споры разрешаются в судебных органах в соответствии с действующим законодательством.<br />
                                    4.3. Настоящий Договор составлен в двух аутентичных экземплярах, имеющих одинаковую юридическую силу, 
                                    по одному для каждой из Сторон.
                                </p>
                                <p style={{textAlign:'center'}}>
                                    5. Юридические адреса Сторон.
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="12">
                                <table style={{width:'100%'}}>
                                    <thead>
                                        <tr>
                                            <th style={{width:300}}>Исполнитель</th>
                                            <th></th>
                                            <th style={{width:300}}>Заказчик</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>{this.props.data.contractData.client.fullname}</td>
                                            <td></td>
                                            <td>{this.props.auth.configuration.legalSettings.legalName}</td>
                                        </tr>
                                        <tr>
                                            <td>{this.props.data.contractData.client.address}</td>
                                            <td></td>
                                            <td>{this.props.auth.configuration.contactSettings.address}</td>
                                        </tr>
                                        <tr>
                                            <td>{this.props.data.contractData.client.identityNumber}</td>
                                            <td></td>
                                            <td>РНН {this.props.auth.configuration.legalSettings.rnn}</td>
                                        </tr>
                                        <tr>
                                            <td>уд. личности {this.props.data.contractData.client.documentNumber}</td>
                                            <td></td>
                                            <td>ИИК ___________________</td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Выдано {this.props.data.contractData.client.documentProvider} 
                                                {moment(this.props.data.contractData.client.documentDate).format('L')}
                                            </td>
                                            <td></td>
                                            <td>_______________________</td>
                                        </tr>
                                        <tr>
                                            <td>тел.: {this.props.data.contractData.client.mobilePhone}, {this.props.data.contractData.client.staticPhone}</td>
                                            <td></td>
                                            <td>тел.: {this.props.auth.configuration.contactSettings.phone}</td>
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
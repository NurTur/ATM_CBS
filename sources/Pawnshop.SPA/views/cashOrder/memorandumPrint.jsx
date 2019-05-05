import React, { PropTypes } from 'react';
import Print from '../controls/print';
import moment from 'moment';

export default class MemorandumPrint extends React.Component {
    render = () => {
        return (
            <Print title={"Служебная записка от" && this.props.data.reason}>
                <table style={{tableLayout:'fixed', width:700, margin:'0px auto'}}>
                    <tbody>
                        <tr>
                        <td colSpan="12" style={{textAlign:'right'}}>Генеральному директору</td>
                        </tr>
                        <tr>
                        <td colSpan="12" style={{textAlign:'right'}}>{"ТОО " + this.props.auth.configuration.legalSettings.legalName}</td>
                        </tr>
                        <tr>
                        <td colSpan="12" style={{textAlign:'right'}}>{this.props.auth.configuration.legalSettings.chiefName}</td>
                        </tr>
                        <tr>
                        <td colSpan="12" style={{textAlign:'right'}}>от {this.props.data.author.fullname}</td>
                        </tr>

                        <tr>
                            <td style={{paddingTop:100}}></td>
                        </tr>
                        <tr>
                            <td colSpan="12" style={{textAlign:'center'}}><h3>Служебная записка</h3></td>
                        </tr>
                        <tr>
                            <td colSpan="12" style={{textIndent:'35px'}}>В связи с производственной необходимостью, для {this.props.data.reason}</td>
                        </tr>
                        <tr>
                            <td colSpan="12"> Прошу выделить денежные средства в размере {this.props.data.orderCost} тенге</td>
                        </tr>
                        {this.props.proveType==20 &&
                        <tr>
                            <td colSpan="12">Настоящие расходы <strong>без подтверждающих документов.</strong></td>
                        </tr>
                        }

                        <tr>
                            <td style={{paddingTop:160}}></td>
                        </tr>
                        <tr>
                        <td colSpan="12" style={{textAlign:'right'}}>{moment(this.props.data.orderDate).format('L')}</td>
                        </tr>
                        <tr>
                        <td colSpan="12" style={{textAlign:'right'}}>Ответственное лицо: {this.props.data.author.fullname}</td>
                        </tr>

                        {this.props.proveType==10 &&
                        <tr>
                            <td colSpan="12" style={{position:'absolute', bottom:20, fontSize:"10px"}}>Прилагаем все документы, выписанные на компанию (счет-фактура, накладная или акт выполненных работ, фискальный чек, при отсутствии фиск. чека копию патента с действительной датой).                            </td>
                        </tr>}
                    </tbody>
                </table>
            </Print>
        );
    };
}
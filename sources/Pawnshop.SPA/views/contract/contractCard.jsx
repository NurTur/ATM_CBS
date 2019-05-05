import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import ContractForm from './contractForm';
import Dialog from '../controls/dialog';
import Confirmation from '../controls/confirmation';
import Restrict from '../controls/restrict';
import permissions from '../../engine/permissions';

import {
    card as cardLoad, get as getCard, copy as cardCopy, save as cardSave,
    actionSign, actionProlong, actionBuyout,
    actionPartialBuyout, actionPartialPayment,
    actionSelling, actionCancel, actionTransfer,
    actionMonthlyPayment, actionAnnuityPartialPayment,
    print as printLoad, printAnnuity,
    actionAnnuityAddition,
    actionAddition
} from '../../actions/contracts';

import { find as insuranceFind, save as insuranceSave } from '../../actions/insurances';

import { find as findLoanPercent } from '../../actions/loanPercents';

import { save as fileSave, remove as fileRemove } from '../../actions/contractFileRow';

import { find as findOrder } from '../../actions/cashOrders';

import { purities as puritiesLoad } from '../../actions/dictionaries';

import SignForm from './actionForms/signForm';
import ProlongForm from './actionForms/prolongForm';
import BuyoutForm from './actionForms/buyoutForm';
import AdditionForm from './actionForms/additionForm';
import PartialBuyoutForm from './actionForms/partialBuyoutForm';
import PartialPaymentForm from './actionForms/partialPaymentForm';
import SellingForm from './actionForms/sellingForm';
import TransferForm from './actionForms/transferForm';
import CalculatorForm from './actionForms/calculatorForm';
import InsuranceSignForm from '../insurance/signForm';
import ScheduleForm from './actionForms/scheduleForm';
import MonthlyPaymentForm from './actionForms/monthlyPaymentForm';
import AnnuityBuyoutForm from './actionForms/annuityBuyoutForm';
import AnnuityAdditionForm from './actionForms/annuityAdditionForm';
import AnnuityPartialPaymentForm from './actionForms/annuityPartialPaymentForm';

import CashInOrderPrint from '../cashOrder/cashInOrderPrint';
import CashOutOrderPrint from '../cashOrder/cashOutOrderPrint';
import ContractPrint from './contractPrint';
import ContractAnnuityPrint from './contractAnnuityPrint';
import { downloadTemp, print, warning } from '../../actions/common';
import { get as cashOrderLoad } from '../../actions/cashOrders';
import { categories as categoriesLoad } from '../../actions/dictionaries';

class ContractCard extends React.Component {
    static contextTypes = {
        router: PropTypes.object.isRequired,
        store: PropTypes.object.isRequired
    };

    state = {
        profile: null
    };

    componentWillReceiveProps(props) {
        if (props.params.id != this.props.params.id) {
            this.onLoad(props.params.id)
        }
    }

    componentWillMount() {
        if (this.props.params.isCopy) {
            this.onCopy(this.props.params.id);
        } else {
            this.onLoad(this.props.params.id);
        }
        if (!this.props.categories.length) {
            this.props.categoriesLoad();
        }
        if (!this.props.purities.length) {
            this.props.puritiesLoad();
        }
    }

    onLoad(id) {
        if (id > 0) {
            this.props.cardLoad(id).then(action => this.onFindProfile({
                collateralType: action.data.collateralType,
                cardType: action.data.contractData.client.cardType,
                loanCost: action.data.loanCost,
                loanPeriod: action.data.loanPeriod
            }));
        } else {
            this.props.cardLoad(id);
        }
    }

    onCopy(id) {
        this.props.cardCopy(id).then(action => this.onFindProfile({
            collateralType: action.data.collateralType,
            cardType: action.data.contractData.client.cardType,
            loanCost: action.data.loanCost,
            loanPeriod: action.data.loanPeriod
        }));
    }

    onPrintCard = (id) => {
        this.props.getCard(id).then(action => {
            if (action && action.data) {
                let contract = action.data;
                if (contract.status < 30) return;

                this.props.findOrder({
                    contractId: contract.id,
                    actionType: 50,
                }).then(action => {
                    if (action && action.data) {
                        let cashOrder = action.data;
                        if (contract.percentPaymentType == 30 || contract.percentPaymentType == 31) {
                            this.props.print(<ContractAnnuityPrint data={contract} order={cashOrder} auth={this.props.auth} profile={this.state.profile} />);
                        } else {
                            this.props.print(<ContractPrint data={contract} order={cashOrder} auth={this.props.auth} purities={this.props.purities} />);
                        }
                    } else {
                        let cashOrder = {
                            debitAccount: {},
                            creditAccount: {}
                        };
                        if (contract.percentPaymentType == 30 || contract.percentPaymentType == 31) {
                            this.props.print(<ContractAnnuityPrint data={contract} order={cashOrder} auth={this.props.auth} profile={this.state.profile} />);
                        } else {
                            this.props.print(<ContractPrint data={contract} order={cashOrder} auth={this.props.auth} purities={this.props.purities} />);
                        }
                    }
                });
            }
        });
    };

    onPrintContractCollateral = (id) => {
        this.props.getCard(id).then(action => {
            if (action && action.data) {
                let contract = action.data;
                if (contract.status < 30) return;
                if (contract.collateralType != 20 && contract.collateralType != 40) return;

                if (contract.percentPaymentType == 30 || contract.percentPaymentType == 31) {
                    this.props.printAnnuity(contract.id).then(action => {
                        if (action && action.data) {
                            this.context.store.dispatch(downloadTemp(action.data));
                        }
                    });
                } else {
                    this.props.printLoad(contract.id).then(action => {
                        if (action && action.data) {
                            this.context.store.dispatch(downloadTemp(action.data));
                        }
                    });
                }

            }
        });
    };

    _query = null;
    onFindProfile(query) {
        this._query = query;
        let ctx = query;
        setTimeout(() => {
            if (this._query !== ctx) return;

            this.props.findLoanPercent(query)
                .then(action =>  {
                    this.setState({
                        profile: action.data
                    });
                    if (!action.data) {
                        this.props.warning('Профиль для загрузки процентов по данному типу договор не найден. Обратитесь к администратору для настройки процентов.');
                    }
                });
        }, 700);
    }

    onSave(contract) {
        if (!this.state.profile) {
            this.props.warning('Профиль для загрузки процентов по данному типу договор не найден. Сохранение не доступно. Обратитесь к администратору для настройки процентов.');
            return;
        }

        return this.props
            .cardSave(contract)
            .then(action => {
                if (action && action.data) {
                    this.context.router.push(`/contracts/${action.data.id}`);
                }
            });
    }

    _signDialog = null;
    onSign(contract) {
        if (!this.state.profile) {
            this.props.warning('Профиль для загрузки процентов по данному типу договор не найден. Подписание не доступно. Обратитесь к администратору для настройки процентов.');
            return;
        }

        this.onSave(contract).then(() => {
            if (this._signDialog) {
                this._signDialog.show(data => {
                    data.contractId = this.props.card.id;
                    return this.props.actionSign(data).then(action => {
                        if (action && action.data) {
                            this.onCashOrderPrint(action.data);
                        }
                        this.onLoad(this.props.card.id);
                    });
                });
            }
        });
    }

    _prolongDialog = null;
    onProlong() {
        if (this._prolongDialog) {
            this._prolongDialog.show(data => {
                data.contractId = this.props.card.id;
                return this.props.actionProlong(data).then(action => {
                    if (action && action.data) {
                        this.onCashOrderPrint(action.data);
                    }
                    this.onLoad(this.props.card.id);
                });
            });
        }
    }

    _buyoutDialog = null;
    onBuyout() {
        if (this._buyoutDialog) {
            this._buyoutDialog.show(data => {
                data.contractId = this.props.card.id;
                return this.props.actionBuyout(data).then(action => {
                    if (action && action.data) {
                        this.onCashOrderPrint(action.data);
                    }
                    this.onLoad(this.props.card.id);
                });
            });
        }
    }

    _additionDialog = null;
    onAddition() {
        if (this._additionDialog) {
            this._additionDialog.show(data => {
                data.contractId = this.props.card.id;
                return this.props.actionAddition(data).then(action => {
                    if (action && action.data) {
                        this.onCashOrderPrint(action.data);
                    }
                    this.onLoad(this.props.card.id);
                });
            });
        }
    }

    _partialBuyoutDialog = null;
    onPartialBuyout() {
        if (this._partialBuyoutDialog) {
            this._partialBuyoutDialog.show(data => {
                data.contractId = this.props.card.id;
                return this.props.actionPartialBuyout(data).then(result => {
                    if (result && result.data) {
                        this.onCashOrderPrint(result.data);
                    }
                    this.context.router.push(`/contracts/${result.data.followedId}`)
                });
            });
        }
    }

    _partialPaymentDialog = null;
    onPartialPayment() {
        if (this._partialPaymentDialog) {
            this._partialPaymentDialog.show(data => {
                data.contractId = this.props.card.id;
                return this.props.actionPartialPayment(data).then(result => {
                    if (result && result.data) {
                        this.onCashOrderPrint(result.data);
                    }
                    this.context.router.push(`/contracts/${result.data.followedId}`)
                });
            });
        }
    }

    _sellingDialog = null;
    onSelling() {
        if (this._sellingDialog) {
            this._sellingDialog.show(data => {
                data.contractId = this.props.card.id;
                return this.props.actionSelling(data).then(action => {
                    if (action && action.data) {
                        this.onCashOrderPrint(action.data);
                    }
                    this.onLoad(this.props.card.id);
                });
            });
        }
    }

    _transferDialog = null;
    onTransfer() {
        if (this._transferDialog) {
            this._transferDialog.show(data => {
                data.contractId = this.props.card.id;
                return this.props.actionTransfer(data).then(action => {
                    this.onLoad(this.props.card.id);
                });
            });
        }
    }

    _calculatorDialog = null;
    onCalculator() {
        if (this._calculatorDialog) {
            this._calculatorDialog.show(null, true);
        }
    }

    _insuranceSignDialog = null;
    onInsuranceSign(contract) {
        if (this._insuranceSignDialog) {
            this.props.insuranceFind({ contractId: contract.id }).then(action => {
                if (action && action.data) {
                    this._insuranceSignDialog.show(data => {
                        return this.props.insuranceSave(data);
                    }, false, action.data);
                }
            });
        }
    }

    _scheduleDialog = null;
    onSchedule(data) {
        if (this._scheduleDialog) {
            this._scheduleDialog.show(null, true, data);
        }
    }

    _monthlyPaymentDialog = null;
    onMonthlyPayment() {
        if (this._monthlyPaymentDialog) {
            this._monthlyPaymentDialog.show(data => {
                data.contractId = this.props.card.id;
                return this.props.actionMonthlyPayment(data).then(action => {
                    if (action && action.data) {
                        this.onCashOrderPrint(action.data);
                    }
                    this.onLoad(this.props.card.id);
                });
            });
        }
    }

    _annuityBuyoutDialog = null;
    onAnnuityBuyout() {
        if (this._annuityBuyoutDialog) {
            this._annuityBuyoutDialog.show(data => {
                data.contractId = this.props.card.id;
                return this.props.actionBuyout(data).then(action => {
                    if (action && action.data) {
                        this.onCashOrderPrint(action.data);
                    }
                    this.onLoad(this.props.card.id);
                });
            });
        }
    }

    _annuityAdditionDialog = null;
    onAnnuityAddition() {
        if (this._annuityAdditionDialog) {
            this._annuityAdditionDialog.show(data => {
                data.contractId = this.props.card.id;
                return this.props.actionAnnuityAddition(data).then(action => {
                    if (action && action.data) {
                        this.onCashOrderPrint(action.data);
                    }
                    this.onLoad(this.props.card.id);
                });
            });
        }
    }

    _annuityPartialPaymentDialog = null;
    onAnnuityPartialPayment() {
        if (this._annuityPartialPaymentDialog) {
            this._annuityPartialPaymentDialog.show(data => {
                data.contractId = this.props.card.id;
                return this.props.actionAnnuityPartialPayment(data).then(action => {
                    if (action && action.data) {
                        this.onCashOrderPrint(action.data);
                    }
                    this.onLoad(this.props.card.id);
                });
            });
        }
    }

    onActionOpen(action) {
        let dialog = null;
        switch (action.actionType) {
            case 10:
                dialog = this._prolongDialog;
                break;
            case 20:
                dialog = this._buyoutDialog;
                break;
            case 30:
                dialog = this._partialBuyoutDialog;
                break;
            case 40:
                dialog = this._partialPaymentDialog;
                break;
            case 50:
                dialog = this._signDialog;
                break;
            case 60:
                dialog = this._sellingDialog;
                break;
            case 70:
                dialog = this._transferDialog;
                break;
            case 80:
                dialog = this._monthlyPaymentDialog;
                break;
            case 90:
                dialog = this._annuityAdditionDialog;
                break;
        }
        if (dialog) {
            dialog.show(null, true, action);
        }
    }

    _confirmation = null;
    onActionCancel(action) {
        let id = this.props.card.id;
        this._confirmation.show("Вы действительно хотите отменить выбранное действие?",
            () => this.props.actionCancel(action).then(() => this.onLoad(id)));
    }

    onCashOrderPrint(action) {
        if (!action.rows || action.rows.length == 0) return;
        action.rows.map((item, i) => {
            if (!item.orderId) return;

            this.props.cashOrderLoad(item.orderId).then(action => {
                if (action && action.data) {
                    if (action.data.orderType == 10) {
                        this.props.print(<CashInOrderPrint data={action.data} auth={this.props.auth} />);
                    } else {
                        this.props.print(<CashOutOrderPrint data={action.data} auth={this.props.auth} />);
                    }                                    
                }
            });
        });
    }

    onFileSave(fileRow) {
        return this.props.fileSave(fileRow);
    }

    onFileRemove(fileRow) {
        return this.props.fileRemove(fileRow);
    }

    render() {
        if (!this.props.card) return <div></div>;

        const actionOptions = {
            allowDiscount: this.props.auth.permissions.indexOf(permissions.ContractDiscount) >= 0,
            profile: this.state.profile,
            configuration: this.props.configuration
        };

        return (
            <div>
                <Restrict permissions={permissions.ContractManage} pass>
                    <ContractForm onSubmit={e => this.onSave(e)} initialValues={this.props.card} enableReinitialize
                                  status={this.props.card.status} locked={this.props.card.locked} deleteDate={this.props.card.deleteDate}
                                  auth={this.props.auth}
                                  id={this.props.params.id} transferDate={this.props.card.transferDate}
                                  collateralType={this.props.card.collateralType}
                                  onSign={e => this.onSign(e)} onProlong={e => this.onProlong()} onBuyout={e => this.onBuyout()}
                                  onAddition={e => this.onAddition()}
                                  onPartialBuyout={e => this.onPartialBuyout()} onPartialPayment={e => this.onPartialPayment()}
                                  onSelling={e => this.onSelling()} onTransfer={e => this.onTransfer()}
                                  onCalculator={e => this.onCalculator()} onInsuranceSign={e => this.onInsuranceSign(e)}
                                  onSchedule={e => this.onSchedule(e)} onMonthlyPayment={e => this.onMonthlyPayment()}
                                  onAnnuityBuyout={e => this.onAnnuityBuyout()}  onAnnuityAddition={e => this.onAnnuityAddition()}
                                  onAnnuityPartialPayment={e => this.onAnnuityPartialPayment()}
                                  onActionOpen={e => this.onActionOpen(e)} onActionCancel={e => this.onActionCancel(e)}
                                  onFindProfile={e => this.onFindProfile(e)} profile={this.state.profile}
                                  onCashOrderPrint={e => this.onCashOrderPrint(e)} params={this.props.params}
                                  onPrintCard={e => this.onPrintCard(this.props.params.id)} onPrintContractCollateral={e => this.onPrintContractCollateral(this.props.params.id)}
                                  categories={this.props.categories} onFileSave={e => this.onFileSave(e)} onFileRemove={e => this.onFileRemove(e)}  />
                </Restrict>

                <Confirmation ref={r => this._confirmation = r} />

                <Dialog ref={r => this._signDialog = r} title="Подписание" form={true}>
                    <SignForm contract={this.props.card} options={actionOptions} />
                </Dialog>
                <Dialog ref={r => this._prolongDialog = r} title="Продление" form={true}>
                    <ProlongForm contract={this.props.card} options={actionOptions} />
                </Dialog>
                <Dialog ref={r => this._buyoutDialog = r} title="Выкуп" form={true}>
                    <BuyoutForm contract={this.props.card} options={actionOptions} />
                </Dialog>
                <Dialog ref={r => this._additionDialog = r} title="Добор" form={true}>
                    <AdditionForm contract={this.props.card} options={actionOptions} />
                </Dialog>
                <Dialog ref={r => this._partialBuyoutDialog = r} title="Частичный выкуп" form={true}>
                    <PartialBuyoutForm contract={this.props.card} options={actionOptions} />
                </Dialog>
                <Dialog ref={r => this._partialPaymentDialog = r} title="Частичное гашение" form={true}>
                    <PartialPaymentForm contract={this.props.card} options={actionOptions} />
                </Dialog>
                <Dialog ref={r => this._sellingDialog = r} title="Реализация" form={true}>
                    <SellingForm contract={this.props.card} options={actionOptions} />
                </Dialog>
                <Dialog ref={r => this._transferDialog = r} title="Передача" form={true}>
                    <TransferForm contract={this.props.card} options={actionOptions} />
                </Dialog>
                <Dialog ref={r => this._calculatorDialog = r} title="Калькулятор" form={true}>
                    <CalculatorForm contract={this.props.card} options={actionOptions} />
                </Dialog>
                <Dialog ref={r => this._insuranceSignDialog = r} title="Страховой договор" form={true}>
                    <InsuranceSignForm />
                </Dialog>
                <Dialog ref={r => this._scheduleDialog = r} title="График платежей" form={true}>
                    <ScheduleForm />
                </Dialog>
                <Dialog ref={r => this._monthlyPaymentDialog = r} title="Погашение" form={true}>
                    <MonthlyPaymentForm contract={this.props.card} options={actionOptions} />
                </Dialog>
                <Dialog ref={r => this._annuityBuyoutDialog = r} title="Выкуп" form={true}>
                    <AnnuityBuyoutForm contract={this.props.card} options={actionOptions} />
                </Dialog>
                <Dialog ref={r => this._annuityAdditionDialog = r} title="Добор" form={true}>
                    <AnnuityAdditionForm contract={this.props.card} options={actionOptions} />
                </Dialog>
                <Dialog ref={r => this._annuityPartialPaymentDialog = r} title="Частичное гашение" form={true}>
                    <AnnuityPartialPaymentForm contract={this.props.card} options={actionOptions} />
                </Dialog>
            </div>
        );
    }
}

export default connect(state => {
    const { workspace, auth, dictionary } = state;

    return {
        card: workspace.card,
        configuration: auth.configuration,
        auth: auth,
        categories: dictionary.categories,
        purities: dictionary.purities
    }
}, {
    cardLoad, getCard, cardSave, cardCopy,
    actionSign, actionProlong, actionBuyout, actionPartialBuyout, actionPartialPayment, actionSelling, actionCancel, actionTransfer,
    actionMonthlyPayment, actionAnnuityPartialPayment, findLoanPercent, cashOrderLoad, print, warning, categoriesLoad,
    fileSave, fileRemove, insuranceFind, insuranceSave, printLoad, printAnnuity, findOrder, puritiesLoad, actionAnnuityAddition, actionAddition
})(ContractCard);
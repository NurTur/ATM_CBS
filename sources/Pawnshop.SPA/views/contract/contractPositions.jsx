import React from 'react';
import { Field } from 'redux-form';
import classnames from 'classnames';
import { Glyphicon } from 'react-bootstrap';

import SelectInput from '../controls/form/selectInput';
import DictInput from '../controls/form/dictInput';

import { 
    positions as positionsLoad, cars as carsLoad, machineries as machineriesLoad,
    carCategories, goldCategories, goodCategories, machineryCategories, purities
} from '../../actions/dictionaries';

import { add as goldSave } from '../../actions/golds';
import { add as goodSave } from '../../actions/goods';
import { add as carSave } from '../../actions/cars';
import { add as machinerySave } from '../../actions/machineries';

import PositionForm, { submitForm as positionSubmit } from '../dictionary/positionForm';
import CarForm, { submitForm as carSubmit } from '../dictionary/carForm';
import MachineryForm, { submitForm as machinerySubmit } from '../dictionary/machineryForm';

const ContractPositions = ({ fields, collateralType, cardType, onChange, onPositionChange, readOnly, locked }) => {
    collateralType = parseInt(collateralType);
    let positionForm = null;
    let categoryDict = null;
    let categoryLoad = null;
    let displayName = null;
    switch (collateralType) {
        case 10:
            positionForm = <PositionForm onSave={goldSave} submitForm={positionSubmit} title="Новая позиция" />;
            categoryDict = 'goldCategories';
            categoryLoad = goldCategories;
            displayName = (p) => p.name;
            break;
        case 20:
            positionForm = <CarForm onSave={carSave} submitForm={carSubmit} title="Новая позиция" />;
            categoryDict = 'carCategories';
            categoryLoad = carCategories;
            displayName = (p) => p.name + ' ' + p.mark + ' ' + p.model + ' ' + p.releaseYear;
            break;
        case 30:
            positionForm = <PositionForm onSave={goodSave} submitForm={positionSubmit} title="Новая позиция" />;
            categoryDict = 'goodCategories';
            categoryLoad = goodCategories;
            displayName = (p) => p.name;
            break;
        case 40:
            positionForm = <MachineryForm onSave={machinerySave} submitForm={machinerySubmit} title="Новая позиция" />;
            categoryDict = 'machineryCategories';
            categoryLoad = machineryCategories;
            displayName = (p) => p.name + ' ' + p.mark + ' ' + p.model + ' ' + p.releaseYear;
            break;
    }

    return (
        <div className="row">
            {locked ||
                <div className="col-xs-12" style={{marginBottom: 15}}>
                    <div className="pull-right">
                        <button type="button" className="btn btn-default" title="Добавить" onClick={() => {
                            fields.push({
                                positionCount: 1
                            });
                            onChange();
                        }}><Glyphicon glyph="plus"/></button>
                    </div>
                </div>
            }
            {fields.map((position, i) => (
                <div key={i} className="col-sm-12 col-md-12 col-lg-12">
                    <div className="thumbnail">
                        <div className="caption">
                            <div className="form-group">
                                <div className="col-xs-12">
                                    <h4 className="pull-left">Позиция №{i + 1}</h4>
                                    {locked ||
                                        <div className="pull-right">
                                            <button type="button" className="btn btn-default" title="Удалить" onClick={() => {
                                                fields.remove(i);
                                                onChange();
                                            }}><Glyphicon glyph="trash"/></button>
                                        </div>
                                    }
                                </div>
                            </div>

                            <fieldset disabled={readOnly}>
                                <div className="form-group">
                                    <label htmlFor={`${position}.position`} className="col-sm-4">Позиция</label>
                                    <div className="col-sm-8">
                                        <Field name={`${position}.position`} component={SelectInput} className="form-control"
                                               title="Выбор позиции" disabled={locked} locked={locked} onLoad={query => {
                                                   query.model = { collateralType: collateralType };
                                                   switch (collateralType) {
                                                       case 20:
                                                           return carsLoad(query);
                                                       case 40:
                                                           return machineriesLoad(query);
                                                       default:
                                                           return positionsLoad(query);
                                                   }
                                               }}
                                               display={e => displayName(e)} onChange={e => onPositionChange(`${position}.positionId`, (e && e.id) || null)}>
                                            {positionForm}
                                        </Field>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor={`${position}.categoryId`} className="col-sm-4">Категория</label>
                                    <div className="col-sm-8">
                                        <Field name={`${position}.categoryId`} component={DictInput} className="form-control"
                                               onLoad={categoryLoad} dictionary={categoryDict} disabled={cardType > 10} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor={`${position}.positionCount`} className="col-sm-4">Количество</label>
                                    <div className="col-sm-8">
                                        <Field name={`${position}.positionCount`} component="input" type="number" min="1" max="10" className="form-control" disabled={locked} />
                                    </div>
                                </div>
                                <hr />
                            </fieldset>

                            <fieldset disabled={locked} className={classnames({
                                "hidden": collateralType != 10,
                            })}>
                                <div className="form-group">
                                    <label htmlFor={`${position}.positionSpecific.collateralTotalWeight`} className="col-sm-4">Общий вес</label>
                                    <div className="col-sm-8">
                                        <Field name={`${position}.positionSpecific.collateralTotalWeight`} component={({input}) => (
                                            <input value={input.value} min="0" max="1000" step="0.01" type="number" className="form-control" onChange={e => {
                                                input.onChange(e);
                                                onChange();
                                            }} />
                                        )} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor={`${position}.positionSpecific.collateralSpecificWeight`} className="col-sm-4">Чистый вес</label>
                                    <div className="col-sm-8">
                                        <Field name={`${position}.positionSpecific.collateralSpecificWeight`} component={({input}) => (
                                            <input value={input.value} min="0" max="1000" step="0.01" type="number" className="form-control" onChange={e => {
                                                input.onChange(e);
                                                onChange();
                                            }} />
                                        )} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor={`${position}.positionSpecific.purityId`} className="col-sm-4">Проба</label>
                                    <div className="col-sm-8">
                                        <Field name={`${position}.positionSpecific.purityId`} component={DictInput} className="form-control"
                                               dictionary="purities" onLoad={purities} />
                                    </div>
                                </div>
                                <hr />
                            </fieldset>

                            <fieldset disabled={locked}>
                                <div className="form-group">
                                    <label htmlFor={`${position}.estimatedCost`} className="col-sm-4">Оценка</label>
                                    <div className="col-sm-8">
                                        <Field name={`${position}.estimatedCost`} component="input" min="0" max="100000000" type="number" className="form-control" disabled />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor={`${position}.loanCost`} className="col-sm-4">Ссуда</label>
                                    <div className="col-sm-8">
                                        <Field name={`${position}.loanCost`} component={({input}) => (
                                            <input value={input.value} min="0" max="100000000" type="number" className="form-control" onChange={e => {
                                                input.onChange(e);
                                                onPositionChange(`${position}.estimatedCost`, e.target.value);
                                                onChange();
                                            }} disabled={cardType > 10} />
                                        )} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor={`${position}.note`} className="col-xs-12">Примечание</label>
                                    <div className="col-xs-12">
                                        <Field name={`${position}.note`} component="textarea" rows="5" className="form-control" />
                                    </div>
                                </div>
                            </fieldset>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ContractPositions;
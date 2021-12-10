import {useDispatch, useSelector} from "react-redux";
import { BigNumber} from "@waves/bignumber";
import {armyUnits, armyUnitsUpgrades} from "../../database/army";
import './army.css'
import {stateUpdaters} from "../../state/ui/actions";
import {interactionActions} from "../../state/game/army/actions";
import CostComponent from "../general/cost.component";
import formatBig from "../general/fmt-val";
import {Scrollbars} from "react-custom-scrollbars";
import classNames from "classnames";
import {goldUnits} from "../../database/gold";

const ArmyUnit = ({unit, qty}) => {
    const dispatch = useDispatch();
    const quantity = qty || new BigNumber(0);
    return (<div
        className={'unit-item'}
        onClick={e => dispatch(stateUpdaters.setArmyUnit.make(unit.id))}
    >
        <div className={'inner'}>
            <p>{unit.name}</p>
            <span>{formatBig(quantity.roundTo(0))}</span>
        </div>
    </div>)
}

function Army() {
    const dispatch = useDispatch();
    const { army } = useSelector(state => state.game);
    const { armyCalculations, armyUnit, availableUpgrades } = useSelector(state => state.ui);
    const currentUnit = armyUnits.find(one => one.id === armyUnit);
    const upgradesAvailable = armyUnitsUpgrades.filter(
        one => Array.isArray(one.targetId)
            ? one.targetId.includes(armyUnit)
            : one.targetId === armyUnit
    ).map(one => ({
        ...one,
        level: army.upgrades[one.id] || new BigNumber(0),
        cost: availableUpgrades?.find(u => u.id === one.id) || {}
    }))

    return(<div className={classNames('army-screen','units-screen')}>
        <div className={'units'}>
            <Scrollbars style={{ width: 280, height: '100vh' }}>
            {armyUnits
                .filter((item, index) => index <= 0 || (
                    army.units[armyUnits[index-1].id] && army.units[armyUnits[index-1].id].gt(0)
                ))
                .map(one => <ArmyUnit unit={one} qty={army.units ? army.units[one.id] : null}/>)}
            </Scrollbars>
        </div>
        <div className={'unit-details'}>
            {currentUnit && (<div>
                <h4>{currentUnit.name}</h4>
                <div className={'columns'}>
                    <div className={'main-column'}>
                        <div className={'main-desc-area'}>
                            <p>You have {formatBig(army.units[armyUnit])} units.</p>
                            {armyCalculations && (<>
                                <p>In total they produce:</p>
                                <CostComponent cost={armyCalculations.ECP}></CostComponent>
                            </>)}
                        </div>
                        <div className={'upgrade-area'}>
                            {upgradesAvailable.map(u => (<div className={'upgrade'}>
                                <p className={'upgrade-title'}>{u.name} ({formatBig(u.level.roundTo(0))})</p>
                                <CostComponent cost={u.cost.costs}></CostComponent>
                                {u.cost.isAvailable && (<button onClick={e=>dispatch(interactionActions.purchaseUpgrade.make({
                                    id: u.id,
                                    amount: 1,
                                }))}>Purchase</button>)}
                            </div> ))}
                        </div>

                    </div>
                    <div className={'purchase-column'}>
                        {armyCalculations && (<>
                            <div className={'costArea'}>
                                <p>Each {currentUnit.name} costs:</p>
                                <CostComponent cost={armyCalculations.perUnit?.cost} />
                            </div>
                            <div className={'purchaseArea'}>
                                <div><button
                                    className={'big'}
                                    onClick={e => dispatch(interactionActions.purchase.make({
                                        id: currentUnit.id,
                                        amount: new BigNumber(1)
                                    }))}
                                >Buy 1</button></div>
                                <div><button
                                    className={'big'}
                                    onClick={e => dispatch(interactionActions.purchase.make({
                                        id: currentUnit.id,
                                        amount: armyCalculations.per10Percent?.qty
                                    }))}
                                >Buy {formatBig(armyCalculations.per10Percent?.qty)}</button></div>
                                <div><button
                                    className={'big'}
                                    onClick={e => dispatch(interactionActions.purchase.make({
                                        id: currentUnit.id,
                                        amount: armyCalculations.perMax?.qty
                                    }))}
                                >Buy {formatBig(armyCalculations.perMax?.qty)}</button></div>

                            </div></>)}
                    </div>
                </div>

            </div>)}
        </div>
    </div>)
}

export default Army;
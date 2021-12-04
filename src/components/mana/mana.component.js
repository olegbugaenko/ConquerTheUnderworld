import {useDispatch, useSelector} from "react-redux";
import { BigNumber} from "@waves/bignumber";
import {manaUnits, manaUnitsUpgrades} from "../../database/mana";
import './mana.css'
import {stateUpdaters} from "../../state/ui/actions";
import {interactionActions} from "../../state/game/mana/actions";
import CostComponent from "../general/cost.component";
import formatBig from "../general/fmt-val";
import {goldUnitsUpgrades} from "../../database/gold";

const ManaUnit = ({unit, qty}) => {
    const dispatch = useDispatch();
    const quantity = qty || new BigNumber(0);
    return (<div
        className={'unit-item'}
        onClick={e => dispatch(stateUpdaters.setManaUnit.make(unit.id))}
    >
        <p>{unit.name} <span>{quantity.valueOf()}</span></p>
    </div>)
}

function Mana() {
    const dispatch = useDispatch();
    const { mana } = useSelector(state => state.game);
    const { manaUnitCalculations, manaUnit, availableUpgrades } = useSelector(state => state.ui);
    const currentUnit = manaUnits.find(one => one.id === manaUnit);
    const upgradesAvailable = manaUnitsUpgrades.filter(
        one => Array.isArray(one.targetId)
            ? one.targetId.includes(manaUnit)
            : one.targetId === manaUnit
    ).map(one => ({
        ...one,
        level: mana.upgrades[one.id] || new BigNumber(0),
        cost: availableUpgrades?.find(u => u.id === one.id) || {}
    }))
    return(<div className={'mana-screen'}>
        <div className={'units'}>
            {manaUnits.map(one => <ManaUnit unit={one} qty={mana.units ? mana.units[one.id] : null}/>)}
        </div>
        <div className={'unit-details'}>
            {currentUnit && (<div>
                <h4>{currentUnit.name}</h4>
                {manaUnitCalculations && (<>
                    <div className={'costArea'}>
                        <p>Each {currentUnit.name} costs:</p>
                        <CostComponent cost={manaUnitCalculations.perUnit.cost} />
                    </div>
                    <div className={'purchaseArea'}>
                    <div><button
                        onClick={e => dispatch(interactionActions.purchase.make({
                            id: currentUnit.id,
                            amount: new BigNumber(1)
                        }))}
                    >Buy 1</button></div>
                    <div><button
                        onClick={e => dispatch(interactionActions.purchase.make({
                            id: currentUnit.id,
                            amount: manaUnitCalculations.per10Percent?.qty
                        }))}
                    >Buy {formatBig(manaUnitCalculations.per10Percent?.qty)}</button></div>
                        <div><button
                            onClick={e => dispatch(interactionActions.purchase.make({
                                id: currentUnit.id,
                                amount: manaUnitCalculations.perMax?.qty
                            }))}
                        >Buy {formatBig(manaUnitCalculations.perMax?.qty)}</button></div>
                </div><div className={'upgrade-area'}>
                    {upgradesAvailable.map(u => (<div className={'upgrade'}>
                        <p className={'upgrade-title'}>{u.name} ({formatBig(u.level.roundTo(0))})</p>
                        <CostComponent cost={u.cost.costs}></CostComponent>
                        {u.cost.isAvailable && (<button onClick={e=>dispatch(interactionActions.purchaseUpgrade.make({
                            id: u.id,
                            amount: 1,
                        }))}>Purchase</button>)}
                    </div> ))}
                </div></>)}
            </div>)}
        </div>
    </div>)
}

export default Mana;
import {useDispatch, useSelector} from "react-redux";
import { BigNumber} from "@waves/bignumber";
import {goldUnits, goldUnitsUpgrades} from "../../database/gold";
import './gold.css'
import {stateUpdaters} from "../../state/ui/actions";
import {interactionActions} from "../../state/game/gold/actions";
import CostComponent from "../general/cost.component";
import formatBig from "../general/fmt-val";

const GoldUnit = ({unit, qty}) => {
    const dispatch = useDispatch();
    const quantity = qty || new BigNumber(0);
    return (<div
        className={'unit-item'}
        onClick={e => dispatch(stateUpdaters.setGoldUnit.make(unit.id))}
    >
        <p>{unit.name} <span>{formatBig(quantity)}</span></p>
    </div>)
}

function Gold() {
    const dispatch = useDispatch();
    const { gold } = useSelector(state => state.game);
    const { goldUnitCalculations, goldUnit, availableUpgrades } = useSelector(state => state.ui);
    const currentUnit = goldUnits.find(one => one.id === goldUnit);
    const upgradesAvailable = goldUnitsUpgrades.filter(
        one => Array.isArray(one.targetId)
            ? one.targetId.includes(goldUnit)
            : one.targetId === goldUnit
    ).map(one => ({
        ...one,
        level: gold.upgrades[one.id] || new BigNumber(0),
        cost: availableUpgrades?.find(u => u.id === one.id) || {}
    }))

    return(<div className={'gold-screen'}>
        <div className={'units'}>
            {goldUnits.map(one => <GoldUnit unit={one} qty={gold.units ? gold.units[one.id] : null}/>)}
        </div>
        <div className={'unit-details'}>
            {currentUnit && (<div>
                <h4>{currentUnit.name}</h4>
                {goldUnitCalculations && (<>
                    <div className={'costArea'}>
                        <p>Each {currentUnit.name} costs:</p>
                        <CostComponent cost={goldUnitCalculations.perUnit.cost} />
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
                            amount: goldUnitCalculations.per10Percent.qty
                        }))}
                    >Buy {formatBig(goldUnitCalculations.per10Percent.qty)}</button></div>
                        <div><button
                            onClick={e => dispatch(interactionActions.purchase.make({
                                id: currentUnit.id,
                                amount: goldUnitCalculations.perMax.qty
                            }))}
                        >Buy {formatBig(goldUnitCalculations.perMax.qty)}</button></div>
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

export default Gold;
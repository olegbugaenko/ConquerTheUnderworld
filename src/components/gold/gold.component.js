import {useDispatch, useSelector} from "react-redux";
import { BigNumber} from "@waves/bignumber";
import {goldUnits, goldUnitsUpgrades} from "../../database/gold";
import './gold.css'
import {stateUpdaters} from "../../state/ui/actions";
import {stateUpdaters as HeroUpdaters} from "../../state/game/hero/actions";
import {interactionActions} from "../../state/game/gold/actions";
import CostComponent from "../general/cost.component";
import formatBig from "../general/fmt-val";
import {Scrollbars} from "react-custom-scrollbars";
import classNames from "classnames";

const GoldUnit = ({unit, qty}) => {
    const dispatch = useDispatch();
    const quantity = qty || new BigNumber(0);
    return (<div
        className={'unit-item'}
        onClick={e => dispatch(stateUpdaters.setGoldUnit.make(unit.id))}
    >
        <div className={'inner'}>
            <p>{unit.name} </p>
            <span>{formatBig(quantity.roundTo(0))}</span>
        </div>
    </div>)
}

function Gold() {
    const dispatch = useDispatch();
    const { gold, hero } = useSelector(state => state.game);
    const { goldUnitCalculations, goldUnit, availableUpgrades, necklacesCalculations } = useSelector(state => state.ui);
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

    return(<div className={classNames('units-screen','gold-screen')}>
        <div className={'units'}>
            <Scrollbars style={{ width: 280, height: '100vh' }}>
            {goldUnits
                .filter((item, index) => index <= 0 || (
                    gold.units[goldUnits[index-1].id] && gold.units[goldUnits[index-1].id].gt(0)
                ))
                .map(one => <GoldUnit unit={one} qty={gold.units ? gold.units[one.id] : null}/>)}
            </Scrollbars>
        </div>
        <div className={'unit-details'}>
            {currentUnit && (<div>
                <h4>{currentUnit.name}</h4>
                <div className={'columns'}>
                    <div className={'main-column'}>
                        <div className={'main-desc-area'}>
                            <p>You have {formatBig(gold.units[goldUnit])} units.</p>
                            {goldUnitCalculations && (<>
                                <p>In total they produce:</p>
                                <CostComponent cost={goldUnitCalculations.ECP}></CostComponent>
                            </>)}
                        </div>
                        <p>Necklaces: {formatBig(hero.necklaces.perUnit_gold[currentUnit.id] || new BigNumber(0))}</p>
                        <button
                            onClick={(e) => dispatch(HeroUpdaters.addNecklaceToUnit.make({
                                necklaceId: 'gold',
                                unitId: currentUnit.id,
                            }))}
                        >Add necklace ( {formatBig(necklacesCalculations?.free?.gold || hero.necklaces.gold)} left)</button>
                        {upgradesAvailable.map(u => (<div className={'upgrade'}>
                            <p className={'upgrade-title'}>{u.name} ({formatBig(u.level.roundTo(0))})</p>
                            <CostComponent cost={u.cost.costs}></CostComponent>
                            {u.cost.isAvailable && (<button onClick={e=>dispatch(interactionActions.purchaseUpgrade.make({
                                id: u.id,
                                amount: 1,
                            }))}>Purchase</button>)}
                        </div> ))}
                    </div>
                    <div className={'purchase-column'}>
                        {goldUnitCalculations && (<>
                            <div className={'costArea'}>
                                <p>Each {currentUnit.name} costs:</p>
                                <CostComponent cost={goldUnitCalculations.perUnit.cost} />
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
                                        amount: goldUnitCalculations.per10Percent.qty
                                    }))}
                                >Buy {formatBig(goldUnitCalculations.per10Percent.qty)}</button></div>
                                <div><button
                                    className={'big'}
                                    onClick={e => dispatch(interactionActions.purchase.make({
                                        id: currentUnit.id,
                                        amount: goldUnitCalculations.perMax.qty
                                    }))}
                                >Buy {formatBig(goldUnitCalculations.perMax.qty)}</button></div>
                            </div><div className={'upgrade-area'}>

                        </div></>)}
                    </div>
                </div>
            </div>)}
        </div>
    </div>)
}

export default Gold;
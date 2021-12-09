import {useDispatch, useSelector} from "react-redux";
import { BigNumber} from "@waves/bignumber";
import {skills} from "../../database/skills";
import './energy.css';
import {interactionActions, stateUpdaters} from "../../state/game/hero/actions";
import CostComponent from "../general/cost.component";
import formatBig from "../general/fmt-val";
import classNames from "classnames";


function Energy() {
    const dispatch = useDispatch();
    const { hero } = useSelector(state => state.game);
    const { trainingCalculations, necklacesCalculations } = useSelector(state => state.ui);
    return(<div className={'energy-screen'}>
        <div className={'skills-data'}>
            <h4>Training</h4>
        </div>
        <div className={classNames('skills','columns')}>
            {skills.map(one => (
                <div className={classNames('skill-data','column')}>
                    <div className={'skillName'}>
                        <p>{one.name} ({formatBig(one.level)})</p>
                    </div>
                    <CostComponent cost={trainingCalculations.find(u => u.id === one.id)?.costs} />
                    <div>
                        <button
                            onClick={e => dispatch(interactionActions.purchaseSkill.make({
                                id: one.id,
                                amount: new BigNumber(1)
                            }))}
                        >Train</button>
                    </div>
                </div>
            ))}
        </div>
        <div className={'skills-data'}>
            <h4>Necklaces</h4>
        </div>
        <div className={classNames('necklaces', 'columns')}>
            <div className={classNames('skill-data','column')}>
                <div className={'skillName'}>
                    <p>Gold necklace ({formatBig(hero.necklaces.gold)})</p>
                </div>
                <div className={'cost'}>
                    <p>Gold: {formatBig(necklacesCalculations?.prices?.gold)}</p>
                </div>
                <div>
                    <button
                        onClick={e => dispatch(interactionActions.purchaseNecklace.make({
                            id: 'gold',
                        }))}
                    >Purchase</button>
                </div>
            </div>
            <div className={classNames('skill-data','column')}>
                <div className={'skillName'}>
                    <p>Mana necklace ({formatBig(hero.necklaces.mana)})</p>
                </div>
                <div className={'cost'}>
                    <p>Mana: {formatBig(necklacesCalculations?.prices?.mana)}</p>
                </div>
                <div>
                    <button
                        onClick={e => dispatch(interactionActions.purchaseNecklace.make({
                            id: 'mana',
                        }))}
                    >Purchase</button>
                </div>
            </div>
        </div>

    </div>)
}

export default Energy;
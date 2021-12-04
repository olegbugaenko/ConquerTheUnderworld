import {useDispatch, useSelector} from "react-redux";
import { BigNumber} from "@waves/bignumber";
import {skills} from "../../database/skills";
import './energy.css';
import {interactionActions} from "../../state/game/hero/actions";
import CostComponent from "../general/cost.component";
import formatBig from "../general/fmt-val";


function Energy() {
    const dispatch = useDispatch();
    const { hero } = useSelector(state => state.game);
    const { trainingCalculations } = useSelector(state => state.ui);
    return(<div className={'energy-screen'}>
        <div className={'skills'}>
            {skills.map(one => (
                <div className={'skill-data'}>
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

    </div>)
}

export default Energy;
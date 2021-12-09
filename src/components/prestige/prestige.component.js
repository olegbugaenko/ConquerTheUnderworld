import classNames from "classnames";
import {useDispatch, useSelector} from "react-redux";
import {BigNumber} from "@waves/bignumber";
import formatBig from "../general/fmt-val";
import './prestige.css'
import { stateUpdaters, interactionActions } from "../../state/game/prestige/actions";
import { prestiges } from "../../database/prestige";
import CostComponent from "../general/cost.component";
import {useEffect} from "react";
import {Scrollbars} from "react-custom-scrollbars";

function Prestige() {
    const { prestige } = useSelector(state => state.game);
    const { prestigeCalculations, page } = useSelector(state => state.ui);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(interactionActions.updateCosts.make())
    },[]);
    return (<div className={'prestiges'}>
        <Scrollbars style={{ height: '100vh' }}>
        <div className={classNames('prestige-items','columns')}>
            {prestiges.filter(p => p.prophecyId === page).map(one => {
                return (
                    <div className={'prestige-item'}>
                        <div className={'inner-wrap'}>
                            <p>{one.name} ({formatBig(prestige.upgrades[one.id] || new BigNumber(0))})</p>
                            <p>{one.description}</p>
                            <CostComponent cost={prestigeCalculations?.find(o => o.id === one.id)?.costs || {}}>
                            </CostComponent>
                            <button
                                onClick={
                                    e => dispatch(interactionActions.purchase.make(one.id))
                                }
                            >
                                Purchase 1
                            </button>
                        </div>

                    </div>
                )
            })}
        </div>
        </Scrollbars>
        <div className={'settings'}>
            <span> Prestige: {formatBig(prestige.prestige[page] || new BigNumber(0))}</span>
        </div>
        <div>
            <button onClick={e => dispatch(interactionActions.startRun.make())}>START RUN</button>
        </div>
    </div> )
}

export default Prestige;
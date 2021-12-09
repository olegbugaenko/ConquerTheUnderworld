import classNames from "classnames";
import {useDispatch, useSelector} from "react-redux";
import {BigNumber} from "@waves/bignumber";
import formatBig from "../general/fmt-val";
import './battle.css'
import {stateUpdaters} from "../../state/game/battle/actions";
import {interactionActions} from "../../state/game/prestige/actions";

function Battle() {
    const { battle, army } = useSelector(state => state.game);
    const dispatch = useDispatch();
    return (<div className={'battle'}>
        <div className={classNames('enemies','columns')}>
            <div className={classNames('stats','me')}>
                <p>Quantity: {formatBig(army.units.warrior0?.roundTo(0) || new BigNumber(0))}</p>
                <p>HP: {formatBig(army.stats?.hp?.roundTo(0) || new BigNumber(0))}</p>
                <p>Attack: {formatBig(army.stats?.at?.roundTo(0) || new BigNumber(0))}</p>
                <p>Defense: {formatBig(army.stats?.df?.roundTo(0) || new BigNumber(0))}</p>
            </div>
            <div className={classNames('stats','opponents')}>
                {battle.enemy ? (
                    <>
                        <p>Quantity: {formatBig(battle.enemy.units.qty?.roundTo(0) || new BigNumber(0))}</p>
                        <p>HP: {formatBig(battle.enemy.total.hp?.roundTo(0) || new BigNumber(0))}</p>
                        <p>Attack: {formatBig(battle.enemy.total.at?.roundTo(0) || new BigNumber(0))}</p>
                        <p>Defense: {formatBig(battle.enemy.total.df?.roundTo(0) || new BigNumber(0))}</p>
                    </>
                ) : (
                    <p>Searching for enemy...</p>
                    )}

            </div>
        </div>
        <div className={'settings'}>
            <span>Level: {formatBig(battle.level)} of {formatBig(battle.maxLevel)}</span>
            <span> Fame: {formatBig(battle.fame)}</span>
            <div>
                <button onClick={e => dispatch(stateUpdaters.setBattleInProgress.make(!battle.isBattleInProgress))}>
                    {battle.isBattleInProgress ? 'Stop' : 'Start'}
                </button>
                <input
                    type="checkbox"
                    checked={battle.isAutoAdvance}
                    onClick={(e) => dispatch(stateUpdaters.setAutoAdvance.make(!battle.isAutoAdvance))}
                />
            </div>
            <div className={'prestige-area'}>
                {battle.fame && battle.fame.gte(10) && (
                    <button onClick={e => dispatch(interactionActions.doPrestige.make())}>
                        Prestige
                    </button>
                )}
            </div>
        </div>
    </div> )
}

export default Battle;
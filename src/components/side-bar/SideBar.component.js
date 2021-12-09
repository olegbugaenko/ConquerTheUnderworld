import {useSelector, useDispatch} from "react-redux";
import classNames from 'classnames';
import {stateUpdaters as uiActions} from "../../state/ui/actions";
import './menu.css'
import formatBig from "../general/fmt-val";
import {interactionActions} from "../../state/game/actions";
import {useRef} from "react";
import { prophecies, prestiges } from "../../database/prestige";

function SideBar() {
    const inputFile = useRef(null);
    const energy = useSelector(state => state.game.hero.energy || {});
    const gold = useSelector(state => state.game.gold || {});
    const mana = useSelector(state => state.game.mana || {});
    const army = useSelector(state => state.game.army || {});
    const battle = useSelector(state => state.game.battle || {});
    const prestige = useSelector(state => state.game.prestige || {});
    const page = useSelector(state => state.ui.page || {});
    const dispatch = useDispatch();
    const onButtonClick = () => {
        // `current` points to the mounted file input element
        inputFile.current.click();
    };
    const onSelectLoad = (e) => {
        console.log('loadGame', e.target.files);
        if(e.target.files.length) {
            var file = e.target.files[0];
            if (file) {
                var reader = new FileReader();
                reader.readAsText(file, "UTF-8");
                reader.onload = function (evt) {
                    console.log('SPAWN: ',interactionActions.load.make(evt.target.result));
                    dispatch(interactionActions.load.make(evt.target.result));
                }
                reader.onerror = function (evt) {
                    alert('Error loading game!');
                }
            }
        }

    }

    if(prestige.isPrestiging) {
        return (<aside>
            <div
                className={classNames({
                    'menu-item': 1,
                    'active': page === prophecies[0].id
                })}
                onClick={e => dispatch(uiActions.setPage.make(prophecies[0].id))}
            >
                <p>
                    {prophecies[0].name}
            </p>
            </div>
            <div
                className={classNames({
                    'menu-item': 1,
                    'active': page === prophecies[1].id
                })}
                onClick={e => dispatch(uiActions.setPage.make(prophecies[1].id))}
            >
                <p>
                    {prophecies[1].name}
                </p>
            </div>
            <div
                className={classNames({
                    'menu-item': 1,
                    'active': page === prophecies[2].id
                })}
                onClick={e => dispatch(uiActions.setPage.make(prophecies[2].id))}
            >
                <p>
                    {prophecies[2].name}
                </p>
            </div>
            {prestige.upgrades.warrior1 && prestige.upgrades.warrior1.gt(0) && (
                <div
                    className={classNames({
                        'menu-item': 1,
                        'active': page === prophecies[3].id
                    })}
                    onClick={e => dispatch(uiActions.setPage.make(prophecies[3].id))}
                >
                    <p>
                        {prophecies[3].name}
                    </p>
                </div>
            )}
            {prestige.upgrades.merchant1 && prestige.upgrades.merchant1.gt(0) && (
                <div
                    className={classNames({
                        'menu-item': 1,
                        'active': page === prophecies[4].id
                    })}
                    onClick={e => dispatch(uiActions.setPage.make(prophecies[4].id))}
                >
                    <p>
                        {prophecies[4].name}
                    </p>
                </div>
            )}
        </aside>)
    }

    return(<aside>
        <div
            className={classNames({
                'menu-item': 1,
                'active': page === 'energy'
            })}
             onClick={e => dispatch(uiActions.setPage.make('energy'))}
        >
            <p>
                {'Energy: '}</p><p>
                {formatBig(energy.value?.roundTo(0))}
                {' / '}
                {formatBig(energy.maxValue?.roundTo(0))}
            </p>
        </div>
        <div
            className={classNames({
                'menu-item': 1,
                'active': page === 'gold'
            })}
            onClick={e => dispatch(uiActions.setPage.make('gold'))}
        >
            <p>
                {'Gold: '}
            {formatBig(gold.gold.roundTo(0))}
        </p>
        </div>
        <div
            className={classNames({
                'menu-item': 1,
                'active': page === 'mana'
            })}
            onClick={e => dispatch(uiActions.setPage.make('mana'))}
        >
            <p>
                {'Mana: '}
                {formatBig(mana.mana.roundTo(0))}
            </p>
        </div>
        <div
            className={classNames({
                'menu-item': 1,
                'active': page === 'army'
            })}
            onClick={e => dispatch(uiActions.setPage.make('army'))}
        >
            <p>
                {'Army: '}
                {formatBig(army.units?.warrior0?.roundTo(0))}
            </p>
        </div>
        <div
            className={classNames({
                'menu-item': 1,
                'active': page === 'battle'
            })}
            onClick={e => dispatch(uiActions.setPage.make('battle'))}
        >
            <p>
                {'Battle: '}
                {formatBig(battle.level)}
            </p>
        </div>
        <div></div>
        <div>
            <button onClick={(e) => dispatch(interactionActions.save.make())}>Save</button>
            <button onClick={(e) => onButtonClick()}>Load</button>
            <input
                type='file'
                id='file'
                ref={inputFile}
                style={{display: 'none'}}
                onChange={onSelectLoad}
            />
        </div>
    </aside>)
}

export default SideBar;
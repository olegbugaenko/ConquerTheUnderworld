import {useSelector, useDispatch} from "react-redux";
import classNames from 'classnames';
import {stateUpdaters as uiActions} from "../../state/ui/actions";
import './menu.css'
import formatBig from "../general/fmt-val";
import {interactionActions} from "../../state/game/actions";
import {useRef} from "react";

function SideBar() {
    const inputFile = useRef(null);
    const energy = useSelector(state => state.game.hero.energy || {});
    const gold = useSelector(state => state.game.gold || {});
    const mana = useSelector(state => state.game.mana || {});
    const army = useSelector(state => state.game.army || {});
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
                {formatBig(energy.value)}
                {' / '}
                {formatBig(energy.maxValue)}
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
            {formatBig(gold.gold)}
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
                {formatBig(mana.mana)}
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
                {formatBig(army.units?.warrior0)}
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
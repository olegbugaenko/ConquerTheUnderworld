import {useSelector, useDispatch} from "react-redux";
import classNames from 'classnames';
import {stateUpdaters as uiActions} from "../../state/ui/actions";
import './menu.css'
import formatBig from "../general/fmt-val";

function SideBar() {
    const energy = useSelector(state => state.game.hero.energy || {});
    const gold = useSelector(state => state.game.gold || {});
    const mana = useSelector(state => state.game.mana || {});
    const page = useSelector(state => state.ui.page || {});
    const dispatch = useDispatch();
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
    </aside>)
}

export default SideBar;
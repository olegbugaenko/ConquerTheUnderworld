import SideBar from "./side-bar/SideBar.component";
import './game.css';
import Gold from "./gold/gold.component";
import Mana from "./mana/mana.component";
import {useSelector} from "react-redux";
import Energy from "./energy/energy.component";
import Army from './army/army.component';

const renderContent = page => {
    switch (page) {
        case 'gold':
            return <Gold></Gold>
        case 'mana':
            return <Mana></Mana>
        case 'energy':
            return <Energy></Energy>
        case 'army':
            return <Army></Army>
        default:
            return 'Content'
    }
}

function Game () {
    const page = useSelector(state => state.ui.page);
    return (
        <main className={'wrap'}>
            <div className={'sidebar'}>
                <SideBar />
            </div>
            <div className={'content'}>{renderContent(page)}</div>
        </main>
    )
}

export default Game;
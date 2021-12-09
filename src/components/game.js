import SideBar from "./side-bar/SideBar.component";
import './game.css';
import Gold from "./gold/gold.component";
import Mana from "./mana/mana.component";
import {useSelector} from "react-redux";
import Energy from "./energy/energy.component";
import Army from './army/army.component';
import Battle from "./battle/battle.component";
import Prestige from "./prestige/prestige.component";

function RenderContent ({page}) {
    const prestige = useSelector(state => state.game.prestige);
    if(prestige.isPrestiging) {
        return (<Prestige></Prestige>)
    }
    switch (page) {
        case 'gold':
            return <Gold></Gold>
        case 'mana':
            return <Mana></Mana>
        case 'energy':
            return <Energy></Energy>
        case 'army':
            return <Army></Army>
        case 'battle':
            return <Battle></Battle>
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
            <div className={'content'}><RenderContent page={page}/></div>
        </main>
    )
}

export default Game;
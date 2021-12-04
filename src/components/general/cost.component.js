import { goldUnits } from "../../database/gold";
import { manaUnits} from "../../database/mana";
import './costs.css';
import formatBig from "./fmt-val";

const CostComponent = ({ cost }) => {
    const costArray = [];
    for(const key in cost) {
        let title;
        if (key !== 'unit') {
            switch (key) {
                case 'gold':
                    title = 'gold';
                    break;
                case 'mana':
                    title = 'mana';
                    break;
                default:
                    title = key;
                    break;
            }
            costArray.push({
                title,
                amount: cost[key]
            });
        } else {
            for (const unitKey in cost.unit) {
                const unit = goldUnits.find(one => one.id === unitKey)
                    || manaUnits.find(one => one.id === unitKey);
                if (unit) {
                    costArray.push({
                        title: unit.name,
                        amount: cost.unit[unitKey]
                    })
                }
            }
        }
    }
    return (<div className={'costs'}>
        {
            costArray.map(({ title, amount }) => (<p>
                {formatBig(amount)}
                {' '}
                {title}
            </p>))
        }
    </div>)
}

export default CostComponent;
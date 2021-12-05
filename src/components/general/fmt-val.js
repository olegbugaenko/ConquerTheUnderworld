import {BigNumber} from "@waves/bignumber";

const formatBig = (amount, isInt) => {
    if(!amount) return '0.00';
    try {
        amount.lt(1000);
    } catch (e) {
        console.error('ERRAM: ', amount);
        console.error(e);
    }
    if(amount.lt(1000)) return amount.valueOf();
    if(amount.lt(1000000)) return `${amount.div(1000).toFixed(2)}K`;
    if(amount.lt(1000000000)) return `${amount.div(1000000).toFixed(2)}M`;
    if(amount.lt(1000000000000)) return `${amount.div(1000000000).toFixed(2)}B`;
    if(amount.lt(1000000000000000)) return `${amount.div(1000000000000).toFixed(2)}T`;
    if(amount.lt(1000000000000000000)) return `${amount.div(1000000000000000).toFixed(2)}Qa`;
    if(amount.lt(1000000000000000000000)) return `${amount.div(1000000000000000000).toFixed(2)}Qi`;
    if(amount.lt(1000000000000000000000000)) return `${amount.div(1000000000000000000000).toFixed(2)}Sx`;
    return amount.valueOf();
}

export default formatBig;
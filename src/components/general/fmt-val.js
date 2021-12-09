import {BigNumber} from "@waves/bignumber";

function coeffToString(a) {
    var s, z,
        i = 1,
        j = a.length,
        r = a[0] + '';

    for (; i < j;) {
        s = a[i++] + '';
        z = 14 - s.length;
        for (; z--; s = '0' + s);
        r += s;
    }

    // Determine trailing zeros.
    for (j = r.length; r.charCodeAt(--j) === 48;);

    return r.slice(0, j + 1 || 1);
}

const formatBig = (amount, isInt) => {
    if(!amount) return '0';
    if(!(amount instanceof BigNumber)) {
        amount = new BigNumber(amount);
    }
    try {
        amount.lt(1000);
    } catch (e) {
        console.error('ERRAM: ', amount);
        console.error(e);
    }
    if(amount.lt(1.e-4)) {
        if(amount.lt('1.e-20') || !amount.bn.c) return '0';
        console.log('amount.bn.c', amount.bn.c);
        const strM = coeffToString(amount.bn.c);
        const rsM = (strM.length > 1 ? strM.charAt(0) + '.' + strM.slice(1).substring(0,3) : strM.substr(3)) +
            (amount.bn.e < 0 ? 'e' : 'e+') + amount.bn.e;
        return amount.bn.s < 0 ? '-' + rsM : rsM;
    }
    if (amount.lt(1.e45)) {
        if(amount.lt(1.e3)) return amount.valueOf();
        if(amount.lt(1.e6)) return `${amount.div(1000).toFixed(2)}K`;
        if(amount.lt(1.e9)) return `${amount.div(1.e6).toFixed(2)}M`;
        if(amount.lt(1.e12)) return `${amount.div(1.e9).toFixed(2)}B`;
        if(amount.lt(1.e15)) return `${amount.div(1.e12).toFixed(2)}T`;
        if(amount.lt(1.e18)) return `${amount.div(1.e15).toFixed(2)}Qa`;
        if(amount.lt(1.e21)) return `${amount.div(1.e18).toFixed(2)}Qi`;
        if(amount.lt(1.e24)) return `${amount.div(1.e21).toFixed(2)}Sx`;
        if(amount.lt(1.e27)) return `${amount.div(1.e24).toFixed(2)}Sp`;
        if(amount.lt(1.e30)) return `${amount.div(1.e27).toFixed(2)}Oc`;
        if(amount.lt(1.e33)) return `${amount.div(1.e30).toFixed(2)}No`;
        if(amount.lt(1.e36)) return `${amount.div(1.e33).toFixed(2)}Dc`;
        if(amount.lt(1.e39)) return `${amount.div(1.e36).toFixed(2)}UDc`;
        if(amount.lt(1.e42)) return `${amount.div(1.e39).toFixed(2)}DDc`;
        if(amount.lt(1.e45)) return `${amount.div(1.e42).toFixed(2)}TDc`;
    } else if (amount.lt(1.e90)) {
        if(amount.lt(1.e48)) return `${amount.div(1.e45).toFixed(2)}QaDc`;
        if(amount.lt(1.e51)) return `${amount.div(1.e48).toFixed(2)}QiDc`;
        if(amount.lt(1.e54)) return `${amount.div(1.e51).toFixed(2)}SxDc`;
        if(amount.lt(1.e57)) return `${amount.div(1.e54).toFixed(2)}SpDc`;
        if(amount.lt(1.e60)) return `${amount.div(1.e57).toFixed(2)}OcDc`;
        if(amount.lt(1.e63)) return `${amount.div(1.e60).toFixed(2)}NDc`;
        if(amount.lt(1.e66)) return `${amount.div(1.e63).toFixed(2)}Vi`;
        if(amount.lt(1.e69)) return `${amount.div(1.e66).toFixed(2)}UVi`;
        if(amount.lt(1.e72)) return `${amount.div(1.e69).toFixed(2)}DVi`;
        if(amount.lt(1.e75)) return `${amount.div(1.e72).toFixed(2)}TVi`;
        if(amount.lt(1.e78)) return `${amount.div(1.e75).toFixed(2)}QaVi`;
        if(amount.lt(1.e81)) return `${amount.div(1.e78).toFixed(2)}QiVi`;
        if(amount.lt(1.e84)) return `${amount.div(1.e81).toFixed(2)}SxVi`;
        if(amount.lt(1.e87)) return `${amount.div(1.e84).toFixed(2)}SpVi`;
        if(amount.lt(1.e90)) return `${amount.div(1.e87).toFixed(2)}OcVi`;
    }

    if(!amount.bn.c) {
        return amount.valueOf();
    }
    const str = coeffToString(amount.bn.c);
    const rs = (str.length > 1 ? str.charAt(0) + '.' + str.slice(1).substring(0,3) : str.substr(3)) +
        (amount.bn.e < 0 ? 'e' : 'e+') + amount.bn.e;
    return amount.bn.s < 0 ? '-' + rs : rs;
}

export default formatBig;
import {
    put,
    select,
    call,
    takeLatest,
    all,
} from 'redux-saga/effects';

import { BigNumber } from "@waves/bignumber"

import { armyUnits, armyUnitsUpgrades } from "../../../database/army";

import {
    interactionActions,
    stateUpdaters as BattleStateActions
} from "./actions";
import {stateUpdaters} from "../army/actions";


class BattleSaga {


    static calculateTotalStats(enemy) {
        return {
            at: enemy.units.qty.mul(enemy.units.stats.at),
            df: enemy.units.qty.mul(enemy.units.stats.df),
            hp: enemy.units.qty.mul(enemy.units.stats.hp),
        }
    }

    static generateEnemyForRound(level) {
        const units = {
            qty: level.pow(2).add(10),
                stats: {
                at: new BigNumber(2).pow(level),
                    df: new BigNumber(2).pow(level).mul(0.5),
                    hp: new BigNumber(2).pow(level).mul(5)
            }
        };
        return {
            units,
            total: BattleSaga.calculateTotalStats({ units })
        }
    }

    static *getMyStats() {
        const myArmy = yield select(state => state.game.army);

    }

    static *runRound(enemy) {
        // get my stats
        const myArmy = yield select(state => state.game.army); //replace with more sophisticated logic
        // take off some units from enemy
        console.log('enemy.total', enemy.total);
        const takenFromEnemy = myArmy.stats.at.sub(enemy.total.df).div(enemy.units.stats.hp);
        const takenFromMe = enemy.total.at.sub(myArmy.stats.df).div(myArmy.stats.hpPerUnit);
        console.log('flowOfBattle: ', takenFromMe.valueOf(), takenFromEnemy.valueOf());
        if(takenFromEnemy.gt(0)) {
            enemy.units.qty = enemy.units.qty.sub(takenFromEnemy);
            enemy.total = BattleSaga.calculateTotalStats(enemy);
            yield put(BattleStateActions.setEnemy.make(enemy));
            if(enemy.units.qty.lte(0)) {
                // finish battle, won
                return {
                    status: 'victory',
                }
            }
        }
        if(takenFromMe.gt(0)) {
            yield put(stateUpdaters.updateUnit.make({
                id: 'warrior0',
                amount: BigNumber.min(takenFromMe, myArmy.units.warrior0).mul(-1),
            }));
            if(myArmy.units.warrior0.lte(takenFromMe)) {
                return {
                    status: 'defeat',
                }
            }
        }

        return {
            status: 'go-on',
        }

    }

    static *handleBattle() {
        const data = yield select(state => state.game.battle);
        let enemy = data.enemy;
        if(!enemy || !enemy.total) {
            enemy = BattleSaga.generateEnemyForRound(data.level || new BigNumber(0));
            console.log('enemy: ', enemy);
            yield put(BattleStateActions.setEnemy.make(enemy));
        }
        if(!data.isBattleInProgress) return;
        console.log('in-battle', data.battleStatus.timeToNextRound < new Date());
        if(!data.battleStatus.timeToNextRound) {
            yield put(BattleStateActions.setTimeToNextRound.make({
                round: new BigNumber(0),
                timeToNextRound: (new Date()).setTime((new Date()).getTime() + 1000),
            }))
        }
        if(data.battleStatus.timeToNextRound < new Date()) {
            const roundData = yield call(BattleSaga.runRound, enemy);
            console.log('roundData', roundData);
            let round = data.battleStatus.round;
            if(roundData.status === 'victory') {
                round = new BigNumber(0);
                const maxLvl = BigNumber.max(data.level.add(1), data.maxLevel);
                yield put(BattleStateActions.setMaxBattleLevel.make(
                    maxLvl
                ));
                if(data.isAutoAdvance) {
                    yield put(BattleStateActions.setBattleLevel.make(
                        maxLvl
                    ));
                }
                yield put(BattleStateActions.setEnemy.make(null));
                yield put(BattleStateActions.setFameAmount.make(maxLvl.pow(2).mul(0.1)));
            } else if(roundData.status === 'defeat') {
                round = new BigNumber(0)
                enemy = BattleSaga.generateEnemyForRound(data.level || new BigNumber(0));
                yield put(BattleStateActions.setEnemy.make(enemy));
                yield put(BattleStateActions.setBattleInProgress.make(false));
            } else {
                // in progress
                round = round.add(1);
            }
            yield put(BattleStateActions.setTimeToNextRound.make({
                round,
                timeToNextRound: (new Date()).setTime((new Date()).getTime() + 2000),
            }))
        }
    }

}

export default BattleSaga;
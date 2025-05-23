export class StateManager {
    states: Map<string, number>

    constructor() {
        this.states = new Map
    }

    retiveStateNumber(state: string) {
        let num = this.states.get(state)
        if (num != undefined) {
            num++
            this.states.set(state, num)
        } else {
            this.states.set(state, 1)
        }

        return this.states.get(state)
    }

    getStatesJSON() {
        const states = new Array

        this.states.forEach((key, value) => {
            states.push({
                "state": key,
                "CurrentRuleStateNumber": value
            })
        })

        return states
    }
}
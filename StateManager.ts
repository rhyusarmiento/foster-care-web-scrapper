export class StateManager {
    states: Map<string, number>
    stateAbbre: any

    constructor() {
        this.states = new Map
        this.stateAbbre = {
            "Alabama": "AL",
            "Alaska": "AK",
            "Arizona": "AZ",
            "Arkansas": "AR",
            "California": "CA",
            "Colorado": "CO",
            "Connecticut": "CT",
            "Delaware": "DE",
            "Florida": "FL",
            "Georgia": "GA",
            "Hawaii": "HI",
            "Idaho": "ID",
            "Illinois": "IL",
            "Indiana": "IN",
            "Iowa": "IA",
            "Kansas": "KS",
            "Kentucky": "KY",
            "Louisiana": "LA",
            "Maine": "ME",
            "Maryland": "MD",
            "Massachusetts": "MA",
            "Michigan": "MI",
            "Minnesota": "MN",
            "Mississippi": "MS",
            "Missouri": "MO",
            "Montana": "MT",
            "Nebraska": "NE",
            "Nevada": "NV",
            "New Hampshire": "NH",
            "New Jersey": "NJ",
            "New Mexico": "NM",
            "New York": "NY",
            "North Carolina": "NC",
            "North Dakota": "ND",
            "Ohio": "OH",
            "Oklahoma": "OK",
            "Oregon": "OR",
            "Pennsylvania": "PA",
            "Rhode Island": "RI",
            "South Carolina": "SC",
            "South Dakota": "SD",
            "Tennessee": "TN",
            "Texas": "TX",
            "Utah": "UT",
            "Vermont": "VT",
            "Virginia": "VA",
            "Washington": "WA",
            "West Virginia": "WV",
            "Wisconsin": "WI",
            "Wyoming": "WY"
        }
    }

    getStateAbbre(state: string) {
        const newState = state.trim()
        return this.stateAbbre[newState]
    }

    retiveStateNumber(state: string) {
        const newState = state.trim()
        let num = this.states.get(newState)
        if (num != undefined) {
            num++
            this.states.set(newState, num)
        } else {
            this.states.set(newState, 1)
        }

        return this.states.get(newState)
    }

    getStatesJSON() {
        const states = new Array
        
        this.states.forEach((key, value) => {
            states.push({
                "state": value,
                "CurrentRuleStateNumber": key
            })
        })

        return states
    }
}
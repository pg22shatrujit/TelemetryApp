// Copyright (C) Shatrujit Aditya Kumar 2022, All Rights Reserved

// Two copies of this class to get around the `export` - `module.exports` conflict
// Server-side copy uses `module.exports`
const rec = {
    id: null,                              // auto generated unique identifier
    version: null,                         // String from date - auto generated
    sessionID: null,                       // Session within version
    eventID: null,                         // Type of event
    /*
    location: { X: 0, Y: 0, Z: 0 },        // Event location
    mapName: "base_map",                   // Current level
    actor: {
        state: 0,                          // Actor ID within session
        id: 0,                             // Animation state
        health: 100,                       // Current health
        damageDone: 0,                     // Damage dealt so far
        weapon: 0,                         // Weapon type
        velocity: { X: 0, Y: 0, Z: 0 },    // Current speed and direction 
        lookingAt: { X: 0, Y: 0, Z: 0 },   // Current look direction (normalized)
        spawnAt: 0,                        // Spawn point ID (ENUM)
        travelled: 0                       // Distance travelled so far
    }
    */
}

// Class to store data and serialize
class TData {
    constructor( serializedObj = undefined ) {

        this.record = {
            ...rec
        }

        // Update record data if an object is passed to the constructor
        if(serializedObj) {
            this.record = {
                ...this.record,
                ...JSON.parse(serializedObj)
            }
        }
    }

    // Server only needs to access id
    get id() { return this.record.id }

    serialize() {
        return JSON.stringify( this.record )
    }
}

module.exports = TData
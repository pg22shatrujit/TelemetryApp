// Copyright (C) Shatrujit Aditya Kumar 2022, All Rights Reserved

const rec = {
    id: null,                                // auto generated unique identifier
    version: null,                 // String from date - auto generated
    sessionID: null,                          // Session within version
    eventID: null,                           // Type of event
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

class TData {
    constructor( serializedObj = undefined ) {

        this.record = {
            ...rec
        }
        if(serializedObj) {
            this.record = {
                ...rec,
                ...JSON.parse(serializedObj)
            }
        }
    }

    get id() { return this.record.id }

    serialize() {
        return JSON.stringify( this.record )
    }
}

module.exports = TData
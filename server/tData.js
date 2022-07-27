// Copyright (C) Shatrujit Aditya Kumar 2022, All Rights Reserved

// Auto genereate version from date
let currentVersion = () => {
    return new Date().toISOString().split('T')[0]
}

const rec = {
    id: -1,                                // auto generated unique identifier
    version: currentVersion(),             // String from date - auto generated
    sessionID: 0,                          // Session within version
    eventID: 0,                            // Type of event
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
export default class TData {
    constructor( params = undefined ) {

        this.record = {
            ...rec
        }
        
        // Update record data if an object is passed to the constructor
        if(params) {
            if(typeof params === 'string') {
                this.record = {
                    ...this.record,
                    ...JSON.parse( params )
                }
                return
            }

            this.record = {
                ...this.record,
                ...params
            }
        }
    }

    // Getters/Setters to read/write data
    get id() { return this.record.id }
    get version() { return this.record.version }
    get sessionID() { return this.record.sessionID }
    get eventID() { return this.record.eventID }

    set id(val) { this.record.id = val }
    set version(val) { this.record.version = val }
    set sessionID(val) { this.record.sessionID = val }
    set eventID(val) { this.record.eventID = val }

    serialize() {
        return JSON.stringify( this.record )
    }
}
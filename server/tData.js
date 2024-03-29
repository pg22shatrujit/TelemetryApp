// Copyright (C) Shatrujit Aditya Kumar 2022, All Rights Reserved

export const INDEX_NONE = -1 // Default ID

// Auto generate version from date
let currentVersion = () => {
    return new Date().toISOString().split('T')[0]
}

export const PlayerState = {
    WALK: 0,
    RUN: 1,
    CROUCH: 2,
    PRONE: 3
}

const rec = {
    id: INDEX_NONE,                        // auto generated unique identifier
    version: currentVersion(),             // String from date - auto generated
    sessionID: 0,                          // Session within version
    eventID: 0,                            // Type of event
    playerState: PlayerState.WALK,         // Current state of the player character
    location: {                            // 2D representation of the player's location
        X: 0,
        Y: 0
    }
    /*
    location: { X: 0, Y: 0, Z: 0 },        // Event location
    mapName: "base_map",                   // Current level
    actor: {
        state: 0,                          // Animation state
        id: 0,                             // Actor ID within session
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

// Create a deep copy of constant rec
// Using since spread operator doesn't deep copy nested objects like location
let cloneRec = () => {
    return JSON.parse( JSON.stringify ( rec ) )
}

// Class to store data and serialize
export default class TData {
    constructor( params = undefined ) {

        this.record = cloneRec()
        
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
    get playerState() { return this.record.playerState }
    get X() { return this.record.location.X }
    get Y() { return this.record.location.Y }
    get location() { return this.record.location }

    set id(val) { this.record.id = val }
    set version(val) { this.record.version = val }
    set sessionID(val) { this.record.sessionID = val }
    set eventID(val) { this.record.eventID = val }
    set playerState(val) { this.record.playerState = val }
    set X(val) { this.record.location.X = val }
    set Y(val) { this.record.location.Y = val }

    serialize() {
        return JSON.stringify( this.record )
    }
}
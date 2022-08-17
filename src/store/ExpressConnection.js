// Copyright (C) Shatrujit Aditya Kumar 2022, All Rights Reserved

'use strict'

import Connection from "./connection"

import Axios from 'axios'

const baseURL = `http://localhost:5000`
const prefix = `/api/telemetry`

export default class ExpressConnection extends Connection {

    constructor() {
        super()

        // Create an Axios object with the correct baseURL
        this.db = Axios.create({ baseURL: baseURL })
    }

    open() {}

    read( request ) {

        return new Promise(( resolve, reject ) => {

            this.db.get( `${prefix}${request}` )
            .then( response => response.data )
            // Clean data and send back only the payload
            .then( data => ( data.error ? error => { throw( error ) } : data.payload ))
            .then( content => resolve( content ))
            .catch( error => reject( error ))

        })
    }

    write( request, data ) {

        return new Promise(( resolve, reject ) => {

            this.db.post( `${prefix}${request}`, { record : data.serialize() })
            .then( response => response.data )
            .then( data => ( data.error ? error => { throw( error ) } : data.payload ))
            .then( content => resolve( content ))
            .catch( error => {
                reject( error )
            })
        })
    }

    delete( request ) {

        return new Promise(( resolve, reject ) => {
            
            this.db.delete( `${prefix}${request}` )
            .then( response => response.data )
            .then( data => ( data.error ? error => { throw( error ) } : data.payload ))
            .then( content => resolve( content ))
            .catch( error => {
                reject( error )
            })
        })
    }

    close() {}
}
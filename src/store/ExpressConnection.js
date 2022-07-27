// Copyright (C) Shatrujit Aditya Kumar 2022, All Rights Reserved

'use strict'

import Connection from "./connection"

import Axios from 'axios'

const baseURL = `http://localhost:5000/api/telemetry/`

export default class ExpressConnection extends Connection {

    constructor() {
        super()
        this.db = Axios.create({ baseURL: baseURL })
    }

    open() {}

    read( request ) {

        return new Promise(( resolve, reject ) => {

            this.db.get( request )
            .then( response => response.data )
            .then( data => ( data.error ? error => { throw( error ) } : data.payload ))
            .then( content => {
                resolve( content )
            })
            .catch( error => {
                reject( error )
            })

        })
    }

    write( request, data ) {

        return new Promise(( resolve, reject ) => {

            this.db.post( request, { record : data.serialize() })
            .then( response => response.data )
            .then( data => ( data.error ? error => { throw( error ) } : resolve( data ) ))
            .catch( error => {
                reject( error )
            })
        })
    }

    delete( request, data ) {

        return new Promise(( resolve, reject ) => {

            this.db.delete( request, { params : { id : data.id } })
            .then( response => response.data )
            .then( data => ( data.error ? error => { throw( error ) } : resolve( data ) ))
            .catch( error => {
                reject( error )
            })
        })
    }

    close() {}
}
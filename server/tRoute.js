// Copyright (C) Shatrujit Aditya Kumar 2022, All Rights Reserved
const { response } = require('express')
const Express = require('express')
const Result = require('../src/mixins/result')

const TDataRec = require('./tData')

const Router = Express.Router()

mergeParams = (request) => {
    return {
        ...request.params,
        ...request.query,
        ...request.body
    }
}

resultOK = ( payload = undefined ) => {
    let result = new Result()
    result.payload = payload
    result.ok()
    return result
}

let records = {}

Router.get('/single', ( request, response, next ) => {

    // Fetch a single record for client
    const params = mergeParams(request)
    response.send( resultOK(records[params.id].serialize()) )
    next()
})

Router.get('/multi', ( request, response, next ) => {

    // Fetch multiple records for client
    response.send(resultOK())
    next()
})

Router.post('/single', ( request, response, next ) => {

    // Add/update single record from client
    const params = mergeParams(request)
    let newRecord = new TDataRec.TData(params.record)
    records[newRecord.id] = newRecord
    response.send(resultOK())
    next()
})

Router.delete('/single', ( request, response, next ) => {

    // Delete a single record
    const params = mergeParams(request)
    delete records[params.id]
    response.send(resultOK(params.id))
    next()
})

module.exports = Router
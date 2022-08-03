// Copyright (C) Shatrujit Aditya Kumar 2022, All Rights Reserved
const { response } = require('express')
const Express = require('express')
const Result = require('../src/mixins/result')

const TData = require('./tData').default

const Router = Express.Router()

// Condense request params into a single object
mergeParams = (request) => {
    return {
        ...request.query,
        ...request.params,
        ...request.body
    }
}

// Create and return a result object with payload
resultOK = ( payload = undefined ) => {
    let result = new Result()
    result.payload = payload
    result.ok()
    return result
}

// Store of records
let records = {}

// Fetch a single record for client
Router.get('/single/:id', ( request, response, next ) => {

    const params = mergeParams(request)
    response.send( resultOK(records[params.id].serialize()) )
    next()
})

// Fetch every record for client
Router.get('/multi', ( request, response, next ) => {

    let payload = {}

    for(id in records) {
        payload[id] = records[id].serialize()
    }
    response.send(resultOK(payload))
    next()
})

// Add/update single record from client
Router.post('/single', ( request, response, next ) => {

    const params = mergeParams(request)
    let newRecord = new TData(params.record)
    records[newRecord.id] = newRecord
    response.send(resultOK())
    next()
})

// Delete a single record
Router.delete('/single/:id', ( request, response, next ) => {

    const params = mergeParams(request)
    delete records[params.id]
    response.send(resultOK(params.id))
    next()
})

Router.get('/actionSummary/:id/:sessionId', ( request, response, next ) => {
    
    const data = [
        ['Year', 'Sales', 'Expenses', 'Profit'],
        ['2014', 1000, 400, 200],
        ['2015', 1170, 460, 250],
        ['2016', 660, 1120, 300],
        ['2017', 1030, 540, 350]
    ]
    response.send(resultOK(data))
    next()
})

module.exports = Router
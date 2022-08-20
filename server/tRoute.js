// Copyright (C) Shatrujit Aditya Kumar 2022, All Rights Reserved
const { response } = require('express')
const Express = require('express')
const { LOCATION_MAXIMUM_KEY, LOCATION_OBJECTS_KEY } = require('../functions/FirestoreSetup')
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
Router.post('/single/:id', ( request, response, next ) => {

    const params = mergeParams(request)
    let newRecord = new TData(params.record)
    records[newRecord.id] = newRecord
    response.send(resultOK(newRecord.id))
    next()
})

// Delete a single record
Router.delete('/single/:id', ( request, response, next ) => {

    const params = mergeParams(request)
    delete records[params.id]
    response.send(resultOK(params.id))
    next()
})

// Sample data to populate the chart on the local server
Router.get('/getChartData', ( request, response, next ) => {
    
    const data = [
        [ 'Player State', 'Occurances' ],
        [ 'WALK', 1000 ],
        [ 'RUN', 1170 ],
        [ 'CROUCH', 660 ],
        [ 'PRONE', 1030 ]
    ]
    response.send(resultOK(data))
    next()
})

// Sample data to populate the heat map on the local server
Router.get('/getHeatMapData', ( request, response, next ) => {
    
    const data = {
        [ LOCATION_MAXIMUM_KEY ]: 5,
        [ LOCATION_OBJECTS_KEY ]: [
            { x: 0, y: 0, value: 1 },
            { x: 0, y: 250, value: 5 },
            { x: 50, y: 30, value: 2 },
            { x: 50, y: 150, value: 3 },
        ]
    }
    response.send(resultOK(data))
    next()
})

module.exports = Router
// Copyright (C) Shatrujit Aditya Kumar, 2022. All Rights Reserved

require = require("esm")(module)
const cors = require('cors')({origin: true})
const functions = require("firebase-functions")
const { runTransaction, deleteField, getDoc } = require("@firebase/firestore")
const { db, STATE_AGGREGATE_COLLECTION, LOCATION_AGGREGATE_COLLECTION, TELEMETRY_COLLECTION, STATE_KEY, LOCATION_KEY, LOCATION_MAXIMUM_KEY, LOCATION_OBJECTS_KEY, getAggregationReference } = require("./FirestoreSetup.js")
const { PlayerState } = require("../server/tData")

// Check two location objects for equality, Object structure => { X: 0.00, Y: 0.00 }
let isEqualLocation = (locA, locB) => {

    // Either object doesn't exist
    if(!locA || !locB) return false;

    // Either object is missing a coordinate
    if(locA.X == undefined || locA.Y == undefined || locB.X == undefined || locB.Y == undefined) return false;

    // Either coordinate of both objects aren't equal
    if(locA.X != locB.X || locA.Y != locB.Y) return false;

    // If we're still here, the values are the same
    return true;
}

// Get key value from a snapshot change object, defaulting to null
let getKeyData = ( change, key, isBeforeChange = false ) => {

    if( isBeforeChange ) return change.before.exists ? change.before.data()[ key ] : null
    return change.after.exists ? change.after.data()[ key ] : null
}

// Updates the aggregations for playerState
let updateStateAggegation = ( aggregation, after, before ) => {
    // Increase the count for the new state if it exists in the aggregation (Set it to one if it doesn't)
    if( after != null) {
        if( !aggregation.hasOwnProperty( `${ after }` ) ) aggregation[ after ] = 0
        aggregation[ after ]++
    }

    // Decrease the count for the old state if it exists in the aggregation (Do nothing if the key doesn't exist)
    if( before != null) {
        // Check for key and make sure the count is a positive number
        if( aggregation.hasOwnProperty( `${ before }` ) ) {
            aggregation[ before ]--
            if( aggregation[ before ] <= 0 ) {
                aggregation[ before ] = deleteField()
            }
        }
    }
}

// Runs transaction to register any required changes to playerState aggregation
let runStatesTransaction = async ( change ) => {
    await runTransaction( db, async ( transaction ) => {

        // Get values of current and previous states if they exist
        const newState = getKeyData( change, STATE_KEY )
        const oldState = getKeyData( change, STATE_KEY, true )

        // Break out if nothing changed
        if( newState == oldState ) return

        // Get a reference to the state aggregations doc
        let aggregationsRef = await getAggregationReference( STATE_AGGREGATE_COLLECTION )
        if( !aggregationsRef ) return   

        const aggregationsDoc = await transaction.get( aggregationsRef );
        let aggregateStates = aggregationsDoc.data()

        updateStateAggegation( aggregateStates, newState, oldState )

        // Update the doc
        transaction.update( aggregationsRef, aggregateStates );
    });
}

// Get a reference to the first document in a collection, creating one if the collection is empty
findLocationMaxima = ( newMaximum, aggregationValues ) => {
    console.log(aggregationValues)
    for( let xKeys in aggregationValues ) {
        for( let yKeys in aggregationValues[ xKeys ] ) {
            let numPoints = aggregationValues[ xKeys ][ yKeys]
            if( numPoints > newMaximum ) newMaximum = numPoints
        }
    }

    return newMaximum
}

// Update the aggregation for location values
let updateLocationAggregation = ( aggregation, after, before ) => {

        if( !aggregation.hasOwnProperty( LOCATION_MAXIMUM_KEY ) ) aggregation[ LOCATION_MAXIMUM_KEY ] = 0
        if( !aggregation.hasOwnProperty( LOCATION_OBJECTS_KEY ) ) aggregation[ LOCATION_OBJECTS_KEY ] = {}
        
        let aggregationValues = aggregation[ LOCATION_OBJECTS_KEY ]
        // Location exists and has X, Y values
        if( after != null && after.X != undefined && after.Y != undefined ) {
            
            let xIndex = Math.round( after.X )
            let yIndex = Math.round( after.Y )

            if( !aggregationValues.hasOwnProperty( `${ xIndex }` ) ) aggregationValues[ xIndex ] = {}
            if( !aggregationValues[ xIndex ].hasOwnProperty( `${ yIndex }` ) ) aggregationValues[ xIndex ][ yIndex ] = 0
            ++aggregationValues[ xIndex ][ yIndex ]

            if( aggregationValues[ xIndex ][ yIndex ] > aggregation[ LOCATION_MAXIMUM_KEY ] ) aggregation[ LOCATION_MAXIMUM_KEY ] = aggregationValues[ xIndex ][ yIndex ]
        }

        // Location exists and has X, Y values
        if( before != null && before.X != undefined && before.Y != undefined ) {
            
            let xIndex = Math.round( before.X )
            let yIndex = Math.round( before.Y )

            if( aggregationValues.hasOwnProperty( `${ xIndex }` ) ) {

                if( aggregationValues[ xIndex ].hasOwnProperty( `${ yIndex }` ) ) {

                    // If both indexes exist, decrement the count for the old value
                    aggregationValues[ xIndex ][ yIndex ]--

                    if( aggregationValues[ xIndex ][ yIndex ] >= aggregation[ LOCATION_MAXIMUM_KEY ] - 1 )
                    {
                        aggregation[ LOCATION_MAXIMUM_KEY ] = findLocationMaxima( aggregation[ LOCATION_MAXIMUM_KEY ] - 1, aggregationValues )
                    }


                    // Remove the key if the count is 0 or less
                    if( aggregationValues[ xIndex ][ yIndex ] <= 0 ) {
                        delete aggregationValues[ xIndex ][ yIndex ]
                    }
                }
                
                // Check size of the xIndex and delete if its empty 
                if( Object.keys( aggregationValues[ xIndex ] ).length == 0  ) delete aggregationValues[ xIndex ]
            }
        }
}

// Runs transaction to register any required changes to location aggregation
let runLocationsTransaction = async ( change ) => {
    await runTransaction( db, async ( transaction ) => {

        // Get values of current and previous states if they exist
        const newLocation = getKeyData( change, LOCATION_KEY )
        const oldLocation = getKeyData( change, LOCATION_KEY, true )
        
        // Break out if nothing changed
        if( isEqualLocation( newLocation, oldLocation ) ) return

        // Get a reference to the state aggregations doc
        let aggregationsRef = await getAggregationReference( LOCATION_AGGREGATE_COLLECTION )
        if( !aggregationsRef ) return

        const aggregationsDoc = await transaction.get( aggregationsRef );
        let aggregateLocations = aggregationsDoc.data()

        updateLocationAggregation( aggregateLocations, newLocation, oldLocation )

        // Update the doc
        transaction.update( aggregationsRef, aggregateLocations );
    })
}

// Loads data for visualizaztions, bool to flip between bar chart and heat map data
let loadVizData = async ( isHeatMap = false ) => {
    let aggregationsRef = await getAggregationReference( isHeatMap ? LOCATION_AGGREGATE_COLLECTION : STATE_AGGREGATE_COLLECTION )
    if ( !aggregationsRef ) return

    aggregationsDoc = await getDoc( aggregationsRef )

    return aggregationsDoc.data()
}

// Update necessary collections everytime a document in the telemetry collection gets updated
exports.aggregateTelemetryData = functions.firestore
    .document( `${TELEMETRY_COLLECTION}/{recordID}` )
    .onWrite(async (change, context) => {

        let aggregationTransactions = []

        // Update aggregations in a transaction
        aggregationTransactions.push( runStatesTransaction( change ) )
        aggregationTransactions.push( runLocationsTransaction( change ) )

        await Promise.all(aggregationTransactions)
    })

// Returns data to populate the bar chart in the right format
exports.getChartData = functions.https.onRequest( async (req, res) => {

    await cors(req, res, async () => {
        let vizData = await loadVizData()
        
        let formattedData = [
            [ "Player State", "Occurances" ]
        ]
    
        Object.keys( PlayerState ).forEach( ( state ) => {
            let stateVal = vizData.hasOwnProperty( PlayerState[ state ] ) ? vizData[ PlayerState[ state ] ]: 0
            formattedData.push( [ state, stateVal ] )
        })
        res.send(formattedData)
    })
})

// Returns data to populate the heat map in the right format
exports.getHeatMapData = functions.https.onRequest( async (req, res) => {
    await cors(req, res, async () => {
        let vizData = await loadVizData( true )
            
        let mapData = []
        let aggregatedLocations = vizData[ LOCATION_OBJECTS_KEY ]
        for( let xKey in aggregatedLocations ) {
            for( let yKey in aggregatedLocations[ xKey ] ) {
                mapData.push({
                    x: xKey,
                    y: yKey,
                    value: aggregatedLocations[ xKey ][ yKey ]
                })
            }
        }
        
        let formattedData = {
            [LOCATION_MAXIMUM_KEY]: vizData[LOCATION_MAXIMUM_KEY],
            [LOCATION_OBJECTS_KEY]: mapData
        }
        res.send(formattedData)
    })
})
require = require("esm")(module)
const functions = require("firebase-functions")
const { doc, runTransaction, getDocs, addDoc, collection, deleteField } = require("@firebase/firestore")
const db = require("./FirestoreSetup.js").db

// Collection names for PlayerState and Location aggregations respectively
const STATE_AGGREGATE = "PlayerState"
const LOCATION_AGGREGATE = "Location"

const STATE_KEY = "playerState"
const LOCATION_KEY = "location"

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

// Get a reference to the first document in a collection, creating one if the collection is empty
let getAggregationReference = async ( aggregationCollection ) => {

    const snapshot = await getDocs( collection( db, aggregationCollection ))
    let aggregationsRef = null

    if( !snapshot.size ) {
        // Create doc if one doesn't exist and get the reference
        aggregationsRef = await addDoc( collection( db, aggregationCollection ), {} )
    }
    else {
        // If the collection isn't empty, grab the first doc (Always has only one doc)
        aggregationsRef = await doc( db, aggregationCollection, snapshot.docs[0].id );
    }

    return aggregationsRef
}

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

let runStatesTransaction = async ( change ) => {
    await runTransaction( db, async ( transaction ) => {

        // Get values of current and previous states if they exist
        const newState = getKeyData( change, STATE_KEY )
        const oldState = getKeyData( change, STATE_KEY, true )

        // Break out if nothing changed
        if( newState == oldState ) return

        // Get a reference to the state aggregations doc
        let aggregationsRef = await getAggregationReference( STATE_AGGREGATE )
        if( !aggregationsRef ) return   

        const aggregationsDoc = await transaction.get( aggregationsRef );
        let aggregateStates = aggregationsDoc.data()

        updateStateAggegation( aggregateStates, newState, oldState )

        // Update the doc
        transaction.update( aggregationsRef, aggregateStates );
    });
}

let updateLocationAggregation = ( aggregation, after, before ) => {

        // Location exists and has X, Y values
        if( after != null && after.X != undefined && after.Y != undefined ) {
            
            let xIndex = Math.round( after.X )
            let yIndex = Math.round( after.Y )

            if( !aggregation.hasOwnProperty( `${ xIndex }` ) ) aggregation[ xIndex ] = {}
            if( !aggregation[ xIndex ].hasOwnProperty( `${ yIndex }` ) ) aggregation[ xIndex ][ yIndex ] = 0
            ++aggregation[ xIndex ][ yIndex ]
        }

        // Location exists and has X, Y values
        if( before != null && before.X != undefined && before.Y != undefined ) {
            
            let xIndex = Math.round( before.X )
            let yIndex = Math.round( before.Y )

            if( aggregation.hasOwnProperty( `${ xIndex }` ) ) {

                if( aggregation[ xIndex ].hasOwnProperty( `${ yIndex }` ) ) {

                    // If both indexes exist, decrement the count for the old value
                    aggregation[ xIndex ][ yIndex ]--

                    // Remove the key if the count is 0 or less
                    if( aggregation[ xIndex ][ yIndex ] <= 0 ) {
                        delete aggregation[ xIndex ][ yIndex ]
                    }
                }
                
                // Check size of the xIndex and delete if its empty 
                if( Object.keys( aggregation[ xIndex ] ).length == 0  ) aggregation[ xIndex ] = deleteField()
            }
        }
}

let runLocationsTransaction = async ( change ) => {
    await runTransaction( db, async ( transaction ) => {

        // Get values of current and previous states if they exist
        const newLocation = getKeyData( change, "location" )
        const oldLocation = getKeyData( change, "location", true )
        
        // Break out if nothing changed
        if( isEqualLocation( newLocation, oldLocation ) ) return

        // Get a reference to the state aggregations doc
        let aggregationsRef = await getAggregationReference( LOCATION_AGGREGATE )
        if( !aggregationsRef ) return

        const aggregationsDoc = await transaction.get( aggregationsRef );
        let aggregateLocations = aggregationsDoc.data()

        updateLocationAggregation( aggregateLocations, newLocation, oldLocation )

        // Update the doc
        transaction.update( aggregationsRef, aggregateLocations );
    })
}

// Update necessary collections everytime a document in the telemetry collection gets updated
exports.aggregateTelemetryData = functions.firestore
    .document( 'Telemetry/{recordID}' )
    .onWrite(async (change, context) => {

        let aggregationTransactions = []

        // Update aggregations in a transaction
        aggregationTransactions.push( runStatesTransaction( change ) )
        aggregationTransactions.push( runLocationsTransaction( change ) )

        await Promise.all(aggregationTransactions)
    })

// class TelemetryFunctions {

//     constructor() {

//         fb.initializeApp()
//         this.db = getFirestore(fb)
//         functions = getFunctions(getApp());
//         connectFunctionsEmulator(functions, "localhost", 5001);
//     }
    
//     get exports() {
//         return {
//             helloWorld: this.functions.https.onRequest( this.helloWorld )
//         }
//     }

//     helloWorld( request, response ) {

//         functions.logger.info( "Hello logs!", { structuredData: true });
//         response.send( "Hello from Firebase!" );
//     }
// }

// const telemetryfunctions = new TelemetryFunctions()
// exports = telemetryfunctions.exports
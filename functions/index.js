require = require("esm")(module)
const functions = require("firebase-functions")
const { doc, runTransaction, getDocs, addDoc, collection} = require("@firebase/firestore")
const db = require("./FirestoreSetup.js").db

const STATE_AGGREGATE = "PlayerState"

exports.aggregatePlayerStates = functions.firestore
    .document( 'Telemetry/{recordID}' )
    .onWrite(async (change, context) => {

        // Get values of current and previous states if they exist
        const newState = change.after.exists ? change.after.data().playerState : null
        const oldState = change.before.exists ? change.before.data().playerState : null

        // Break out if nothing changed
        if( newState == oldState ) return

        // Get a reference to the state aggregations doc

        // Update aggregations in a transaction
        await runTransaction( db, async ( transaction ) => {

            const snapshot = await getDocs( collection( db, STATE_AGGREGATE ))
            let aggregationsRef = null

            if( !snapshot.size ) {
                // Create doc if one doesn't exist and get the reference
                aggregationsRef = await addDoc( collection( db, STATE_AGGREGATE ), {} )
            }
            else {
                // If the collection isn't empty, grab the first doc (Always has only one doc)
                aggregationsRef = await doc( db, STATE_AGGREGATE, snapshot.docs[0].id );
            }

            if( !aggregationsRef ) return

            const aggregationsDoc = await transaction.get( aggregationsRef );
            let aggregateStates = aggregationsDoc.data()

            // Decrease the count for the old state if it exists in the aggregation (Do nothing if the key doesn't exist)
            if( oldState != null) {
                // Check for key and make sure the count is a positive number
                if( aggregateStates.hasOwnProperty( `${ oldState }` ) && aggregateStates[ oldState ] > 0 ) aggregateStates[ oldState ]--
            }

            // Increase the count for the new state if it exists in the aggregation (Set it to one if it doesn't)
            if( newState != null) {
                if( aggregateStates.hasOwnProperty( `${ newState }` ) ) aggregateStates[ newState ]++
                else aggregateStates[ newState ] = 1
            }

            // Update the doc
            transaction.update(aggregationsRef, aggregateStates);
        });
    });

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

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

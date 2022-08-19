const { getFirestore, connectFirestoreEmulator, getDocs, addDoc, doc, collection } = require("@firebase/firestore")
const { initializeApp } = require("firebase/app");

const firebaseConfig = {
    apiKey: "AIzaSyDL4QcDPhMwaAWEpP9Ry-OO-8SieiHqsxE",
    authDomain: "telemetrytracking.firebaseapp.com",
    projectId: "telemetrytracking",
    storageBucket: "telemetrytracking.appspot.com",
    messagingSenderId: "664459976338",
    appId: "1:664459976338:web:085df2cf6669b5695f504b",
    measurementId: "G-LL3H2ZYGLK"
}

const app = initializeApp( firebaseConfig )
export const db = getFirestore( app )

// Collection names for Aggregations and telemetry data
export const STATE_AGGREGATE_COLLECTION = "PlayerState"
export const LOCATION_AGGREGATE_COLLECTION = "Location"
export const TELEMETRY_COLLECTION = "Telemetry"

// Keys for data to be aggregated
export const STATE_KEY = "playerState"
export const LOCATION_KEY = "location"

const EMULATOR = true
if( EMULATOR ) connectFirestoreEmulator(db, 'localhost', 8080)

// Get a reference to the first document in a collection, creating one if the collection is empty
export const getAggregationReference = async ( aggregationCollection ) => {

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
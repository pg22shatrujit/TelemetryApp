const functions = require("firebase-functions")
const fb = require("firebase-admin")
const { getFirestore } = require("@firebase/firestore")

class TelemetryFunctions {

    constructor() {

        fb.initializeApp()
        this.db = getFirestore(fb)
    }
    
    get exports() {
        return {
            helloWorld: functions.https.onRequest( this.helloWorld )
        }
    }

    helloWorld( request, response ) {

        functions.logger.info( "Hello logs!", { structuredData: true });
        response.send( "Hello from Firebase!" );
    }
}

const telemetryfunctions = new TelemetryFunctions()
exports = telemetryfunctions.exports

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

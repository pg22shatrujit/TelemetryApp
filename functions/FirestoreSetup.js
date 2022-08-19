const { getFirestore, connectFirestoreEmulator } = require("@firebase/firestore")
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

const EMULATOR = true
if( EMULATOR ) connectFirestoreEmulator(db, 'localhost', 8080)
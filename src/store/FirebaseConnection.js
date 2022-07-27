// Copyright (C) Shatrujit Aditya Kumar 2022, All Rights Reserved

'use strict'

import Connection from "./connection"

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, getDoc, getDocs, addDoc, setDoc, deleteDoc} from "firebase/firestore";

const TELEMETRY_COLLECTION = "Telemetry"
const INDEX_NONE = -1
export default class FirebaseConnection extends Connection {


    constructor() {
        super()

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
        this.db = getFirestore( app )
    }

    open() {}

    read( request ) {

        // return new Promise( async ( resolve, reject ) => {
            
        //     let collection = await this.db.collection(TELEMETRY_COLLECTION)
        //     let query = collection.where("id", "==", id)
        //     let result = await query.get()
        //     resolve( result )
        //     .catch( error = reject( error ))
        // })

        return new Promise( ( resolve, reject ) => {
            getDocs(collection(this.db, TELEMETRY_COLLECTION))
            .then( querySnapshot => {
                let docList = {}
                querySnapshot.forEach((doc) => {
                    docList[doc.id] = doc.data()
                    docList[doc.id].id = doc.id
                })
                resolve(docList)
            })
            .catch(error => reject( error ))
        })
    }

    write( request, data ) {

        return new Promise( ( resolve, reject ) => {

            if( data.id != INDEX_NONE ) {

                getDoc( doc( this.db, TELEMETRY_COLLECTION, data.id ))
                .then( docSnapshot => {

                    if(docSnapshot.exists()) {
                        setDoc(doc(this.db, TELEMETRY_COLLECTION, data.id), data.record, { merge: true } )
                        .then( result => resolve( result ))
                        .catch( error => reject( error ))
                    } else {
                        delete data.id
                        addDoc(collection(this.db, TELEMETRY_COLLECTION), data.record )
                        .then( result => resolve( result ))
                        .catch( error => reject( error ))
                    }
                })
    
            }

            delete data.id
            addDoc( collection(this.db, TELEMETRY_COLLECTION), data.record )
            .then( result => resolve( result ))
            .catch( error => reject( error ))
        })
    }

    delete( request, data ) {
        
        return new Promise(( resolve, reject ) => {
            
            deleteDoc( doc(this.db, TELEMETRY_COLLECTION, data.id ))
            .then( result => resolve( result ))
            .catch( error => reject( error ))
        })
    }
    


    close() {}
}
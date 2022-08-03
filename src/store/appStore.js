/*
VUEX Data Store.
Copyright (C) Shatrujit Aditya Kumar 2022, All Rights Reserved
*/
import Vue from 'vue'
import Vuex from 'vuex'


import FirebaseConnection from './FirebaseConnection.js'
import ExpressConnection from './ExpressConnection.js'

const DEBUG = false
let dataStore = new FirebaseConnection()
if( DEBUG ) dataStore = new ExpressConnection()

// Set base url for local server requests
import TData from '../../server/tData'


export default {

    state: {
        appTitle: "Game Telemetry Viewer",
        records: {},
        currentRecord: new TData,
    },

    getters: {
        title: state => state.appTitle,
        records: state => state.records,
        currentRecord: state => state.currentRecord
    },

    actions: {

        // Add/Update a record and refresh the local copy of records
        postRecord({ commit }, record) {

            return new Promise(( resolve, reject ) => {
    
                dataStore.write( 'single/' + record.id, record )
                .then( () => { return dataStore.read( 'multi' ) })
                .then( result => {
                    commit( 'SYNC_RECORDS', result )
                    resolve()
                })
                .catch( error => reject( error ))
            })
        },

        // Grab existing records, used on component creation
        syncRecords({ commit }) {

            return new Promise(( resolve, reject ) => {
    
                dataStore.read( 'multi' )
                .then( result => {
                    commit( 'SYNC_RECORDS', result )
                    resolve()
                })
                .catch( error => reject( error ))
            })
        },

        // Reset form to default values after posting
        resetCurrentRecord({ commit }) {
            commit( 'RESET_RECORD' )
        },

        // Set form values to selected record
        setCurrentRecord({ commit }, record) {
            commit( 'SET_CURRENT', record )
        },

        // Remove a record
        deleteRecord({ commit }, record) {

            return new Promise(( resolve, reject ) => {
    
                dataStore.delete( 'single/' + record.id )
                .then( () => { return dataStore.read( 'multi' ) } )
                .then( result => {
                    commit( 'SYNC_RECORDS', result )
                    resolve()
                })
                .catch( error => reject( error ))
            })
        }
    },

    mutations: {

        // Update local cache of records
        SYNC_RECORDS: ( state, records ) => {
            // Clear records in state
            for( let id in state.records ) {
                Vue.delete( state.records, id )
            }

            // Populate state with records received from the server
            for( let id in records ) {
                records.id = id
                Vue.set( state.records, id, new TData( records[ id ] ))
            }
        },

        // Manipulate form data, reset to default or set to a specific record's values
        RESET_RECORD: ( state ) => { state.currentRecord = new TData() },
        SET_CURRENT: ( state, record ) => { state.currentRecord = new TData( record.serialize() ) },

        // For testing, setting and deleting a specific local record
        SET_RECORD: ( state, record ) => { Vue.set( state.records, record.id, record ) },
        DELETE_RECORD: ( state, id ) => { Vue.delete( state.records, id ) }
    },
}

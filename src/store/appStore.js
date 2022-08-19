/*
VUEX Data Store.
Copyright (C) Shatrujit Aditya Kumar 2022, All Rights Reserved
*/
import Vue from 'vue'


import FirebaseConnection from './FirebaseConnection.js'
import ExpressConnection from './ExpressConnection.js'

// Flag to toggle between test server and firebase
export const DEBUG = false

let dataService = new FirebaseConnection()
if( DEBUG ) dataService = new ExpressConnection()

// Set base url for local server requests
import TData from '../../server/tData'


export default {

    state: {
        appTitle: "Game Telemetry Viewer",
        records: {},
        currentRecord: new TData,
        chartData: [],
    },

    getters: {
        title: state => state.appTitle,
        records: state => state.records,
        currentRecord: state => state.currentRecord,
        actionSummary: state => state.chartData
    },

    actions: {

        // Add/Update a record and refresh the local copy of records
        postRecord({ commit }, record) {

            return new Promise(( resolve, reject ) => {

                dataService.write( `/single/${record.id}`, record )
                .then( id => dataService.read( `/single/${id}` ))
                .then( result => {
                    commit( 'SET_RECORD', result )
                    resolve()
                })
                .catch( error => reject( error ))
            })
        },

        // Grab existing records, used on component creation
        syncRecords({ commit }) {

            return new Promise(( resolve, reject ) => {
    
                dataService.read( '/multi' )
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
    
                dataService.delete( `/single/${record.id}` )
                .then( result => {
                    commit( 'DELETE_RECORD', record.id )
                    resolve()
                })
                .catch( error => reject( error ))
            })
        },

        fetchActionSummary({ commit }, params) {
            // Get data from the server

            // TODO Change to call execute
            return new Promise(( resolve, reject ) => {
                const id = '1234'
                const session = '001'
                dataService.read(`/actionSummary/${id}/${session}`)
                .then( result => {
                    commit('UPDATE_ACTION_SUMMARY', result)
                    resolve( result.status )
                })
                .catch( error => reject( error ))
            // Fill up chart when we get a response
            })
        },

        callHelloWorld({ commit }, params) {
            // Get data from the server

            // TODO Change to call execute
            dataService.callCloudHello()
            // Fill up chart when we get a response
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
        SET_RECORD: ( state, record ) => { 
            let TDataRecord = new TData( record )
            Vue.set( state.records, TDataRecord.id, TDataRecord) 
        },
        DELETE_RECORD: ( state, id ) => { Vue.delete( state.records, id ) },
        UPDATE_ACTION_SUMMARY: (state, data ) => { state.chartData = data }
    },
}

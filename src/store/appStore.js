/*
VUEX Data Store.
Copyright (C) Shatrujit Aditya Kumar 2022, All Rights Reserved
*/
import Vue from 'vue'
import Vuex from 'vuex'

import Axios from 'axios'

const baseURL = `http://localhost:5000`

// TODO once firebase environment is set up: Set up global debug variable to easily switch between local server and firebase
// const baseURL = `${LOCATION.PROTOCOL}//${LOCATION.HOSTNAME}:${LOCATION.PORT}}`
// if(DEBUG) {
//     baseURL = `http://localhost:5000`
// }

// Set base url for local server requests
const Server = Axios.create({ baseURL: baseURL })
import TData from './tData'


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
            Server.post('/api/telemetry/single', { record : record.serialize() })
            .then(() => { return Server.get('/api/telemetry/multi' ) } )
            .then(result => {
                commit('SYNC_RECORDS', result.data.payload)
            })
            // .then(() => { return Server.get('/api/telemetry/single', { params : { id : record.id }} ) } )
            // .then(result => {
            //     commit('SET_RECORD', new TData(result.data.payload))
            // })
        },

        // Grab existing records, used on component creation
        syncRecords({ commit }) {
            Server.get('/api/telemetry/multi')
            .then(result => {
                commit('SYNC_RECORDS', result.data.payload)
            })
        },

        // Reset form to default values after posting
        resetCurrentRecord({ commit }) {
            commit('RESET_RECORD')
        },

        // Set form values to selected record
        setCurrentRecord({ commit }, record) {
            commit('SET_CURRENT', record)
        },

        // Remove a record
        deleteRecord({ commit }, record) {
            Server.delete('/api/telemetry/single', { params : { id : record.id } })
            .then(() => { return Server.get('/api/telemetry/multi' ) } )
            .then(result => {
                commit('SYNC_RECORDS', result.data.payload)
            })
        }
    },

    mutations: {

        // Update local cache of records
        SYNC_RECORDS: ( state, records ) => {
            // Clear records in state
            for(let id in state.records) {
                Vue.delete(state.records, id)
            }

            // Populate state with records received from the server
            for(let id in records) {
                Vue.set(state.records, id, new TData(records[id]))
            }
        },

        // Manipulate form data, reset to default or set to a specific record's values
        RESET_RECORD: ( state ) => { state.currentRecord = new TData() },
        SET_CURRENT: ( state, record ) => { state.currentRecord = new TData(record.serialize()) },

        // For testing, setting and deleting a specific local record
        SET_RECORD: ( state, record ) => { Vue.set(state.records, record.id, record) },
        DELETE_RECORD: ( state, id ) => { Vue.delete(state.records, id) }
    },
}

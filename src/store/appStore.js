/*
VUEX Data Store.
Copyright (C) Shatrujit Aditya Kumar 2022, All Rights Reserved
*/
import Vue from 'vue'
import Vuex from 'vuex'

import Axios from 'axios'

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
        hasRecords: state => Object.keys(state.records).length !== 0,
        currentRecord: state => state.currentRecord
    },

    actions: {

        postRecord({ commit }, record) {
            return new Promise(( resolve, reject ) => {
                Axios.post('http://localhost:5000/api/telemetry/single', { record : record.serialize() })
                .then(() => { return Axios.get('http://localhost:5000/api/telemetry/single', { params : { id : record.id }} ) } )
                .then(result => {
                    commit('SET_RECORD', new TData(result.data.payload))
                })
            })
        },

        resetCurrentRecord({ commit }) {
            commit('RESET_RECORD')
        },

        setCurrentRecord({ commit }, record) {
            commit('SET_CURRENT', record)
        },

        deleteRecord({ commit }, record) {
            return new Promise(( resolve, reject ) => {
                Axios.delete('http://localhost:5000/api/telemetry/single', { params : { id : record.id } })
                .then(result => {
                    commit('DELETE_RECORD', result.data.payload)
                })
            })
        }
    },

    mutations: {
        SET_RECORD: ( state, record ) => { Vue.set(state.records, record.id, record) },
        RESET_RECORD: ( state ) => { state.currentRecord = new TData() },
        SET_CURRENT: ( state, record ) => { state.currentRecord = new TData(record.serialize()) },
        DELETE_RECORD: ( state, id ) => { Vue.delete(state.records, id) }
    },
}

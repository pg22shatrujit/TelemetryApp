<!--
<t-table max-records="10" />

@Copyright (C) Shatrujit Aditya Kumar 2022, All Rights Reserved
-->
<template>

    <section :class="{ debug: debugWidth }">

        <!-- Cycle throught records so too many aren't on the screen at once -->
        <button @click.prevent="fetchRecordsInRange( startIndex - maxRecords )">Previous</button>
        {{ startIndex + 1 }} to {{ ( startIndex + maxRecords ) > maxSize ? maxSize : startIndex + maxRecords  }} of {{ maxSize }}
        <button @click.prevent="fetchRecordsInRange( startIndex + maxRecords )">Next</button>

        
        <table>
            <tr>
                <th> ID </th>
                <th> Version </th>
                <th> Session ID </th>
                <th> Event ID </th>
                <th> State </th>
                <th> Location </th>
                <th> Modify </th>
            </tr>

            <!-- Display records with modification options -->
            <tr v-for="record in displayedRecords" :key="record.id">
                <td> {{ record.id }} </td>
                <td> {{ record.version }} </td>
                <td> {{ record.sessionID }} </td>
                <td> {{ record.eventID }} </td>
                <td> {{ stateFromValue(record.playerState) }} </td>
                <td> {{ record.location ? `${record.location.X}, ${record.location.Y}`: '' }} </td>
                <td> <button @click.prevent="setCurrentRecord(record)"> Edit </button> <button @click.prevent="deleteRecord(record)"> Delete </button></td>
            </tr>

        </table>
    </section>

</template>
<script>
    import Controller from '@/mixins/controller'
    import { PlayerState } from '../../server/tData'
    import { EMULATOR } from '../../functions/FirestoreSetup'

    class TTableController extends Controller {

        constructor( name, subComponentList = []) {
            super( name, subComponentList )
            this.vm = {
                debugWidth: EMULATOR,
                displayedRecords: [],
                startIndex: 0,
                maxSize: 0
            }
            this.props = {
                maxRecords: Number
            }

            this.injectGetters(['records'])
            this.injectActions(['setCurrentRecord', 'deleteRecord', 'syncRecords'])
        }

        // Check if the state value has a corresponding key
        stateFromValue( state ) {

            for( let key in PlayerState ) {
                if( state == PlayerState[ key ] ) {
                    return key
                }
            }

            // Default return state value
            return state
        }

        // Check for existing records on load
        onCreated() {
            this.syncRecords()
            .then(() => {
                this.maxSize = Object.keys( this.records ).length
                this.fetchRecordsInRange()
            })
        }

        // 
        fetchRecordsInRange( startIndex = 0 ) {
            let keysArray = Object.keys( this.records )
            if( startIndex >= keysArray.length ) startIndex = 0
            this.startIndex = startIndex
            this.displayedRecords = []
            for( let i = startIndex; i < startIndex + this.maxRecords; i ++) {
                if( i >= keysArray.length ) break
                this.displayedRecords.push( this.records[ keysArray[ i ] ] )
            }
        }
    }

    export default new TTableController('tTable');

</script>
<style scoped>

section {
    text-align: center;
    width: fit-content;
    display: inline-block;
}

.debug {
    /* width: 10vw; */
}

table {
    width: 80%;
    margin: 0 auto;
}

th {
    padding: 1vh 1vw;
}

td {
    padding: .2vh .2vw;
}

table, th ,td {
    border: 1px solid black;
}

button {
    font-size: .75em;
    border: 1px solid black;
    background: white;
    margin: 5% 0%;
    padding: none;
    height: auto;
}

</style>
<!--
<t-table :record="myRecord" />

@Copyright (C) Shatrujit Aditya Kumar 2022, All Rights Reserved
-->
<template>

    <section :class="{ debug: debugWidth }">
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
            <tr v-for="record in records" :key="record.id">
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
    import { LOCAL_EMULATOR } from '@/store/FirebaseConnection'

    class TTableController extends Controller {

        constructor( name, subComponentList = []) {
            super( name, subComponentList )
            this.vm = {
                debugWidth: LOCAL_EMULATOR,
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
    width: 20vw;
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
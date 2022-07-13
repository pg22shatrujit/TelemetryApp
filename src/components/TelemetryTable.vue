<!--
<t-table :record="myRecord" />

@Copyright (C) Shatrujit Aditya Kumar 2022, All Rights Reserved
-->
<template>

    <section>
        <table>
            <tr>
                <th> ID </th>
                <th> Version </th>
                <th> Session ID </th>
                <th> Event ID </th>
                <th> Modify </th>
            </tr>

            <!-- Display records with modification options -->
            <tr v-for="record in records" :key=record.id>
                <td> {{ record.id }} </td>
                <td> {{ record.version }} </td>
                <td> {{ record.sessionID }} </td>
                <td> {{ record.eventID }} </td>
                <td> <button @click.prevent="setCurrentRecord(record)"> Edit </button> <button @click.prevent="deleteRecord(record)"> Delete </button></td>
            </tr>

        </table>
    </section>

</template>
<script>
    import Controller from '@/mixins/controller'

    class TTableController extends Controller {

        constructor( name, subComponentList = []) {
            super( name, subComponentList )

            this.injectGetters(['records'])
            this.injectActions(['setCurrentRecord', 'deleteRecord', 'syncRecords'])
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
    width: 100%;
}

table {
    width: 80%;
    margin: 0 auto;
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
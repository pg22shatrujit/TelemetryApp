<!--
VFS VUE Single File Component

<pg-admin user="User"/>

Copyright (C) Shatrujit Aditya Kumar 2022, All Rights Reserved
-->
<template>

    <section class="home-container">
        <div class="home">
            <div class="title">Admin</div>
            <div class="dialog">

                <form class="sample-form" @submit.prevent="submitFormData()">
                    <label>Version
                        <input name="version" v-model="currentRecord.version" required>
                    </label><br/>
                    <label>ID:
                        <input name="id" v-model="currentRecord.id" required>
                    </label><br/>
                    <label>Session ID:
                        <input name="sessionID" type="number" v-model="currentRecord.sessionID" required>
                    </label><br/>
                    <label>Event ID:
                        <input name="eventID" type="number" v-model="currentRecord.eventID" required>
                    </label><br/>
                    <button value="Submit">Post</button>
                </form>

            </div>
            <br/>
            <t-table />
        </div>
    </section>

</template>
<script>

    import Controller from '@/mixins/controller'
    import tTable from '@/components/TelemetryTable'

    class AdminController extends Controller {

        constructor( name, subComponentList = []) {
            super( name, subComponentList );
            this.injectGetters(['title', 'currentRecord'])
            this.injectActions(['postRecord', 'resetCurrentRecord'])
        }

        // Posts the editable record and resets the form to defaults
        submitFormData() {
            this.postRecord(this.currentRecord);
            this.resetCurrentRecord();
        }
    }

    export default new AdminController('pgAdmin', { tTable });

</script>
<style scoped>
    /* Local styles for this template */
    .home-container {
        display: inline-block;
        width: 100%;
    }

    .home {
        margin:2vw;
        border: 1px solid black;
        background-color: lightgray;
        color: black;
        height: 78vh;
        width: 80vw;
    }

    .sample-form {
        border: 2px solid #333;
        margin: 1em;
        padding: 2em;
    }

    select, input, button {
        font-size: 1.2em;
        font-weight: 700;
        height: 1.4em;
    }

    button {
        padding: .5em;
        margin: .25em;
        padding-bottom: 1.5em;
    }

    .title {
        margin: 5px;
    }
</style>

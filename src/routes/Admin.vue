<!--
VFS VUE Single File Component

<pg-admin user="User"/>

Copyright (c) 2018. Scott Henshaw, Kibble Online Inc. All Rights Reserved.
-->
<template>

    <section class="home-container">
        <div class="home">
            <div>Admin</div>
            <div class="dialog">

                <form class="sample-form">
                    <label>Name
                        <input name="name" v-model="formData.name">
                    </label><br/>
                    <label>ID:
                        <input name="id" type="number" min=0 step=1 v-model="formData.id">
                    </label><br/>
                    <label>Value:
                        <input name="val" type="number" v-model="formData.val">
                    </label><br/>
                    <button value="Submit" @click.prevent="submitFormData()">Add Record</button>
                </form>

            </div>
        </div>
    </section>

</template>
<script>

    import Controller from '@/mixins/controller'

    class AdminController extends Controller {

        constructor( name, subComponentList = []) {
            super( name, subComponentList );
            this.vm = {
                formData: {
                    name: null,
                    id: null,
                    val: null
                }
            }
            this.props = {
                name: String,
            }
            this.injectGetters(['title'])
            this.injectActions(['addRecord'])
        }

        submitFormData() {
            if(this.formData.name == null || this.formData.id == null || this.formData.val == null) return
            this.formData.id = Math.round(this.formData.id)
            this.addRecord(this.formData);
            this.resetFormData();

        }
        resetFormData() {
            this.formData = {
                name: null,
                id: null,
                val: null
            }
        }
    }

    export default new AdminController('pgAdmin');

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
</style>

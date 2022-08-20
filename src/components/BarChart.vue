<!--
VFS VUE Single File Component

<t-bar-chart :data="dataObject" title="Title" />

Copyright (C) Shatrujit Aditya Kumar, 2022. All Rights Reserved
-->
<template>

    <section>
        <h3> {{ title }} </h3>
        <GChart type="BarChart" :data="data" />
    </section>

</template>

<style scoped>
    /* Local styles for this template */
    h3 {
        color: black;
        font-size: 1.5em;
        font-weight: 700;
        margin: .25em;
    }
</style>

<script>

    import Controller from '@/mixins/controller'
    import { GChart } from 'vue-google-charts/legacy'

    class BarChartController extends Controller {

        constructor( name, subComponentList = []) {
            super( name, subComponentList );
            this.props = {
                data: Array,
                title: String,
            }
        }
    }

    export default new BarChartController('TBarChart', { GChart });

</script>

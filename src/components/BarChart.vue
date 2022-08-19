<!--
VFS VUE Single File Component

<t-bar-chart :data="dataObject", title="Title", subtitle="SubTitle" />

Copyright (c) 2018. Scott Henshaw, Kibble Online Inc. All Rights Reserved.
-->
<template>

    <section>
        <h3> {{ title }} </h3>
        <GChart type="BarChart" :data="data" :options="chartOptions" />
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
            this.vm = {
                title: "Bar Chart",
                chartOptions: {
                    chart: {
                    title: "Placeholder Title",
                    subtitle: "Placeholder Subtitle",
                    }
                }
            }
            this.props = {
                data: Array,
                title: String,
                subtitle: String
            }
        }

        // Check for existing records on load
        onCreated() {
            this.chartOptions.title = this.title
            this.chartOptions.subtitle = this.subtitle
        }
    }

    export default new BarChartController('TBarChart', { GChart });

</script>
